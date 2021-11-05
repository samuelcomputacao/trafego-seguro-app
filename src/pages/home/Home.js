import React from "react";
import { Button, View } from "react-native";


const Home = ({navigation}) => {
    return (
        <View>
            <Button title='OK'
            onPress={() => navigation.navigate('Mapa2')}/>
        </View>)
}

export default Home;