import React from 'react';
import { AppRegistry, StyleSheet, Dimensions, Text, View, Button, Image, FlatList, ScrollView, SectionList, TouchableWithoutFeedback} from 'react-native';
import firebase from 'firebase';
import ShoppingCategoryCard from './ShoppingCategoryCard.js';
import filterIcon from './images/filter.png';
import chevronLeftIcon from './images/chevron-left.png';

const win = Dimensions.get('window');
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#06988D',
    borderBottomWidth: 0,
  },
  headerActions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginHorizontal: 20,
  },
  headerIconText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImageRight: {
    height: 30,
    width: 30,
    opacity: 0.75,
    marginLeft: 15,
  },
  headerImageBack: {
    height: 40,
    width: 40,
    opacity: 0.75,
    marginLeft: -20,
    marginRight: -10,
  },
  headerText: {
    color: '#FFF',
    height: 30,
    fontSize: 17,
    paddingTop: 4,
  },
  headerTextBold: {
    fontWeight: 'bold',
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
  emptyView: {
    width: Dimensions.get('window').width - 40,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 10,
  },
  emptyViewText: {
    color: '#FFF',
    fontSize: 17,
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 30,
  },
  emptyViewButton: {
    width: Dimensions.get('window').width - 40,
    paddingVertical: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  emptyViewButtonText: {
    color: '#FFF',
    fontSize: 17,
    textAlign: 'center',
  },
});

export default class ShoppingListView extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const {navigate, goBack, state, setParams} = navigation;
    const {params} = state;

    return {
      title: 'Shopping List',
      headerStyle: styles.header,
      headerTintColor: '#06988D',
      headerLeft: <View style={styles.headerActions}>
                    <TouchableWithoutFeedback onPress={() => goBack()}>
                      <View style={styles.headerIconText}>
                        <Image source={chevronLeftIcon} style={styles.headerImageBack} />
                        <Text style={styles.headerText}>Back</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>,
      headerRight: <View style={styles.headerActions}>
                     <TouchableWithoutFeedback onPress={() => navigate('Overview', { mode: 'select', onBack: params.onBack, })}>
                       <Image source={filterIcon} style={styles.headerImageRight} />
                     </TouchableWithoutFeedback>
                   </View>,
    };
  };

  constructor(props) {
    super(props);

    this.state = { shoppingList: [] };
  }

  componentDidMount() {
    this.updateShoppingList();
    this.props.navigation.setParams({ onBack: this.updateShoppingList.bind(this) });
  }

  updateShoppingList() {
    this.getShoppingListFromApiAsync()
      .then((shoppingList) => {
        shoppingList = shoppingList ? Object.entries(shoppingList) : [];
        shoppingList.map((item, index) => item.key = index);
        this.setState({
          shoppingList: shoppingList,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getShoppingListFromApiAsync() {
    return fetch(`http://souschef-182502.appspot.com/api/v1/users/shopping_list?user_id=${firebase.auth().currentUser.uid}`)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Shopping List</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            data={this.state.shoppingList}
            extraData={this.state}
            renderItem={
              ({item, index}) => <ShoppingCategoryCard key={index}
                                                  category={item[0]}
                                                     items={Object.entries(item[1]).map((entry, ind) => {
                                                       entry.key = ind;
                                                       return entry;
                                                     })} />
            }
          />
          { this.state.shoppingList.length === 0 &&    
              <View style={styles.emptyView}>
                <Text style={styles.emptyViewText}>No items on shopping list.</Text>
                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Overview', { mode: 'select', onBack: this.updateShoppingList.bind(this) })}>
                  <View style={styles.emptyViewButton}>
                    <Text style={styles.emptyViewButtonText}>Select Recipes</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
          }
        </ScrollView>
      </View>
    );
  }
}
