import { FileSystem } from 'expo'
import storage from '../helpers/AsyncLib'


const CACHE_FOLDER = `${FileSystem.documentDirectory}image-cache`

export function clearImageCache(){
    storage.keys().then(item => {
        storage.get(item).then(meta => {
            meta.forEach(({uri}) =>{
                Expo.FileSystem.deleteAsync(uri, {idempotent: true})
            })
            item.forEach(storage.remove)
        })
    })
}

export function storeImageMeta(source, uri){
    storage.set(source, {
        uri,
        dateCreated: new Date()
      })
}

export async function getCacheDir(){
    const cacheFolder = await FileSystem.getInfoAsync(CACHE_FOLDER);
    if (cacheFolder.exists && cacheFolder.isDirectory) {
      console.log("Caching folder found");
      return cacheFolder
    }else{
      console.log("Folder does not found. Creating new one")
      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'image-cache/')
    }
    return await this.getCacheDir()
}

export function fetchB64(source){
    return new Promise((resolve, reject) => {
        fetch(source).then(resp=>{
          var reader = new FileReader();
          reader.readAsDataURL(resp._bodyBlob); 
          reader.onloadend = function() {
            base64data = reader.result;     
            resolve(base64data)
          }
        }).catch(err => {
          console.log(err)
          reject()
        })
      });
}

export function guid(){
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}