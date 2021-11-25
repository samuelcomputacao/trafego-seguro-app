import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

import { api } from "../../api";
import { speak } from "../../speak/speak";

const DEFAULT_PADDING = { top: 100, right: 100, bottom: 100, left: 100 };

const Mapa2 = ({ route, navigation }) => {
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
      text = `Fo${plural ? "ram" : "i"} encontrado${plural ? "s" : ""} ${
        length
      } alerta${plural ? "s" : ""} em seu trajeto.`;
    }
    speak(text, onDone);
  };

  const convertLineToPoly = (cortemp) => {
    var coordsAux = cortemp.map((c) => {
      return c;
    });
    coordsAux.reverse();
    return cortemp.concat(coordsAux);
  };

  const speakAlert = (alerts, idx) => {
      if (idx < alerts.length){
        speak(alerts[idx].texto, () => speakAlert(alerts, idx + 1));
      }
  }


  const speakAlerts = (alerts) => {
    speakAlert(alerts,0);
  }

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
        setCoords(convertLineToPoly(cortemp));

        if (response.data.poi) {
          setPoi(response.data.poi);
          speakAlertInit(response.data.poi.length, ()=>{speakAlert(response.data.poi,0)});
        }
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
          <MapView.Polygon
            coordinates={coords}
            strokeWidth={4}
            strokeColor="#000"
            lineCap="round"
          />
          <MapView.Marker coordinate={startMarker} />
          <MapView.Marker coordinate={destMarker} />
          {poi.map((p, idx) => {
            return <MapView.Marker key={idx} coordinate={p.point} />;
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

export default Mapa2;
