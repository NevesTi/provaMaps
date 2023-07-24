
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer,  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraPage from './src/pages/camera-Page';
import HomeMaps from './src/pages/home-maps';



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

      </Stack.Navigator>

    </NavigationContainer>
  );

}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
