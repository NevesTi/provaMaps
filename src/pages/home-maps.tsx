
import { View, Text, TouchableNativeFeedback, TextInput, Alert, Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import React, { useState, useEffect } from 'react';
//import { Image } from 'expo-image';
import { Icon } from "react-native-elements";
import { styles } from "../styles/styles";
import PlaceEntity from "../entities/place-entity";
import { db } from "../../firebase-config";
import { onValue, push, ref, remove, update } from "firebase/database";
import * as Location from 'expo-location';
import { getStoredData } from "../shared/secure-store-service";

interface Coords {
  latitude: number;
  longitude: number;
}

export default function HomeMaps({ navigation }) {

  var region;
  const [modalVisibility, setModalVisibility] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const [places, setPlaces] = useState<PlaceEntity[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceEntity>();
  const [placeDescription, setPlaceDescription] = useState(null);
  const onChange = (event) => { setPlaceDescription(event); };
  const [description, setDescription] = useState('');

  useEffect(() => {
    


    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        getAll();
        initMap();       
        return;
      }
    })();
  }, []);

  async function getAll() {
    return onValue(ref(db, '/places'), (snapshot) => {
      console.log(getAll)
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

      }


    });
  }

  async function addItem(imageUrl: string) {
    const position = await getCurrentLocation();
    const newItem: PlaceEntity = {
      id: Math.random().toString(),
      imagePath: imageUrl,
      description: 'CelsoNeves',
      photoDate: Date().toString(),
      coords: {
        latitude: position.latitude,
        longitude: position.longitude
      },
      title: '',
      author: await getStoredData('author')
    }

    push(ref(db, 'places'), newItem);
    //setPlaces((places) => [...places, newItem]);
    setModalVisibility(false)
    
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
    selectedPlace.description = description;
    update(ref(db, '/places/' + selectedPlace.id), selectedPlace);
    setModalVisibility(false);
    setSelectedPlace(null);
  }

  async function removeItem() {
    setModalVisibility(false);
    setSelectedPlace(null);
    remove(ref(db, '/places/' + selectedPlace.id));
  }

  function showConfirmDialog() {
    return Alert.alert(
      "Deseja remover o local?",
      "Esta ação nõa pode ser desfeita",

      [
        {
          text: "sim",
          onPress: () => removeItem()
        },
        {
          text: "Não",
        }
      ]

    )

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

            <TouchableNativeFeedback onPress={() => { navigation.navigate('place', { place: selectedPlace }) }}>
              <Image source={{ uri: selectedPlace.imagePath }} style={{ width: '100%', maxHeight: 300, aspectRatio: 1 }} />
            </TouchableNativeFeedback>

            {
              selectedPlace.description !== '' ?
                <Text style={{ fontSize: 17, marginTop: 8 }}>{selectedPlace.description}</Text> :
                <View style={{ alignItems: 'center', marginTop: 16, width: '100%', flexDirection: 'row', justifyContent: "space-between" }}>
                  <TextInput placeholder="Digite aqui a descrição"
                    onChangeText={setDescription}
                    style={{
                      height: 40,
                      marginRight: 8,
                      borderRadius: 8,
                      flex: 1,
                      backgroundColor: '#8786867d',
                      paddingHorizontal: 8
                    }}></TextInput>
                  <View style={styles.cardButton}>
                    <TouchableNativeFeedback onPress={() => {
                      // Salvar Item
                      updateItem();


                    }}>
                      <Icon name='edit' type='google' color='white' size={15} />
                    </TouchableNativeFeedback>
                  </View>
                </View>
            }

            <View style={{ marginTop: 16, width: '100%', flexDirection: 'row', justifyContent: "flex-end" }}>
              <View style={styles.cardButton}>
                <TouchableNativeFeedback onPress={() => {
                  // Remover item
                  showConfirmDialog();

                }}>
                  <Icon name='delete' type='google' color='white' size={15} />
                </TouchableNativeFeedback>
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              width: '100%',
              marginBottom: 16,
              justifyContent: 'space-between'
            }}>

              <View style={{}}>
                <Text>Date: {selectedPlace.photoDate}</Text>
                <Text>Author: {selectedPlace.author}</Text>
              </View>

              <View style={[styles.cardButton, { marginTop: 20 }]}>
                <TouchableNativeFeedback onPress={() => {
                  navigation.navigate('chat', {place: selectedPlace})

                }}>
                  <Icon name='chat' type='google' color='white' size={15} />
                </TouchableNativeFeedback>

              </View>
            </View>
          </View> :
          <></>
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
