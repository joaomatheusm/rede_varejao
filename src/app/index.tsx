
import Colors from "@/constants/Colors";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";


export default function Index (){
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size={44} />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF4757",
  }
});

