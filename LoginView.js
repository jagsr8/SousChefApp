import React from 'react';
import { AppRegistry, ActivityIndicator, StyleSheet, Text, View, Button, Image, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView} from 'react-native';
import { StackNavigator } from 'react-navigation';
const win = Dimensions.get('window');
import firebase from 'firebase';


const styles = StyleSheet.create({
    container: {
        backgroundColor:'#06988D',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    input: {
        height: 60,
        backgroundColor: '#048277',
        paddingHorizontal: 10,
        marginBottom: 30,
        color: '#FFF',
        borderRadius: 10
    },
    buttonContainer: {
        justifyContent: 'center',
        height: 50,
        backgroundColor: '#066963',
        marginTop: 30,
        borderRadius: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15
    },
    errorText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: '700',
        fontSize: 15,
        marginBottom:10
    },
    inputHeaders: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'left',
      color: 'rgb(255,255,255)',
      padding: 5,
      paddingBottom: 10,
    },
    headerTitle: {
      color: '#FFF',
      fontSize: 34,
      fontWeight: 'bold',
      paddingTop: 50,
      marginBottom: 70,
    },
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
      isLoading: true,
      email: 'a@b.com',
      password: 'blahblah',
      loading: false,
      error: false,
    }
  }

  login() {
      this.setState({ error: false, loading: true });
      const { email, password } = this.state;
      firebase.auth().signInWithEmailAndPassword(email, password)
                  .then((userData) => {
                      this.setState({ error: '', loading: false });
                      this.props.navigation.navigate('Overview', {});
                  })
                  .catch((error) => {
                      console.log(error)
                      this.setState({ error: true, loading: false });
          });
  }

  renderButtonOrSpinner() {
      if (this.state.loading) {
          return <ActivityIndicator color='#FFFFFF' size='small'/>;
      }
      return <TouchableOpacity style={styles.buttonContainer}
          onPress={this.login.bind(this)}>
          <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>;
  }

  renderErrorMessage() {
      if (this.state.error) {
          return <Text style={styles.errorText}> Authentication failed. </Text>;
      }
      return ;
  }


  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <Text style={styles.headerTitle}>Login</Text>
        <View>
            {this.renderErrorMessage()}
            <Text style={styles.inputHeaders}>
             Email
            </Text>
            <TextInput
                placeholder='email'
                placeholderTextColor = 'rgba(255,255,255,0.4)'
                returnKeyType='next'
                onSubmitEditing={() => this.passwordInput.focus()}
                keyboardType = 'email-address'
                autoCapitalize = 'none'
                autoCorrect ={false}
                style={styles.input}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                />
            <Text style={styles.inputHeaders}>
             Password
            </Text>
            <TextInput
                placeholder='password'
                placeholderTextColor = 'rgba(255,255,255,0.4)'
                returnKeyType='go'
                secureTextEntry
                style={styles.input}
                ref={(input) => this.passwordInput = input}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
                />
        </View>
        {this.renderButtonOrSpinner()}
      </KeyboardAvoidingView>

    );
  }
}
