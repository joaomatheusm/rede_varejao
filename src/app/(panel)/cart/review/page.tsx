import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../../contexts/AuthContext";
import { useCart } from "../../../../contexts/CartContext";
import { CartItem } from "../../../../lib/cartService";
import { Endereco, enderecoService } from "../../../../lib/enderecoService";

const PRIMARY_COLOR = "#FF4757";
const SECONDARY_COLOR = "#FF9800";

const ReviewCartItem: React.FC<{ item: CartItem }> = ({ item }) => {
  const itemPrice =
    item.produto.is_oferta && item.produto.preco_oferta
      ? item.produto.preco_oferta
      : item.produto.preco;

  return (
    <View style={styles.reviewItemContainer}>
      <Image
        source={{ uri: item.produto.imagem_url }}
        style={styles.reviewItemImage}
      />
      <View style={styles.reviewItemDetails}>
        <Text style={styles.reviewItemName} numberOfLines={2}>
          {item.produto.nome}
        </Text>
        <Text style={styles.reviewItemPrice}>R$ {itemPrice.toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.reviewItemQuantity}>Qtd: {item.quantidade}</Text>
      </View>
      <View style={styles.reviewItemTotal}>
        <Text style={styles.reviewItemTotalText}>
          R$ {(itemPrice * item.quantidade).toFixed(2).replace('.', ',')}
        </Text>
      </View>
    </View>
  );
};

