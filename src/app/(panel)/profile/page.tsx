import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TabBar from "../../../components/TabBar";
import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "../../../lib/supabase";
import { styles } from "../../../styles/profile";

const { width } = Dimensions.get("window");
const PRIMARY_COLOR = "#4CAF50";
const SECONDARY_COLOR = "#FF9800";
const ACCENT_COLOR = "#2196F3";

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, setAuth } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuSections = [
    {
      title: "Conta",
      items: [
        {
          icon: "person-outline",
          text: "Meus Dados",
          screen: "UserData",
          color: PRIMARY_COLOR,
          description: "Editar informações pessoais",
        },
        {
          icon: "location-outline",
          text: "Meus Endereços",
          screen: "Addresses",
          color: SECONDARY_COLOR,
          description: "Gerenciar endereços de entrega",
        },
      ],
    },
    {
      title: "Pedidos",
      items: [
        {
          icon: "receipt-outline",
          text: "Histórico de Pedidos",
          screen: "OrderHistory",
          color: PRIMARY_COLOR,
          description: "Ver pedidos anteriores",
        },
        {
          icon: "heart-outline",
          text: "Favoritos",
          screen: "Favorites",
          color: "#E91E63",
          description: "Produtos que você gosta",
        },
      ],
    },
    {
      title: "Configurações",
      items: [
        {
          icon: "notifications-outline",
          text: "Notificações",
          screen: "Notifications",
          color: SECONDARY_COLOR,
          description: "Gerenciar notificações",
          hasSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled,
        },
        {
          icon: "moon-outline",
          text: "Modo Escuro",
          screen: "DarkMode",
          color: "#9C27B0",
          description: "Tema escuro/claro",
          hasSwitch: true,
          switchValue: darkMode,
          onSwitchChange: setDarkMode,
        },
      ],
    },
    {
      title: "Suporte",
      items: [
        {
          icon: "help-circle-outline",
          text: "Central de Ajuda",
          screen: "Help",
          color: ACCENT_COLOR,
          description: "Dúvidas frequentes",
        },
        {
          icon: "chatbubbles-outline",
          text: "Fale Conosco",
          screen: "Contact",
          color: "#FF5722",
          description: "Entre em contato",
        },
        {
          icon: "star-outline",
          text: "Avaliar App",
          screen: "Rate",
          color: "#FFC107",
          description: "Deixe sua avaliação",
        },
      ],
    },
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);

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
    } catch (error) {
      console.error("❌ Erro ao fazer logout:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao sair da conta. Tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  const getUserInitials = () => {
    const name =
      user?.user_metadata?.full_name || user?.email?.split("@")[0] || "U";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.text}
      style={styles.menuItem}
      onPress={() => {
        if (item.screen === "Addresses") {
          router.push("/(panel)/cart/address/list");
        } else if (item.screen === "Favorites") {
          router.push("/(panel)/favorites/page");
        } else {
          console.log("Abrir", item.screen);
        }
      }}
      activeOpacity={0.7}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: item.color + "15" }]}
      >
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemText}>{item.text}</Text>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
      </View>
      {item.hasSwitch ? (
        <Switch
          value={item.switchValue}
          onValueChange={item.onSwitchChange}
          trackColor={{ false: "#767577", true: item.color + "40" }}
          thumbColor={item.switchValue ? item.color : "#f4f3f4"}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header com Avatar */}
        <View style={styles.header}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getUserInitials()}</Text>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.user_metadata?.full_name ||
                user?.email?.split("@")[0] ||
                "Usuário"}
            </Text>
            <Text style={styles.userEmail}>
              {user?.email || "email@exemplo.com"}
            </Text>
          </View>
        </View>

        {/* Seções do Menu */}
        {menuSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuContainer}>
              {section.items.map(renderMenuItem)}
            </View>
          </View>
        ))}

        {/* Botão de Sair */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Modal de Confirmação de Logout */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="log-out-outline" size={48} color="#FF4757" />
            </View>
            <Text style={styles.modalTitle}>Sair da Conta</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja sair da sua conta? Você precisará fazer
              login novamente.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmLogout}
              >
                <Text style={styles.modalConfirmText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TabBar />
    </SafeAreaView>
  );
};

export default ProfileScreen;
