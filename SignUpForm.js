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

export default class SignUpForm extends React.Component {
    state = {
        email: '',
        password: '',
        name: '',
        loading: false,
        error: false
    }

    signup() {
        this.setState({ error: false, loading: true });
        const { email, password, name } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((userData) => {
                        fetch('https://souschef-182502.appspot.com/api/v1/users/create_profile?user_id='+userData['uid']+'&name='+name+'&exclusions=None&diet=None')
                            .catch(() => {
                                this.setState({ error: true, loading: false })
                            });
                        this.setState({ error: false, loading: false });
                        this.props.navigate('Profile', {mode: 'onboarding'});
                    })
                    .catch(() => {
                        this.setState({ error: true, loading: false });
            });
    }

    renderButtonOrSpinner() {
        if (this.state.loading) {
            return <ActivityIndicator color='#FFFFFF' size='small' />;
        }
        return <TouchableOpacity style={styles.buttonContainer}
            onPress={this.signup.bind(this)}>
            <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>;
    }

    renderErrorMessage() {
        if (this.state.error) {
            return <Text style={styles.errorText}> Sign up failed. </Text>;
        }
        return ;
    }

  render() {
    const navigate = this.props.navigate;
    return (
      <View style={styles.container}>
        {this.renderErrorMessage()}
        <TextInput
          placeholder='Name'
          placeholderTextColor = 'rgba(255,255,255,0.4)'
          returnKeyType='next'
          onSubmitEditing={() => this.emailInput.focus()}
          autoCorrect ={false}
          style={styles.input}
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
          />
        <TextInput
            placeholder='Email'
            placeholderTextColor = 'rgba(255,255,255,0.4)'
            returnKeyType='next'
            onSubmitEditing={() => this.passwordInput.focus()}
            keyboardType = 'email-address'
            autoCapitalize = 'none'
            autoCorrect ={false}
            style={styles.input}
            ref={(input) => this.emailInput = input}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            />
        <TextInput
            placeholder='Password'
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
