import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { Endereco, enderecoService } from "../../../../lib/enderecoService";

const PRIMARY_COLOR = "#FF4D4D";

const AddressScreen = () => {
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Endereco | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const editId = params.editId as string;

  useEffect(() => {
    if (editId) {
      loadAddressForEdit();
    }
  }, [editId]);

  const loadAddressForEdit = async () => {
    if (!editId) return;

    setLoading(true);
    try {
      const endereco = await enderecoService.buscarEnderecoPorId(
        parseInt(editId)
      );
      setEditingAddress(endereco);
      setIsEditing(true);
    } catch (error) {
      console.error("Erro ao carregar endereço para edição:", error);
      Alert.alert("Erro", "Não foi possível carregar o endereço para edição.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAddress = async (formData: any) => {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    setLoading(true);
    try {
      if (isEditing && editingAddress?.id) {
        // Editar endereço existente
        const dadosAtualizados = {
          ...formData,
          data_ult_atualizacao: new Date().toISOString(),
        };

        await enderecoService.atualizarEndereco(
          editingAddress.id,
          dadosAtualizados
        );

        Alert.alert("Sucesso", "Endereço atualizado com sucesso!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        // Criar novo endereço
        const dadosEndereco = {
          ...formData,
          usuario_id: user.id,
        };

        await enderecoService.criarEndereco(dadosEndereco);

        Alert.alert("Sucesso", "Endereço cadastrado com sucesso!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }
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

  if (loading && isEditing) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {isEditing ? "Editar Endereço" : "Novo Endereço"}
          </Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={styles.loadingText}>Carregando endereço...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? "Editar Endereço" : "Novo Endereço"}
        </Text>
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
          submitButtonText={
            isEditing ? "Atualizar Endereço" : "Salvar e Continuar"
          }
          initialData={editingAddress || undefined}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});

export default AddressScreen;
