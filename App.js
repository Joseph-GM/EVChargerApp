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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WebView } from 'react-native-webview';

import HomeScreen from './screen/HomeScreen';
import ListScreen from './screen/ListScreen';
import ReviewDetails from './screen/ReviewDetails';
import RouteView from './screen/RouteView';
import SearchScreen from './screen/SearchScreen';
import SearchResult from './screen/SearchResult';
import SearchRoute from './screen/SearchRoute';
import ModalDetail from './screen/ModalDetail';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();
const RootStack = createStackNavigator();

function HomeStackScreen() {
  return(
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Energy Assist'
        }} 
      />
      <HomeStack.Screen name="List" component={ListScreen} />
      <HomeStack.Screen name="Details" component={ReviewDetails} />
      <HomeStack.Screen name="Route" component={RouteView} />
    </HomeStack.Navigator>
  );
}

function SearchStackScreen() {
  return(
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={SearchScreen} />
      <SearchStack.Screen name="SearchResult" component={SearchResult} />
      <SearchStack.Screen name="SearchRoute" component={SearchRoute} />
    </SearchStack.Navigator>
  );
}

function ChevyHomeScreen() {
  return(
    <WebView 
      source = {{uri: 'https://m.chevrolet.co.kr'}}
      style = {{marginTop:20}}
    />
  );
}

function RootStackScreen() {
  return (
    <RootStack.Navigator mode="modal">
      <RootStack.Screen 
        name="Root"
        component={HomeStackScreen}
        options = {{headerShown: false}}
      />
      <RootStack.Screen 
        name="ModalDetail"
        component={ModalDetail}
      />
    </RootStack.Navigator>
  );
}

 export default function App() {
      
    return (
        <NavigationContainer>
          <Tab.Navigator initialRouteName="Home">
            <Tab.Screen name="Search" component={SearchStackScreen} />
            <Tab.Screen name="Home" component={RootStackScreen} />
            <Tab.Screen name="ChevyHome" component={ChevyHomeScreen} />
          </Tab.Navigator>
        </NavigationContainer>    
      );
 }
 