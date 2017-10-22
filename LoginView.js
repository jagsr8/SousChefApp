import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView} from 'react-native';
import { StackNavigator } from 'react-navigation';
import LoginForm from './LoginForm.js';
const win = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#06988D',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    image: {
        alignSelf: 'center',
        flexGrow: 1,
        marginBottom: 150,
        width: 250,
        height: 50,
        borderRadius: 20
    }
});

export default class LoginView extends React.Component {
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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
        {/*<TouchableOpacity>
            <Image
                style={styles.image}
                source={require('./images/facebook.png')}
              />
        </TouchableOpacity>*/}
        <View style={styles.loginContainer}>
            <LoginForm navigate={navigate}/>
        </View>
      </KeyboardAvoidingView>

    );
  }
}
