import _dayjs from "dayjs";
import { useRouter } from "vue-router";
import { t } from "./useTranslation.js";

/**
 * Wrapper around `dayjs`. Kept as a named export so callers don't have to
 * import the `dayjs` package directly (the project relies on Nuxt's
 * auto-import for that today; this gives us an explicit hook in case that
 * changes).
 */
export function dayjs(...args) {
  return _dayjs(...args);
}

/**
 * Format a date the way the legacy UNIC portal expects.
 *
 * Supported `type` values:
 *   "time"          -> "HH:mm:ss"
 *   "datetime"      -> "YYYY-MM-DD HH:mm:ss"
 *   "date"          -> "YYYY-MM-DD"     (default)
 *   "read_date"     -> "DD/MM/YYYY"
 *   "read_datetime" -> "DD/MM/YYYY HH:mm:ss"
 *
 * Returns "" for null/blank input instead of "Invalid Date".
 */
export const formatDate = (date, type) => {
  if (check_is_null_or_blank(date)) {
    return "";
  }
  switch (type) {
    case "time":
      return dayjs(date).format("HH:mm:ss");
    case "datetime":
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    case "read_date":
      return dayjs(date).format("DD/MM/YYYY");
    case "read_datetime":
      return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
    case "date":
    default:
      return dayjs(date).format("YYYY-MM-DD");
  }
};

/**
 * Return every YYYY-MM-DD between `fromDate` and `toDate` (inclusive).
 * Either argument can be a string or a Day.js object.
 */
export const getDateList = (fromDate, toDate) => {
  const end = dayjs(toDate);
  const dateArray = [];
  let currentDate = dayjs(fromDate);
  while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
    dateArray.push(currentDate.format("YYYY-MM-DD"));
    currentDate = currentDate.add(1, "day");
  }
  return dateArray;
};

/**
 * Format `num` using `separator` as thousands sep and `decimal` decimals.
 * `num` may be a number, a numeric string, or null/blank.
 */
export const formatNumber = (num, separator = ".", decimal = 2) => {
  if (check_is_null_or_blank(num)) return "";
  const parsed = parseFloat(num);
  if (Number.isNaN(parsed)) return "";
  return parsed.toFixed(decimal).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

/**
 * Current viewport height in pixels. Returns undefined in SSR.
 */
export const screen_height = () => {
  if (typeof window === "undefined") return undefined;
  return window.innerHeight;
};

/**
 * True iff `arr2` is a subset of `arr1` (every element of `arr2` is in `arr1`).
 * Comparison uses `===`. Order doesn't matter.
 */
export const arraysContainAllElements = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  return arr2.every((element) => arr1.includes(element));
};

/**
 * Strip Vietnamese diacritics, punctuation, and collapse whitespace.
 *
 * Notes:
 * - Lower-cases the input first. `Đ`/`đ` is mapped to `d`.
 * - Any non-letter character (including digits) is replaced with a space
 *   and the result is trimmed and single-spaced. This is what the legacy
 *   portal uses for slug/search fields.
 */
export const bodautiengviet = (str) => {
  if (str == null) return "";
  let s = String(str).toLowerCase();
  s = s.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  s = s.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  s = s.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  s = s.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  s = s.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  s = s.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  s = s.replace(/đ/g, "d");
  s = s.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|\{|\}|\||\\/g, " ");
  s = s.replace(/\s+/g, " ");
  return s.trim();
};

/**
 * Strip HTML <a> tag wrappers from a list of rows, in place.
 *
 * Returns the same array (mutated) for backward compatibility with the
 * original implementation. For new code, prefer a pure variant that
 * returns a new list.
 *
 * NOTE: Despite the name, this only strips anchor tags. Other HTML is
 * left untouched. If full HTML stripping is needed, use a proper
 * sanitizer instead.
 */
export const remove_html = (lst, col) => {
  if (!Array.isArray(lst) || !Array.isArray(col)) return lst;
  for (let i = 0; i < lst.length; i++) {
    for (let j = 0; j < col.length; j++) {
      const value = lst[i]?.[col[j]];
      if (typeof value === "string" && value.includes("<a")) {
        lst[i][col[j]] = remove_a_tag(value);
      }
    }
  }
  return lst;
};