const ReviewScreen: React.FC = () => {
  const { user } = useAuth();
  const { items, totalItems, totalPrice, loading, createOrder } = useCart();
  
  const { enderecoId } = useLocalSearchParams<{ enderecoId: string }>();

  const [selectedAddress, setSelectedAddress] = useState<Endereco | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [finalizing, setFinalizing] = useState(false);

  const subtotal = totalPrice;
  const deliveryFee = 8.0;
  const total = subtotal + deliveryFee;
  const estimatedTime = "45-60 min";

  useEffect(() => {
    const loadSelectedAddress = async () => {
      if (!enderecoId) {
        Alert.alert("Erro", "Nenhum endereço foi selecionado.", [{ text: "OK", onPress: () => router.back() }]);
        return;
      }
      setLoadingAddress(true);
      try {
        const endereco = await enderecoService.buscarEnderecoPorId(parseInt(enderecoId, 10));
        if (endereco) {
          setSelectedAddress(endereco);
        } else {
          throw new Error('Endereço não encontrado');
        }
      } catch (error) {
        console.error("Erro ao carregar endereço:", error);
        Alert.alert("Erro", "Não foi possível carregar o endereço de entrega.", [{ text: "OK", onPress: () => router.back() }]);
      } finally {
        setLoadingAddress(false);
      }
    };
    
    loadSelectedAddress();
  }, [enderecoId]);

  const handleGoBack = () => {
    router.back();
  };

  const handleChangeAddress = () => {
    router.push("/(panel)/cart/address/list");
  };

  const handleFinalizePedido = () => {
    if (!selectedAddress) {
      Alert.alert("Atenção", "Endereço não selecionado.");
      return;
    }

    Alert.alert(
      "Confirmar Pedido",
      `Total: R$ ${total.toFixed(2).replace('.', ',')}\n\nForma de Pagamento: Pagar na Entrega`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => confirmAndCreateOrder(),
        },
      ]
    );
  };

  const confirmAndCreateOrder = async () => {
    setFinalizing(true);
    try {
      const metodoPagamento = "Pagar na Entrega";
      
      const newOrderId = await createOrder(
        selectedAddress!.id!, 
        metodoPagamento, 
        deliveryFee
      );

      if (newOrderId) {
        Alert.alert(
          "Pedido Confirmado!",
          `Seu pedido #${newOrderId} foi recebido e já está sendo preparado.`,
          [
            {
              text: "OK",
              onPress: () => router.replace("/(panel)/home/page"),
            },
          ]
        );
      } else {
        throw new Error("Não foi possível criar o pedido.");
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      Alert.alert("Erro", `Não foi possível finalizar seu pedido. ${error instanceof Error ? error.message : ''}`);
    } finally {
      setFinalizing(false);
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <ReviewCartItem item={item} />
  );

  if (loadingAddress || (loading && items.length === 0)) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Revisão do Pedido</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Revisão do Pedido</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Carrinho Vazio</Text>
          <Text style={styles.emptySubtitle}>
            Seu pedido foi finalizado ou seu carrinho está vazio.
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.replace("/(panel)/home/page")}
          >
            <Text style={styles.shopButtonText}>Continuar Comprando</Text>
          </TouchableOpacity>
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
        <Text style={styles.title}>Revisão do Pedido</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seção de Produtos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cart" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.sectionTitle}>
              Produtos ({totalItems} itens)
            </Text>
          </View>
          <View style={styles.productsContainer}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCartItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>

        {/* Seção de Endereço */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
          </View>
          {selectedAddress ? (
            <View style={styles.addressContainer}>
              <View style={styles.addressInfo}>
                <Text style={styles.addressLabel}>{selectedAddress.apelido}</Text>
                <Text style={styles.addressText}>{selectedAddress.logradouro}, {selectedAddress.numero}</Text>
                <Text style={styles.addressSubtext}>{selectedAddress.bairro}, {selectedAddress.cidade} - {selectedAddress.estado}</Text>
                <Text style={styles.addressSubtext}>CEP: {selectedAddress.cep}</Text>
              </View>
              <TouchableOpacity style={styles.changeButton} onPress={handleChangeAddress}>
                <Text style={styles.changeButtonText}>Alterar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addAddressButton} onPress={handleChangeAddress}>
              <Text style={styles.addAddressText}>Selecionar Endereço</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Seção de Tempo de Entrega */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color={SECONDARY_COLOR} />
            <Text style={styles.sectionTitle}>Tempo de Entrega</Text>
          </View>
          <View style={styles.deliveryTimeContainer}>
            <Text style={styles.deliveryTime}>{estimatedTime}</Text>
            <Text style={styles.deliveryNote}>Tempo estimado para sua região</Text>
          </View>
        </View>

        {/* Seção de Resumo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
          </View>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2).replace('.', ',')}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxa de entrega</Text>
              <Text style={styles.summaryValue}>R$ {deliveryFee.toFixed(2).replace('.', ',')}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R$ {total.toFixed(2).replace('.', ',')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Botão Fixo */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.finalizeButton,
            (finalizing || !selectedAddress) && styles.finalizeButtonDisabled,
          ]}
          onPress={handleFinalizePedido}
          disabled={finalizing || !selectedAddress || loading}
        >
          {finalizing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.finalizeButtonText}>Confirmar Pedido</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
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
  shopButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#fff",
    marginVertical: 4,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  productsContainer: {
    paddingHorizontal: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  addressSubtext: {
    fontSize: 13,
    color: "#888",
    marginBottom: 1,
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 6,
  },
  changeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  addAddressButton: {
    marginHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    alignItems: "center",
  },
  addAddressText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "600",
  },
  deliveryTimeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff3e0",
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffe0b3",
  },
  deliveryTime: {
    fontSize: 18,
    fontWeight: "bold",
    color: SECONDARY_COLOR,
    marginBottom: 4,
  },
  deliveryNote: {
    fontSize: 12,
    color: "#bf8f00",
  },
  summaryContainer: {
    paddingHorizontal: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  bottomSpace: {
    height: 100, 
  },
  bottomContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  finalizeButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  finalizeButtonDisabled: {
    opacity: 0.6,
  },
  finalizeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  finalizeButtonPrice: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    position: 'absolute',
    right: 16,
  },
  reviewItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  reviewItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  reviewItemDetails: {
    flex: 1,
  },
  reviewItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  reviewItemPrice: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  reviewItemQuantity: {
    fontSize: 12,
    color: "#888",
  },
  reviewItemTotal: {
    alignItems: "flex-end",
  },
  reviewItemTotalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
});

export default ReviewScreen;