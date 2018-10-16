import React, { Component } from 'react';
import { View, Image, ActivityIndicator, Animated } from 'react-native';
import PropTypes from 'prop-types'
import storage from '../helpers/AsyncLib'
import { FileSystem } from 'expo'
import { guid, getCacheDir, fetchB64, storeImageMeta} from '../components/CacheManager'

export default class CachedImage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      hasError: false,
      cachedb64: '',
      opacity: new Animated.Value(0),
      loaderOpactiy: new Animated.Value(1)
    }
    // This is an anti-pattern
    this.mounted = true
  }

  componentWillMount = () => {
    const { source } = this.props
    source ? storage.get(source).then(res => res ? this.loadItem(res) : this.storeItem(source)) : this.setState({hasError: true})
  }

  componentWillUnmount = () => (this.mounted = false)

  storeItem = async (source) => {
    const dir = await getCacheDir()
    const id = guid()
    let b46 = await fetchB64(source)
    FileSystem.writeAsStringAsync(dir.uri + id, b46).then((res) => {
      this.fadeOut(() => {
        if (this.mounted) {
          this.setState({
            loaded: true,
            cachedb64: b46
          }, () => {
            this.fadeIn()
            storeImageMeta(source, dir.uri + id)
          })
        }
      })
    }).catch(error => {
      console.error(error)
    })
  }

  loadItem = async (meta) => {
    FileSystem.readAsStringAsync(meta.uri).then(resp => {
      this.fadeOut(() => {
        if (this.mounted) {
          this.setState({
            loaded: true,
            cachedb64: resp
          }, () => {
            this.fadeIn()
          })
        }
      })
    }).catch(err => console.log(err))
  }

  fadeIn = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true
    }).start()
  }

  fadeOut = (callback) => {
    Animated.timing(this.state.loaderOpactiy, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(callback)
  }

  render () {
    const { style } = this.props
    const { loaded, cachedb64, opacity, loaderOpactiy } = this.state
    let animatedStyles = { opacity }
    let animatedLoaderStyles = { opacity: loaderOpactiy }
    return loaded ? (
      <Animated.Image
        source={{ uri: cachedb64 }}
        style={[style, animatedStyles]}
      />
    ) : this.handleLoading(animatedLoaderStyles)
    
  }

  handleLoading = (loaderStyles) =>{
    const { style, placeholderStyle, loaderSize, loaderColor, errorTextStyle } = this.props

    return this.state.hasError ? (
      <View style={[placeholderStyle, style]}>
        <Text style={[errorTextStyle]}>No image found</Text>
      </View>
    ) : 
    (
      <Animated.View style={[placeholderStyle, style, loaderStyles]}>
        <ActivityIndicator size={loaderSize} color={loaderColor} />
      </Animated.View>
    )
    
  }
}

CachedImage.defaultProps = {
  source: '',
  style: {},
  placeholderStyle: {},
  errorTextStyle: {},
  loaderSize: 'small',
  loaderColor: 'black'
}

CachedImage.propTypes = {
  source: PropTypes.string.isRequired,
  loaderSize: PropTypes.oneOf(['large', 'small']),
  loaderColor: PropTypes.string
}
