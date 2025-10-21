import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddressItem from "../../../../components/AddressItem";
import TabBar from "../../../../components/TabBar";
import { useAuth } from "../../../../contexts/AuthContext";
import { Endereco, enderecoService } from "../../../../lib/enderecoService";

const PRIMARY_COLOR = "#FF4757";

const AddressListScreen: React.FC = () => {
  const { user } = useAuth();
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Endereco | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarEnderecos = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const enderecosData = await enderecoService.buscarEnderecosPorUsuario(user.id);
      setEnderecos(enderecosData);

      const selectedId = selectedAddress?.id;
      const
 
novoEnderecoSelecionado = 
        enderecosData.find(e => e.id === selectedId) || // Tenta manter o selecionado
        enderecosData[0] || // Se não puder, pega o primeiro
        null; // Se não houver, é nulo
      
      setSelectedAddress(novoEnderecoSelecionado);

    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
      Alert.alert("Erro", "Não foi possível carregar os endereços.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, selectedAddress?.id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      carregarEnderecos();
    }, [carregarEnderecos])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    carregarEnderecos();
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleAddNewAddress = () => {
    router.push("/(panel)/cart/address/page");
  };

  const handleSelectAddress = (endereco: Endereco) => {
    setSelectedAddress(endereco);
  };

  const handleEditAddress = (endereco: Endereco) => {
    router.push({
      pathname: "/(panel)/cart/address/page",
      params: { editId: endereco.id?.toString() },
    });
  };

  const handleDeleteAddress = async (endereco: Endereco) => {
    if (!endereco.id) return;
    Alert.alert("Excluir Endereço", "Tem certeza que deseja excluir este endereço?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir", style: "destructive",
        onPress: async () => {
          try {
            await enderecoService.deletarEndereco(endereco.id);
            Alert.alert("Sucesso", "Endereço excluído com sucesso!");
            carregarEnderecos(); // Recarrega a lista
          } catch (error) {
            console.error("Erro ao excluir endereço:", error);
            Alert.alert("Erro", "Não foi possível excluir o endereço.");
          }
        },
      },
    ]);
  };

  const handleContinue = () => {
    if (!selectedAddress) {
      Alert.alert("Atenção", "Selecione um endereço para continuar.");
      return;
    }
    router.push({
        pathname: "/(panel)/cart/review/page",
        params: { enderecoId: selectedAddress.id.toString() }
    });
  };

  const renderAddressItem = ({ item }: { item: Endereco }) => (
    <AddressItem
      endereco={item}
      isSelected={selectedAddress?.id === item.id}
      onPress={() => handleSelectAddress(item)}
      onEdit={() => handleEditAddress(item)}
      onDelete={() => handleDeleteAddress(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="location-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Nenhum endereço cadastrado</Text>
      <Text style={styles.emptySubtitle}>
        Adicione um endereço para continuar com seu pedido
      </Text>
      <TouchableOpacity
        style={styles.addFirstButton}
        onPress={handleAddNewAddress}
      >
        <Text style={styles.addFirstButtonText}>Adicionar Endereço</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && enderecos.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Endereços de Entrega</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={styles.loadingText}>Carregando endereços...</Text>
        </View>
        <TabBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Endereços de Entrega</Text>
        <TouchableOpacity
          onPress={handleAddNewAddress}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={enderecos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAddressItem}
        ListEmptyComponent={enderecos.length === 0 ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[PRIMARY_COLOR]}
          />
        }
        style={{ flex: 1 }}
      />

      {enderecos.length > 0 && (
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.addNewButton}
            onPress={handleAddNewAddress}
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={PRIMARY_COLOR}
            />
            <Text style={styles.addNewButtonText}>
              Adicionar Novo Endereço
            </Text>
          </TouchableOpacity>

          {selectedAddress && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>
                Entregar neste endereço
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      )}
      <TabBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
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
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    marginTop: "30%",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  addFirstButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addFirstButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomSection: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    marginBottom: 12,
  },
  addNewButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});


export default AddressListScreen;