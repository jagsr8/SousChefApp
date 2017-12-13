import React from 'react';
import { AppRegistry, ActivityIndicator, StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView, StatusBar, TouchableHighlight, TouchableWithoutFeedback, Alert} from 'react-native';
import { StackNavigator } from 'react-navigation';
import firebase from 'firebase';
import starIcon from './images/star.png';
import starFilledIcon from './images/star-filled.png';
var watch = require('react-native-watch-connectivity')

function getNutrients(responseJson) {

  try {
    nutrients = responseJson.nutrition.nutrients;
    nutrientsJSON = []
    for (i = 0; i < nutrients.length; i++) {
      nutrientsJSON.push({
        key: i,
        name: nutrients[i].title,
        value: nutrients[i].amount + " " + nutrients[i].unit,
        percent: nutrients[i].percentOfDailyNeeds + "%"
      })
    }
    return nutrientsJSON;
  } catch (e) {
    return [];
  }
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
    const currentRecipeId = this.props.navigation.state.params.recipeId;

    return fetch(`https://souschef-182502.appspot.com/api/v1/recipes/recipe_details?recipe_id=${currentRecipeId}`)
      .then((response) => response.json())
      .then((responseJson) => {
        //let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        responseJson["nutrients"] = getNutrients(responseJson);
        fetch(`https://souschef-182502.appspot.com/api/v1/users/get_favorites?user_id=${firebase.auth().currentUser.uid}`)
          .then((response) => response.json())
          .then((favorites) => {
            this.setState({
              isLoading: false,
              dataSource: (responseJson),
              isFavorite: favorites && favorites[currentRecipeId],
            });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateFavorite() {
    fetch(`https://souschef-182502.appspot.com/api/v1/users/${this.state.isFavorite ? 'delete' : 'add'}_favorite?user_id=${firebase.auth().currentUser.uid}&recipe_id=${this.state.dataSource.id}`)
      .then(() => {
        this.setState({ isFavorite: !this.state.isFavorite })
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
              <TouchableWithoutFeedback onPress={this.updateFavorite.bind(this)}>
                <Image
                  style={styles.favoriteIcon}
                  source={this.state.isFavorite ? starFilledIcon : starIcon}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeaderText}>Nutrition Info</Text>

            <View style={styles.sectionHeader}>
              <Text style = {styles.nutrientHeader}>Nutrient</Text>
              <Text style = {styles.amountHeader}>Amount</Text>
              <Text style = {styles.amountHeader}>Percent of DV</Text>
            </View>
            <FlatList style={styles.ingredientsList}
                       data={this.state.dataSource.nutrients}
                 renderItem={({item}) => (
                              <View style={styles.nutrient}>
                                <Text style = {styles.nutrientName}>{`${item.name.charAt(0).toUpperCase()}${item.name.slice(1)}`}</Text>
                                <Text style = {styles.nutrientAmount}>{item.value}</Text>
                                <Text style = {styles.nutrientAmount}>{item.percent}</Text>
                              </View>
                            )}
            />
          </View>

        </ScrollView>



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
    flex: 1,
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
  favoriteIcon: {
    height: 30,
    width: 30,
    marginLeft: 15,
    marginBottom: 5,
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
  nutrient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nutrientName: {
    fontSize: 16,
    color: 'white',
    width: 110,
  },
  nutrientAmount: {
    fontSize: 16,
    color: 'white',
    width: 80,
  },
  nutrientHeader: {
    fontSize: 16,
    color: 'white',
    width: 110,
    fontWeight: 'bold'
  },
  amountHeader: {
    fontSize: 16,
    color: 'white',
    width: 80,
    fontWeight: 'bold'
  },
  percentHeader: {
    fontSize: 16,
    color: 'white',
    width: 80,
    fontWeight: 'bold'
  },
  ingredientPercent: {
    fontSize: 16,
    color: 'white',
    width: 40,
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
});
