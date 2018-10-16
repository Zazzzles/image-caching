import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { clearImages, createCacheDir, clean, Image, ImageBg } from './src'

export default class App extends React.Component {

  componentWillMount = async() =>{
   // clearImages()
    await createCacheDir()
    clean()
  }

  render() {
    return (

          <ImageBg
            source={"https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg"}
            style={styles.container}
            placeholderStyle={styles.container}
            loaderSize="large"
            loaderColor="lightgrey"
          >
           
           <Image
            source={"https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg"}
            style={styles.image}
            placeholderStyle={styles.loader}
            loaderSize="large"
            loaderColor="white"
          />

           <Image
            source={"https://images.pexels.com/photos/1452219/pexels-photo-1452219.jpeg"}
            style={styles.image}
            placeholderStyle={styles.loader}
            loaderSize="large"
            loaderColor="white"
          />

          <Image
            source={"https://images.pexels.com/photos/1461663/pexels-photo-1461663.jpeg"}
            style={styles.image}
            placeholderStyle={styles.loader}
            loaderSize="large"
            loaderColor="white"
          />

          <Image
            source={"https://images.pexels.com/photos/1279344/pexels-photo-1279344.jpeg"}
            style={styles.image}
            placeholderStyle={styles.loader}
            loaderSize="large"
            loaderColor="white"
          />

          <Image
            source={"https://images.pexels.com/photos/885880/pexels-photo-885880.jpeg"}
            style={styles.image}
            placeholderStyle={styles.loader}
            loaderSize="large"
            loaderColor="white"
          />

           <Image
            source={"https://images.pexels.com/photos/1450013/pexels-photo-1450013.jpeg"}
            style={styles.image}
            placeholderStyle={styles.loader}
            loaderSize="large"
            loaderColor="white"
          />
          
          </ImageBg>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  loader:{
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  image:{
    height: '30%',
    width: '50%'
  }
});
