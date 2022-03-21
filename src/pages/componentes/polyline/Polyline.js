import React, { useState } from "react";
import { View } from "react-native";
import MapView from "react-native-maps";

const Polyline = ({ route }) => {
  const convertLineToPoly = (cortemp) => {
    var coordsAux = cortemp.map((c) => {
      return c;
    });
    coordsAux.reverse();
    return cortemp.concat(coordsAux);
  };

  return !route || route.length === 0 ? (
    <View></View>
  ) : (
    <MapView.Polygon
      coordinates={convertLineToPoly(route)}
      strokeWidth={4}
      strokeColor="#000"
      lineCap="round"
    />
  );
};

export default Polyline;
