import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView} from 'react-native';
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
class RecipeDetailsView extends React.Component {
 
  static navigationOptions = {
    title: 'Chat with Lucy',
  };
  render() {
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
            Item1
          </Text>
          <Text style = {styles.textOnHorizontalView}>
            Item2
          </Text>
          <Text style = {styles.textOnHorizontalView}>
            Item3
          </Text>
          <Text style = {styles.textOnHorizontalView}>
            Item4
          </Text>
        </View>


        <Text style = {styles.headerText}>
            Ingredients
        </Text>
        <FlatList style={styles.ingridentsContainer}
          data={[{key: 'Eggs', value: '3 large'}, {key: 'Spinach', value: '3 oz'}]}

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
          data={[{key: '1. First heat the stove to high'}, {key: '2. Pour the egg in a pan'}, {key: '3. First heat the stove to high'}, {key: '4. First heat the stove to high'}]}

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
          onPress={() => navigate('Chat')}
          title="Change Recipe"
          color="#FFFFFF"
          backgroundColor='#111111'


        />
        </View>

        <View style={styles.startCookingButton}>
          <Button
            onPress={() => navigate('Chat')}
            title="Start Cooking"
            color="#86A791"
          />
        </View>

      </View>

    );
  }
}

export default RecipeDetailsView;
