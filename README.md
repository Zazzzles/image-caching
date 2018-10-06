# Image caching for React Native with Expo

> A  nifty wrapper for `Image` and `ImageBackround` used for caching remote images to prevent unnecessary network requests.

## Code Samples



```
        import CachedImage from './components/CachedImage'
        import CachedImageBg from './components/CachedImageBg'
        import { clearImageCache, cleanCache } from './components/CacheManager'
        
        
        componentDidMount(){
           clearImageCache() //Clearing the cache
           cleanCache() //Removing stale items from storage
        }

        <CachedImage
            source={"https://images.pexels.com/photos/1452219/pexels-photo-1452219.jpeg"}
            style={styles.image}
            placeholderStyle={styles.placeholder}
            loaderSize="small"
            loaderColor="white"
          />

        <CachedImageBg
            source={"https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg"}
            style={styles.image}
            placeholderStyle={styles.loader}
            loaderSize="small"
          >
            <Text>Content</Text>
         </CachedImageBg>
```

## Usage

> `CacheManager.clearImageCache()` is used to remove all items from async storage and local FileSystem

> `CacheManager.cleanCache()` checks for images that are older than 30 days and removes them. It is reccommended to do this check often to avoid using too much storage space for caching

## Installation

>This project requires expo to run. You can get it [here](https://docs.expo.io/versions/latest/introduction/installation).

## Starting the project


`npm run start`

or if you're using yarn

`yarn start`
