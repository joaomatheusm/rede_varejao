import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { orderService, Pedido } from '../../../../lib/orderService';

const PRIMARY_COLOR = "#FF4757";

// Função auxiliar para pegar as cores baseado nos status do banco
const getStatusColors = (statusDescricao: string) => {
    let backgroundColor = '#FFF3E0';
    let borderColor = '#FFE0B3';
    let textColor = '#BF8F00';

    if (statusDescricao === 'Confirmado') {
        backgroundColor = '#E0E7FF';
        borderColor = '#C7D2FE';
        textColor = '#4338CA';
    } else if (statusDescricao === 'Entregue') {
        backgroundColor = '#D1FAE5';
        borderColor = '#A7F3D0';
        textColor = '#065F46';
    } else if (statusDescricao === 'Cancelado') {
        backgroundColor = '#FEE2E2';
        borderColor = '#FECACA';
        textColor = '#991B1B';
    }

    return { backgroundColor, borderColor, textColor };
};


// Componente para renderizar cada pedido na lista
const OrderItemCard: React.FC<{ pedido: Pedido }> = ({ pedido }) => {
  const dataPedido = new Date(pedido.data_criacao).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const statusColors = getStatusColors(pedido.status_descricao);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Pedido #{pedido.id}</Text>
        <Text style={styles.cardDate}>{dataPedido}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={[
            styles.statusBadge, 
            { 
                backgroundColor: statusColors.backgroundColor, 
                borderColor: statusColors.borderColor 
            }
        ]}>
            <Text style={[
                styles.statusText,
                { color: statusColors.textColor }
            ]}>
                {pedido.status_descricao}
            </Text>
        </View>

        <Text style={styles.cardLabel}>Itens:</Text>
        {pedido.itens.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Image source={{ uri: item.produto.imagem_url }} style={styles.itemImage} />
            <Text style={styles.itemText}>
              {item.quantidade}x {item.produto.nome}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardTotalLabel}>Total</Text>
        <Text style={styles.cardTotalValue}>R$ {pedido.valor_total.toFixed(2).replace('.', ',')}</Text>
      </View>
    </View>
  );
};

const OrderHistoryScreen = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.fetchOrders();
      setPedidos(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar seu histórico de pedidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <> 
      <Stack.Screen options={{ headerShown: false }} /> 

      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Histórico de Pedidos</Text>
          <View style={{ width: 26 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          </View>
        ) : (
          <FlatList
            data={pedidos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <OrderItemCard pedido={item} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Sem pedidos por aqui</Text>
                <Text style={styles.emptySubtext}>Você ainda não fez nenhum pedido.</Text>
              </View>
            }
            contentContainerStyle={styles.listContainer}
          />
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  backButton: { padding: 4 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '30%',
  },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#AAA', marginTop: 8 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardDate: { fontSize: 14, color: '#888' },
  cardBody: { padding: 16 },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardLabel: { fontSize: 14, color: '#888', marginBottom: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  itemImage: { width: 30, height: 30, borderRadius: 4, marginRight: 8, backgroundColor: '#EEE' },
  itemText: { fontSize: 14, color: '#555' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardTotalLabel: { fontSize: 16, fontWeight: '500', color: '#333' },
  cardTotalValue: { fontSize: 18, fontWeight: 'bold', color: PRIMARY_COLOR },
});

export default OrderHistoryScreen;