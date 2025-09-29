import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MenuItem } from "../../../components/MenuItem";
import TabBar from "../../../components/TabBar";
import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "../../../lib/supabase";
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
  const { user, setAuth } = useAuth();

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
            // Fazer logout no Supabase
            const { error } = await supabase.auth.signOut();

            if (error) {
              throw error;
            }

            // Limpar o contexto de autenticação
            setAuth(null);

            // Limpar dados locais opcionais (carrinho, favoritos, etc.)
            await AsyncStorage.multiRemove([
              "cartItems",
              "favoriteItems",
              "userPreferences",
            ]);

            console.log("✅ Logout realizado com sucesso");

            // O redirecionamento será feito automaticamente pelo _layout.tsx
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
            <Text style={styles.profileName}>
              {user?.user_metadata?.full_name ||
                user?.email?.split("@")[0] ||
                "Usuário"}
            </Text>
            <Text style={styles.profileEmail}>
              {user?.email || "email@exemplo.com"}
            </Text>
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
