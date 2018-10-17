import { FileSystem } from 'expo'

export const CACHE_KEY = '__image_cache__'
export const CACHE_FOLDER = `${FileSystem.documentDirectory}${CACHE_KEY}`
export const TTL = 30
