# Image caching for React Native with Expo

> A  nifty wrapper for `Image` and `ImageBackround` used for caching remote images to prevent unnecessary network requests.

![Example](https://media.giphy.com/media/4ZqfhgH3OS8rgwKaEo/giphy.gif)

## Code Samples



```
        import CachedImage from './components/CachedImage'
        import CachedImageBg from './components/CachedImageBg'
        import { clearImageCache, cleanCache, createCacheDir } from './components/CacheManager'
        
        
        componentDidMount(){
           await createCacheDir() //Check if caching directory exists and create one if not
           clearImageCache() //Clearing the cache
           cleanCache(30) //Removing stale items from storage with specified period in days
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

## Pull Requests

1. Fork it and create your feature branch: git checkout -b my-new-feature
2. Commit your changes: git commit -am 'Add some feature'
3. Push to the branch: git push origin my-new-feature 
4. Submit a pull request
