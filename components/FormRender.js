import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { XMLParser } from "fast-xml-parser"; // Correct import
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import DateTimePicker from "@react-native-community/datetimepicker";
import SignatureCanvas from "react-native-signature-canvas";

const FormRenderer = ({ route }) => {
  const { fromFile } = route.params; // Check if loading from a file
  const [formFields, setFormFields] = useState([]); // Store form fields
  const [formData, setFormData] = useState({}); // Store form data

  useEffect(() => {
    const loadXMLFile = async () => {
      try {
        let xmlContent;

        if (fromFile) {
          // Load predefined XML file
          const asset = Asset.fromModule(require("../assets/form.xml"));
          await asset.downloadAsync();
          xmlContent = await FileSystem.readAsStringAsync(asset.localUri);
        } else {
          // Placeholder for user-provided XML input
          xmlContent = `
          <form>
            <field>
              <type>text</type>
              <label>Name</label>
              <placeholder>Enter your name</placeholder>
            </field>
            <field>
              <type>date</type>
              <label>Date</label>
            </field>
            <field>
              <type>radio</type>
              <label>Gender</label>
              <options>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </options>
            </field>
            <field>
              <type>signature</type>
              <label>Signature</label>
            </field>
          </form>`;
        }

        // Parse XML to JSON
        const parser = new XMLParser();
        const jsonData = parser.parse(xmlContent);

        if (jsonData && jsonData.form && jsonData.form.field) {
          // Normalize the fields and ensure `options` is always an array
          const fields = jsonData.form.field.map((field) => {
            if (field.type === "radio" && field.options) {
              field.options = Array.isArray(field.options)
                ? field.options
                : [field.options];
            }
            return field;
          });

          setFormFields(fields);
        } else {
          Alert.alert("Error", "Invalid XML structure");
        }
      } catch (error) {
        console.error("Error loading XML file:", error);
        Alert.alert("Error", "Failed to load XML file. Check file path or structure.");
      }
    };

    loadXMLFile();
  }, [fromFile]);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {formFields.map((field, index) => {
        switch (field.type) {
          case "text":
            return (
              <View key={index} style={styles.field}>
                <Text>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  onChangeText={(text) => handleInputChange(field.label, text)}
                />
              </View>
            );
          case "date":
            return (
              <View key={index} style={styles.field}>
                <Text>{field.label}</Text>
                <DateTimePicker
                  mode="date"
                  value={new Date()}
                  onChange={(event, date) =>
                    handleInputChange(field.label, date?.toISOString())
                  }
                />
              </View>
            );
          case "radio":
            return (
              <View key={index} style={styles.field}>
                <Text>{field.label}</Text>
                {field.options.map((option, idx) => (
                  <Button
                    key={idx}
                    title={option}
                    onPress={() => handleInputChange(field.label, option)}
                  />
                ))}
              </View>
            );
          case "signature":
            return (
              <View key={index} style={styles.field}>
                <Text>{field.label}</Text>
                <View style={{ height: 200, borderWidth: 1, borderColor: "#000" }}>
                  <SignatureCanvas
                    onOK={(data) => handleInputChange(field.label, data)} // Save signature data
                    descriptionText="Sign here"
                    clearText="Clear"
                    confirmText="Save"
                    webStyle={`.m-signature-pad { border: 1px solid black; }`}
                  />
                </View>
              </View>
            );
          default:
            return null;
        }
      })}
      <Button
        title="Submit"
        onPress={() => {
          console.log("Form Data:", formData);
          Alert.alert("Form Submitted", JSON.stringify(formData, null, 2));
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  field: { marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5 },
});

export default FormRenderer;
