import { FileSystem } from 'expo'
import storage from '../helpers/AsyncLib'

const CACHE_FOLDER = `${FileSystem.documentDirectory}image-cache`
const TTL = 30

/**
 * Clears all entries out of asyncstorage
 * and filesystem.
 */

export function clearImageCache () {
  storage.keys().then(item => {
    FileSystem.deleteAsync(CACHE_FOLDER, { idempotent: true })
    item.forEach(item =>{
      if(item.includes("images")){
        storage.remove(item)
      }
    })
  })
}

/**
 * Checks asyncstorage for items older
 * than specified TTL and removes them.
 * This check needs to happen at least
 * once per flow.
 */

export function cleanCache () {
  storage.keys().then(asyncItem => {
    storage.get(asyncItem).then(meta => {
      meta.forEach((item, index) => {
        const cachedDate = new Date(item.dateCreated)
        const currentDate = new Date()
        const timeDiff = Math.abs(currentDate.getTime() - cachedDate.getTime())
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
        if (TTL < diffDays) {
          FileSystem.deleteAsync(item.uri, { idempotent: true })
          storage.remove(asyncItem[index])
        }
      })
    })
  })
}

/**
 * Stores image meta data.
 * @param {String} source for storage key and reference to stored file
 * @param {String} uri that points to FileSystem location
 */

export function storeImageMeta (source, uri) {
  storage.set(source, {
    uri,
    dateCreated: new Date()
  })
}

/**
 * Checks is cache folder exists
 * and creates one if not found.
 */

export async function createCacheDir (){
  const cacheFolder = await FileSystem.getInfoAsync(CACHE_FOLDER)
  return !cacheFolder.exists && FileSystem.makeDirectoryAsync(CACHE_FOLDER)
}

/**
 * Checks is cache folder exists
 * and creates one if not found.
 * @returns {String} URI of cache directory folder
 */

export function getCacheDir () {
  return CACHE_FOLDER
}

/**
 * Fetch image from remote source
 * and convert to b64.
 * @param {String} source for image URL
 * @returns {Promise} resolves to b64 string
 */

export function fetchB64 (source) {
  return new Promise((resolve, reject) => {
    fetch(source).then(resp => {
      var reader = new FileReader()
      reader.readAsDataURL(resp._bodyBlob)
      reader.onloadend = function () {
        let base64data = reader.result
        resolve(base64data)
      }
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

/**
 * Generates UUID
 * @returns {String} UUID
 */

export function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}
