
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraPage from './src/pages/camera-Page';
import HomeMaps from './src/pages/home-maps';
import PlacePage from './src/pages/place-page';



const Stack = createNativeStackNavigator();

export default function App() {

  return (

    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen options={({ route }) => ({
          headerShown: false
        })} name="homemaps" component={HomeMaps} />

        <Stack.Screen options={({ route }) => ({
          headerShown: false
        })} name="camera" component={CameraPage} />

        <Stack.Screen options={({ route }) => ({
          headerShown: false
        })} name="place" component={PlacePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
