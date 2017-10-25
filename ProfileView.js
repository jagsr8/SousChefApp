import React from 'react';
import { StyleSheet, Dimensions, ActivityIndicator, Text, View, ScrollView, FlatList, Picker, TouchableWithoutFeedback, TouchableHighlight, TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import firebase from 'firebase';
import TagInput from './TagInput.js';

export default class ProfileView extends View {
  static navigationOptions = ({ navigation }) => {
    const {navigate, goBack, state, setParams} = navigation;
    const {params} = state;
    let leftHeader = null;
    let rightHeader = null;

    if(params.mode !== 'onboarding') {
      leftHeader = (
        <View style={styles.headerActions}>
          <TouchableWithoutFeedback onPress={() => goBack()}>
            <View><Text style={styles.headerText}>Back</Text></View>
          </TouchableWithoutFeedback>
        </View>
      )
    }
    rightHeader = (
      <View style={styles.headerActions}>
        <TouchableWithoutFeedback onPress={() => params.onDone(params.onBack)}>
          <View><Text style={[styles.headerText,styles.headerTextBold]}>Save</Text></View>
        </TouchableWithoutFeedback>
      </View>
    )

    return {
      title: 'Profile',
      headerStyle: styles.header,
      headerTintColor: '#06988D',
      headerTitleStyle: styles.headerTitle,
      headerLeft: leftHeader,
      headerRight: rightHeader,
    };
  };

  constructor(props) {
    super(props);

    this.state = {
        diet: "None",
        loading: false,
        tags: [],
        exc: '',
        tag:''
    };
  }

  componentDidMount() {
      this.props.navigation.setParams({ onDone: this.updateDietaryPreferences.bind(this) });
      this.getMoviesFromApiAsync().then((plan) => {
          var exclus = plan['exclusions'];
          var die = plan['diet'];
          if ((plan['exclusions'].length == 1 && plan['exclusions'][0] == "")) {
             plan['exclusions'].pop()
          }
          this.setState({
              tags: plan['exclusions'],
              diet: die,
            });
        });
  }

  getMoviesFromApiAsync() {
    return fetch(`http://souschef-182502.appspot.com/api/v1/users/get_profile?user_id=${firebase.auth().currentUser.uid}`)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateDietaryPreferences(onBack) {
      this.setState({ error: '', loading: true });
      var uid = firebase.auth().currentUser.uid;
      var call = 'https://souschef-182502.appspot.com/api/v1/users/update_profile?user_id='+uid;
      diet = this.state.diet;
      exclusions = this.state.tags.join();

      if ((this.state.diet == 'None')) {
          diet = '';
      }
      call += '&diet='+diet;
      if ((exclusions == '' || exclusions == 'None')) {
          exclusions = '';
      }
      call += '&exclusions='+exclusions;

      fetch(call)
          .then(() => {
              fetch('https://souschef-182502.appspot.com/api/v1/users/weekly_plan_create?user_id='+uid)
                  .then(() => {
                      onBack();
                      this.props.navigation.goBack();
                  })
          })
          .catch((error) => {
              console.log(error);
              this.setState({ error: 'Cannot create weekly view', loading: false})
          });

  }

  addExclusion() {
      this.state.tags.push(this.state.exc);
      this.setState({ tags: this.state.tags });
  }

  toggleSet(item) {
      if (this.selectionSet.has(item.key)) {
          this.selectionSet.delete(item.key);
      } else {
          this.selectionSet.add(item.key);
      }
  }

  renderTags() {
      return (<TagInput
           tagContainerStyle={styles.tagStyle}
           value={this.state.tags}
           onChange={(tags) => this.setState({tags})}
           labelExtractor={(tag) => tag}
           text={''}
           onChangeText={()=>{}}
           tagColor={'#06988D'}
         />);
  }

  renderProfileOrSpinner() {
      if (this.state.loading) {
          return <View style={styles.activity}>
                    <ActivityIndicator color='#FFFFFF' size='large' />
                 </View>;
      }
      const { navigate, state } = this.props.navigation;
      let diets = [{
        key: 'vegetarian',
        label: 'Vegetarian'
      },
      {
        key: 'glutenFree',
        label: 'Gluten Free'
      },
      {
        key: 'dairyFree',
        label: 'Dairy Free'
      },
      {
        key: 'cheap',
        label: 'Cheap'
      }];

      return <KeyboardAvoidingView behavior='position' style={styles.profile}>
        <Text style={styles.profileTitle}>Profile</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>
              Dietary Restriction
            </Text>
            <Text style={styles.selectionSubtitle}>Select the option that best describes your diet.</Text>
            <Picker selectedValue={this.state.diet}
                    onValueChange={(itemValue, itemIndex) => this.setState({ diet: itemValue, })}
                            style={styles.selectionPicker}
                        itemStyle={{height: 100, color: 'white',}}>
              <Picker.Item label="None" value="none" />
              {diets.map((item, index) => {
                return <Picker.Item key={index} label={item.label} value={item.key} />
              })}
            </Picker>
          </View>
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>
              Dietary Exclusions
            </Text>
            <Text style={styles.selectionSubtitle}>Select all applicable exclusions.</Text>
            {this.renderTags()}
            <View style={styles.tagInputContainer}>
                <TextInput
                  placeholder='Exclusions'
                  placeholderTextColor = 'rgba(255,255,255,0.4)'
                  autoCorrect ={false}
                  style={styles.input}
                  value={this.state.exc}
                  onChangeText={exc => this.setState({ exc })}
                  />
                  <TouchableOpacity style={styles.buttonInput}
                      onPress={() => {
                          this.addExclusion()
                      }}>
                      <Text style={styles.buttonText}>Add</Text>
                  </TouchableOpacity>
             </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>;
  }

  render() {


    return (
        this.renderProfileOrSpinner()
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#06988D',
    borderBottomWidth: 0,
  },
  headerActions: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 20,
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
    paddingTop: 8,
  },
  headerTextBold: {
    fontWeight: 'bold',
  },
  profile: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 40,
    backgroundColor: '#07988D',
    alignItems: 'flex-start',
    justifyContent: 'center',
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
  profileTitle: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 20,
  },
  selectionContainer: {
    flex: 1,
    width: Dimensions.get('window').width - 40,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  selectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'rgba(255,255,255,0.4)',
    padding: 20,
    paddingBottom: 5,
  },
  selectionSubtitle: {
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'italic',
    textAlign: 'left',
    color: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  selectionPicker: {
    width: Dimensions.get('window').width - 80,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.15)',
    margin: 20,
    marginTop: 10,
  },
  selectionList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selection: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  selectionText: {
    fontSize: 16,
    color: 'white',
  },
  input: {
      width: 150,
      backgroundColor: 'rgba(0,0,0,0.15)',
      color: '#FFF',
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 'normal',
      textAlign: 'left',
      paddingHorizontal: 20,
      marginHorizontal: 20,
      marginVertical: 10,
      paddingVertical: 10,
      justifyContent: 'center'
  },
  buttonInput: {
      backgroundColor: 'rgba(0,0,0,0.15)',
      borderRadius: 10,
      paddingHorizontal: 20,
      marginHorizontal: 10,
      marginVertical: 10,
      paddingVertical: 10,
      justifyContent: 'center'
  },
  tagInputContainer: {
      flexDirection: 'row',
      flex: 1
  },
  buttonText: {
      textAlign: 'center',
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 13
  },
  tagStyle: {
      backgroundColor: 'rgba(0,0,0,0.15)',
      borderRadius: 10,
      marginHorizontal: 5,
      justifyContent: 'center',
  }
});
