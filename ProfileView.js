import React from 'react';
import { StyleSheet, Dimensions, Text, View, ScrollView, FlatList, Picker, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';

export default class ProfileView extends View {
  static navigationOptions = ({ navigation }) => {
    const {navigate, state, setParams} = navigation;
    const {params} = state;
    let leftHeader = null;
    let rightHeader = null;

    if(params.mode !== 'onboarding') {
      leftHeader = (
        <View style={styles.headerActions}>
          <TouchableWithoutFeedback onPress={() => navigate('Overview', {})}>
            <View><Text style={styles.headerText}>Back</Text></View>
          </TouchableWithoutFeedback>
        </View>
      )
    }
    rightHeader = (
      <View style={styles.headerActions}>
        <TouchableWithoutFeedback onPress={params.onDone}>
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
  
    this.state = {diet: "none"};
  }

  componentDidMount() {
    this.props.navigation.setParams({ onDone: this.updateDietaryPreferences.bind(this) });
  }

  updateDietaryPreferences() {
    this.props.navigation.navigate('Overview', {});
  }
  
  render() {
    const { navigate, state } = this.props.navigation;
    let days = [{
      key: 'Monday'
    },
    {
      key: 'Tuesday'
    },
    {
      key: 'Wednesday'
    },
    {
      key: 'Thursday'
    },
    {
      key: 'Friday'
    }];

    return (
      <View style={styles.profile}>
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
              {days.map((item, index) => {
                return <Picker.Item key={index} label={item.key} value={item.key} />
              })}
            </Picker>
          </View>
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>
              Dietary Exclusions
            </Text>
            <Text style={styles.selectionSubtitle}>Select all applicable exclusions.</Text>
            <View style={styles.selectionList}>
              {days.map((item, index) => {
                return (
                  <TouchableHighlight key={index}
                                  onPress={() => {}}
                                    style={styles.selection}
                            underlayColor="white">
                    <Text style={styles.selectionText}>{item.key}</Text>
                  </TouchableHighlight>
                )
              })}
            </View>
          </View>
        </ScrollView>
      </View>
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
});