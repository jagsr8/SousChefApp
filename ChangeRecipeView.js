import React from 'react';
import { AppRegistry, ActivityIndicator,StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView, StatusBar, TouchableHighlight} from 'react-native';
import { StackNavigator } from 'react-navigation';
const win = Dimensions.get('window');
import firebase from 'firebase';
import chevronRight from './images/chevron-right.png';
import starIcon from './images/star.png';
import starFilledIcon from './images/star-filled.png';


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
  activity: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 40,
    backgroundColor: '#07988D',
    alignItems: 'center',
    justifyContent: 'center',
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
  'DailyOverviewCard__recipeDetailHeader': {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  'DailyOverviewCard__recipeDetail': {
    color: '#FFF',
    textAlign: 'left',
    fontSize: 13,
    marginRight: 10,
    marginBottom: 2,
  },
  'DailyOverviewCard__favoriteIcon': {
    height: 13,
    width: 13,
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
  }

  componentDidMount() {
    return fetch(`https://souschef-182502.appspot.com/api/v1/recipes/recipe_changes?user_id=${firebase.auth().currentUser.uid}&offset=0&meal_type=${this.props.navigation.state.params.meal.toLowerCase()}`)
      .then((response) => response.json())
      .then((responseJson) => {
        fetch(`https://souschef-182502.appspot.com/api/v1/users/get_favorites?user_id=${firebase.auth().currentUser.uid}`)
          .then((response) => response.json())
          .then((favorites) => {
            //let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            responseJson.results = responseJson.results.map((item, index) => {
              item.key = index;
              item.isFavorite = favorites[item.id];
              return item;
            });

            this.setState({
              isLoading: false,
              dataSource: (responseJson),
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

  render() {
    const navigate = this.props.navigate;
    if (this.state.isLoading) {
      return (
                <View style={styles.activity}>
                  <ActivityIndicator color='#FFFFFF' size='large' />
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
                      <View style={styles['DailyOverviewCard__recipeDetailHeader']}>
                        <Text style={styles['DailyOverviewCard__recipeDetail']}>
                          {item.readyInMinutes} min
                        </Text>
                        {item.isFavorite && (
                          <Image
                            style={styles['DailyOverviewCard__favoriteIcon']}
                            source={starFilledIcon}
                          />
                        )}
                      </View>
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
