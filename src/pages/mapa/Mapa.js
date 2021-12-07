import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";

import Polyline from "../componentes/polyline/Polyline";

import { api } from "../../api";
import { speak } from "../../speak/speak";

import { openConnectionWS } from "../../websocket/ws";

const DEFAULT_PADDING = { top: 100, right: 100, bottom: 100, left: 100 };

const Mapa = ({ route }) => {
  const mapRef = useRef(null);

  const [markers, setMarkers] = useState(null);
  const [destMarker, setDestMarker] = useState(null);
  const [startMarker, setStartMarker] = useState(null);
  const [coords, setCoords] = useState([]);
  const [poi, setPoi] = useState([]);

  const { origin, destination } = route.params;

  const speakAlertInit = (length, onDone) => {
    let text = "Não foram encontrados alertas em seu trajeto até o momento.";
    if (length > 0) {
      const plural = length > 1;
      text = `Fo${plural ? "ram" : "i"} encontrado${
        plural ? "s" : ""
      } ${length} alerta${plural ? "s" : ""} em seu trajeto.`;
    }
    speak(text, onDone);
  };

  const captureLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (granted) {
      let { coords } = await Location.getCurrentPositionAsync({});
      return { latitude: coords.latitude, longitude: coords.longitude };
    }
  };

  const speakAlert = (alerts, idx) => {
    if (idx < alerts.length) {
      speak(alerts[idx].texto, () => speakAlert(alerts, idx + 1));
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

        if (response.data.poi) {
          setPoi(response.data.poi);
          speakAlertInit(response.data.poi.length, () => {
            speakAlert(response.data.poi, 0);
          });
        }

        openConnectionWS(async () => {
          const position = await captureLocation();
          return {
            type: "POSITION",
            value: { position, route: cortemp },
          };
        });
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
            title="Origem"
          />

          <MapView.Circle
            center={startMarker}
            radius={2000}
            fillColor="#1626d9"
          />

          {poi.map((p, idx) => {
            return (
              <MapView.Circle
                key={idx}
                center={p.point}
                radius={2000}
                fillColor="#c42e00"
              />
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
