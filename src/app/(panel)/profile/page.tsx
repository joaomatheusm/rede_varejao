import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TabBar />
    </SafeAreaView>
  );
};

export default ProfileScreen;
