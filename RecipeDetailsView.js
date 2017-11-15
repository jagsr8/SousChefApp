import React from 'react';
import { AppRegistry, ActivityIndicator, StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView, StatusBar, TouchableHighlight, Alert} from 'react-native';
import { StackNavigator } from 'react-navigation';
import firebase from 'firebase';
var watch = require('react-native-watch-connectivity')

function getDiet(responseJson) {
  diet = {
    'Vegan': responseJson.vegan,
    'Vegetarian': responseJson.vegetarian,
    'Keto': responseJson.ketogenic,
    'Gluten Free': responseJson.glutenFree,
    'Low Fodmap': responseJson.lowFodmap,
  }
  return Object.entries(diet).filter((item) => item[1]).map((item) => item[0]).join(', ');
}

function sendUsername(text) {
    if (text != null && text.trim().length) {
      const timestamp = new Date().getTime()
      watch.sendMessage({text, timestamp}, (err, resp) => {
        if (!err) {
          console.log('response received', resp)
        }
        else {
          console.log('error sending message to watch')
        }
      })
    }
}  

function getIngredients(responseJson) {
  try {
    extendedIngredients = responseJson.extendedIngredients;
    ingredientsJSON = []
    for (i = 0; i < extendedIngredients.length; i++) {
      ingredientsJSON.push({
        key: i,
        name: extendedIngredients[i].name,
        value: extendedIngredients[i].amount + " " + extendedIngredients[i].unitShort
      })
    }
    return ingredientsJSON;
  } catch (e) {
    return [];
  }
}

function getDirections(responseJson) {
  try {
    analyzedInstructions = responseJson.analyzedInstructions[0].steps;
    instructionsJSON = [];
    for (i = 0; i < analyzedInstructions.length; i++) {
      instructionsJSON.push({
        key: analyzedInstructions[i].number + ". " + analyzedInstructions[i].step,
      })
    }
    return instructionsJSON;
  } catch (e) {
    return [];
  }
}

function changeRecipeClicked(navigate) {
  if(!navigate.state.params.isRecipeChange) {
    navigate.navigate("ChangeRecipe", {
      recipeId: navigate.state.params.recipeId,
      day: navigate.state.params.day,
      meal: navigate.state.params.meal,
    });
  } else {
    changeRecipe(navigate);
  }
}

async function changeRecipe(navigate) {
  return fetch(`https://souschef-182502.appspot.com/api/v1/users/update_meal?user_id=${firebase.auth().currentUser.uid}&day=${navigate.state.params.day}&meal=${navigate.state.params.meal}&recipe_id=${navigate.state.params.recipeId}`)
    .then((responseJson) => {
      navigate.navigate("Overview", {});
    })
    .catch((error) => {
      console.error(error);
    });
}

