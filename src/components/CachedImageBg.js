import React, { Component } from 'react'
import { View, ImageBackground, ActivityIndicator, Animated, Text } from 'react-native'
import PropTypes from 'prop-types'
import storage from '../helpers/AsyncLib'
import { FileSystem } from 'expo'
import { guid, getCacheDir, fetchB64, storeImageMeta } from './CacheManager'
import { CACHE_KEY } from '../helpers/constants'

export default class ImageBg extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      hasError: false,
      cachedb64: '',
      loaderOpactiy: new Animated.Value(1)
    }
    // This is an anti-pattern
    this.mounted = true
  }

  componentWillMount = () => {
    const { source } = this.props
    const key = `${CACHE_KEY}${source}`
    source ? storage.get(key).then(res => res ? this.loadItem(res) : this.storeItem(source)) : this.setState({ hasError: true })
  }

  componentWillUnmount = () => (this.mounted = false)

  storeItem = async (source) => {
    const dir = getCacheDir()
    const id = guid()
    let b46 = await fetchB64(source)
    FileSystem.writeAsStringAsync(dir + id, b46).then((res) => {
      this.fadeOut(() => {
        if (this.mounted) {
          this.setState({
            loaded: true,
            cachedb64: b46
          }, () => {
            storeImageMeta(source, dir + id)
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
          })
        }
      })
    }).catch(err => console.log(err))
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
    const { loaded, cachedb64, loaderOpactiy } = this.state
    let animatedLoaderStyles = { opacity: loaderOpactiy }
    return loaded ? (
      <ImageBackground
        source={{ uri: cachedb64 }}
        style={[style]}
      >
        {this.props.children}
      </ImageBackground>
    ) : this.handleLoading(animatedLoaderStyles)
  }

  handleLoading = (loaderStyles) => {
    const { style, placeholderStyle, loaderSize, loaderColor, errorTextStyle } = this.props

    return this.state.hasError ? (
      <View style={[placeholderStyle, style]}>
        <Text style={[errorTextStyle]}>No image found</Text>
      </View>
    )
      : (
        <Animated.View style={[placeholderStyle, style, loaderStyles]}>
          <ActivityIndicator size={loaderSize} color={loaderColor} />
        </Animated.View>
      )
  }
}

ImageBg.defaultProps = {
  source: '',
  style: {},
  placeholderStyle: {},
  loaderSize: 'small',
  loaderColor: 'black'
}

ImageBg.propTypes = {
  source: PropTypes.string.isRequired,
  loaderSize: PropTypes.oneOf(['large', 'small']),
  loaderColor: PropTypes.string
}
