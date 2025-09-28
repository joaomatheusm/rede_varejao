import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Produto } from '../lib/produtoService';

const PRIMARY_COLOR = "#FF4757";

type ProductItemProps = {
    item: Produto;
    variant?: 'verticalGrid' | 'horizontalScroll'; 
};

const ProductItem = ({ item, variant = 'verticalGrid' }: ProductItemProps) => {
    const cardStyle = variant === 'horizontalScroll' ? styles.horizontalCard : styles.verticalCard;

    return (
        <TouchableOpacity style={[styles.baseCard, cardStyle]}>
            {item.is_oferta && item.preco_oferta !== null && (
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>OFERTA</Text>
                </View>
            )}
            
            <Image source={{ uri: item.imagem_url }} style={styles.productImage} resizeMode="contain" />
            <Text style={styles.productName} numberOfLines={2}>{item.nome}</Text>
            
            <View style={styles.priceRow}>
                {item.is_oferta && item.preco_oferta !== null ? (
                    <View>
                        <Text style={styles.originalPrice}>R$ {item.preco.toFixed(2).replace('.', ',')}</Text>
                        <Text style={styles.offerPrice}>R$ {item.preco_oferta.toFixed(2).replace('.', ',')}</Text>
                    </View>
                ) : (
                    <Text style={styles.normalPrice}>R$ {item.preco.toFixed(2).replace('.', ',')}</Text>
                )}
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        margin: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        position: 'relative',
    },
    verticalCard: {
        flex: 1,
        maxWidth: '46%',
    },
    horizontalCard: {
        width: 150,
        marginRight: 10,
    },
    productImage: { 
        width: '100%', 
        height: 100, 
        alignSelf: 'center', 
        marginBottom: 8,
    },
    productName: { 
        fontSize: 14, 
        fontWeight: '500', 
        color: '#333',
        marginBottom: 8,
    },
    priceRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
    },
    normalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    originalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    offerPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: { 
        backgroundColor: '#20C997', 
        width: 28, 
        height: 28, 
        borderRadius: 14, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    discountBadge: { 
        position: 'absolute', 
        top: 8,
        right: 8,
        backgroundColor: PRIMARY_COLOR, 
        borderRadius: 8, 
        paddingHorizontal: 6, 
        paddingVertical: 2, 
        zIndex: 1, 
    },
    discountText: { 
        color: '#FFF', 
        fontSize: 10, 
        fontWeight: 'bold', 
    },
});

export default ProductItem;