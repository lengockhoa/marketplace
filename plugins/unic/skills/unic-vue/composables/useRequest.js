import axios from "axios";
import pako from "pako";
import { state, baseurl } from "./state.js";

// ---------------------------------------------------------------------------
// SSR-safe base64 helpers
// ---------------------------------------------------------------------------
// `atob` / `btoa` are browser globals; they don't exist in Node (SSR).
// We guard every call so that composables imported during SSR don't crash.
// Returning null on failure lets callers fall back gracefully.

function safeAtob(base64) {
  if (typeof atob === "undefined") return null;
  try {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  } catch (e) {
    console.error("[useRequest] safeAtob failed:", e);
    return null;
  }
}

function safeBtoa(uint8Array) {
  if (typeof btoa === "undefined") return null;
  try {
    let binary = "";
    const bytes = new Uint8Array(uint8Array.buffer || uint8Array);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(
        null,
        bytes.subarray(i, i + chunk)
      );
    }
    return btoa(binary);
  } catch (e) {
    console.error("[useRequest] safeBtoa failed:", e);
    return null;
  }
}

// ---------------------------------------------------------------------------
// GZIP helpers (compress / decompress)
// ---------------------------------------------------------------------------

/**
 * Decompress a GZIP-compressed base64 string back to a UTF-8 string.
 * Returns null on failure (including SSR).
 */
export const decompressData = (compressedData) => {
  const arr = safeAtob(compressedData);
  if (!arr) return null;
  try {
    const decompressed = pako.ungzip(arr);
    return new TextDecoder().decode(decompressed);
  } catch (e) {
    console.error("[useRequest] decompressData failed:", e);
    return null;
  }
};

/**
 * Compress a string with GZIP and return as base64. Returns null in SSR.
 */
export const compressData = (data) => {
  const input = new TextEncoder().encode(data);
  const compressed = pako.gzip(input);
  return safeBtoa(compressed);
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Update the global loading counter and `state.loading` flag.
 * The previous implementation manually incremented/decremented `loading_count`
 * around every `await`, which meant ANY thrown error left the count
 * permanently above zero — the loading spinner stayed forever after one
 * failed request. We centralise that bookkeeping here and rely on
 * try/finally in the request functions to guarantee decrement on error.
 */
function bumpLoading(up) {
  if (!state) return;
  if (up) {
    state.loading_count += 1;
    if (state.loading_count === 1) state.loading = true;
  } else {
    // Clamp at 0 so a stray decrement never goes negative.
    state.loading_count = Math.max(0, state.loading_count - 1);
    if (state.loading_count === 0) state.loading = false;
  }
}

/**
 * Normalise the axios response body to a JS value.
 *
 * The UNIC backend sometimes returns a JSON object directly and other
 * times a GZIP-compressed base64 string (when `is_compress: true` is
 * set on the request). We detect which is which and decode accordingly.
 */
function unwrapResponse(response) {
  const data = response?.data;
  if (data == null) return [];
  if (typeof data === "object") return data;
  const decompressed = decompressData(data);
  if (decompressed == null) return [];
  try {
    return JSON.parse(decompressed);
  } catch (e) {
    console.error("[useRequest] JSON.parse after decompress failed:", e);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Public request helpers
// ---------------------------------------------------------------------------

/**
 * Issue a request against the bare origin (no `api/` prefix).
 * Used for legacy endpoints that live at the root.
 */
export const request_origin = async (url, data = {}, method = "post", with_loading = true) => {
  const ax = axios.create({ baseURL: baseurl() + "/" });
  if (method === "get") data = { params: data };
  if (with_loading) bumpLoading(true);
  try {
    const response = await ax[method.toLowerCase()](url, data);
    return unwrapResponse(response);
  } catch (err) {
    console.error(
      `[useRequest] request_origin ${method.toUpperCase()} ${url} failed:`,
      err?.message || err
    );
    return [];
  } finally {
    if (with_loading) bumpLoading(false);
  }
};

/**
 * Standard JSON request helper. All API calls under `/api/...` go through here.
 */
export const request = async (url, data = {}, method = "post", with_loading = true) => {
  const ax = axios.create({ baseURL: baseurl() + "api/" });
  const headers = { "Content-Type": "application/json", is_compress: "true" };
  if (method === "get") {
    // For GET, `data` is forwarded as query params; headers live in config.
    data = { params: data, headers };
  }
  if (with_loading) bumpLoading(true);
  try {
    const response =
      method === "post"
        ? await ax.post(url, data, { headers })
        : await ax[method.toLowerCase()](url, data);
    return unwrapResponse(response);
  } catch (err) {
    console.error(
      `[useRequest] request ${method.toUpperCase()} ${url} failed:`,
      err?.message || err
    );
    return [];
  } finally {
    if (with_loading) bumpLoading(false);
  }
};

/**
 * Multipart/form-data request. Used for file uploads.
 *
 * IMPORTANT: do NOT set `Content-Type: multipart/form-data` manually.
 * Axios needs to generate the form-data `boundary` itself; setting the
 * header without a boundary breaks the upload. Letting axios handle it
 * also makes the request work correctly in both browser and Node (with
 * `form-data` package).
 */
export const requestForm = async (url, data = {}, method = "post", with_loading = true) => {
  const ax = axios.create({ baseURL: baseurl() + "api/" });
  if (with_loading) bumpLoading(true);
  try {
    const response = await ax[method.toLowerCase()](url, data);
    return unwrapResponse(response);
  } catch (err) {
    console.error(
      `[useRequest] requestForm ${method.toUpperCase()} ${url} failed:`,
      err?.message || err
    );
    return [];
  } finally {
    if (with_loading) bumpLoading(false);
  }
};

/**
 * Login endpoint — separate from `request` because it lives at
 * `/user/login` and returns a raw response (no GZIP envelope).
 */
export const requestLogin = async (data = {}, method = "post") => {
  const ax = axios.create({ baseURL: baseurl() + "user/login" });
  try {
    const response = await ax[method.toLowerCase()]("", data);
    return response?.data;
  } catch (err) {
    console.error("[useRequest] requestLogin failed:", err?.message || err);
    return [];
  }
};

/**
 * Send-email endpoint — also raw response (no GZIP envelope).
 */
export const requestSendmail = async (data = {}) => {
  const ax = axios.create({ baseURL: baseurl() + "send_email/send_email" });
  try {
    const response = await ax.post("", data);
    return response?.data;
  } catch (err) {
    console.error("[useRequest] requestSendmail failed:", err?.message || err);
    return [];
  }
};
