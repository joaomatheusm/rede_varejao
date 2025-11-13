import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { loading } = useAuth();

  if (!loading) {

    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={44} color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF4757",
  },
});
