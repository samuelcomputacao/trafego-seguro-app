import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Image , Text} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";

import Polyline from "../componentes/polyline/Polyline";

import { api } from "../../api";
import { speak } from "../../speak/speak";

import { openConnectionWS } from "../../websocket/ws";

const DEFAULT_PADDING = { top: 100, right: 100, bottom: 100, left: 100 };

const Mapa = ({ route }) => {
  const mapRef = useRef(null);
  const poisRef = useRef();

  const [markers, setMarkers] = useState(null);
  const [destMarker, setDestMarker] = useState(null);
  const [startMarker, setStartMarker] = useState(null);
  const [coords, setCoords] = useState([]);
  const [poi, setPois] = useState([]);

  poisRef.current = poi;

  const { origin, destination } = route.params;

  const captureLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (granted) {
      let { coords } = await Location.getCurrentPositionAsync({});
      return { latitude: coords.latitude, longitude: coords.longitude };
    }
  };

  const speakAlert = async (alert) => {
    await speak(alert);
  };

  const processPois = (data) => {
    if (data && data.length > 0) {
      data = data.filter(
        (d) => !poisRef.current.map((p) => p.id).includes(d.id)
      );
      const length = data.length;
      if (length > 0) {
        const plural = length > 1;
        const text = `Fo${plural ? "ram" : "i"} encontrado${
          plural ? "s" : ""
        } ${length} alerta${plural ? "s" : ""} em seu trajeto.`;

        speakAlert(text);

        data.forEach((p) => {
          setPois([...poi, p]);
          speakAlert(p.texto);
        });
      }
    }
  };

  const getRoutePoints = async (origin, destination) => {
    try {
      const response = await api.get(
        `/routes?origin=${origin}&destination=${destination}`
      );
      const cortemp = response.data.route;

      if (cortemp) {
        var length = cortemp.length - 1;

        var tempMARKERS = [];
        tempMARKERS.push(cortemp[0]);
        tempMARKERS.push(cortemp[length]);
        setMarkers(tempMARKERS);
        setDestMarker(cortemp[length]);
        setStartMarker(cortemp[0]);
        setCoords(cortemp);

        openConnectionWS(async () => {
          const position = await captureLocation();
          return {
            type: "POSITION",
            value: { position, route: cortemp },
          };
        }, processPois);

        processPois(response);
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
          <Polyline route={coords} />

          <MapView.Marker
            coordinate={destMarker}
            fillColor="#1626d9"
            title="Destino"
          />

          <MapView.Circle
            center={startMarker}
            fillColor="#1626d9"
            description="Origem"
            radius={10}
          />

          {poi.map((p, idx) => {
            return (
              <MapView.Marker
                key={idx}
                coordinate={p.point}
              >
                <Image
                  source={require("../../../resources/warning.png")}
                  style={{ height: 35, width: 35, resizeMode: "contain" }}
                />
                <MapView.Callout>
                  <View style={{width:100}}>
                    <Text>{p.texto}</Text>
                  </View>
                </MapView.Callout>
              </MapView.Marker>
            );
          })}
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

export default Mapa;
