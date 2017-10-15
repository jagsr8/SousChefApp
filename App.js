import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView} from 'react-native';
import { StackNavigator } from 'react-navigation';
import RecipeDetailsView from './RecipeDetailsView.js';
const win = Dimensions.get('window');

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };


  render() {
    const { navigate } = this.props.navigation;
    const data = [1, 2, 3, 4, 5];
    // const sampledata = fetch('https://souschef-182502.appspot.com/api/v1/weekly_plan?user_id=48')
    // console.log(sampledata)
    return (

      <View style={styles.container}>

        <Button
          onPress={() => navigate('Chat')}
          title="Recipe Details"
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
  Chat: { screen: RecipeDetailsView },
});

