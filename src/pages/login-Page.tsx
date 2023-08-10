import { NavigationContainer, } from '@react-navigation/native';
import { View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import { useEffect, useState } from 'react';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { getStoredData, setStoredData } from '../shared/secure-store-service';


export default function LoginPage({ navigation }) {

    const [author, setAuthor] = useState('');

    useEffect(()=>{
        getAuthor();

    }, []);

    async function getAuthor(){
        const localAuthor = await getStoredData('author');
        if(localAuthor){
            navigation.navigate('homemaps');

        }
    }

 function login(){
    // Armazenar no SecureStorre o nome do usuário
    setStoredData('author', author);

    // Navegar para a tela da Home
    navigation.navigate('homemaps');
 }
    return (
        <View style={styles.containerLogin}>

            <View style={{ flex: 1 }}></View>
            <View style={styles.containerImage} ><Image style={{
                height: 50, width: 50, top: 25, left: 20,
            }} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1816/1816918.png' }} />
            </View>

            <Text style={{ fontSize: 20, color: 'white', fontWeight: '700' }}> Seu App</Text>
           
            <View style={{ flex: 1 }}></View>
            <View style={{ flex: 1, width: '90%', marginHorizontal: 16 }}>
                <TextInput placeholder='Digite aqui seu nome:' 
                onChangeText={setAuthor}
                value={author}
                style={{ 
                    backgroundColor:'#FFF', 
                    padding:8,
                    marginBottom:32 
                    }}></TextInput>
                <Button style={{backgroundColor:'black'}} title='Entrar' onPress={login} ></Button>

            </View>

        </View>
    )
}

