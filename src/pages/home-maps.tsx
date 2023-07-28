
import { View, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback, TextInput } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import React, { useRef, useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { Button, Icon } from "react-native-elements";
import { styles } from "../styles/styles";
import PlaceEntity from "../entities/place-entity";
import { db } from "../../firebase-config_alternativo.js";
import { onValue, push, ref, update } from "firebase/database";
import * as Location from 'expo-location';

interface Coords {
  latitude: number;
  longitude: number;
}


export default function HomeMaps({ navigation }) {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const [places, setPlaces] = useState<PlaceEntity[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceEntity>();
  const [placeDescription, setPlaceDescription] = useState('');
  const onChange = (event)=>{setPlaceDescription(event);};



  useEffect(() => {
    getPlaces();
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        initMap();
        return;
      }
    })();
  }, []);

  async function getPlaces() {
    return onValue(ref(db, '/places'), (snapshot) => {
      console.log(getPlaces)
      try {
        setPlaces([]);
        if (snapshot !== undefined) {
          snapshot.forEach((childSnapshot) => {
            const childkey = childSnapshot.key;
            let childValue = childSnapshot.val();
            childValue.id = childkey;
            setPlaces((places) => [...places, (childValue as PlaceEntity)])
          });
        }

      } catch (e) {
        console.log(e);
      }


    });
  }

  async function addItem(imageUrl: string) {
    const newItem = {
      id: Math.random().toString(),
      description: '',
      coords: await getCurrentLocation(),
      imagePath: imageUrl,
      photoDate: Date().toString(),
      title: ''
    }

    push(ref(db, 'places'), newItem);
    setPlaces((places) => [...places, newItem]);
  }

  async function getCurrentLocation(): Promise<Coords> {
    let location = await Location.getCurrentPositionAsync({});
    return { latitude: location.coords.latitude, longitude: location.coords.longitude };
  }

  async function initMap() {
    const coords = await getCurrentLocation();
    mapRef.animateToRegion({ latitude: coords.latitude, longitude: coords.longitude }, 500);
  }

  async function updateItem() {
    selectedPlace.description = placeDescription;
    update(ref(db, '/places/' + selectedPlace.id), selectedPlace);
    setModalVisibility(false)
    setPlaceDescription('');
}




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
            console.log(place)
            return (

              <Marker
                key={place.id}
                id={place.id.toString()}
                coordinate={{
                  latitude: place.coords.latitude,
                  longitude: place.coords.longitude,
                }}
                onPress={() => {
                  setSelectedPlace(place);
                  setModalVisibility(true);
                }}
                description={place.description}>
                <View style={styles.markerImageContainer}>
                  <Image source={{ uri: place.imagePath }} style={styles.markerImage} />
                </View>
              </Marker>

            );
          })
        }

      </MapView>

      <View style={styles.cameraButtonRight}>
        <TouchableNativeFeedback onPress={() => { navigation.navigate('camera', { callback: (imageUrl) => addItem(imageUrl) }) }}>
          <Icon name='photo-camera' type='google' color='white' size={30} />
        </TouchableNativeFeedback>
      </View>

      {

        modalVisibility ?

          <View style={styles.cardStyle} >
            <Image source={{ uri: selectedPlace.imagePath }} style={{ width: '100%', maxHeight: 300, aspectRatio: 1 }} />
            <TextInput onChangeText={onChange} placeholder="Digite aqui a sua descrição"></TextInput>
            <Text style={{ fontSize: 17, marginTop: 8 }}>{selectedPlace.description}</Text>
            <View style={{ margin: 16, paddingHorizontal: 32, width: '100%', flexDirection: 'row', justifyContent: "space-between" }}>
              <View style={styles.cardButton}>
                <TouchableNativeFeedback onPress={() => { navigation.navigate('camera') }}>
                  <Icon name='edit' type='google' color='white' size={15} />
                </TouchableNativeFeedback>
              </View>

              <Button style={{ marginTop: 16, flex: 1 }}
                onPress={() => { updateItem();}} title='Gravar'>
              </Button>

            </View>
          </View> : <></>

      }



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
