import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MenuItem } from "../../../components/MenuItem";
import TabBar from "../../../components/TabBar";
import { styles } from "./styles";

const menuItems = [
  { icon: "person-outline" as const, text: "Meus Dados", screen: "UserData" },
  {
    icon: "receipt-outline" as const,
    text: "Histórico de Pedidos",
    screen: "OrderHistory",
  },
];

const ProfileScreen: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Sair da Conta", "Tem certeza que deseja sair da sua conta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            // Limpar todos os dados de autenticação e sessão
            await AsyncStorage.multiRemove([
              "userToken",
              "userId",
              "userEmail",
              "userData",
              "authToken",
              "refreshToken",
              "isLoggedIn",
              "cartItems",
              "favoriteItems",
              "userPreferences",
              "lastLogin",
            ]);

            // Log para debug
            console.log("✅ Logout realizado com sucesso - Sessão limpa");

            // Redirecionar para a tela de login/inicial
            router.replace("/(auth)/signin/page");
          } catch (error) {
            console.error("❌ Erro ao fazer logout:", error);
            Alert.alert(
              "Erro",
              "Ocorreu um erro ao sair da conta. Tente novamente.",
              [{ text: "OK" }]
            );
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.screenTitle}>Perfil</Text>

          {/* Informações do Usuário */}
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
              }}
              style={styles.avatar}
            />
            <Text style={styles.profileName}>Teste</Text>
            <Text style={styles.profileEmail}>Teste@email.com</Text>
          </View>

          {/* Menu de opções */}
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <MenuItem
                key={item.text}
                icon={item.icon}
                text={item.text}
                onPress={() => console.log("Abrir", item.screen)}
              />
            ))}
          </View>

          {/* Botão de Sair */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TabBar />
    </SafeAreaView>
  );
};

export default ProfileScreen;
