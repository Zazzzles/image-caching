# Image caching for React Native with Expo

> A  nifty wrapper for `Image` and `ImageBackround` used for caching remote images to prevent unnecessary network requests.

## Code Samples



```
        import CachedImage from './components/CachedImage'
        import CachedImageBg from './components/CachedImageBg'
        import { clearImageCache } from './components/CacheManager'
        
        //Clearing the cache
        componentDidMount(){
           clearImageCache()
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

## Installation

>This project requires expo to run. You can get it [here](https://docs.expo.io/versions/latest/introduction/installation).

## Starting the project


`npm run start`

or if you're using yarn

`yarn start`
