import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

    },

    mapView: {
        width: '100%',
        height: '100%',
    },
    cameraButtonRight: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        position: 'absolute',
        bottom: 60,
        right: 32,
        backgroundColor: 'blue',
        elevation: 5
    },
    camera: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    cameraButtonLeft: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        position: 'absolute',
        bottom: 60,
        left: 32,
        backgroundColor: 'blue',
        elevation: 5
    },

    markerImage: {
        width: 80,
        height: 80,
        borderRadius:40,
    },
    markerImageContainer: {
        width: 82,
        height: 82,
        borderRadius: 41,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',

    },
    cardStyle:{
        backgroundColor:'white',
        height:470,
        position:'absolute',
        top:32,
        right:16,
        left:16,
        borderRadius:7,
        elevation:5,
        justifyContent:'flex-end',
        alignItems:"center",
        paddingHorizontal:16,
        paddingVertical:16,
    },
    cardButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'black',
        elevation: 5
    },



})
