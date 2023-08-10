import { useState, useEffect } from "react";
import { View, TouchableNativeFeedback, Text, useWindowDimensions } from "react-native";
import * as MediaLibray from 'expo-media-library';
import { Image } from 'expo-image';
import { Camera, CameraType } from 'expo-camera';
import { styles } from "../styles/styles";
import { Icon } from "react-native-elements";
import { getDownloadURL, getStorage, ref, uploadBytes } from "@firebase/storage";
import { app } from "../../firebase-config";



export default function CameraPage({ navigation, route }) {

    const {width} = useWindowDimensions();
    const height = Math.round((width *16/9));
    const [cameraRef, setCameraRef] = useState(null);
    const [cameraPermission, setCameraPosition] = useState(false);
    const [IsUploading, setIsUploading] = useState(false);

    useEffect(() => {
        getCameraPermissions(); 

    }, []);

    async function getCameraPermissions() {

        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setCameraPosition(cameraStatus.status === 'granted');
        await MediaLibray.requestPermissionsAsync();

    }


    async function uploadImage(imageUrl: string): Promise<string> {
        setIsUploading(true);
        const response = await uriToBlob(imageUrl);
        const blob = response;

        const storage = getStorage(app);
        const storageRef = ref(
            storage, 'images/' + imageUrl.replace(/^.*[\\\/]/, '')
        );


         await uploadBytes(storageRef, blob);
        const uploadedImageUrl = await getDownloadURL(storageRef);
        console.log(uploadedImageUrl);
        setIsUploading(false);
        return uploadedImageUrl;

    }

    
    async function takePicture() { 

        if (cameraRef) {
            const { uri } = await cameraRef.takePictureAsync();
            await MediaLibray.saveToLibraryAsync(uri);
            const uploadedImageUrl = await uploadImage(uri);
            route.params.callback(uploadedImageUrl);
            navigation.goBack();
        }


    }

    async function uriToBlob(uri: string): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // If successful -> return with blob
            xhr.onload = function () {
                resolve(xhr.response);
            };

            // reject on error
            xhr.onerror = function () {
                reject(new Error('uriToBlob failed'));
            };

            // Set the response type to 'blob' - this means the server's response 
            // will be accessed as a binary object
            xhr.responseType = 'blob';

            // Initialize the request. The third argument set to 'true' denotes 
            // that the request is asynchronous
            xhr.open('GET', uri, true);

            // Send the request. The 'null' argument means that no body content is given for the request
            xhr.send(null);
        });
    };


    

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





