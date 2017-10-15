import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView} from 'react-native';
import { StackNavigator } from 'react-navigation';
import WeeklyOverviewView from './WeeklyOverviewView.js';
import RecipeDetailsView from './RecipeDetailsView.js';
import ShoppingListView from './ShoppingListView.js';
const win = Dimensions.get('window');

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };


  render() {
    const { navigate } = this.props.navigation;
    return (

      <View style={styles.container}>

        <Button
          onPress={() => navigate('Recipe')}
          title="Recipe Details"
        />
        <Button
          onPress={() => navigate('Overview')}
          title="Weekly Overview"
        />
        <Button
          onPress={() => navigate('List')}
          title="Shopping List"
        />

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

