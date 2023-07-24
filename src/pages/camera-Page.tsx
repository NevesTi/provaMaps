import { useState, useEffect } from "react";
import { View, TouchableNativeFeedback } from "react-native";
import * as MediaLibray from 'expo-media-library';
import { Image } from 'expo-image';
import { Camera, CameraType } from 'expo-camera';
import { styles } from "../styles/styles";
import { Icon } from "react-native-elements";



export default function CameraPage({ navigation, route }) {

    const [cameraRef, setCameraRef] = useState(null);
    const [cameraPermission, setCameraPosition] = useState(false)

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setCameraPosition(cameraStatus.status === 'granted');
            await MediaLibray.requestPermissionsAsync();
        })();

    }, []);

    return (
        <View style={styles.container}>
            <Camera
                ref={(ref) => { setCameraRef(ref) }}
                ratio="16:9"
                style={styles.camera}
                type={CameraType.back}
            >
            </Camera>

            <View style={styles.cameraButtonRight}>
                <TouchableNativeFeedback onPress={() => { }}>
                    <Icon type="google" name="photo-camera" size={30} color='white' />
                </TouchableNativeFeedback>
            </View>

            <View style={styles.cameraButtonLeft}>
                <TouchableNativeFeedback onPress={() => { navigation.goBack() }}>
                    <Icon type="google" name="arrow-back" size={30} color='white' />
                </TouchableNativeFeedback>
            </View>


        </View>
    )

}





