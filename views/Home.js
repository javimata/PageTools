import React, { Component } from 'react';
import { Linking, ScrollView, StyleSheet, TextInput, Image, View, Alert, KeyboardAvoidingView, TouchableHighlight } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Container, Header, Title, Content, Card, CardItem, Thumbnail, Footer, Button, FooterTab, Left, Right, Body, Icon, Text, Spinner, Badge } from 'native-base';
import Expo from 'expo'

import PercentageCircle from 'react-native-percentage-circle';

import Logo from '../components/Logo';

class HomeScreen extends Component{

  static navigationOptions = {
    title: 'PageTools',
    header: null
  }

  constructor() {
    super();
    this.state = {
      url: '',
      resultado: '',
      animating: true,
      isReady: false
    }
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    })
    this.setState({ isReady: true });
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

    if (!this.state.isReady) {
      return(
        <View style={styles.container}>
          <Spinner color='black' />
        </View>
      )
    }else {
      return(
      <Container>
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
                  onSubmitEditing={ () => this.onSendUrl() }
                  style={styles.inputField}
                />
                <Button IconRight full dark
                  onPress={() => this.onSendUrl() }
                  title="SEND URL"
                  color="#000"
                  accessibilityLabel="Send url"
                  style={styles.boton}
                >
                <Text>SEND URL</Text>
                <Icon name='ios-search' />
                </Button>
            </KeyboardAvoidingView>
        </View>
      </Container>
    );
    }
  }

}


class ResultsScreen extends Component {

  static navigationOptions = {
    title: 'Resultados',
    header: null
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
            this.setState({imgMimeType: responseData.screenshot.mime_type });
            this.setState({imgData: responseData.screenshot.data});

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
      const { navigate } = this.props.navigation;
      if (this.state.animating == true) {
        return(
          <View style={styles.container}>
          <Spinner color='black' />
          </View>
        )
      }else {
        return(
        <Container style={{marginTop: Expo.Constants.statusBarHeight}}>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.navigate('Home') }>
                <Icon name='md-arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>Result</Title>              
            </Body>
            <Right/>
          </Header>

           <Content>
              <Card>
                <CardItem>
                  <Left>
                    <Icon name='globe' />
                    <Body>
                      <Text>{this.state.resultado.title}</Text>
                      <Text note>{this.state.url}</Text>
                    </Body>
                  </Left>
                </CardItem>

                <CardItem cardBody>
                  <Image source={{uri: 'data:'+this.state.imgMimeType+';base64,'+this.state.imgData}} style={{height: 200, width: null, flex: 1}}/>
                </CardItem>
                <CardItem>
                  <Left>
                    <Badge primary>
                      <Text>Score: {this.state.resultado.score}</Text>
                    </Badge>
                  </Left>
                  <Body>
                  </Body>
                  <Right>
                    <Button iconLeft transparent primary onPress={ ()=>{ Linking.openURL(this.state.url)}}>
                      <Icon name='globe' />
                      <Text>Open site</Text>
                    </Button>
                  </Right>
                </CardItem>
              </Card>

              <Card>

                <CardItem>
                  <Text>Alexa Rank</Text>
                  <Right>
                    <Badge primary>
                      <Text>{this.state.resultado.alexaRank ?  this.state.resultado.alexaRank : 'N/A' }</Text>
                    </Badge>
                  </Right>
                 </CardItem>


                <CardItem>
                  <Text>Number of Resourses</Text>
                  <Right>
                    <Badge primary>
                      <Text>{this.state.resultado.pageStats.numberResources}</Text>
                    </Badge>
                  </Right>
                 </CardItem>


                <CardItem>
                  <Text>Number of Hosts</Text>
                  <Right>
                    <Badge primary>
                      <Text>{this.state.resultado.pageStats.numberHosts}</Text>
                    </Badge>
                  </Right>
                 </CardItem>


                <CardItem>
                  <Text>Number of JS</Text>
                  <Right>
                    <Badge primary>
                      <Text>{this.state.resultado.pageStats.numberJsResources}</Text>
                    </Badge>
                  </Right>
                 </CardItem>


                <CardItem>
                  <Text>Number of CSS's</Text>
                  <Right>
                    <Badge primary>
                      <Text>{this.state.resultado.pageStats.numberCssResources}</Text>
                    </Badge>
                  </Right>
                 </CardItem>

               </Card>


              <Card>
                <CardItem Header>
                  <Text>{this.state.resultado.AvoidLandingPageRedirects.summary}</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text>
                    </Text>
                  </Body>
                </CardItem>
              </Card>



              <Card>
                <CardItem Header>
                  <Text>{this.state.resultado.EnableGzipCompression.summary}</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text>
                    </Text>
                  </Body>
                </CardItem>
              </Card>



              <Card>
                <CardItem Header>
                  <Text>{this.state.resultado.LeverageBrowserCaching.summary}</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text>
                    </Text>
                  </Body>
                </CardItem>
              </Card>



              <Card>
                <CardItem Header>
                  <Text>{this.state.resultado.MinifyCss.summary}</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text>
                    </Text>
                  </Body>
                </CardItem>
              </Card>


              <Card>
                <CardItem Header>
                  <Text>{this.state.resultado.MinifyHTML.summary}</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text>
                    </Text>
                  </Body>
                </CardItem>
              </Card>


              <Card>
                <CardItem Header>
                  <Text>{this.state.resultado.MinifyJavaScript.summary}</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text>
                    </Text>
                  </Body>
                </CardItem>
              </Card>


              <Card>
                <CardItem Header>
                  <Text>{this.state.resultado.OptimizeImages.summary}</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text>
                    </Text>
                  </Body>
                </CardItem>
              </Card>




              <Card>
                <CardItem Header>
                  <Text>{this.state.resultado.PrioritizeVisibleContent.summary}</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text>
                    </Text>
                  </Body>
                </CardItem>
              </Card>




              
              <Button iconLeft full dark
                onPress={() => this.props.navigation.navigate('Home') }
                style={styles.boton}>
                  <Icon name='md-arrow-back' />
                  <Text>BACK</Text>
              </Button>

            </Content>

          </Container>
        )
      }
  }
}


class SetUpView extends Component {

  static navigationOptions = {
    title: 'Set up',
    header: null
  };

  render(){
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('Home') }>
              <Icon name='md-arrow-back' />
            </Button>              
          </Left>
          <Body>
            <Title>Set up</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Text>
            This is Content Section
          </Text>
        </Content>
      </Container>
    )
  }
}


class WebViewThatOpensLinksInNavigator extends Component {
  render() {
    const uri = 'http://stackoverflow.com/questions/35531679/react-native-open-links-in-browser';
    return (
      <WebView
        ref={(ref) => { this.webview = ref; }}
        source={{ uri }}
        onNavigationStateChange={(event) => {
          if (event.url !== uri) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
    );
  }
}


const PageTools = StackNavigator({
  Home: { screen: HomeScreen },
  Results: { screen: ResultsScreen },
  SetUp: { screen: SetUpView}
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
      paddingLeft: 40,
      paddingRight: 40,
      alignItems: 'center',
      justifyContent: 'center'
    },
    texto: {
      textAlign: 'center',
    },
    inputField: {
        width: 220,
        height: 40,
        marginBottom: 10,
    },
    boton: {
      marginTop: 15
    },
    btnTop: {
      backgroundColor: '#000000',
      color: '#ffffff',
      marginRight: 5
    }
});

export default PageTools;
