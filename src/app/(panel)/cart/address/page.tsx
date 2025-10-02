import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddressForm from "../../../../components/AddressForm";
import { useAuth } from "../../../../contexts/AuthContext";
import { enderecoService } from "../../../../lib/enderecoService";

const PRIMARY_COLOR = "#FF4D4D";

const AddressScreen = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmitAddress = async (formData: any) => {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    console.log("Dados do formulário:", formData);
    console.log("ID do usuário:", user.id);
    console.log("Email do usuário:", user.email);

    setLoading(true);
    try {
      // Usar o UUID diretamente como string
      const dadosEndereco = {
        ...formData,
        usuario_id: user.id, // Usar UUID diretamente
      };

      console.log("Dados para salvar:", dadosEndereco);

      const endereco = await enderecoService.criarEndereco(dadosEndereco);

      Alert.alert("Sucesso", "Endereço cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            // Navegar de volta para o carrinho ou para uma tela de confirmação
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar o endereço. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Endereço de Entrega</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <AddressForm
          onSubmit={handleSubmitAddress}
          loading={loading}
          submitButtonText="Salvar e Continuar"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
});

export default AddressScreen;
