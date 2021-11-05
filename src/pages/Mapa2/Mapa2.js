import React, {useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,Dimensions
} from 'react-native';
import MapView from 'react-native-maps';

import config from '../../../config/index.json';

const mode = 'driving'; // 'walking';
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
const DEFAULT_PADDING = { top: 100, right: 100, bottom: 100, left: 100 };
const { width, height } = Dimensions.get('window');

const Mapa2 = () => {

    const mapRef = useRef(null);

    const LAT_DELTA = 0.009;
    const LNG_DELTA = 0.002;

    const [markers, setMarkers] = useState(null);
    const [origin, setOrigin]  = useState('22.9962,72.5996');
    const [destination, setDestination] = useState('23.0134,72.5624');
    const [destMarker, setDestMarker] = useState(null);
    const [startMarker, setStartMarker] = useState(null);
    const [imageloaded, setImageloaded] = useState(false);
    const [coords, setCoords] = useState(null);
    const [loading, setLoading] = useState(false);


    const decode = (t, e) => {
        for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) {
          a = null, h = 0, i = 0;
          do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
          n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0;
          do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
          o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c])
        }
        return d = d.map(function (t) {
          return {
            latitude: t[0],
            longitude: t[1]
          }
        })
      }

    const getRoutePoints = (origin,destination) => {
        console.log("-----getRoutePoints-----")    
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${config.googleAPI}&mode=${mode}`;
        console.log("URL -- >>" + url);
    
        fetch(url)
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.routes.length) {
              var cortemp = decode(responseJson.routes[0].overview_polyline.points) // definition below;
              var length = cortemp.length - 1;
    
              var tempMARKERS = []; 
              tempMARKERS.push(cortemp[0]) ;   //start origin        
              tempMARKERS.push(cortemp[length]); //only destination adding
    
              console.log("tempMARKERS : " + JSON.stringify(tempMARKERS));
    
            setCoords(cortemp);
            setMarkers(tempMARKERS);
            setDestMarker(cortemp[length]);
            setStartMarker(cortemp[0]);
    
            }
          }).catch(e => { console.warn(e) });
      }

      const  forceUpdateMap = () => {
        console.log("-----forceUpdateMap------")
        setImageloaded(true);
      }

      const fitAllMarkers = () => {
        const temMark = markers;
        console.log( "------fitAllMarkers------")
        setLoading(false);
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