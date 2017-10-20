import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, Button, Image, TouchableWithoutFeedback } from 'react-native';
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
          <TouchableWithoutFeedback onPress={() => setParams({ mode: '' })}>
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
          <TouchableWithoutFeedback
            onPress={() => {}}>
            <Image source={profileIcon} style={styles.headerImage} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => setParams({ mode: params.mode === 'select' ? '' : 'select' })}>
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
  
  render() {
    const { navigate } = this.props.navigation;
    let days = [{
      key: 'Monday\n10/16'
    },
    {
      key: 'Tuesday\n10/17'
    },
    {
      key: 'Wednesday\n10/18'
    },
    {
      key: 'Thursday\n10/19'
    },
    {
      key: 'Friday\n10/20'
    }];

    return (
      <View style={styles['WeeklyOverview']}>
        <Text style={styles['WeeklyOverview__title']}>Recipes This Week</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            data={days}
            renderItem={
              ({item}) => 
                <DailyOverviewCard day={item.key} navigate={navigate} />
            }
          />
        </ScrollView>
      </View>
    );
  }

  selectRecipes() {
    navigationOptions.headerRight = (
      <Button title="Done" style={styles.headerRight} onPress={() => this.props.navigation.navigate('List', {})} />
    )
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