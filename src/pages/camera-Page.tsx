import { useState, useEffect } from "react";
import { View, TouchableNativeFeedback, Text } from "react-native";
import * as MediaLibray from 'expo-media-library';
import { Image } from 'expo-image';
import { Camera, CameraType } from 'expo-camera';
import { styles } from "../styles/styles";
import { Icon } from "react-native-elements";
import { getDownloadURL, getStorage, ref, uploadBytes } from "@firebase/storage";
import { app } from "../../firebase-config";



export default function CameraPage({ navigation, route }) {

    const [cameraRef, setCameraRef] = useState(null);
    const [cameraPermission, setCameraPosition] = useState(false);
    const [IsUploading, setIsUploading] = useState(false);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setCameraPosition(cameraStatus.status === 'granted');
            await MediaLibray.requestPermissionsAsync();
        })();

    }, []);

    async function takePicture() {

        if (cameraRef) {
            const { uri } = await cameraRef.takePictureAsync();
            await MediaLibray.saveToLibraryAsync(uri);
            route.params.callback(await uploadImage(uri));
            navigation.goBack();
        }


    }

    async function uploadImage(imageUrl): Promise<string> {
        setIsUploading(true);
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const storage = getStorage(app);
        const storageRef = ref(
            storage, 'images/' + imageUrl.replace(/^.*[\\\/]/, '')
        )


        const upload = await uploadBytes(storageRef, blob);

        const uploadedImageUrl = await getDownloadURL(storageRef);
        console.log(uploadedImageUrl);
        setIsUploading(false);
        return uploadedImageUrl;

    }

    return (
        <View style={styles.container}>
            <Camera
                ref={(ref) => { setCameraRef(ref) }}
                ratio="16:9"
                style={styles.camera}
                type={CameraType.back}
            >
                {
                    IsUploading ?
                        <View style={{ width: '100%', height: '100%', backgroundColor: 'black', opacity: 0.8, justifyContent: "center", alignItems: 'center' }}>

                            <Image style={{ width: 100, height: 80 }} source={{ uri:'https://www.ivymount.org/wp-content/themes/fathom/preview.gif'}} />
                            <Text style={{ color: 'white' }}>Aguarde...</Text>

                        </View> : <></>
                }
            </Camera>

            <View style={styles.cameraButtonRight}>
                <TouchableNativeFeedback onPress={takePicture}>
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





