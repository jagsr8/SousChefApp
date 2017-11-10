import React from 'react';
import { StyleSheet, Dimensions, Text, ActivityIndicator, View, ScrollView, FlatList, Button, Image, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';
import firebase from 'firebase';
import DailyOverviewCard from './DailyOverviewCard.js';
import profileIcon from './images/profile.png';
import shoppingCart from './images/shopping-cart.png';

export default class WeeklyOverviewView extends View {
  static navigationOptions = ({ navigation }) => {
    const {navigate, goBack, state, setParams} = navigation;
    const {params} = state;
    let leftHeader = null;
    let rightHeader = null;

    if(params.mode === 'select') {
      leftHeader = (
        <View style={styles.headerActions}>
          <TouchableWithoutFeedback onPress={() => goBack()}>
            <View><Text style={styles.headerText}>Cancel</Text></View>
          </TouchableWithoutFeedback>
        </View>
      )
      rightHeader = (
        <View style={styles.headerActions}>
          <TouchableWithoutFeedback onPress={() => params.onSubmit(params.onBack)}>
            <View><Text style={[styles.headerText,styles.headerTextBold]}>Done</Text></View>
          </TouchableWithoutFeedback>
        </View>
      )
    } else {
      rightHeader = (
        <View style={styles.headerActions}>
          <TouchableWithoutFeedback onPress={() => navigate('Profile', {onBack: params.onBackFunc})}>
            <Image source={profileIcon} style={styles.headerImage} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigate('List', {})}>
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
      gesturesEnabled: params.mode === 'select',
    };
  };

  constructor(props) {
    super(props);

    const {params} = this.props.navigation.state;

    this.state = {
      weeklyPlan: [],
      isSelecting: params.mode && params.mode === 'select',
      loading: true,
      selectedRecipes: [],
    };

  }

  componentDidMount() {
    this.updateWeeklyPlan();
    this.props.navigation.setParams({
      onSubmit: this.submitSelection.bind(this),
      onBackFunc: this.updateWeeklyPlan.bind(this),
    });
  }

  updateWeeklyPlan() {
    this.getWeeklyPlanFromApiAsync()
      .then((plan) => {
        plan.map((item, index) => item.key = index);
        this.setState({
          weeklyPlan: plan,
          loading: false
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getWeeklyPlanFromApiAsync() {
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
    let selections = this.state.selectedRecipes;
    selections[index] = selections[index] === recipeId ? -1 : recipeId;
    this.setState({
      selectedRecipes: selections,
    });
  }

  submitSelection(onBack) {
    let selections = this.state.selectedRecipes.filter((recipeId) => recipeId && recipeId >= 0).join();
    fetch(`http://souschef-182502.appspot.com/api/v1/users/shopping_list_create?user_id=${firebase.auth().currentUser.uid}&recipe_ids=${selections}`)
      .then(() => {
        onBack();
        this.props.navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  generateNewRecipe() {
    this.setState({
      loading: true,
    });
    fetch(`https://souschef-182502.appspot.com/api/v1/users/weekly_plan_create?user_id=${firebase.auth().currentUser.uid}`)
      .then(this.updateWeeklyPlan.bind(this));
  }

  render() {
    return (
      <View style={styles['WeeklyOverview']}>
        <Text style={styles['WeeklyOverview__title']}>{this.state.isSelecting ? 'Select Recipes' : 'Recipes This Week'}</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
          {this.state.loading ? (
            <View style={styles.activity}>
              <ActivityIndicator color='#FFFFFF' size='large' />
            </View>
          ) : (
            <FlatList
              data={this.state.weeklyPlan}
              extraData={this.state}
              style={styles.daysList}
              renderItem={
                ({item, index}) =>
                  <DailyOverviewCard key={index}
                                     day={index}
                                 recipes={item}
                              navigation={this.props.navigation}
                             isSelecting={this.state.isSelecting}
                                onSelect={this.selectRecipe.bind(this)}
                              selections={this.state.selectedRecipes.slice(index*3, index*3+3)} />
              }
            />
          )}
        </ScrollView>
        {!this.state.isSelecting && (
          <TouchableHighlight style={styles.actionButton} onPress={this.generateNewRecipe.bind(this)} underlayColor="rgba(0,0,0,0.3)">
            <View style={styles.generatePlanButton}>
              <Text style={styles.generatePlanButtonText}>Generate New Weekly Plan</Text>
            </View>
          </TouchableHighlight>
        )}
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
    marginHorizontal: 20,
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
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#06988D',
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
  daysList: {
    paddingBottom: 30,
  },
  scrollMask: {
    flex: 1,
    position: 'absolute',
    bottom: 90,
    width: Dimensions.get('window').width - 40,
    height: 30,
    marginHorizontal: 20,
  },
  activity: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    width: Dimensions.get('window').width - 40,
    height: 50,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: -20,
  },
  generatePlanButton: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generatePlanButtonText: {
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
  },
});
