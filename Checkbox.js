import React from 'react';
import { AppRegistry, StyleSheet, View, Image, TouchableWithoutFeedback} from 'react-native';
import check from './images/check.png'


const styles = StyleSheet.create({
  checkbox: {
    width: 25,
    height: 25,
    margin: 7.5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selected: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 0,
  },
  check: {
    width: 15,
    height: 15,
    margin: 5,
  }
});

export default class Checkbox extends React.Component {

  toggleCheckbox() {
    this.props.onToggle();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.toggleCheckbox.bind(this)}>
        <View style={[styles.checkbox, this.props.selected && styles.selected]}>
          { this.props.selected && <Image source={check} resizeMode="contain" style={styles.check} /> }
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
