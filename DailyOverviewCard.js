import React from 'react';
import { StyleSheet, Dimensions, Text, View, ScrollView, FlatList, Image, TouchableHighlight } from 'react-native';
import placeholderImg from './images/placeholder.png';
import chevronRight from './images/chevron-right.png';
import omelette from './images/omelette.png';
import chickenParm from './images/chicken-parmigiana.png';
import cod from './images/cod.png';

export default class DailyOverviewCard extends View {


  render() {
    const navigate = this.props.navigate;
    const breakfast = this.props.recipes.Breakfast;
    const lunch = this.props.recipes.Lunch;
    const dinner = this.props.recipes.Dinner;

    return (
      <View style={styles['DailyOverviewCard']}>
        <Text style={styles['DailyOverviewCard__dayTitle']}>
          Day {this.props.day + 1}
        </Text>
        <View style={styles['DailyOverviewCard__recipeList']}>

          <TouchableHighlight style={styles['DailyOverviewCard__recipeButton']}
                      underlayColor="rgba(0,0,0,0.08)"
                            onPress={() => {
                              navigate('Recipe', {
                                recipeId: breakfast.ID,
                                day: this.props.day,
                                meal: 'Breakfast',
                              })
                            }}>
            <View style={styles['DailyOverviewCard__recipe']}>
              <Image source={{uri: breakfast.Image}} resizeMode="cover" style={styles['DailyOverviewCard__recipeImage']} />
              <View style={styles['DailyOverviewCard__recipeText']}>
                <Text style={styles['DailyOverviewCard__recipeMeal']}>
                  Breakfast
                </Text>
                <Text numberOfLines={1} style={styles['DailyOverviewCard__recipeName']}>
                  {breakfast.Name}
                </Text>
              </View>
              <Image source={chevronRight} style={styles['DailyOverviewCard__rightChevron']} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles['DailyOverviewCard__recipeButton']}
                      underlayColor="rgba(0,0,0,0.08)"
                            onPress={() => {
                              navigate('Recipe', {
                                recipeId: lunch.ID,
                                day: this.props.day,
                                meal: 'Lunch',
                              })
                            }}>
            <View style={styles['DailyOverviewCard__recipe']}>
              <Image source={{uri: lunch.Image}} resizeMode="cover" style={styles['DailyOverviewCard__recipeImage']} />
              <View style={styles['DailyOverviewCard__recipeText']}>
                <Text style={styles['DailyOverviewCard__recipeMeal']}>
                  Lunch
                </Text>
                <Text numberOfLines={1} style={styles['DailyOverviewCard__recipeName']}>
                  {lunch.Name}
                </Text>
              </View>
              <Image source={chevronRight} style={styles['DailyOverviewCard__rightChevron']} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles['DailyOverviewCard__recipeButton']}
                      underlayColor="rgba(0,0,0,0.08)"
                            onPress={() => {
                              navigate('Recipe', {
                                recipeId: dinner.ID,
                                day: this.props.day,
                                meal: 'Dinner',
                              })
                            }}>
            <View style={[styles['DailyOverviewCard__recipe'],styles['DailyOverviewCard__recipe--bottom']]}>
              <Image source={{uri: dinner.Image}} resizeMode="cover" style={styles['DailyOverviewCard__recipeImage']} />
              <View style={styles['DailyOverviewCard__recipeText']}>
                <Text style={styles['DailyOverviewCard__recipeMeal']}>
                  Dinner
                </Text>
                <Text numberOfLines={1} style={styles['DailyOverviewCard__recipeName']}>
                  {dinner.Name}
                </Text>
              </View>
              <Image source={chevronRight} style={styles['DailyOverviewCard__rightChevron']} />
            </View>
          </TouchableHighlight>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  'DailyOverviewCard': {
    flex: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width - 40,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  'DailyOverviewCard__dayTitle': {
    color: '#FFF',
    width: 100,
    fontSize: 17,
    alignItems: 'center',
    textAlign: 'center',
  },
  'DailyOverviewCard__recipeList': {
    flex: 1,
    width: '60%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  'DailyOverviewCard__recipeButton': {
    flex: 1,
    width: Dimensions.get('window').width - 140,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  'DailyOverviewCard__recipe': {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  'DailyOverviewCard__recipe--bottom': {
    borderBottomWidth: 0,
  },
  'DailyOverviewCard__recipeImage': {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  'DailyOverviewCard__recipeText': {
    width: Dimensions.get('window').width - 215,
    paddingLeft: 10,
    paddingRight: 10,
  },
  'DailyOverviewCard__recipeMeal': {
    color: '#FFF',
    textAlign: 'left',
    fontSize: 13,
    marginBottom: 2,
  },
  'DailyOverviewCard__recipeName': {
    color: '#FFF',
    textAlign: 'left',
    fontSize: 16,
  },
  'DailyOverviewCard__rightChevron': {
    height: 30,
    width: 15,
    paddingRight: 5,
    opacity: 0.5,

  },
});
