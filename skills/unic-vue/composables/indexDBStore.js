export const db_state = reactive({
    db: '',
    DB_NAME: 'eplanning',
    DB_VERSION: 1,
    storage_list: ["air_code_list", "cost_center_list", "internal_order_list", "cost_element_list", "maintenanceTaskList", "buyer_list"],
});

export const createStoreIDB = async (storage) => {
    return new Promise((resolve, reject) => {
        let request = window.indexedDB.open(db_state.DB_NAME, db_state.DB_VERSION);
        
        request.onerror = e => {
            console.log('Error opening db', e);
            reject('Error');
        };

        request.onsuccess = e => {
            let db = e.target.result;
            resolve(db);
        };

        request.onupgradeneeded = e => {
            let db = e.target.result;
            // Check if the object store already exists
            db_state.storage_list.forEach(storage => {
                if (!db.objectStoreNames.contains(storage)) {
                    db.createObjectStore(storage, { autoIncrement: true, keyPath: 'id' });
                }
            });
            resolve(db);
        };
        
	});
};


export const addDataIDB = async (storage, data) => {
    const db = await createStoreIDB(storage);
    return new Promise((resolve, reject) => {
        try{
            let transaction = db.transaction([storage], 'readwrite');
            let objectStore = transaction.objectStore(storage);
            let clearRequest = objectStore.clear();

            clearRequest.onsuccess = () => {
                if (data) {
                    let putRequest = objectStore.put(data);
                    putRequest.onsuccess = () => {
                        resolve();
                    };
                    putRequest.onerror = () => {
                        reject('Error adding data to object store');
                    };
                } else {
                    resolve(); // Resolve immediately if no data is provided
                }
            }
        } catch (e) {
            window.indexedDB.deleteDatabase(db_state.DB_NAME);
            createStoreIDB(storage);
        }
        
    });
};



export const getDataIDB = async (storage) => {
    const db = await createStoreIDB(storage);
    return new Promise((resolve, reject) => {
        try {
            if (!db.objectStoreNames.contains(storage)) {
                resolve([]);
                return;
            }
            let trans = db.transaction([storage],'readonly');
            trans.oncomplete = e => {
                resolve(to_return[0]);
            };
            
            let store = trans.objectStore(storage);
            let to_return = [];
            
            store.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if (cursor) {
                    to_return.push(cursor.value)
                    cursor.continue();
                }
            };
        } catch (e) {
            window.indexedDB.deleteDatabase(db_state.DB_NAME);
            createStoreIDB(storage);
        }
	});
};




