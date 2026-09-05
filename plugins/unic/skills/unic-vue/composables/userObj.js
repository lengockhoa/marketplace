/**
 * Generic user-lookup helpers.
 *
 * Project-agnostic template — copy into your project and adapt the
 * view name and field list. The DuraOne-specific version is preserved
 * at `examples/duraone-portal/composables/userObj.duraone.js` for
 * reference.
 *
 * Auth flow:
 *   - Login is handled by `useRequest.requestLogin()` (see unic-api skill).
 *   - The session is stored in `localStorage` under `unic_service`
 *     via `composables/useSession.js`.
 *   - The current user object should be hydrated into `state` once
 *     on app start (see `plugins/session.client.ts` in your project).
 */
import { request } from "./useRequest.js";
import { get_schema } from "./state.js";

/**
 * Default view used to look up users. Override this constant in your
 * project's copy of this file.
 */
const USER_VIEW = "v_user";

/**
 * Look up a user by their `username` (login id).
 *
 * @param {string} username
 * @returns {Promise<object>} the user row, or `{}` if not found
 */
export const getUserObjByUsername = async (username) => {
  if (!username) return {};
  const data = {
    schema: get_schema(),
    table: USER_VIEW,
    conditions: JSON.stringify({ username }),
  };
  const rows = await request("/select", data, "get");
  return rows.length > 0 ? rows[0] : {};
};

/**
 * Look up a user by primary key.
 *
 * @param {string|number} id
 * @returns {Promise<object>}
 */
export const getUserObjById = async (id) => {
  if (id == null) return {};
  const data = {
    schema: get_schema(),
    table: USER_VIEW,
    conditions: JSON.stringify({ id }),
  };
  const rows = await request("/select", data, "get");
  return rows.length > 0 ? rows[0] : {};
};

/**
 * Fetch a subset of fields for a user. Useful for autocomplete / pickers.
 *
 * @param {string} username
 * @param {string[]} fields — column names to return
 * @returns {Promise<object>}
 */
export const getUserFields = async (username, fields = []) => {
  if (!username) return {};
  const data = {
    schema: get_schema(),
    table: USER_VIEW,
    columns: fields,
    conditions: JSON.stringify({ username }),
  };
  const rows = await request("/select", data, "get");
  return rows.length > 0 ? rows[0] : {};
};