async function startCookingClicked(navigate) {
  return fetch(`https://souschef-182502.appspot.com/api/v1/users/save_current_recipe_progress?user_id=${firebase.auth().currentUser.uid}&step=1&recipe_id=${navigate.state.params.recipeId}`)
    .then((responseJson) => {
      Alert.alert(
        'Successfully Saved Current Recipe',
        'Please open Apple Watch app or open Alexa Skill: "MySousChef" to start cooking!',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
    })
    .catch((error) => {
      console.error(error);
    });
}

export default class RecipeDetailsView extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {navigate, state, setParams} = navigation;
    const {params} = state;

    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
    sendUsername(firebase.auth().currentUser.uid);
  }

  componentDidMount() {
    return fetch(`https://souschef-182502.appspot.com/api/v1/recipes/recipe_details?recipe_id=${this.props.navigation.state.params.recipeId}`)
      .then((response) => response.json())
      .then((responseJson) => {
        //let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        responseJson["diet"] = getDiet(responseJson);
        responseJson["ingredients"] = getIngredients(responseJson);
        responseJson["directions"] = getDirections(responseJson);
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
    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator color='#FFFFFF' size='large' />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode={'cover'}
              source={{uri: this.state.dataSource.image}}
            />
            <View style={styles.imageMask}>
              <Text style={styles.title}>{this.state.dataSource.title}</Text>
            </View>
          </View>

          <View style={styles.detailBar}>
            <Text style = {styles.detailBarText}>{`${this.state.dataSource.readyInMinutes} min`}</Text>
            <Text style = {styles.detailBarText}></Text>
            <Text style = {styles.detailBarText}></Text>
            <Text style = {styles.detailBarText}>{this.state.dataSource.diet}</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeaderText}>Ingredients</Text>
            <FlatList style={styles.ingredientsList}
                       data={this.state.dataSource.ingredients}
                 renderItem={({item}) => (
                              <View style={styles.ingredient}>
                                <Text style = {styles.ingredientName}>{`${item.name.charAt(0).toUpperCase()}${item.name.slice(1)}`}</Text>
                                <Text style = {styles.ingredientAmount}>{item.value}</Text>
                              </View>
                            )}
            />
          </View>

          <View style={[styles.sectionCard,styles.directionsCard]}>
            <Text style={styles.sectionHeaderText}>Directions</Text>
            <FlatList style={styles.directionsList}
                       data={this.state.dataSource.directions}
                 renderItem={({item, index}) => (
                              <View style={styles.direction}>
                                <Text style={styles.directionNum}>{index+1}</Text>
                                <Text style={styles.directionText}>{item.key.split('. ').slice(1).join('. ')}</Text>
                              </View>
                            )}
            />
          </View>
        </ScrollView>


        <TouchableHighlight style={styles.actionButton} onPress={() => changeRecipeClicked(this.props.navigation)} underlayColor="rgba(0,0,0,0.3)">
          <View style={styles.changeRecipeButton}>
            <Text style={styles.changeRecipeButtonText}>{this.props.navigation.state.params.isRecipeChange ? "Select Recipe" : "Change Recipe"}</Text>
          </View>
        </TouchableHighlight>

        {<TouchableHighlight style={styles.actionButton} onPress={() => startCookingClicked(this.props.navigation)} underlayColor="rgba(0,0,0,0.3)">
          <View style={styles.startCookingButton}>
            <Text style={styles.startCookingButtonText}>Start Cooking on Alexa or Watch</Text>
          </View>
        </TouchableHighlight>}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06988D',
    justifyContent: 'flex-start',
    paddingBottom: 12.5,
  },
  activity: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 40,
    backgroundColor: '#06988D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginBottom: 12.5,
  },
  imageContainer: {
    backgroundColor: 'rgb(0,0,0)'
  },
  image: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 220,
  },
  imageMask: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: Dimensions.get('window').width,
    height: 220,
    marginTop: -220,
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.5,
  },
  detailBar: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  detailBarText: {
    fontSize: 17,
    color: 'white',
    marginHorizontal: 10,
  },
  sectionCard: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
  },
  sectionHeaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 20,
  },
  ingredientsList: {
    flex: 1,
  },
  ingredient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  ingredientName: {
    fontSize: 16,
    color: 'white',
  },
  ingredientAmount: {
    fontSize: 16,
    color: 'white',
  },
  directionsCard: {
    marginBottom: 30,
  },
  directionsList: {
    flex: 1,
  },
  direction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  directionNum: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'left',
    width: 30,
    marginRight: 5,
    fontWeight: 'bold',
  },
  directionText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
  },
  scrollMask: {
    flex: 1,
    position: 'absolute',
    bottom: 90,
    width: Dimensions.get('window').width - 40,
    height: 30,
    marginHorizontal: 20,
  },
  actionButton: {
    height: 50,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 7.5,
  },
  changeRecipeButton: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeRecipeButtonText: {
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
  },
  startCookingButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startCookingButtonText: {
    color: '#056A63',
    fontSize: 17,
    textAlign: 'center',
  },
});
