import React, {useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,Dimensions
} from 'react-native';
import MapView from 'react-native-maps';
import * as Speech from "expo-speech"; 

import config from '../../../config/index.json';

const mode = 'driving'; // 'walking';
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
const DEFAULT_PADDING = { top: 100, right: 100, bottom: 100, left: 100 };
const { width, height } = Dimensions.get('window');
const polylineDecorder = require('polyline');


const Mapa2 = ({ route, navigation }) => {

    const mapRef = useRef(null);

    const LAT_DELTA = 0.009;
    const LNG_DELTA = 0.002;
  
    const [markers, setMarkers] = useState(null);
    const [destMarker, setDestMarker] = useState(null);
    const [startMarker, setStartMarker] = useState(null);
    const [coords, setCoords] = useState(null);

    const { origin, destination, destinoStr } = route.params;

    const gerarLinha = (polyline) => {
      debugger;
      const coordenadas = polylineDecorder.decode(polyline);
      let i = 0;
      const pontos = Array();
      while(i < coordenadas.length){
        pontos.push({
          latitude: coordenadas[i][0],
          longitude:coordenadas[i][1]
        });
        i += 1;
      }
      return pontos;
    }

    const speak = (destinostr) => {
      Speech.speak(destinoStr,{language: 'pt-BR'})
    }

    const getRoutePoints = (origin,destination) => {
        console.log("-----getRoutePoints-----")    
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${config.googleAPI}&mode=${mode}`;
    
        fetch(url)
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.routes.length) {
              
              var cortemp = gerarLinha(responseJson.routes[0].overview_polyline.points); // definition below;
              var length = cortemp.length - 1;
    
              var tempMARKERS = []; 
              tempMARKERS.push(cortemp[0]) ;   //start origin        
              tempMARKERS.push(cortemp[length]); //only destination adding
    
              //temMark : [{"latitude":[22.9962,72.59957],"longitude":[22.99633,72.59959]},{"latitude":[23.0138,72.56277],"longitude":[23.01369,72.56232]}]
              console.log("tempMARKERS : " + JSON.stringify(tempMARKERS));
    
              setCoords(cortemp);
              setMarkers(tempMARKERS);
              setDestMarker(cortemp[length]);
              setStartMarker(cortemp[0]);
    
            }
          }).catch(e => { console.warn(e) });
      }

      const fitAllMarkers = () => {
        const temMark = markers;
        console.log( "------fitAllMarkers------")
        if (mapRef.current == null) {
          console.log("map is null")
        } else {
          console.log("temMark : " + JSON.stringify(temMark));
          mapRef.current.fitToCoordinates(temMark, {
            edgePadding: DEFAULT_PADDING,
            animated: false,
          });              
        }
      }

useEffect(() => {
    getRoutePoints(origin,destination);
    speak(destinoStr);
},[]);

  return (
    
      <View style={styles.container}>
        {
          (coords !== null && startMarker !== null && destMarker !== null) ?
          
            <MapView
              ref={mapRef}
              style={styles.map}
              onLayout={() => fitAllMarkers()}
              loadingEnabled={true}
              showsMyLocationButton={true}
              showsUserLocation={true}
              
              >

              < MapView.Polyline
                coordinates={coords}
                strokeWidth={5}
                lineDashPattern={[0]}
              />

              <MapView.Marker
                key={1}
                coordinate={startMarker}
               
              />

              {/*end point marker*/}
              <MapView.Marker
                key={2}
                coordinate={destMarker}
              >                
              </MapView.Marker>
            </MapView> : null
        }
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Mapa2;