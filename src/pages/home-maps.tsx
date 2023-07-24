
import { View, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback, TextInput } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibray from 'expo-media-library';
import { Image } from 'expo-image';
import { Icon } from "react-native-elements";
import { styles } from "../styles/styles";
import PlaceEntity from "../entities/place-entity";


export default function HomeMaps({ navigation }) {
  const [Permission, setPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [cameraPosition, setCameraPosition] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [image, setImage] = useState(null);
  const [modalVisibility, setModalVisibility] = useState(true);



  const [mapRef, setMapRef] = useState(null);
  const [places, setplaces] = useState<PlaceEntity[]>([{
    id: 1,
    description: 'Descrição',
    imageUrl: 'https://odia.ig.com.br/_midias/jpg/2022/03/12/1200x750/1_tres_rios002-24558796.jpeg',
    date: '19 de Abril de 2017',
    latitude: -22.1212,
    longitude: -43.0662,
  }]);

  return (
    <View style={styles.container}>
      <MapView ref={(map) => { setMapRef(map) }} style={styles.mapView}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        toolbarEnabled={false}

        initialRegion={{
          latitude: -22.1214571,
          longitude: -43.2061884,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,

        }}
      >

        {
          places.map((place) => {
            return (
              <Marker
                key={place.id}
                id={place.id.toString()}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                onPress={() => {

                }}
                description={place.description}>
                <View style={styles.markerImageContainer}>
                  <Image source={{ uri: place.imageUrl }} style={styles.markerImage} />
                </View>
              </Marker>

            );
          })
        }



      </MapView>
      <View style={styles.cameraButtonRight}>
        <TouchableNativeFeedback onPress={() => { navigation.navigate('camera') }}>
          <Icon name='photo-camera' type='google' color='white' size={30} />
        </TouchableNativeFeedback>
      </View>

      <View style={styles.cardStyle} >
        <Image source={{ uri: 'https://odia.ig.com.br/_midias/jpg/2022/03/12/1200x750/1_tres_rios002-24558796.jpeg' }} style={{ width: '100%', maxHeight: 400, aspectRatio: 1 }} />

        <TextInput></TextInput>
        <Text style={{ fontSize: 17, marginTop: 16 }}>Cidade de Três Rios</Text>
        <View style={{ margin: 32, paddingHorizontal: 32, width: '100%', flexDirection: 'row', justifyContent: "space-between" }}>
          <View style={styles.cardButton}>
            <TouchableNativeFeedback onPress={() => { navigation.navigate('camera') }}>
              <Icon name='edit' type='google' color='white' size={15} />
            </TouchableNativeFeedback>
          </View>

          <View style={styles.cardButton}>
            <TouchableNativeFeedback onPress={() => { navigation.navigate('camera') }}>
              <Icon name='delete' type='google' color='white' size={15} />
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    </View>



  )
}













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
