import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView, SectionList, TouchableWithoutFeedback} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Checkbox from './Checkbox.js';


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
    marginBottom: 20,
  },
  itemsList: {
    flex: 1,
    width: Dimensions.get('window').width - 80,
  },
  item: {
    flex: 1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'flex-start',
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  itemName: {
    width: Dimensions.get('window').width - 220,
    fontSize: 16,
    color: 'white',
    paddingHorizontal: 10,
    textAlign: 'left',
    flex: 0,
  },
  itemQuantity: {
    width: 100,
    fontSize: 16,
    color: 'white',
    paddingLeft: 10,
    textAlign:'right',
  },
});

export default class ShoppingCategoryCard extends React.Component {

  constructor(props) {
    super(props);
  
    this.state = {
      checkedItems: []
    };
  }

  checkItem(index) {
    let checkedItems = this.state.checkedItems;
    checkedItems[index] = !checkedItems[index];
    this.setState({
      checkedItems: checkedItems,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.categoryHeader}>{this.props.category}</Text>
        <FlatList style={styles.itemsList}
          data={this.props.items}
          extraData={this.state}
          renderItem={
            ({item, index}) => (
              <TouchableWithoutFeedback key={index} onPress={this.checkItem.bind(this,index)}>
                <View style={styles.item}>
                  <Checkbox selected={this.state.checkedItems[index]} onToggle={this.checkItem.bind(this,index)}
                  />
                  <Text style={styles.itemName}>{`${item[0].charAt(0).toUpperCase()}${item[0].slice(1)}`}</Text>
                  <Text style={styles.itemQuantity}>
                    { Object.entries(item[1]).map((amt) => `${amt[1]} ${amt[0]}`).join('\n') }
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )
          }
        />
      </View>

    );
  }
}
