import React from 'react';
import { AppRegistry, StyleSheet, StatusBar, Text, View, Button, Image, Dimensions, FlatList, ScrollView, TouchableWithoutFeedback} from 'react-native';
import { StackNavigator } from 'react-navigation';
import WeeklyOverviewView from './WeeklyOverviewView.js';
import RecipeDetailsView from './RecipeDetailsView.js';
import ShoppingListView from './ShoppingListView.js';
import StartUpView from './StartUpView.js';
import LoginView from './LoginView.js';
import SignUpView from './SignUpView.js';
import shoppingCart from './images/shopping-cart.png';
import logo from './images/chevron-right.png';
import * as firebase from 'firebase';


const win = Dimensions.get('window');

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {state, setParams} = navigation;
    return {
      title: 'Home',
      headerStyle: styles.header,
      headerTintColor: '#06988D',
    };
  };

  componentWillMount() {
    const { navigate } = this.props.navigation;
    navigate('StartUpView', {});
    // setTimeout(() => navigate('Overview', {}), 5000);
    const firebaseConfig = {
      apiKey: "AIzaSyCaH5KTQyiFCdK9b49MAMO-IYynWLy0vZA",
      authDomain: "souschef-182502.firebaseapp.com",
      databaseURL: "https://souschef-182502.firebaseio.com",
      storageBucket: "souschef-182502.appspot.com"
    };
    firebase.initializeApp(firebaseConfig);
  }

  render() {
    return (
     <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
      />
      <Image source={logo} resizeMode="contain" style={styles.loadingImage} />
     </View>
    );
  }
}

export default class App extends React.Component {
  render() {
    return <SimpleApp />;
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#06988D',
    borderBottomWidth: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#06988D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingImage: {
    flex: 1,
    width: 0.8 * win.width,
    height: 0.8 * win.height,
    opacity: 0,
  },
});



export const SimpleApp = StackNavigator({
  Home: { screen: StartUpView },
  SignUp: { screen: SignUpView },
  Login: { screen: LoginView },
  Recipe: { screen: RecipeDetailsView },
  Overview: { screen: WeeklyOverviewView },
  List: { screen: ShoppingListView },
}, {
  headerMode: 'screen',
  navigationOptions: {
    gesturesEnabled: false,
  },
});
