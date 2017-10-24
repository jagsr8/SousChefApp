import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, Button, Image, TouchableWithoutFeedback } from 'react-native';
import firebase from 'firebase';
import DailyOverviewCard from './DailyOverviewCard.js';
import profileIcon from './images/profile.png';
import shoppingCart from './images/shopping-cart.png';

export default class WeeklyOverviewView extends View {
  static navigationOptions = ({ navigation }) => {
    const {navigate, state, setParams} = navigation;
    const {params} = state;
    let leftHeader = null;
    let rightHeader = null;

    if(params.mode === 'select') {
      leftHeader = (
        <View style={styles.headerActions}>
          <TouchableWithoutFeedback onPress={() => navigate('List', {})}>
            <View><Text style={styles.headerText}>Cancel</Text></View>
          </TouchableWithoutFeedback>
        </View>
      )
      rightHeader = (
        <View style={styles.headerActions}>
          <TouchableWithoutFeedback onPress={() => navigate('List', {})}>
            <View><Text style={[styles.headerText,styles.headerTextBold]}>Done</Text></View>
          </TouchableWithoutFeedback>
        </View>
      )
    } else {
      rightHeader = (
        <View style={styles.headerActions}>
          <TouchableWithoutFeedback onPress={() => navigate('Profile', {})}>
            <Image source={profileIcon} style={styles.headerImage} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigate('Overview', {mode: 'select'})}>
            <Image source={shoppingCart} style={styles.headerImage} />
          </TouchableWithoutFeedback>
        </View>
      )
    }

    return {
      title: 'Weekly Overview',
      headerStyle: styles.header,
      headerTintColor: '#06988D',
      headerTitleStyle: styles.headerTitle,
      headerLeft: leftHeader,
      headerRight: rightHeader,
    };
  };

  constructor(props) {
    super(props);

    const {params} = this.props.navigation.state;

    this.selectedRecipes = [];

    this.state = {
      weeklyPlan: [],
      isSelecting: params.mode && params.mode === 'select',
    };

  }

  componentDidMount() {
    this.getWeeklyPlanFromApiAsync()
      .then((plan) => {
        plan.map((item, index) => item.key = index);
        this.setState({
          weeklyPlan: plan
        });
      })
      .catch((error) => {
        console.error(error);
      });
    this.props.navigation.setParams({ onSelectMode: this.setState.bind(this) });
  }

  getWeeklyPlanFromApiAsync() {
    console.log(firebase.auth().currentUser.uid);
    return fetch(`http://souschef-182502.appspot.com/api/v1/users/weekly_plan?user_id=${firebase.auth().currentUser.uid}`)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  selectRecipe(index, recipeId) {
    this.selectedRecipes[index] = this.selectedRecipes[index] === recipeId ? null : recipeId;
    console.log(this.selectedRecipes);
  }
  
  render() {
    return (
      <View style={styles['WeeklyOverview']}>
        <Text style={styles['WeeklyOverview__title']}>Recipes This Week</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            data={this.state.weeklyPlan}
            renderItem={
              ({item, index}) => 
                <DailyOverviewCard key={index}
                                   day={index}
                               recipes={item}
                            navigation={this.props.navigation}
                           isSelecting={this.state.isSelecting}
                              onSelect={this.selectRecipe.bind(this)} />
            }
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#06988D',
    borderBottomWidth: 0,
  },
  headerActions: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  headerImage: {
    height: 30,
    width: 30,
    opacity: 0.75,
    marginLeft: 15,
  },
  headerText: {
    color: '#FFF',
    fontSize: 17,
    paddingTop: 8,
  },
  headerTextBold: {
    fontWeight: 'bold',
  },
  'WeeklyOverview': {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 40,
    backgroundColor: '#07988D',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  'WeeklyOverview__title': {
    color: '#FFF',
    fontSize: 34,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 20,
  },
});
