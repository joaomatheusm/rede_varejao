import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartListItem from '../../../components/CartListItem';
import TabBar from '../../../components/TabBar';
import { useCart } from '../../../contexts/CartContext';

const PRIMARY_COLOR = "#FF4757";

const CartScreen = () => {
    const { items, totalItems, totalPrice, loading, removeFromCart, updateQuantity } = useCart();

    return (
        <>
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <View style={styles.header}>
                    <Text style={styles.title}>Meu Carrinho</Text>
                </View>

                {loading && items.length === 0 ? (
                    <ActivityIndicator style={{ flex: 1 }} size="large" color={PRIMARY_COLOR} />
                ) : (
                    <FlatList
                        data={items}
                        renderItem={({ item }) => (
                            <CartListItem
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}         
                                loading={loading}
                            />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
                            </View>
                        }
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 180 }}
                    />
                )}
                
                {items.length > 0 && (
                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.footerText}>Total ({totalItems} itens)</Text>
                            <Text style={styles.totalPrice}>R$ {totalPrice.toFixed(2).replace('.', ',')}</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutButton} onPress={() => { /* Lógica de checkout */ }} disabled={loading}>
                            <Text style={styles.checkoutButtonText}>Finalizar Pedido</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
            <TabBar />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '50%',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        padding: 16,
        paddingBottom: 90,
        backgroundColor: '#FFF',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    footerText: {
        fontSize: 16,
        color: '#555',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    checkoutButton: {
        backgroundColor: PRIMARY_COLOR,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CartScreen;