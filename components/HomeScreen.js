import React from "react";
import { View, Button, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Button
      title="Render Form from XML File"
      onPress={() => navigation.navigate("FormRenderer", { fromFile: true })}
    />
    <Button
      title="Render Form from XML Input"
      onPress={() => navigation.navigate("FormRenderer", { fromFile: false })}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
