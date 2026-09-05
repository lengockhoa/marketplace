import { reactive } from "vue";

/**
 * Generic application state.
 *
 * NOTE: this is the project-agnostic version. DuraOne Portal-specific
 * state (menu items, hard-coded baseurl, etc.) has been moved to
 * `examples/duraone-portal/composables/state.duraone.js`.
 *
 * Add project-specific fields here only when they are truly shared
 * across the whole app. For per-page state, prefer local `ref()` /
 * `reactive()` inside the component.
 */
export const state = reactive({
  // ----- user/session (populated by your auth flow) -----
  username: "",
  fullname: "",
  language: "",
  usergroup: "",

  // ----- navigation -----
  page_header: "",
  homepage: "/",

  // ----- global loading indicator -----
  // `loading_count` is incremented by useRequest.js on every API call
  // and decremented in `finally`. `loading` is a derived boolean
  // computed in app.vue or a layout.
  loading: false,
  loading_count: 0,

  // ----- viewport -----
  screen_height: 0,

  // ----- feature flags -----
  is_update: false,

  // ----- i18n object (consumed by useTranslation.js) -----
  objToTranslate: {},
});

/**
 * Resolve the API base URL.
 *
 * Reads from (in order):
 *   1. `window.__NUXT__?.config?.apiBase` (set via `runtimeConfig.public.apiBase`)
 *   2. `process.env.NUXT_PUBLIC_API_BASE` (build-time)
 *   3. `window.location.origin` (same-origin fallback)
 *
 * NEVER hard-code a production URL here. Project-specific overrides
 * belong in the consuming project's `nuxt.config.ts` under `runtimeConfig`.
 */
export const baseurl = () => {
  if (typeof window !== "undefined") {
    const fromRuntime = window?.__NUXT__?.config?.apiBase;
    if (fromRuntime) return fromRuntime;
  }
  const fromEnv = process?.env?.NUXT_PUBLIC_API_BASE;
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") return window.location.origin + "/";
  return "";
};

/**
 * Resolve the schema/namespace for the current request.
 *
 * Schema values are typically `prd`, `qas`, or `dev`. Override this in
 * your app to read from a runtime config or a different signal
 * (cookie, host substring, etc.).
 *
 * Default: read from `process.env.NUXT_PUBLIC_SCHEMA` or `"prd"`.
 */
export const get_schema = () => {
  const env = process?.env?.NUXT_PUBLIC_SCHEMA;
  if (env) return env;
  return "prd";
};

/**
 * Translate a key using `state.objToTranslate`.
 *
 * If the key is not found, the key itself is returned (so missing
 * translations are easy to spot in the UI).
 */
export const t = (key) => {
  if (!key) return "";
  const map = state?.objToTranslate;
  if (map && Object.prototype.hasOwnProperty.call(map, key)) {
    return map[key];
  }
  return key;
};
