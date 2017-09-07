import React from 'react';
import { Image } from 'react-native';

export default class Logo extends React.Component {
  render() {
    return (
    	<Image source={{uri: 'https://www.javimata.com/images/logo_black.png'}}
       style={{width: 221, height: 80, marginBottom: 20}} />
    );
  }
} 
