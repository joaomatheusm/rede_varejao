import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { loading } = useAuth();

  if (!loading) {
    // A navegação será feita pelo _layout.tsx baseado no estado do user
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
