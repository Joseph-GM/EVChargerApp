/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import {
   View,
   Button,
 } from 'react-native';
 
 import {
   Header,
   LearnMoreLinks,
   Colors,
   DebugInstructions,
   ReloadInstructions,
 } from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer, NavigationHelpersContext } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screen/HomeScreen';
import ListScreen from './screen/ListScreen';

function HomeStack({navigation}) {
  return (
    <>
      <HomeScreen />
      <Button 
        title = "Go to List"
        onPress = {()=> navigation.navigate('List') }
      />
    </>
  );
}

function ListStack({navigation}){
  return(
    <ListScreen />
  );
} 


const Stack = createStackNavigator();

 export default function App() {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen 
             name="Home" 
             component={HomeStack}
             options={{
               title: 'Energy Assist'
             }} 
            />
            <Stack.Screen name="List" component={ListStack} />
          </Stack.Navigator>
        </NavigationContainer>    
      );
 }
 