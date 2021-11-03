import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { css } from "./assets/css/Css";
import MapView from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import config from "./config/index.json";
import MapViewDirections from "react-native-maps-directions";
import * as Speech from "expo-speech"; 

export default function App() {
  const mapEl = useRef(null);
  const seachEl = useRef(null);

  const [searching, setSearching] = useState(false);
  const [target, setTarget] = useState(null);
  const [origin, setOrigin] = useState(null);

  const [distance, setDistance] = useState(null);

  const LAT_DELTA = 0.009;
  const LNG_DELTA = 0.002;

  useEffect(() => {
    (async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (granted) {
        // console.log(granted);
        // const { coords } = await Location.getCurrentPositionAsync({
        //   enableHighAccuracy: true,
        // });
        // console.log('>>c',coords);
        setOrigin({
          latitude:-7.1051873,
          longitude: -35.8703542,
        });
      } else {
        throw new Error("Location permission not granted");
      }
    })();
  }, []);

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

  const speak = (origem, destino) => {
    const texto  = `Trajeto definido de ${origem} para ${destino}`;
    Speech.speak(texto,{language: 'pt-BR'})
  }

  return (
    <>
      <StatusBar />
      <SafeAreaView style={css.container}>
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
              const destinoStr  = `${data.terms[0].value},${data.terms[1].value},${data.terms[2].value}`;
              
              speak('Local Atual', destinoStr);
              setSearching(false);
              setTarget({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              });
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
        {origin && (
          <MapView
            style={mapStyle()}
            initialRegion={{
              latitude: -7.1051945,
              longitude: -35.8703602,
              latitudeDelta: LAT_DELTA,
              longitudeDelta: LNG_DELTA,
            }}
            showsUserLocation={true}
            loadingEnabled={true}
            ref={mapEl}
          >
            {target && (
              <MapViewDirections
                origin={origin}
                destination={target}
                apikey={config.googleAPI}
                strokeWidth={3}
                onReady={(result) => {
                  setDistance(result.distance);
                  mapEl.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      top: 50,
                      bottom: 50,
                      left: 50,
                      right: 50,
                    },
                  });
                }}
              />
            )}
          </MapView>
        )}
      </SafeAreaView>
    </>
  );
}
