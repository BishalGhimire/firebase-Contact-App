import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Image
} from "react-native";

import uuid from 'uuid';

import { Form, Item, Input, Label, Button } from "native-base";3
import * as ImagePicker  from "expo-image-picker";
import Promise from 'expo';
import { Header } from "react-navigation-stack";

import * as firebase from 'firebase';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

export default class AddNewContactScreen extends Component {
  static navigationOptions = {
    title: "Add Contact"
  };

  constructor (props){
      super(props);
      this.state = {
        fname : "",
        lname : "",
        phone : "",
        email : "",
        address : "",
        image : "empty",
        imageURL: "empty",
        isUploading : false
      }
  }


  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status == 'granted') {
        this.pickImage();
      }
      else if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }
 

  //TODO: savecontact method
  saveContact = async () => {
    if(
        this.state.fname !== "" && 
        this.state.lname !== "" && 
        this.state.email !== "" && 
        this.state.phone !== "" && 
        this.state.address !== "" 
     ) {
         this.setState({isUploading: false})
        const dbReference = firebase.database().ref();
        const storageRef = firebase.storage().ref();
        if(this.state.image !== "empty"){
        const downloadURL = await this.uploadImageAsync(this.state.image, storageRef);
        this.setState({imageURL: downloadURL})

        }
        var contact = {
            fname: this.state.fname,
            lname: this.state.lname,
            phone: this.state.phone,
            email: this.state.email,
            imageURL: this.state.imageURL
        }

        await dbReference.push(contact, error => {
            if(!error){
                return this.props.navigation.goBack();

            }
        })

         }

  };
  // pick image from gallery
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibaryAsync({
        quality: 0.2,
        base64: true,
        allowEditing: true,
        aspect: [1,1],

    });
    if(!result.cancelled){
        this.setState({ image: result.uri })
    }

  };

  uploadImageAsync = async (uri, storageRef) => {
    const parts = uri.split(".");
    const fileExtension = parts[parts.length -1]

    //create blob
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function(){
            resolve(xhr.response)
        }
        xhr.onerror = function(e){
            console.log(e)
            reject(new TypeError("Network Request Failed"))
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null)

    })

    const ref = storageRef
    .child("ContactImages")
    .child(uuid.v4() + "." + fileExtension);

    const snapshot = await ref.put(blob);


    blob.close()
    return await snapshot.ref.getDownloadURL()



  };

  //render method
  render() {
    if (this.state.isUploading) {
      return (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#B83227" />
          <Text style={{ textAlign: "center" }}>
            Contact Uploading please wait..
          </Text>
        </View>
      );
    }
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={Header.HEIGHT + 20} // adjust the value here if you need more padding
        style={{ flex: 1 }}
        behavior="padding"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            // dismiss the keyboard if touch any other area then input
            Keyboard.dismiss();
          }}
        >
          <ScrollView style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.getPermissionAsync();
              }}
            >
              <Image
                source={
                  this.state.image === "empty"
                    ? require("../assets/person.png")
                    : {
                        uri: this.state.image
                      }
                }
                style={styles.imagePicker}
              />
            </TouchableOpacity>

            <Form>
              <Item style={styles.inputItem} floatingLabel>
                <Label>First Name</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={fname => this.setState({ fname })}
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label>Last Name</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={lname => this.setState({ lname })}
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label>Phone</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  onChangeText={phone => this.setState({ phone })}
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label>Email</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={email => this.setState({ email })}
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label>Address</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={address => this.setState({ address })}
                />
              </Item>
            </Form>

            <Button
              style={styles.button}
              full
              rounded
              onPress={() => {
                // save contact
                this.saveContact();
              }}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}
// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 10
  },
  imagePicker: {
    justifyContent: "center",
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 100,
    borderColor: "#c1c1c1",
    borderWidth: 2
  },
  inputItem: {
    margin: 10
  },
  button: {
    backgroundColor: "#B83227",
    marginTop: 40
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});
