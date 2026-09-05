/**
 * Generic API helper template.
 *
 * This file is intentionally project-agnostic. Copy it into your
 * project's `composables/` and rename the exports to match your
 * backend's tables and views.
 *
 * See:
 *   - `skills/unic-api/` for the full backend contract (endpoints,
 *     conditions grammar, GZIP envelope).
 *   - `examples/duraone-portal/composables/masterApi.duraone.js` for
 *     a worked example with ~20 helpers against the DuraOne portal.
 *
 * DO NOT import from `examples/` in production code — examples are
 * illustrative only.
 */
import { request } from "./useRequest.js";
import { get_schema } from "./state.js";

/**
 * Read rows from a view.
 *
 * @param {string} viewName — view name, e.g. "v_user"
 * @param {object} conditions — flat conditions object (see unic-api skill)
 * @returns {Promise<Array>}
 */
export const get_rows = async (viewName, conditions = {}) => {
  const data = {
    schema: get_schema(),
    table: viewName,
    conditions: JSON.stringify(conditions),
  };
  return await request("/select", data, "get");
};

/**
 * Read the first row matching the conditions, or `{}` if none.
 *
 * @param {string} viewName
 * @param {object} conditions
 * @returns {Promise<object>}
 */
export const get_first_row = async (viewName, conditions = {}) => {
  const rows = await get_rows(viewName, conditions);
  return rows.length > 0 ? rows[0] : {};
};

/**
 * Upsert a row by primary key.
 *
 * @param {string} tableName — table name, e.g. "t_user"
 * @param {object} data — row data; PK field must be present for updates
 * @returns {Promise<object>}
 */
export const save_row = async (tableName, data) => {
  return await request("/save", { table: tableName, data });
};

/**
 * Insert a new row.
 *
 * @param {string} tableName
 * @param {object} data
 * @returns {Promise<object>}
 */
export const insert_row = async (tableName, data) => {
  return await request("/insert", { table: tableName, data });
};

/**
 * Update rows matching conditions.
 *
 * @param {string} tableName
 * @param {object} conditions
 * @param {object} data — fields to change
 * @returns {Promise<object>}
 */
export const update_rows = async (tableName, conditions, data) => {
  return await request("/update", {
    table: tableName,
    conditions: JSON.stringify(conditions),
    data,
  });
};

/**
 * Hard-delete rows matching conditions.
 *
 * Use sparingly — prefer soft-delete columns (`deleted_at`) when the
 * table supports them.
 */
export const hard_delete_rows = async (tableName, conditions) => {
  return await request("/hard_delete", {
    table: tableName,
    conditions: JSON.stringify(conditions),
  });
};
