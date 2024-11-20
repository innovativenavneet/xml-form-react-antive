import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./components/HomeScreen";
import FormRenderer from "./components/FormRender";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Home Screen */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: "XML Form Renderer" }}
        />
        {/* Form Renderer Screen */}
        <Stack.Screen 
          name="FormRenderer" 
          component={FormRenderer} 
          options={({ route }) => ({
            title: route.params.fromFile
              ? "Predefined XML Form"
              : "User XML Input",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
