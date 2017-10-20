import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView, SectionList, TouchableWithoutFeedback} from 'react-native';
import { StackNavigator } from 'react-navigation';
import ShoppingCategoryCard from './ShoppingCategoryCard.js';


const win = Dimensions.get('window');
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#06988D',
    borderBottomWidth: 0,
  },
  headerActions: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    marginRight: 20,
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
    fontWeight: 'bold',
    paddingTop: 8,
  },
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 40,
    backgroundColor: '#07988D',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  pageTitle: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 20,
  },
});

export default class ShoppingListView extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const {navigate, state, setParams} = navigation;
    const {params} = state;

    return {
      title: 'Shopping List',
      headerStyle: styles.header,
      headerTintColor: '#06988D',
      headerLeft: null,
      headerRight: <View style={styles.headerActions}>
                     <TouchableWithoutFeedback onPress={() => navigate('Overview', {})}>
                       <View><Text style={styles.headerText}>Done</Text></View>
                     </TouchableWithoutFeedback>
                   </View>,
    };
  };

  render() {
    let shoppingList = [
      {
        category: 'Produce',
        items: [
          {
            name: 'Yellow Onions',
            quantity: '3 large',
          },
          {
            name: 'Roma Tomatoes',
            quantity: '5 ct',
          },
          {
            name: 'Spinach',
            quantity: '1 bunch',
          },
          {
            name: 'Sliced Bella Mushrooms',
            quantity: '8 oz.',
          },
          {
            name: 'Lemons',
            quantity: '2 ct',
          },
          {
            name: 'Cubano Chile Pepper',
            quantity: '6 ct',
          }
        ]
      },
      {
        category: 'Dairy',
        items: [
          {
            name: 'Eggs',
            quantity: '12 large',
          },
          {
            name: 'Milk',
            quantity: '0.5 gl.',
          },
          {
            name: 'Parmesan Cheese, Grated',
            quantity: '6 oz.',
          },
          {
            name: 'Yogurt',
            quantity: '1 qt',
          }
        ]
      }
    ];

    return (

      <View style={styles.container}>
        <Text style={styles.pageTitle}>Shopping List</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
            {/*
                <SectionList style={styles.ingridentsContainer}
                renderItem={this.renderItem}
                renderSectionHeader={this.renderHeader}
                sections={[
                    {data: [{name:'Milk', value:'2 gal'}, {name:'Cheese', value:'12'}], key:'Dairy'},
                    {data: [{name:'Eggs', value:'2 gal'}], key:'Poultry'}
                ]}
                keyExtractor={(item) => item.name}
            />
            <FlatList style={styles.ingridentsContainer}
              data={[[
                  {data: [{name:'Milk', value:'2 gal'}, {name:'Cheese', value:'12'}], key:'Dairy'}],
                  [{data: [{name:'Eggs', value:'2 gal'}], key:'Poultry'}]
              ]}
              renderItem={this.flatRenderItem}
            />
            */}
          <FlatList
            data={shoppingList}
            renderItem={
              ({item}) => 
                <ShoppingCategoryCard category={item.category} items={item.items} />
            }
            keyExtractor={(item) => item.category}
          />

        </ScrollView>
      </View>

    );
  }
}
