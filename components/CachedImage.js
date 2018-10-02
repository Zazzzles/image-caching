import React, { Component } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types'
import storage from '../helpers/AsyncLib'
import { FileSystem } from 'expo'

const CACHE_FOLDER = `${FileSystem.documentDirectory}image-cache`

export default class CachedImage extends Component {
 
  constructor(props){
    super(props)
    this.state = {
      loaded: false,
      cachedb64: ""
    }
  }
 

  componentWillMount = () =>{
    const { source } = this.props
    //storage.remove(source)
    storage.get(source).then(res => res ? this.loadItem(res) : this.storeItem(source))
  }

  storeItem = async (source) =>{
    const dir = await this.getCacheDir()
    const id = this.guid()
    let b46 = await this.fetchB64(source)
    FileSystem.writeAsStringAsync(dir.uri + id, b46).then((res) =>{
        this.setState({
          loaded: true,
          cachedb64: b46
        }, () => {
          storage.set(source, {
            uri: dir.uri + id,
            dateCreated: new Date()
          })
        })
    }).catch(error => {
      console.error(error);
    });
  }

  loadItem = async(meta) => {   
    Expo.FileSystem.readAsStringAsync(meta.uri).then(resp => {
      this.setState({
        loaded: true,
        cachedb64: resp
      })
    }).catch(err => console.log(err))
  }

  getCacheDir = async () => {
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

  fetchB64 = (source) => {
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

  guid = () => {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
     
  

  render() {
    const { style, placeholderStyle, loaderSize, loaderColor } = this.props
    const { loaded, cachedb64  } = this.state
    return loaded ? (
     <Image
      source={{uri: cachedb64}}
      style={style}
     />
    ) : (
      <View style={[placeholderStyle, style]}>
        <ActivityIndicator size={loaderSize} color={loaderColor}/>
      </View>
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
