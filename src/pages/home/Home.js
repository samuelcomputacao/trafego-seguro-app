import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Progress from "react-native-progress";

import { Input, Text } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { api } from "../../api";


const Home = ({ navigation }) => {
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState("23.0134,72.5624");
  const [searching, setSearching] = useState(false);

  const seachEl = useRef(null);

  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [finish, setFinish] = useState(false);


  const handleUpdateQuery = async (query) => {
    setQuery(query);
    setFinish(false);
  };

  const handleUpdateCitie = (citie) => {
    setQuery(`${citie.name} - ${citie.uf}`);
    setDestination(`${citie.point.latitude},${citie.point.longitude}`);
    setCities([]);
    setFinish(true);
  };

  const searchCities = async () => {
    try {
      setSearching(true);
      const { data } = await api.get(`/cities?name=${query}`);
      setCities(data);
    } catch (err) {
      console.log(err);
    } finally {
      setSearching(false);
    }
  };

  const captureLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (granted) {
      let { coords } = await Location.getCurrentPositionAsync({});
      setOrigin(`${coords.latitude},${coords.longitude}`);
    } else {
      throw new Error("Location permission not granted");
    }
  };

  const captureData = () => {
    captureLocation();
    searchCities();
  };

  useEffect(() => {
    captureData();
  }, []);

  const progressItem = () => {
    return searching ? (
      <View style={[styles.row, styles.viewProgress]} key="key-progress">
        <Progress.Bar indeterminate width={200} />
      </View>
    ) : (
      <View></View>
    );
  };

  const listCitiesItems = () => {
    var result = <View />;
    if (!searching && cities.length == 0 && !finish) {
      result = (
        <View style={[styles.row, styles.viewList]} key="key-empty">
          <Text style={styles.textList}>Nenhuma cidade encontrada.</Text>
        </View>
      );
    } else {
      if (!searching && cities.length > 0) {
        result = (
          <ScrollView>
            {cities.map((citie) => {
              return (
                <View style={[styles.row, styles.viewList]} key={citie.cod}>
                  <Text
                    style={styles.textList}
                    onPress={() => {
                      handleUpdateCitie(citie);
                    }}
                  >{`${citie.name} - ${citie.uf}`}</Text>
                </View>
              );
            })}
          </ScrollView>
        );
      }
    }
    return result;
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <View styles={styles.row} ref={seachEl}>
        <Text style={styles.label}>Digite a cidade de destino</Text>
        <Input
          style={styles.input}
          value={query}
          onChangeText={(text) => handleUpdateQuery(text)}
          onKeyPress={(e) => {
            captureData();
          }}
        />
      </View>

      {progressItem()}
      {listCitiesItems()}

      <View style={[styles.row, { justifyContent: "center" }]}>
        <TouchableOpacity
          style={styles.button}
          title="OK"
          onPress={() => {
            navigation.navigate("Mapa", { origin, destination});
          }}
        >
          <Text style={[styles.buttonLabel]}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  input: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "white",
    alignSelf: "flex-start",
  },

  button: {
    padding: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginRight: 10,
    marginBottom: 10,
  },

  buttonLabel: {
    fontSize: 30,
    fontWeight: "500",
    color: "blue",
  },

  selectedLabel: {
    backgroundColor: "white",
  },
  viewProgress: {
    padding: 8,
    marginLeft: "2%",
    marginRight: "2%",
    marginBottom: 2,
    justifyContent: "center",
  },

  viewList: {
    backgroundColor: "white",
    marginLeft: "2%",
    marginRight: "2%",
    marginBottom: 2,
  },

  textList: {
    padding: 8,
    width:'100%'
  },

  label: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 24,
  },
});

export default Home;
