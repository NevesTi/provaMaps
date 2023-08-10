import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, Text, Image, TextInput, TouchableNativeFeedback } from "react-native";
import ChatEntity from "../entities/chat-entity";
import { ref } from "@firebase/database";
import { styles } from "../styles/styles";
import { Icon } from "react-native-elements";
import { onValue, push } from "firebase/database";
import { db } from "../../firebase-config";
import { getStoredData } from "../shared/secure-store-service";

export default function ChatPage({ navigation, route }) {

    const [author, setAuthor] = useState('');
    const [mensages, setMessages] = useState<ChatEntity[]>([]);
    const listRef = useRef (null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        getMessages();
        getAuthor();

    }, []);

    useEffect(() => {
        if(listRef){
        if(mensages.length > 0){
        listRef.current.scrollToEnd({animated:true});
    }
}
    }, [mensages]);

    async function getAuthor() {
        const author = await getStoredData('author');
        setAuthor(author);
    }


    async function getMessages() {
        return onValue(ref(db, `/messages/${route.params.place.id}`), (snapshot) => {
            try {
                setMessages([]);
                if (snapshot !== undefined) {
                    snapshot.forEach((childSnapshot) => {
                        const childkey = childSnapshot.key;
                        let childValue = childSnapshot.val();
                        childValue.id = childkey;
                        setMessages((messages) => [...mensages, (childValue as ChatEntity)])
                    });
                }
            } catch (e) {
                console.log(e)

            }
        });
    }

    async function sendMessage() {
        const newMessage: ChatEntity = {
            id: Math.random().toString(),
            date: Date.now(),
            message: message,
            sender: author,
            author: author,
            
        }

        push(ref(db, `/messages/${route.params.place.id}`), newMessage);
        setMessage('');

    }

    function convertTimestampToDate(timestamp: number) {
        let date = new Date(timestamp);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    }

    return (
        <View style={{ justifyContent: 'center', backgroundColor: '#FFF', height: '100%', width: '100%' }}>
            <FlatList
                ref={listRef}
                data={mensages}
                renderItem={({ item }) => {

                    return (
                        item.sender !== author ?

                            <View style={styles.containerChat}>
                                <View style={styles.containerMessage}>
                                    <View style={{
                                        backgroundColor: 'transparente',
                                        width: 200,
                                        flexDirection: 'row',
                                        marginBottom: 16

                                    }}>
                                        <Image source={{ uri: `https://robohash.org/${item.sender}.png?set=set2` }}
                                            style={{ backgroundColor: '#ccc', width: 40, height: 40, marginRight: 8, borderRadius: 20 }} />
                                        <View style={{ backgroundColor: '#ccc', width: 'auto', borderRadius: 7, paddingVertical: 2, paddingHorizontal: 4 }}>
                                            <Text style={{ fontSize: 13, fontWeight: '700' }}>{item.sender}</Text>
                                            <Text style={{}}>{item.message}</Text>
                                            <Text style={{ textAlign: "left", fontSize: 8 }}>{convertTimestampToDate(item.date)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            :


                            <View style={styles.containerReverse}>
                                <View style={styles.containerMessageReverse}>
                                    <View style={{ backgroundColor: 'transparente', width: 200, flexDirection: 'row-reverse', }}>
                                        <Image source={{ uri: `https://robohash.org/${item.author}.png?set=set2`}}
                                            style={{ backgroundColor: '#ccc', width: 40, height: 40, marginRight: 8, borderRadius: 20 }} />
                                        <View style={{ backgroundColor: '#ccc', width: 'auto', borderRadius: 7, paddingVertical: 2, paddingHorizontal: 4 }}>
                                            <Text style={{ fontSize: 13, fontWeight: '700' }}>{item.sender}</Text>
                                            <Text style={{}}>{item.message}</Text>
                                            <Text style={{ textAlign: "right", fontSize: 8 }}>{convertTimestampToDate(item.date)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                    )
                }}
                keyExtractor={(item) => item.id}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 8, marginBottom: 8 }}>
                <TextInput placeholder="Digite aqui a menssagem" numberOfLines={1} value={message} onChangeText={setMessage}
                    style={{
                        backgroundColor: '#ccc',
                        flex: 4, borderRadius: 7,
                        paddingVertical: 2,
                        paddingHorizontal: 8,
                        maxHeight: 80,
                        marginRight: 8
                    }}
                />
                <TouchableNativeFeedback onPress={sendMessage}>
                    <Icon name="send" type="google" size={20} color='#000' />
                </TouchableNativeFeedback>

            </View>
        </View>
    )
}