import React from 'react';
import { AppRegistry, StyleSheet, StatusBar, Text, View, Button, Image, Dimensions, TouchableOpacity} from 'react-native';
import { StackNavigator } from 'react-navigation';
import firebase from 'firebase';
import logo from './images/logo.png';

const win = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#06988D',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    logoContainer: {
        marginTop: 50,
    },
    logo: {
        alignSelf: 'center',
        flexGrow: 1,
        justifyContent: 'center',
        width: 300,
        height: 300,
        marginBottom: 100,
    },
    buttonContainer: {
        backgroundColor: '#066963',
        paddingVertical: 25,
        paddingHorizontal: 10,
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 10
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15
    },

});

export default class StartUpView extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {navigate, state, setParams} = navigation;
    const {params} = state;

    return {
      header: null,
      gesturesEnabled: true,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentWillMount() {
    const firebaseConfig = {
      apiKey: "AIzaSyCaH5KTQyiFCdK9b49MAMO-IYynWLy0vZA",
      authDomain: "souschef-182502.firebaseapp.com",
      databaseURL: "https://souschef-182502.firebaseio.com",
      storageBucket: "souschef-182502.appspot.com"
    };
    firebase.initializeApp(firebaseConfig);
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <View style={styles.logoContainer}>
            <Image
                style={styles.logo}
                source={logo}/>
        </View>
        <View style={styles.formContainer}>
            <TouchableOpacity style={styles.buttonContainer}
                onPress={() => { navigate('SignUp', {}) }}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer}
                onPress={() => { navigate('Login', {}) }}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
        </View>
      </View>

    );
  }
}
