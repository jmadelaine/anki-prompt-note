// Some browsers do not allow access to local storage, so we use this to
// check before accessing it.
// See: https://michalzalecki.com/why-using-localStorage-directly-is-a-bad-idea/
const hasLocalStorageAccess = () => {
  try {
    const s = window.localStorage
    const key = 'temp_key'
    s.setItem(key, key)
    s.removeItem(key)
    return true
  } catch {
    return false
  }
}

// Secure storage is an in-memory object in web, because local storage ain't secure bro!
const webSecureStorage: Map<string, string> = new Map()
const setSecurely = async (key: string, value: string) => Promise.resolve(webSecureStorage.set(key, value))

const setUnsecurely = async (key: string, value: string) => {
  if (hasLocalStorageAccess()) window.localStorage.setItem(key, value)
  return Promise.resolve()
}

const get = async (key: string) => {
  return Promise.resolve((hasLocalStorageAccess() && window.localStorage.getItem(key)) || webSecureStorage.get(key))
}

const remove = async (key: string) => {
  if (hasLocalStorageAccess()) window.localStorage.removeItem(key)
  webSecureStorage.delete(key)
  return Promise.resolve()
}

export const storage = { setUnsecurely, setSecurely, get, remove }
