'use strict';

var React = require('react-native');
var SearchResults = require('./SearchResults');

var {
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableHighlight,
	ActivityIndicatorIOS,
	Image,
	Component,
	ScrollView
} = React;

var styles = StyleSheet.create({
	description: {
		marginBottom:20,
		fontSize:18,
		color: '#656565'
	},
	container: {
		padding: 30,
		marginTop:65,
		alignItems: 'center'
	},
	flowRight: {
	  flexDirection: 'row',
	  alignItems: 'center',
	  alignSelf: 'stretch'
	},
	buttonText: {
	  fontSize: 18,
	  color: 'white',
	  alignSelf: 'center'
	},
	button: {
	  height: 36,
	  flex: 1,
	  flexDirection: 'row',
	  backgroundColor: '#48BBEC',
	  borderColor: '#48BBEC',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  justifyContent: 'center'
	},
	searchInput: {
	  height: 36,
	  padding: 4,
	  marginRight: 5,
	  flex: 5,
	  fontSize: 18,
	  borderWidth: 1,
	  borderColor: '#48BBEC',
	  borderRadius: 8,
	  color: '#48BBEC'
	},
	image: {
  	width: 217,
 	height: 138,
 	justifyContent: 'center',
 	alignItems: 'center',
	},
	centered: {
		justifyContent: 'center',
 		alignItems: 'center',
 		flex:1
	}
});

function urlForQueryAndPage(key, value, pageNumber){
	var data = {
		country: 'uk',
		pretty: '1',
		encoding: 'json',
		listing_type: 'buy',
		action: 'search_listings',
		page:pageNumber
	};
	data[key] = value;
	var queryString = Object.keys(data)
		.map(key => key + '=' + encodeURIComponent(data[key]))
		.join('&');

	
	return 'http://api.nestoria.co.uk/api?' + queryString;
}

class SearchPage extends Component {

	_handleResponse(response){
		this.setState({isLoading: false, message: ''})
		if(response.application_response_code.substr(0,1) === '1') {
			this.props.navigator.push({
				title: 'Results',
				component: SearchResults,
				passProps: {listings: response.listings}
			})
		} else {
			this.setState({message: 'Location not recognized. Please try again.'})
		}
	}

	_executeQuery(query){
		console.log(query);
		this.setState({isLoading:true});
		fetch(query)
			.then(response => response.json())
			.then(json => this._handleResponse(json.response))
			.catch(error =>
				this.setState({
					isLoading: false,
					message: 'Something bad happened' + error
				}))
	}

	onSearchPressed() {
		var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
		console.log(query);
		this._executeQuery(query);
	}

	constructor(props) {
	  super(props);
	  this.state = {
	    searchString: 'london',
	    isLoading: false,
	    message: ''
	  };
	}

	onSearchTextChanged(event) {
	  console.log('onSearchTextChanged');
	  this.setState({ searchString: event.nativeEvent.text });
	  console.log(this.state.searchString);
	} 

	onLocationPressed(){
		navigator.geolocation.getCurrentPosition(
				location => {
					var searchLocation = location.coords.latitutde + ',' + location.coords.longitude;
					this.setState({searchString: searchLocation});
					var query = urlForQueryAndPage('centre_point', search, 1);
					this._executeQuery;
				}, error => {
					this.setState({
						message: 'There was a problem with obtaining your location ' + error
					});
				});
	}

	render(){ 

		var spinner = this.state.isLoading?
		(<ActivityIndicatorIOS hidden='true' size='large' />) : (<View />);

		console.log('SearchPage.render');
		return(
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.description}>Search for houses to buy!</Text>
				<Text style={styles.description}>Search by place-name, postcode, or search near your location. </Text>
				<View style={styles.flowRight}>
					<TextInput style={styles.searchInput} 
					placeholder='Search view name or postcode'
					value={this.state.searchString}
					onChange={this.onSearchTextChanged.bind(this)}/>
					<TouchableHighlight 
					onPress={this.onSearchPressed.bind(this)}
					style={styles.button}
					      underlayColor='#99d9f4'>
					    <Text style={styles.buttonText}>Go</Text>
					  </TouchableHighlight>
				</View>
				<TouchableHighlight 
				onPress={this.onLocationPressed.bind(this)}
				style={styles.button} underlayColor='#99d9f4'>
					<Text style={styles.buttonText}>Location</Text>
				</TouchableHighlight>
				<View style={styles.flowRight}>
					<View style={styles.centered}>
						<Image source={require('image!house')} style={styles.image} />
						{spinner}
					</View>
				</View>

				<Text style={styles.description}>{this.state.message}</Text>
			</ScrollView>
			
		)
	}
}

module.exports = SearchPage;





