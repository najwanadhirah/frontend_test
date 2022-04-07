import React, { Component } from 'react';
import {  StyleSheet} from 'react-native';
import { Router, Scene} from 'react-native-router-flux';
import Home from './pages/HomeScreen';
import Second from './pages/SecondScreen';
import Details from './pages/DetailsScreen';

export default class App extends Component {

  render() {

    return (

      <Router >
        <Scene key="root">
        <Scene key="Home" component={Home}  hideNavBar={true}/>
        <Scene key="Second" component={Second}  hideNavBar={false}/>
        <Scene key="Details" component={Details} hideNavBar={true}/>
      </Scene>
      </Router>
    )
  }
}