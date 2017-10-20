import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView, SectionList, TouchableWithoutFeedback} from 'react-native';
import { StackNavigator } from 'react-navigation';
import CheckBox from 'react-native-check-box';


const win = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width - 40,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  categoryHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 30,
  },
  itemsList: {
    flex: 1,
    width: Dimensions.get('window').width - 80,
  },
  item: {
    flex: 1,
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  itemName: {
    width: Dimensions.get('window').width - 220,
    fontSize: 16,
    color: 'white',
    paddingRight: 10,
    alignSelf: 'flex-start',
    textAlign: 'left',
    flex: 0,
  },
  itemQuantity: {
    width: 100,
    fontSize: 16,
    color: 'white',
    paddingLeft: 10,
    alignSelf: 'flex-end',
    textAlign:'right',
  },
  checkBoxButton: {
    width: 40,
    height: 40,
    marginLeft:0,
    marginRight:0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    flex: -1
  }
});

export default class ShoppingCategoryCard extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.categoryHeader}>{this.props.category}</Text>
        <FlatList style={styles.itemsList}
          data={this.props.items}
          renderItem={
            ({item}) => (
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.item}>
                  <CheckBox style={styles.checkBoxButton}
                          onClick={() => this.setState({ color: '#FFFFFF', })}
                  />
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>{item.quantity}</Text>
                </View>
              </TouchableWithoutFeedback>
            )
          }
          keyExtractor={(item) => item.name}
        />
      </View>

    );
  }
}
