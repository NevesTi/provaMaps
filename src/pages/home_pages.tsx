import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Camera } from 'expo-camera';

export default function HomePage() {
  const [cameraActive, setCameraActive] = useState(false);
  const mapRef = useRef(null);

  const toggleCamera = () => {
    setCameraActive(!cameraActive);
  };

  const handleMapPress = (event) => {
    if (cameraActive) {
      const { coordinate } = event.nativeEvent;
      // Fazer algo com as coordenadas da câmera, como enviar para um servidor, etc.
      toggleCamera();
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onPress={handleMapPress}
      >
        {/* Marcador para representar a posição da câmera */}
        {cameraActive && (
          <Marker coordinate={/* coordenadas da câmera */} />
        )}
      </MapView>

      {/* Botão para alternar a câmera */}
      <TouchableOpacity style={styles.button} onPress={toggleCamera}>
        <Text style={styles.buttonText}>{cameraActive ? 'Fechar Câmera' : 'Abrir Câmera'}</Text>
      </TouchableOpacity>

      {/* Renderizar a câmera se estiver ativa */}
      {cameraActive && (
        <Camera style={styles.camera} />
      )}
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
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});