import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View, Button, Alert, KeyboardAvoidingView, TouchableHighlight } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Logo from '../components/Logo';


class HomeScreen extends Component{

  static navigationOptions = {
    title: 'Home',
    header: null,
  }

  constructor() {
    super();
    this.state = {
      url: '',
      resultado: '',
      animating: true
    }
  }

  onSendUrl(){

    let url = this.state.url;

    if ( !url.includes("http") || !url.includes("https") ) {
      url = "http://" + url;
    }


    if ( ValidURL(url) ) {

      this.props.navigation.navigate('Results', { url: this.state.url });


    } else {

      alert("Es necesario ingresar una URL valida");
      this.UrlInput.focus();

    }

  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
          <Logo />
          <KeyboardAvoidingView behavior="padding" style={{padding: 10}}>
              <TextInput
                placeholder="http://"
                returnKeyType="done"
                returnKeyLabel="done"
                keyboardType="url"
                autoCapitaliza="none"
                autoCorrect={true}
                onChangeText={(url) => this.setState({url})}
                ref={(input) => this.UrlInput = input}
                style={styles.inputField}
              />
              <Button
                onPress={() => this.onSendUrl() }
                title="Ingresar"
                color="#000"
                accessibilityLabel="Ingresar url"
                style={styles.boton}
              />
          </KeyboardAvoidingView>
      </View>
    );
  }

}


class ResultsScreen extends Component {

  static navigationOptions = {
    title: 'Resultados',
  };

  constructor() {
    super();
    this.state = {
      url: '',
      resultado: '',
      animating: true
    }
  }

  fetchData() {

    const { params }   = this.props.navigation.state;

    let url = params.url;
    if ( !url.includes("http") || !url.includes("https") ) {
      url = "http://" + url;
    }

    if ( ValidURL(url) ) {

      fetch("https://www.javimata.com/api/php/pagetools.php?url=" + url,{
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'url': url
          })
        })
        .then((response) => response.json())
        .then((responseData) => {
          if ( responseData.responseCode == 200 ){
            this.setState({url: url});
            this.setState({title: responseData.title});
            this.setState({resultado: responseData });
            this.setState({animating: false});
            /*
            alexaRank = responseData.alexaRank;
            Alert.alert(
              responseData.title,
              'Score: ' + responseData.score + '\n' + 'Alexa Rank: ' + alexaRank.toLocaleString('en')
            )
            */
          }
        })
        .done();

    } else {

      alert("Es necesario ingresar una URL valida");
      this.UrlInput.focus();

    }


  }

  componentDidMount() {
      this.fetchData();
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.state.animating}
          style={[styles.centering, {height: 80}]}
          size="large"
        />
        <Logo />
        <Text>URL: {this.state.url}</Text>
        <Text>Titulo del sitio: {this.state.resultado.title}</Text>
        <Text>Score: {this.state.resultado.score}</Text>
        <Text>Alexa Rank {this.state.resultado.alexaRank}</Text>

      </View>
    )
  }
}


const PageTools = StackNavigator({
  Home: { screen: HomeScreen },
  Results: { screen: ResultsScreen },
});



function ValidURL(str) {
  var pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    texto: {
      textAlign: 'center',
    },
    inputField: {
        width: 200,
        height: 40,
        marginBottom: 10,
    },
    boton: {
      marginTop: 5,
    }
});

export default PageTools;
