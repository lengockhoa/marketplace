import axios from "axios";
import pako from "pako";


// Function to decompress GZIP data
export const decompressData = (compressedData) => {
  // Convert the compressed data (base64 string) to a Uint8Array
  const compressedUint8Array = Uint8Array.from(atob(compressedData), c => c.charCodeAt(0));
  // Decompress the data using pako
  const decompressedUint8Array = pako.ungzip(compressedUint8Array);
  // Convert the decompressed data to a string
  const decompressedString = new TextDecoder().decode(decompressedUint8Array);
  // Now you can use decompressedString as needed
  return decompressedString;
};

// Function to compress data with GZIP
export const compressData = (data) => {
  // Convert the string data to a Uint8Array
  const inputUint8Array = new TextEncoder().encode(data);
  // Compress the data using pako
  const compressedUint8Array = pako.gzip(inputUint8Array);
  // Convert the compressed data to a base64 string
  const compressedData = btoa(String.fromCharCode(...new Uint8Array(compressedUint8Array.buffer)));
  // Now you can use compressedData as needed
  return compressedData;
};
export const request_origin = async (url, data = {}, method = "post") => {
  const ax = axios.create({
    baseURL: baseurl() + "/",
  });
  if (method === "get") {
    data = { params: data };
  }
  try {
    state.loading_count += 1;
    if (state.loading_count === 1) {
      state.loading = true;
    }
    let response = await ax[method.toLowerCase()](url, data);
    state.loading_count -= 1;
    if (state.loading_count === 0) {
      state.loading = false;
    }
    if(typeof response?.data === 'object'){
      return response?.data;
    } else {
      const gzipBuffer = decompressData(response?.data);
      return JSON.parse(gzipBuffer);
    }
  } catch {
    return [];
  }
};
export const request = async (url, data = {}, method = "post", with_loading=true) => {
  const ax = axios.create({
    baseURL: baseurl() + "api/",
  });
  const headers = { 'Content-Type': 'application/json', 'is_compress': 'true'};
  if (method === "get") {
    data = { params: data, headers: headers };
  }
  try {
    if(with_loading){
      state.loading_count += 1;
      if (state.loading_count === 1) {
        state.loading = true;
      }
    }
    let response = null;
    if(method === 'post'){
      response = await ax[method.toLowerCase()](url, data, {headers: headers});
    } else {
      response = await ax[method.toLowerCase()](url,data );
    }
    let to_return = [];
    if(typeof response?.data === 'object'){
      to_return = response?.data;
    } else {
      const gzipBuffer = decompressData(response?.data);
      to_return = JSON.parse(gzipBuffer);
    }
    if(with_loading){
      state.loading_count -= 1;
      if (state.loading_count === 0) {
        state.loading = false;
      }
    }
    return to_return;
  } catch {
    return [];
  }
};

export const requestForm = async (url, data = {}, method = "post", with_loading=true) => {
  const ax = axios.create({
    baseURL: baseurl() + "api/",
  });
  const headers = { 'Content-Type': 'multipart/form-data' };
  try {
    if(with_loading){
      state.loading_count += 1;
      if (state.loading_count === 1) {
        state.loading = true;
      }
    }
    let response = await ax['post'](url, data, { headers: headers });
    let to_return = [];
    if(typeof response?.data === 'object'){
      to_return = response?.data;
    } else {
      const gzipBuffer = decompressData(response?.data);
      to_return = JSON.parse(gzipBuffer);
    }
    if(with_loading){
      state.loading_count -= 1;
      if (state.loading_count === 0) {
        state.loading = false;
      }
    }
    return to_return;
  } catch {
    return [];
  }
};

export const requestLogin = async (data = {}, method = "post") => {
  const ax = axios.create({
    baseURL: baseurl() + "user/login",
  });
  try {
    let response = await ax[method.toLowerCase()]("", data);
    return response?.data;
  } catch {
    return [];
  }
};
export const requestSendmail = async (data = {}) => {
  const ax = axios.create({
    baseURL: baseurl() + "send_email/send_email",
  });
  try {
    let response = await ax['post']("", data);
    return response?.data;
  } catch {
    return [];
  }
};
