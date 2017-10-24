import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView, SectionList, TouchableWithoutFeedback} from 'react-native';
import firebase from 'firebase';
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
    const {navigate, goBack, state, setParams} = navigation;
    const {params} = state;

    return {
      title: 'Shopping List',
      headerStyle: styles.header,
      headerTintColor: '#06988D',
      headerLeft: <View style={styles.headerActions}>
                    <TouchableWithoutFeedback onPress={() => goBack()}>
                      <View><Text style={styles.headerText}>Cancel</Text></View>
                    </TouchableWithoutFeedback>
                  </View>,
      headerRight: <View style={styles.headerActions}>
                     <TouchableWithoutFeedback onPress={() => navigate('Overview', { mode: 'select' })}>
                       <View><Text style={styles.headerText}>Edit</Text></View>
                     </TouchableWithoutFeedback>
                   </View>,
    };
  };

  constructor(props) {
    super(props);

    this.state = { shoppingList: [] };
  }

  componentDidMount() {
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
                                                     items={Object.entries(item[1])} />
            }
          />
        </ScrollView>
      </View>

    );
  }
}
