import { reactive } from "vue";

/**
 * Minimal IndexedDB wrapper for the unic-vue skill.
 *
 * Design notes (read before editing):
 * - The original `getDataIDB` resolved with `to_return[0]` (a single record)
 *   instead of the whole list — `to_return` was also declared *after* the
 *   `trans.oncomplete` callback that referenced it. We hoist the array and
 *   resolve with the array. We also push values from the cursor into a
 *   closure-scoped array so it survives across the async cursor chain.
 * - `addDataIDB` previously called `objectStore.clear()` unconditionally
 *   before every `put`. We add an `opts.replace` parameter (default false)
 *   so callers can choose between "add/replace" and "merge" semantics.
 * - The recursive `createStoreIDB` calls inside the catch blocks fired
 *   without `await`, which could reopen the DB while a transaction was
 *   still active. We drop the database once and rely on the caller to
 *   retry explicitly.
 */

export const db_state = reactive({
  db: null,
  DB_NAME: "eplanning",
  DB_VERSION: 1,
  // Object stores the application expects to find. New stores should be
  // added here AND their presence will be checked on every `onupgradeneeded`.
  storage_list: [
    "air_code_list",
    "cost_center_list",
    "internal_order_list",
    "cost_element_list",
    "maintenanceTaskList",
    "buyer_list",
  ],
});

/**
 * Open (and create if needed) the IndexedDB database.
 * @returns {Promise<IDBDatabase>}
 */
export const createStoreIDB = async (storage) => {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available in this environment"));
      return;
    }
    let request;
    try {
      request = indexedDB.open(db_state.DB_NAME, db_state.DB_VERSION);
    } catch (e) {
      reject(e);
      return;
    }

    request.onerror = (e) => {
      console.error("[indexDBStore] Error opening db", e);
      reject(e.target?.error || new Error("Error opening db"));
    };

    request.onsuccess = (e) => {
      const db = e.target.result;
      db_state.db = db;
      resolve(db);
    };

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      // Ensure every expected store exists. New stores added to
      // `db_state.storage_list` after first run require bumping
      // `DB_VERSION` to trigger this handler again.
      for (const storage of db_state.storage_list) {
        if (!db.objectStoreNames.contains(storage)) {
          db.createObjectStore(storage, {
            autoIncrement: true,
            keyPath: "id",
          });
        }
      }
      // Resolve here too so callers that only listen for success still
      // see the upgraded db.
      resolve(db);
    };
  });
};

/**
 * Add (or optionally replace all data in) an object store.
 *
 * @param {string} storage - object store name
 * @param {*} data - the value to store. Can be an object, an array of
 *   objects, or a primitive. Stored as-is; the store's keyPath ('id') is
 *   honoured when `data` is a plain object.
 * @param {{ replace?: boolean }} [opts] - `replace: true` (default) clears
 *   the store before storing. `replace: false` puts the value alongside
 *   existing rows.
 */
export const addDataIDB = async (storage, data, opts = {}) => {
  const { replace = true } = opts;
  const db = await createStoreIDB(storage);
  return new Promise((resolve, reject) => {
    let transaction;
    try {
      transaction = db.transaction([storage], "readwrite");
    } catch (e) {
      console.error("[indexDBStore] addDataIDB transaction failed", e);
      reject(e);
      return;
    }
    const objectStore = transaction.objectStore(storage);

    const finish = (err) => {
      if (err) reject(err);
      else resolve();
    };

    if (replace) {
      const clearRequest = objectStore.clear();
      clearRequest.onsuccess = () => {
        if (data == null) {
          finish();
          return;
        }
        try {
          const putRequest = objectStore.put(data);
          putRequest.onsuccess = () => finish();
          putRequest.onerror = () =>
            finish(putRequest.error || new Error("put failed"));
        } catch (e) {
          finish(e);
        }
      };
      clearRequest.onerror = () =>
        finish(clearRequest.error || new Error("clear failed"));
    } else {
      if (data == null) {
        finish();
        return;
      }
      try {
        const putRequest = objectStore.put(data);
        putRequest.onsuccess = () => finish();
        putRequest.onerror = () =>
          finish(putRequest.error || new Error("put failed"));
      } catch (e) {
        finish(e);
      }
    }
  });
};

/**
 * Return every record in an object store as an array.
 *
 * Fixes over the previous implementation:
 * - `to_return` is hoisted to the closure so both `trans.oncomplete`
 *   and the cursor `onsuccess` handler see the same array.
 * - The promise resolves with the *whole array* (not just `[0]`).
 */
export const getDataIDB = async (storage) => {
  const db = await createStoreIDB(storage);
  return new Promise((resolve, reject) => {
    let transaction;
    try {
      transaction = db.transaction([storage], "readonly");
    } catch (e) {
      console.error("[indexDBStore] getDataIDB transaction failed", e);
      reject(e);
      return;
    }

    const store = transaction.objectStore(storage);
    // If the store doesn't exist (older DB without this object store),
    // short-circuit with an empty array instead of failing the transaction.
    if (!db.objectStoreNames.contains(storage)) {
      resolve([]);
      return;
    }

    const results = [];

    transaction.oncomplete = () => {
      resolve(results);
    };
    transaction.onerror = (e) => {
      console.error("[indexDBStore] getDataIDB transaction error", e);
      reject(transaction.error || new Error("getDataIDB transaction failed"));
    };
    transaction.onabort = () => {
      reject(transaction.error || new Error("getDataIDB transaction aborted"));
    };

    const cursorRequest = store.openCursor();
    cursorRequest.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      }
      // No resolve here — `transaction.oncomplete` resolves with `results`.
    };
    cursorRequest.onerror = (e) => {
      console.error("[indexDBStore] cursor error", e);
      reject(cursorRequest.error || new Error("cursor failed"));
    };
  });
};