/**
 * True iff `value` is null, undefined, empty string, empty array, or empty plain object.
 *
 * Fixes over the previous version:
 *   - removed the `value == {}` clause, which is always false (reference equality)
 *   - `Array.isArray` is used so the `.length` check is array-specific
 *   - plain object check is `Object.keys(value).length === 0` only (no longer
 *     relying on the `value.length == 0` branch, which never fired for objects)
 *   - `Date` is treated as a non-blank value
 *   - whitespace-only strings are considered blank
 */
export const check_is_null_or_blank = (value) => {
  if (value == null) return true;
  if (typeof value === "undefined" || value === "undefined") return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Date) return false;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/**
 * True iff `value` is the number zero (0, "0", "0.00") or undefined.
 * Non-numeric input returns false.
 */
export const check_is_zero = (value) => {
  if (typeof value === "undefined") return true;
  if (typeof value === "number") return value === 0;
  if (typeof value === "string") return value === "0" || value === "0.00";
  return false;
};

/** Smooth-scroll to top of the page. No-op in SSR. */
export const move_to_top = () => {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * Navigate to `page`, optionally with query string `query` ("k=v&k2=v2" form).
 *
 * Must be called from a component setup() context (or an event handler
 * inside an active component) because `useRouter()` relies on Vue's
 * inject(). It's safe to call from `@click="go_to_page('/foo')"` handlers.
 */
export const go_to_page = (page, query = "") => {
  const router = useRouter();
  if (!router) {
    console.warn("[utils] go_to_page called outside a Vue setup context");
    return;
  }
  if (query === "") {
    router.push({ path: page });
  } else {
    router.push({ path: page, query });
  }
};

/**
 * Go back to the previous page, falling back to `page` (or "/") when no
 * history is available.
 */
export const go_back = (page) => {
  if (typeof window !== "undefined" && window.history.length > 1) {
    const router = useRouter();
    if (router) {
      router.back();
      return;
    }
  }
  if (check_is_null_or_blank(page)) {
    go_to_page("/");
  } else {
    go_to_page(page);
  }
};

/**
 * Resolve after `ms` milliseconds.
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Show a toast via Ant Design Vue.
 *
 * NOTE: importing `ant-design-vue` from a utility composable creates a
 * dependency on a UI library that's irrelevant to most helpers. Callers
 * that don't actually need the toast should import the underlying
 * `message` from `ant-design-vue` directly to keep this file free of UI
 * concerns.
 */
export const show_message = (type, content, duration = 3) => {
  // Lazy import keeps the bundle smaller for components that don't show toasts.
  // (Ant Design Vue's `message` is a function, not a Vue component.)
  import("ant-design-vue")
    .then(({ message }) => {
      message[type]({ content, duration });
    })
    .catch((err) => {
      console.error("[utils] show_message failed:", err);
    });
};

/**
 * Convert a list of objects to Ant Design Vue `<a-select>` option format.
 * Labels are run through the translation function `t()`.
 */
export const convertToDropdownValue = (lst, value_col, label_col) => {
  if (!Array.isArray(lst)) return [];
  return lst.map((obj) => ({
    value: obj?.[value_col],
    label: t(obj?.[label_col]),
  }));
};

/**
 * Convert a list of objects into a plain object keyed by `key_col`.
 */
export const convertListToObject = (lst, key_col, value_col) => {
  if (!Array.isArray(lst)) return {};
  const out = {};
  for (const obj of lst) {
    if (obj && key_col in obj) {
      out[obj[key_col]] = obj[value_col];
    }
  }
  return out;
};

/**
 * Project a list of objects down to an array of one column's values.
 */
export const convertListToListOfField = (lst, key_col) => {
  if (!Array.isArray(lst)) return [];
  return lst.map((obj) => obj?.[key_col]).filter((v) => v !== undefined);
};

/**
 * Sort a list of `{ value, label }` pairs by their numeric `value` ascending.
 */
export function sortListByValueAsc(list) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const av = parseInt(a?.value, 10);
    const bv = parseInt(b?.value, 10);
    return (Number.isNaN(av) ? 0 : av) - (Number.isNaN(bv) ? 0 : bv);
  });
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Strip a single `<a ...>...</a>` tag, keeping the inner text.
 */
function remove_a_tag(value) {
  return String(value).replace(/<a\b[^>]*>/gi, "").replace(/<\/a\s*>/gi, "");
}
