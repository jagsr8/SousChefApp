import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, Button } from 'react-native';
import DailyOverviewCard from './DailyOverviewCard.js';

export default class WeeklyOverviewView extends View {
  
  render() {
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
                <DailyOverviewCard day={item.key} navigate={this.props.navigate} />
            }
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  'WeeklyOverview': {
    flex: 1,
    width: '100%',
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