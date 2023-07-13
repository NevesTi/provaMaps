
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibray from 'expo-media-library';
import { Image } from 'expo-image';





export function HomePage() {
  const [Permission, setPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [cameraPosition, setCameraPosition] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [image, setImage] = useState(null);




  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setPermission(cameraStatus.status === 'granted');
      await MediaLibray.requestPermissionsAsync();
    })();
  }, []);

  async function takePicture() {
    if (camera) {
      // tirar uma foto
      const { uri } = await camera.takePictureAsync();
      console.log(uri);
      setImage(uri);
      await MediaLibray.saveToLibraryAsync(uri);
    }
  }


  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setCameraPosition(coordinate);
  };

  const handleCameraRegionChange = (region) => {
    const { latitude, longitude } = region;
    setCameraPosition({ latitude, longitude });
  };

  if (Permission === null) {
    return <View />;
  }
  if (Permission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <MapView style={{ width: '100%', height: '100%' }}
        initialRegion={{
          latitude: -22.1214571,
          longitude: -43.2061884,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,

        }}
      >

        {cameraPosition && (
          <Marker coordinate={cameraPosition} title="Camera Position" />
        )}

        <Marker
          coordinate={{ latitude: -22.1214571, longitude: -43.2061884 }}
          title="Praça "
          description="Praça são Sebastião"
        />

      </MapView>

      <Camera
        ref={(minhaCamera) => setCamera(minhaCamera)}
        style={styles.styleCamera}
        type={CameraType.back}
        ratio={'1:1'}
      />

      <Image
        style={styles.image}
        source={image}
        contentFit="cover"
        transition={1000} />


      <View style={styles.container_button}>
        <TouchableOpacity 
        style={styles.buttonCamera} onPress={() => { takePicture() }}>

          <Text>click</Text>
        </TouchableOpacity>
      </View>
    </View>

  )
}

const styles = StyleSheet.create({

  map: {
    flex: 1
  },

  camera: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: 100,

    
  },
  buttonCamera: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    backgroundColor: '#6676f1',
    borderRadius: 100,
    marginTop: 300

  },
  container_button: {
    position: 'absolute',
    width: 100,
    height: 100,
  
  },

  imageCamera: {
    width: 50,
    height: 50,

  },
  styleCamera: {
    aspectRatio: 1,
    flex: 1
  },

  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  }




})













/*import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Camera } from 'expo-camera';

export default function HomePage() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [cameraPosition, setCameraPosition] = useState(null);
    const [origin, setOrigin] = useState(null);


  useEffect(() => {
    (async  () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setCameraPosition(coordinate);
  };

  const handleCameraRegionChange = (region) => {
    const { latitude, longitude } = region;
    setCameraPosition({ latitude, longitude });
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        onRegionChange={handleCameraRegionChange}
      >
        {cameraPosition && (
          <Marker coordinate={cameraPosition} title="Camera Position" />
        )}
      </MapView>
      <Camera
        style={styles.camera}
        ref={(ref) => setCameraRef(ref)}
        type={Camera.Constants.Type.back}
        autoFocus={Camera.Constants.AutoFocus.on}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  camera: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom:100
  },
});*/
