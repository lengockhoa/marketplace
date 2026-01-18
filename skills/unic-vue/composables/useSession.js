const SESSION_KEY = 'unic_service'
const DEFAULT_EXPIRATION = 2 * 60 * 60 * 1000 // 2 hours in milliseconds
const RANDOM_STRING = "3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d";

const getStoredSession = () => {
  if (process.client) {
    try {
      const storedSession = localStorage.getItem(SESSION_KEY)
      if (storedSession) {
        const { data, expiry } = JSON.parse(storedSession)
        if (expiry > Date.now()) {
          return data
        }
      }
    } catch (error) {
      console.error('Failed to get session from localStorage:', error)
    }
  }
  return {}
}

export const encrypt_string = (string) => {
  const hash = '';
  const char = string.split('');
  const len = char.length;
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let i = 0; i < len; i += 16) {
    const w = new Array(16);
    for (let t = 0; t < 16; t++) {
      w[t] = char[i + t] || 0;
    }

    let a1 = a;
    let b1 = b;
    let c1 = c;
    let d1 = d;

    for (let t = 0; t < 64; t++) {
      const f = (t < 16) ? (b1 & c1 | ~b1 & d1) : ((t < 32) ? (b1 ^ c1 ^ d1) : (b1 & c1 | b1 & d1 | c1 & d1));
      const g = (t < 16) ? t : ((t < 32) ? (5 * t + 1) : ((t < 48) ? (3 * t + 5) : (7 * t)));
      const f4 = (a1 + f + w[g] + 0x5a827999).toString(16);
      const a2 = d1;
      const b2 = a1;
      const c2 = b1 ^ f4;
      const d2 = c1;

      a1 = a2;
      b1 = b2;
      c1 = c2;
      d1 = d2;
    }

    a = (a + a1).toString(16);
    b = (b + b1).toString(16);
    c = (c + c1).toString(16);
    d = (d + d1).toString(16);
  }
  return (a + b + RANDOM_STRING + c + d).toLowerCase().substring(0, 64);
}

const session = ref(getStoredSession())

export const setSession = (key, value, expirationMs = DEFAULT_EXPIRATION) => {
  session.value[key] = value
  if (process.client) {
    
    try {
      const expire_str = Date.now() + expirationMs;
      const hash = encrypt_string(expire_str.toString());  
      const sessionData = {
        data: session.value,
        expiry: expire_str,
        hash: hash
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
    } catch (error) {
      console.error('Failed to save session to localStorage:', error)
    }
  }
}

export const getSession = (key) => {
  if (process.client) {
    const storedSession = localStorage.getItem(SESSION_KEY)
    if (storedSession) {
      const { data, expiry, hash } = JSON.parse(storedSession)
      // check hash
      const check_hash = encrypt_string(expiry.toString());
      if (hash !== check_hash) {
        clearSession();
        return undefined;
      } else {
        if (expiry > Date.now()) {
          session.value = data
          return session.value[key]
        } else {
          clearSession()
        }
      }
    }
  }
  return undefined
}

export const clearSession = () => {
  session.value = {}
  if (process.client) {
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch (error) {
      console.error('Failed to clear session from localStorage:', error)
    }
  }
}

export const refreshSession = (expirationMs = DEFAULT_EXPIRATION) => {
  if (process.client) {
    try {
      const storedSession = localStorage.getItem(SESSION_KEY)
      if (storedSession) {
        const { data } = JSON.parse(storedSession)
        const expire_str = Date.now() + expirationMs;
        const hash = encrypt_string(expire_str.toString());  
        const sessionData = {
          data,
          expiry: expire_str,
          hash: hash
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
      }
    } catch (error) {
      console.error('Failed to refresh session:', error)
    }
  }
}