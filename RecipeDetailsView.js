import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView, StatusBar} from 'react-native';
import { StackNavigator } from 'react-navigation';
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
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
    position: "absolute",
    top: 150,
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

export function getMoviesFromApiAsync() {
      return fetch('https://souschef-182502.appspot.com/api/v1/users/weekly_plan?user_id=1')
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson.name);
          return String(responseJson.name[0]);
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
      gesturesEnabled: true,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }


  // componentDidMount() {
  //   return fetch('https://souschef-182502.appspot.com/api/v1/users/weekly_plan?user_id=1')
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       //let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  //       this.setState({
  //         isLoading: false,
  //         dataSource: (responseJson.diet),
  //       }, function() {
  //         // do something with new state
  //       });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  render() {
    // if (this.state.isLoading) {
    //   return (
    //     <View style={{flex: 1, paddingTop: 20}}>
    //     <Text>
    //       Loading...
    //     </Text>
    //     </View>
    //   );
    // }
    // console.log(this.state.dataSource)
    return (
      <View style={styles.container}>
        <ScrollView>
        <Image
        style={styles.image}
        resizeMode={'cover'}   /* <= changed  */
        source={{uri: 'https://www.incredibleegg.org/wp-content/uploads/basic-french-omelet-930x550.jpg'}}
        />
        
        <Text
        style= {styles.text}>
        French Omelette
        </Text>
        <View style={styles.horizontalView}>
          <Text style = {styles.textOnHorizontalView}>
            30 min
          </Text>
          <Text style = {styles.textOnHorizontalView}>
            $3.50
          </Text>
          <Text style = {styles.textOnHorizontalView}>
            430 cal
          </Text>
          <Text style = {styles.textOnHorizontalView}>
            Vegetarian
          </Text>
        </View>


        <Text style = {styles.headerText}>
            Ingredients
        </Text>
        <FlatList style={styles.ingridentsContainer}
          data={[{key: 'Eggs', value: '3 large'}, {key: 'Spinach', value: '3 oz'}, {key: 'Yellow Onions', value: '0.5 large'}]}

          renderItem={
            ({item}) => 
              <View style={styles.ingridentsList}>
                <Text style = {styles.textOnHorizontalView}>{item.key}</Text>
                <Text style = {styles.textOnHorizontalView}>{item.value}</Text>
              </View>
          }
        />

        <Text style = {styles.headerText}>
            Directions
        </Text>
        <FlatList style={styles.directionsContainer}
          data={[{key: '1. Beat eggs, water, salt and pepper in small bowl until blended.'}, 
          {key: '2. Heat butter in 7 to 10-inch nonstick omelet pan or skillet over medium-high heat until hot. Pour in egg mixture.'}, 
          {key: '3. Gently push cooked portions from edges toward the center with inverted turner so that uncooked eggs can reach the hot pan surface.'}, 
          {key: '4. When top surface of eggs is thickened and no visible liquid egg remains, place cut up onion and spinach on one side of the omelet. Fold omelet in half with turner. Serve immediately.'}]}

          renderItem={
            ({item}) => 
              <View style={styles.ingridentsList}>
                <Text style = {styles.textOnHorizontalView}>{item.key}</Text>
                <Text style = {styles.textOnHorizontalView}>{item.value}</Text>
              </View>
          }
        />
        </ScrollView>

        <View style={styles.changeRecipeButton}>

        <Button 
          onPress={() => navigate('Overview', {})}
          title={"Change Recipe"}
          color="#FFFFFF"


        />
        </View>

        <View style={styles.startCookingButton}>
          <Button
            onPress={() => navigate('Overview', {})}
            title="Start Cooking"
            color="#86A791"
          />
        </View>

      </View>

    );
  }
}

export default RecipeDetailsView;
