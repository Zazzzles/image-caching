import { FileSystem } from 'expo'
import storage from '../helpers/AsyncLib'
import {CACHE_FOLDER, CACHE_KEY, TTL} from '../helpers/constants'

/**
 * Clears all entries out of asyncstorage
 * and filesystem.
 */

export async function clearImageCache () {
  await FileSystem.deleteAsync(CACHE_FOLDER, { idempotent: true })
  const items = await  storage.keys()
  const removedItemPromises = items.map(item =>{
      if(item.includes(CACHE_KEY)){
        return storage.remove(item)
      }

      return Promise.resolve()
    })

  await Promise.all(removedItemPromises)
}

/**
 * Checks asyncstorage for items older
 * than specified TTL and removes them.
 * This check needs to happen at least
 * once per flow.
 */
export async function cleanCache (days = TTL) {
  const keys = await storage.keys()
  const meta = await storage.get(keys)
  await Promise.all(meta.map(async (item, index) => {
    const diffDays = getTimeDiff(item.dateCreated)
    if (days < diffDays) {
      await FileSystem.deleteAsync(item.uri, { idempotent: true })
      await storage.remove(key[index])
      return 
    }

    return Promise.resolve()
  })) 
}

function getTimeDiff(dateCreated) {
  const cachedDate = new Date(dateCreated)
  const currentDate = new Date()
  const timeDiff = Math.abs(currentDate.getTime() - cachedDate.getTime())
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Stores image meta data.
 * @param {String} source for storage key and reference to stored file
 * @param {String} uri that points to FileSystem location
 */

export function storeImageMeta (source, uri) {
  const key = `${CACHE_KEY}${source}`
  storage.set(key, {
    soure,
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
      console.log('helllooo darnkess', err)
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
