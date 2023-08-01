import { SafeAreaView, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

export default function PlacePage({navigation, route}){
   const image = [
    {
        url:route.params.place.imagePath
    }
   ];
   return(
    <SafeAreaView style={{flex:1}}>
        <View style={{flex:1, backgroundColor:'black'}}>
            <ImageViewer imageUrls={image}/>
        </View>

    </SafeAreaView>
   )
}