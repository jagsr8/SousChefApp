import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, FlatList, ScrollView, SectionList, TouchableWithoutFeedback} from 'react-native';
import { StackNavigator } from 'react-navigation';
import CheckBox from 'react-native-check-box'


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
    borderRadius: 5,
    backgroundColor: '#048277',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  directionsContainer: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
  },
  categoryHeader: {
    fontSize: 25,
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 25,
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
  },
  subHeaderText: {
    fontSize: 20,
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
    paddingRight: 10,
    alignSelf: 'flex-start',
    textAlign:'left',
    flex:0,
    marginLeft:-120
  },
  textOnHorizontalView2: {
    fontSize: 20,
    color: 'white',
    paddingLeft: 10,
    left: '10%',
    paddingRight: 10,
    marginLeft: 10,
    textAlign:'right'
  },
  button: {
    borderColor: '#000066',
    borderWidth: 1,
    borderRadius: 10,
  },
  radioButton: {
    borderColor: '#000066',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 15,
    marginLeft: 10
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
  checkBoxButton: {
    marginLeft:0,
    marginRight:0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    flex: -1
  }
});
class RecipeDetailsView extends React.Component {

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
    return (

      <View style={styles.container}>
        <ScrollView>
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
            <Text style={styles.categoryHeader}>Poultry</Text>
            <FlatList style={styles.ingridentsContainer}
              data={[{name:'Eggs', value:'  2 dozen'}]}
              renderItem= {
                  ({item}) =>  <View style={styles.ingridentsList}>
                  <CheckBox
                        style={styles.checkBoxButton}
                        onClick={()=>
                            this.setState({
                                color: '#FFFFFF',
                            })
                        }
                    />
                  <Text style = {styles.textOnHorizontalView}>{item.name}</Text>
                  <Text style = {styles.textOnHorizontalView2}>{item.value}</Text>

                  </View>
              }
              keyExtractor={(item) => item.name}
            />
            <Text style={styles.categoryHeader}>Dairy</Text>
            <FlatList style={styles.ingridentsContainer}
              data={[{name:'Milk ', value:'       2 gal'}, {name:'Cheese', value:'2 grams'}, {name:'Yogurt', value:'     5 oz'}]}
              renderItem= {
                   ({item}) =>  <View style={styles.ingridentsList}>
                   <CheckBox
                         style={styles.checkBoxButton}
                         onClick={()=>
                             2+4
                         }
                     />
                  <Text style = {styles.textOnHorizontalView}>{item.name}</Text>
                  <Text style = {styles.textOnHorizontalView2}>{item.value}</Text>
                  </View>
              }
              keyExtractor={(item) => item.name}
            />
            <Text style={styles.categoryHeader}>Produce</Text>
            <FlatList style={styles.ingridentsContainer}
              data={[{name:'Spinach', value:'   250g'}, {name:'Carrots', value:'3 sticks'}, {name:'Celery', value:'5 sticks'}]}
              renderItem= {
                   ({item}) =>  <View style={styles.ingridentsList}>
                   <CheckBox
                         style={styles.checkBoxButton}
                         onClick={()=>
                             2+4
                         }
                     />
                  <Text style = {styles.textOnHorizontalView}>{item.name}</Text>
                  <Text style = {styles.textOnHorizontalView2}>{item.value}</Text>
                  </View>
              }
              keyExtractor={(item) => item.name}
            />

        </ScrollView>
      </View>

    );
  }
}

export default RecipeDetailsView;
