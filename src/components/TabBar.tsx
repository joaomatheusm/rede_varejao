import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../contexts/CartContext";

const PRIMARY_COLOR = "#FF4757";

export default function TabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { totalItems } = useCart();

  return (
    <View
      style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      {/* Tab Início */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push("/(panel)/home/page")}
      >
        <Ionicons
          name={pathname.includes("/home") ? "home" : "home-outline"}
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

      {/* Tab Buscar */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push("/(panel)/search/page")}
      >
        <Ionicons
          name={pathname.includes("/search") ? "search" : "search-outline"}
          size={24}
          color={pathname.includes("/search") ? PRIMARY_COLOR : "#999"}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: pathname.includes("/search") ? PRIMARY_COLOR : "#999" },
          ]}
        >
          Buscar
        </Text>
      </TouchableOpacity>

      {/* Tab Carrinho */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push("/(panel)/cart/page")}
      >
        <Ionicons
          name={pathname.includes("/cart") ? "cart" : "cart-outline"}
          size={24}
          color={pathname.includes("/cart") ? PRIMARY_COLOR : "#999"}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: pathname.includes("/cart") ? PRIMARY_COLOR : "#999" },
          ]}
        >
          Carrinho
        </Text>
        {/* Badge com a contagem de itens */}
        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Tab Favoritos */}
      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="heart-outline" size={24} color="#999" />
        <Text style={styles.tabLabel}>Favoritos</Text>
      </TouchableOpacity>

      {/* Tab Perfil */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push("/(panel)/profile/page")}
      >
        <Ionicons
          name={pathname.includes("/profile") ? "person" : "person-outline"}
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
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    right: 18,
    top: -3,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
