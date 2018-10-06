import React, { Component } from 'react';
import { View, ImageBackground, ActivityIndicator, Animated } from 'react-native';
import PropTypes from 'prop-types'
import storage from '../helpers/AsyncLib'
import { FileSystem } from 'expo'
import { guid, getCacheDir, fetchB64, storeImageMeta} from '../components/CacheManager'

export default class CachedImageBg extends Component {
 
  constructor(props){
    super(props)
    this.state = {
      loaded: false,
      cachedb64: "",
      loaderOpactiy: new Animated.Value(1)
    }
  }

  componentWillMount = () =>{
    const { source } = this.props
    storage.get(source).then(res => res ? this.loadItem(res) : this.storeItem(source))
  }

  storeItem = async (source) =>{
    const dir = await getCacheDir()
    const id = guid()
    let b46 = await fetchB64(source)
    FileSystem.writeAsStringAsync(dir.uri + id, b46).then((res) =>{
      this.fadeOut(() =>{
        this.setState({
          loaded: true,
          cachedb64: b46
        }, () => {
          storeImageMeta(source, dir.uri + id)
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
        })
      })
    }).catch(err => console.log(err))
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
    let animatedLoaderStyles = { opacity: loaderOpactiy }
    return loaded ? (
     <ImageBackground
      source={{uri: cachedb64}}
      style={[style]}
     >
     {this.props.children}
     </ImageBackground>
    ) : (
      <Animated.View style={[placeholderStyle, style, animatedLoaderStyles]}>
        <ActivityIndicator size={loaderSize} color={loaderColor}/>
      </Animated.View>
    )
  }

}

CachedImageBg.defaultProps = {
  source: "",
  style: {},
  placeholderStyle: {},
  loaderSize: "small",
  loaderColor: "black"
}

CachedImageBg.propTypes = {
  source: PropTypes.string.isRequired ,
  loaderSize: PropTypes.oneOf(['large', 'small']),
  loaderColor: PropTypes.string
}
