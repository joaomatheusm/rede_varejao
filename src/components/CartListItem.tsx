import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CartItem } from '../lib/cartService';

const PRIMARY_COLOR = "#FF4757";

type CartListItemProps = {
    item: CartItem;
    onUpdateQuantity: (cartItemId: number, newQuantity: number) => void;
    onRemove: (cartItemId: number) => void;
    loading: boolean;
};

const CartListItem = ({ item, onUpdateQuantity, onRemove, loading }: CartListItemProps) => {
    const itemPrice = item.produto.is_oferta && item.produto.preco_oferta
        ? item.produto.preco_oferta
        : item.produto.preco;

    const handleRemoveItem = useCallback(() => {
        Alert.alert("Remover Item", `Tem certeza que deseja remover "${item.produto.nome}" do carrinho?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Remover", style: "destructive", onPress: () => onRemove(item.id) }
            ]
        );
    }, [item.id, item.produto.nome, onRemove]);

    return (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.produto.imagem_url }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.produto.nome}</Text>
                <Text style={styles.itemPrice}>R$ {itemPrice.toFixed(2).replace('.', ',')}</Text>
            </View>
            <View style={styles.quantityControls}>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => item.quantidade === 1 ? handleRemoveItem() : onUpdateQuantity(item.id, item.quantidade - 1)}
                    disabled={loading}
                >
                    <Ionicons name="remove-circle-outline" size={24} color={PRIMARY_COLOR} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantidade}</Text>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => onUpdateQuantity(item.id, item.quantidade + 1)}
                    disabled={loading}
                >
                    <Ionicons name="add-circle-outline" size={24} color={PRIMARY_COLOR} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={handleRemoveItem} disabled={loading}>
                <Ionicons name="trash-outline" size={22} color="#888" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#EEE',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  controlButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  removeButton: {
    padding: 6,
  },
});

export default CartListItem;