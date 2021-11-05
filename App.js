import * as React from 'react';
import { View, Text , Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Mapa from './src/pages/mapa/Mapa';
import Home from './src/pages/home/Home';
import Mapa2 from './src/pages/Mapa2/Mapa2'

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Mapa" component={Mapa} />
        <Stack.Screen name="Mapa2" component={Mapa2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;