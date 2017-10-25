import React from 'react';
import { AppRegistry, ActivityIndicator, StyleSheet, Text, View, Button, Image, Dimensions, TouchableOpacity, TextInput} from 'react-native';
import firebase from 'firebase';


const styles = StyleSheet.create({
    container: {
        backgroundColor:'#06988D',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding:20
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
        height: 60,
        backgroundColor: '#066963',
        paddingHorizontal: 40,
        marginBottom: 20,
        marginHorizontal: 50,
        borderRadius: 35
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
});

export default class LoginForm extends React.Component {

    state = {
        email: 'a@b.com',
        password: 'blahblah',
        loading: false,
        error: false,
    }

    login() {
        this.setState({ error: false, loading: true });
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
                    .then((userData) => {
                        this.setState({ error: '', loading: false });
                        this.props.navigate('Overview', {});
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
    const navigate = this.props.navigate;
    return (
      <View style={styles.container}>
        {this.renderErrorMessage()}
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
        {this.renderButtonOrSpinner()}
      </View>

    );
  }
}
