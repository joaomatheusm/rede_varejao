import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  onPress?: () => void;
}

export const MenuItem: React.FC<Props> = ({ icon, text, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#555" />
      <Text style={styles.text}>{text}</Text>
      <Ionicons name="chevron-forward-outline" size={22} color="#ccc" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    flex: 1,
    marginLeft: 20,
    fontSize: 16,
    color: "#333",
  },
});
