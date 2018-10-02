# Image caching for React Native with Expo

> A  nifty wrapper for `Image` and `ImageBackround` used for caching remote images to prevent unnecessary network requests.

## Code Samples



```
        <CachedImage
            source={"https://images.pexels.com/photos/1452219/pexels-photo-1452219.jpeg"}
            style={styles.image}
            placeholderStyle={styles.placeholder}
            loaderSize="small"
            loaderColor="white"
          />

        <CachedImageBg
            source={"https://images.pexels.com/photos/1452219/pexels-photo-1452219.jpeg"}
            style={styles.image}
            placeholderStyle={styles.placeholder}
            loaderSize="small"
            loaderColor="white"
          />
```

## Installation

>This project requires expo to run. You can get it [here](https://docs.expo.io/versions/latest/introduction/installation).

## Starting the project


`npm run start`

or if you're using yarn

`yarn start`
