import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import * as Speech from "expo-speech";

import {api} from "../../api";

const DEFAULT_PADDING = { top: 100, right: 100, bottom: 100, left: 100 };

const Mapa2 = ({ route, navigation }) => {
  const mapRef = useRef(null);

  const [markers, setMarkers] = useState(null);
  const [destMarker, setDestMarker] = useState(null);
  const [startMarker, setStartMarker] = useState(null);
  const [coords, setCoords] = useState([]);

  const { origin, destination, destinoStr } = route.params;

  const speak = (destinostr) => {
    Speech.speak(destinoStr, { language: "pt-BR" });
  };

  const getRoutePoints = async (origin, destination) => {

    try {
      const response = await api.get(`/routes?origin=${origin}&destination=${destination}`);
      const cortemp = response.data;

      if (cortemp) {
        var length = cortemp.length - 1;

        var tempMARKERS = [];
        tempMARKERS.push(cortemp[0]);
        tempMARKERS.push(cortemp[length]);
        setMarkers(tempMARKERS);
        setDestMarker(cortemp[length]);
        setStartMarker(cortemp[0]);

        var coordsAux = cortemp.map((c) => {
          return c;
        });
        coordsAux.reverse();
        setCoords(cortemp.concat(coordsAux));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fitAllMarkers = () => {
    const temMark = markers;
    if (mapRef.current == null) {
    } else {
      mapRef.current.fitToCoordinates(temMark, {
        edgePadding: DEFAULT_PADDING,
        animated: false,
      });
    }
  };

  useEffect(() => {
    getRoutePoints(origin, destination);
    speak(destinoStr);
  }, []);

  return (
    <View style={styles.container}>
      {coords.length > 0 && startMarker !== null && destMarker !== null ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          onLayout={() => fitAllMarkers()}
          loadingEnabled={true}
          showsMyLocationButton={true}
          showsUserLocation={true}
        >
          <MapView.Polygon
            coordinates={coords}
            strokeWidth={4}
            strokeColor='#000'
            lineCap="round"

          />
          <MapView.Marker key={1} coordinate={startMarker} />
          {/*end point marker*/}
          <MapView.Marker key={2} coordinate={destMarker}></MapView.Marker>
        </MapView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Mapa2;
