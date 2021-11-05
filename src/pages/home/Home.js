import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import config from '../../../config/index.json';
import { css } from "../../../assets/css/Css";
import { SafeAreaView } from "react-native-safe-area-context";



import Form from "../componentes/form/Form";

const Home = ({navigation}) => {

    const [origin, setOrigin]  = useState('22.9962,72.5996');
    const [destination, setDestination] = useState('23.0134,72.5624');
    const [searching, setSearching] = useState(false);

    const [destinoStr, setDestinoStr] = useState('');

    const seachEl = useRef(null);

    const searchStyle = () => {
        return {
            height: searching ? "100%" : "5%",
            zIndex: 1,
        };
      };
    
      const mapStyle = () => {
        return {
          height: searching ? "0%" : "95%",
          backgroundColor: "white",
          zIndex: 0,
          paddingTop: 2,
        };
      };
    

    

    useEffect(() => {
        (async () => {
          const { granted } = await Location.requestForegroundPermissionsAsync();
          console.log(`GRANDED: ${granted}`);
          if (granted) {
            let {coords} = await Location.getCurrentPositionAsync({});
            setOrigin(`${coords.latitude},${coords.longitude}`);
            console.log(`Location: ${JSON.stringify(origin)}`);
          } else {
            throw new Error("Location permission not granted");
          }
        })();
      }, []);

    return (
        <SafeAreaView style={css.container}>
            {/* <Form /> */}
        <View
          style={searchStyle()}
          ref={seachEl}
          onTouchStart={() => {
            setSearching(true);
          }}
        >
          <GooglePlacesAutocomplete
            placeholder="Qual o destino?"
            onPress={(data, details = null) => {
              const destinoStr  = `Trajeto definido de Local Atual para ${data.terms.map(t => {return t.value}).join(',')}`;
              setDestinoStr(destinoStr);
              setSearching(false);
              setDestination(`${details.geometry.location.lat},${details.geometry.location.lng}`);
            }}
            query={{
              key: config.googleAPI,
              language: "pt-br",
            }}
            fetchDetails={true}
            styles={{
              listView: {
                height: 100,
                zIndex: 2,
              },
            }}
          />
        </View>
        <View>
        <Button title='OK'
            onPress={() => navigation.navigate('Mapa2',{origin, destination, destinoStr})}/>
        </View>
      </SafeAreaView>)
}



export default Home;