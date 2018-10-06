import React, { Component } from 'react';
import { View, Image, ActivityIndicator, Animated } from 'react-native';
import PropTypes from 'prop-types'
import storage from '../helpers/AsyncLib'
import { FileSystem } from 'expo'
import CacheManger from '../components/CacheManager'


export default class CachedImage extends Component {
 
  constructor(props){
    super(props)
    this.state = {
      loaded: false,
      cachedb64: "",
      opacity: new Animated.Value(0),
      loaderOpactiy: new Animated.Value(1)
    }
  }

  componentWillMount = () =>{
    const { source } = this.props
    //storage.remove(source)
    storage.get(source).then(res => res ? this.loadItem(res) : this.storeItem(source))
   
  }

  storeItem = async (source) =>{
    const dir = await CacheManger.getCacheDir()
    const id = CacheManger.guid()
    let b46 = await CacheManger.fetchB64(source)
    FileSystem.writeAsStringAsync(dir.uri + id, b46).then((res) =>{
      this.fadeOut(() =>{
        this.setState({
          loaded: true,
          cachedb64: b46
        }, () => {
          this.fadeIn()
          CacheManger.storeImageMeta(source, dir.uri + id)
        })
      })
       
    }).catch(error => {
      console.error(error);
    });
  }

  loadItem = async(meta) => {   
    Expo.FileSystem.readAsStringAsync(meta.uri).then(resp => {
      this.fadeOut(() =>{
        this.setState({
          loaded: true,
          cachedb64: resp
        }, () => {
          this.fadeIn()
        })
      })
    }).catch(err => console.log(err))
  }


  fadeIn = () =>{
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true
    }).start()  
  }

  fadeOut = (callback) =>{
    Animated.timing(this.state.loaderOpactiy, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(callback)
  }


  render() {
    const { style, placeholderStyle, loaderSize, loaderColor } = this.props
    const { loaded, cachedb64, opacity, loaderOpactiy } = this.state
    let animatedStyles = { opacity }
    let animatedLoaderStyles = { opacity: loaderOpactiy }
    return loaded ? (
     <Animated.Image
      source={{uri: cachedb64}}
      style={[style, animatedStyles]}
     />
    ) : (
      <Animated.View style={[placeholderStyle, style, animatedLoaderStyles]}>
        <ActivityIndicator size={loaderSize} color={loaderColor}/>
      </Animated.View>
    )
  }

}

CachedImage.defaultProps = {
  source: "",
  style: {},
  placeholderStyle: {},
  loaderSize: "small",
  loaderColor: "black"
}

CachedImage.propTypes = {
  source: PropTypes.string.isRequired ,
  loaderSize: PropTypes.oneOf(['large', 'small']),
  loaderColor: PropTypes.string
}
