import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

import { withFormik } from 'formik';

const Form = (props) => (
  <View style={styles.container}>
    <TextInput
      value={props.values.email}
      onChangeText={text => props.setFieldValue('email', text)}
    />

    <TextInput
      value={props.values.password}
      onChangeText={text => props.setFieldValue('password', text)}
    />

    <Button
      onPress={props.handleSubmit}
      title="Login"
    />
  </View>
);

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });

export default withFormik({
  mapPropsToValues: () => ({ email: '', password: '' }),

  handleSubmit: (values) => {
    console.log(values);
  }
})(Form);