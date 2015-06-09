/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var SearchPage = require('./app/SearchPage');

var {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    ActivityIndicatorIOS,
    NavigatorIOS
    } = React

var styles = React.StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize:30,
    margin:80,
    textAlign: 'center'
  },
  container: {
    flex:1,
    justifyContent: 'center'
  }
});

class PropertyFinder extends React.Component{
  render(){
    return(
        <NavigatorIOS 
          style={styles.container} 
          initialRoute = {{
            title: 'Property Finder',
            component: SearchPage
          }}/>
      )
  }
}

React.AppRegistry.registerComponent('PropertyFinder', () => PropertyFinder)

