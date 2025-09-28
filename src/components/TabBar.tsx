import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#FF4757";

export default function TabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push("/(panel)/home/page")}
      >
        <Ionicons
          name="home"
          size={24}
          color={pathname.includes("/home") ? PRIMARY_COLOR : "#999"}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: pathname.includes("/home") ? PRIMARY_COLOR : "#999" },
          ]}
        >
          Início
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="search" size={24} color="#999" />
        <Text style={styles.tabLabel}>Buscar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="cart-outline" size={24} color="#999" />
        <Text style={styles.tabLabel}>Carrinho</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="heart-outline" size={24} color="#999" />
        <Text style={styles.tabLabel}>Favoritos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push("/(panel)/profile/page")}
      >
        <Ionicons
          name="person"
          size={24}
          color={pathname.includes("/profile") ? PRIMARY_COLOR : "#999"}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: pathname.includes("/profile") ? PRIMARY_COLOR : "#999" },
          ]}
        >
          Perfil
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    backgroundColor: "white",
  },
  tabItem: {
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
});
