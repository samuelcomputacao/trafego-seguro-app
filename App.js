import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Mapa from './src/pages/mapa/Mapa';
import Home from './src/pages/home/Home';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Mapa" component={Mapa} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;