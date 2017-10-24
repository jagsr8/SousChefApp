import React from 'react';
import { AppRegistry, ActivityIndicator, StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView, StatusBar} from 'react-native';
import { StackNavigator } from 'react-navigation';
import firebase from 'firebase';
const win = Dimensions.get('window');

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
    top: 100,
    left: 20,
    paddingRight: 20,
  },
  activity: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 40,
    backgroundColor: '#07988D',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 25,
    textAlign: 'left',
    marginLeft: 30,
    marginTop: 30,
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
  }
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
  if (!navigate.state.params.isRecipeChange) {
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

class RecipeDetailsView extends React.Component {
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
        <ScrollView>
        <View style={styles.imageContainer}>
          <Image
          style={styles.image}
          resizeMode={'cover'}   /* <= changed  */
          source={{uri: this.state.dataSource.image}}
          />
        </View>

        <Text
        style= {styles.text}>
        {this.state.dataSource.title}
        </Text>
        <View style={styles.horizontalView}>
          <Text style = {styles.textOnHorizontalView}>
          {
            this.state.dataSource.readyInMinutes
          } min
          </Text>
          <Text style = {styles.textOnHorizontalView}>

          </Text>
          <Text style = {styles.textOnHorizontalView}>

          </Text>
          <Text style = {styles.textOnHorizontalView}>
            {this.state.dataSource.diet}
          </Text>
        </View>

        <Text style = {styles.headerText}>
            Ingredients
        </Text>
        <FlatList style={styles.ingridentsContainer}
          data={this.state.dataSource.ingredients}

          renderItem={
            ({item}) =>
              <View style={styles.ingridentsList}>
                <Text style = {styles.textOnHorizontalView}>{item.name}</Text>
                <Text style = {styles.textOnHorizontalView}>{item.value}</Text>
              </View>
          }
        />

        <Text style = {styles.headerText}>
            Directions
        </Text>
        <FlatList style={styles.directionsContainer}
          data={this.state.dataSource.directions}

          renderItem={
            ({item}) =>
              <View style={styles.ingridentsList}>
                <Text style = {styles.textOnHorizontalView}>{item.key}</Text>
              </View>
          }
        />
        </ScrollView>

        <View style={styles.changeRecipeButton}>

        <Button
          onPress={() => changeRecipeClicked(this.props.navigation)

            }
          title={this.props.navigation.state.params.isRecipeChange ? "Select Recipe" : "Change Recipe"}
          color="#FFFFFF"


        />
        </View>

        <View style={styles.startCookingButton}>
          <Button
            onPress={() => this.props.navigation.navigate("Overview", {})}
            title="Start Cooking"
            color="#86A791"
          />
        </View>

      </View>

    );
  }
}

export default RecipeDetailsView;
