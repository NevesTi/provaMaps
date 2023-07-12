
import { StyleSheet, Text, View } from 'react-native';
import { HomePage } from './src/pages/home_pages'; 

export default function App() {
  return (
    <View style={styles.container}> 
      <HomePage/>
    </View> );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
});