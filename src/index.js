import Image from './components/CachedImage'
import ImageBg from './components/CachedImageBg'
import { clearImageCache as clearImages, cleanCache as clean, createCacheDir } from './components/CacheManager'

export {
    clearImages,
    clean,
    createCacheDir,
    ImageBg,
    Image
}