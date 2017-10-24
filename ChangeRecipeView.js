import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView, StatusBar, TouchableHighlight} from 'react-native';
import { StackNavigator } from 'react-navigation';
const win = Dimensions.get('window');
import firebase from 'firebase';
import chevronRight from './images/chevron-right.png';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06988D',
    justifyContent: 'flex-start'
  },
  image: {
    flex: 0,
    alignSelf: 'stretch',
    width: win.width,
    height: 200,
    opacity: 0.6,
  },
  imageContainer: {
      backgroundColor: 'rgba(0,0,0,1)'
  },
  text: {
    fontSize: 25,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
    position: "absolute",
    top: 130,
    left: 20,
  },
  horizontalView: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between',
    paddingTop: 10
  },

  ingridentsList: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,.2)',
  },
  ingridentsContainer: {
    borderRadius: 10,
    backgroundColor: '#048277',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30,
  },
  directionsContainer: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
  },
  headerText: {
    fontSize: 20,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 50,
    marginBottom: 20, 
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
  },
  textOnHorizontalView: {
    fontSize: 20,
    color: 'white',
    paddingLeft: 10,
    paddingRight: 10

  },
  changeRecipeButton: {
    backgroundColor: '#066963',
    borderRadius: 30,
    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 5,
    marginBottom: 5,
  },
  startCookingButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 5,
    marginBottom: 5,
  }, 
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
    width: Dimensions.get('window').width,
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
    width: Dimensions.get('window').width - 100,
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

 function getDiet(responseJson) {
    diet = ""
    if (responseJson.vegan) {
      diet += "Vegan ";
    }
    if (responseJson.vegetarian) {
      diet += "Vegetarian ";
    }
    if (responseJson.ketogenic) {
      diet += "Keto ";
    }
    if (responseJson.glutenFree) {
      diet += "Gluten Free ";
    }
    if (responseJson.lowFodmap) {
      diet += "Low Fodmap ";
    }
    return diet;
}

 function getIngredients(responseJson) {
    extendedIngredients = responseJson.extendedIngredients;
    ingredientsJSON = []
    for (i = 0; i < extendedIngredients.length; i++) { 
      ingredientsJSON.push({
        key: extendedIngredients[i].name,
        value: extendedIngredients[i].amount + " " + extendedIngredients[i].unitShort
      })
    }
    return ingredientsJSON;
  }

 function getDirections(responseJson) {
    analyzedInstructions = responseJson.analyzedInstructions[0].steps;
    console.log(analyzedInstructions);
    instructionsJSON = []
    for (i = 0; i < analyzedInstructions.length; i++) { 
      instructionsJSON.push({
        key: analyzedInstructions[i].number + ". " + analyzedInstructions[i].step,
      })
    }
    console.log(instructionsJSON);
    return instructionsJSON;
  }




class ChangeRecipeView extends React.Component {
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
    console.log(this.props);
  }

  

  componentDidMount() {
    return fetch(`https://souschef-182502.appspot.com/api/v1/recipes/recipe_changes?user_id=1&offset=0&meal_type=${this.props.navigation.state.params.meal.toLowerCase()}`)
      .then((response) => response.json())
      .then((responseJson) => {
        //let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        for (i = 0; i < responseJson.results.length; i++) { 
          responseJson.results[i]["key"] = i;
        }
        console.log(responseJson);

        this.setState({
          isLoading: false,
          dataSource: (responseJson),
        }, function() {
          // do something with new state
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const navigate = this.props.navigate;
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
        <Text>
          Loading...
        </Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
            <Text
        style= {styles.headerText}>
        Select a New Recipe for {this.props.navigation.state.params.meal}
        </Text>
          <FlatList
            data={this.state.dataSource.results}
            renderItem={
              ({item, index}) => 
                 <TouchableHighlight style={styles['DailyOverviewCard__recipeButton']}
                        underlayColor="rgba(0,0,0,0.08)"
                              onPress={() => {
                                this.props.navigation.navigate('Recipe', {
                                  recipeId: item.id,
                                  day: this.props.navigation.state.params.day,
                                  meal: this.props.navigation.state.params.meal,
                                  isRecipeChange: true,
                                })
                              }}>
              <View style={styles['DailyOverviewCard__recipe']}>
                <Image source={{uri: 'https://spoonacular.com/recipeImages/' + item.image}} resizeMode="cover" style={styles['DailyOverviewCard__recipeImage']} />
                <View style={styles['DailyOverviewCard__recipeText']}>
                  <Text style={styles['DailyOverviewCard__recipeMeal']}>
                    {item.readyInMinutes} min
                  </Text>
                  <Text numberOfLines={1} style={styles['DailyOverviewCard__recipeName']}>
                    {item.title}
                  </Text>
                </View>
                <Image source={chevronRight} style={styles['DailyOverviewCard__rightChevron']} />
              </View>
            </TouchableHighlight>
            }
          />
        </ScrollView>
          
      </View>

    );
  }
}

export default ChangeRecipeView;
