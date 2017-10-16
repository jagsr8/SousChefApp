import React from 'react';
import { AppRegistry, StyleSheet, StatusBar, Text, View, Button, Image, Dimensions, FlatList, ScrollView, TouchableWithoutFeedback} from 'react-native';
import { StackNavigator } from 'react-navigation';
import WeeklyOverviewView from './WeeklyOverviewView.js';
import RecipeDetailsView from './RecipeDetailsView.js';
import ShoppingListView from './ShoppingListView.js';
import shoppingCart from './images/shopping-cart.png';
const win = Dimensions.get('window');

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {state, setParams} = navigation;
    return {
      title: 'Weekly Overview',
      headerStyle: styles.header,
      headerTintColor: '#06988D',
      headerTitleStyle: styles.headerTitle,
      headerRight: (
        <TouchableWithoutFeedback
          title="Shopping List"
        onPress={() => navigation.navigate('List')}>
          <Image source={shoppingCart} style={styles.headerImage} />
        </TouchableWithoutFeedback>
      ),
    };
  };


  render() {
    const { navigate } = this.props.navigation;
    return (


     <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
      />

      <WeeklyOverviewView navigate={navigate} />

     </View>

//        <Button
//          onPress={() => navigate('Recipe')}
//          title="Recipe Details"
//        />
//        <Button
//          onPress={() => navigate('Overview')}
//          title="Weekly Overview"
//        />
//        <Button
//          onPress={() => navigate('List')}
//          title="Shopping List"
//        />

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
  headerImage: {
    height: 30,
    width: 30,
    opacity: 0.75,
    marginRight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#06988D',
    justifyContent: 'flex-start'
  },
});



export const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen },
  Recipe: { screen: RecipeDetailsView },
  Overview: { screen: WeeklyOverviewView },
  List: { screen: ShoppingListView },
});

