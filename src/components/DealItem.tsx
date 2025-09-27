import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Deal = {
    id: string;
    name: string;
    originalPrice: number;      
    offerPrice?: number;     
    image: string;
};

type DealItemProps = {
    item: Deal;
};

const DealItem = ({ item }: DealItemProps) => (
    <TouchableOpacity style={styles.dealItem}>
        <Image source={{ uri: item.image }} style={styles.dealImage} resizeMode="cover" />
        <Text style={styles.dealName}>{item.name}</Text>

        {item.offerPrice ? (
            <View style={styles.priceContainer}>
                <Text style={styles.originalPrice}>R$ {item.originalPrice.toFixed(2)}</Text>
                <Text style={styles.offerPrice}>R$ {item.offerPrice.toFixed(2)}</Text>
            </View>
        ) : (
            <Text style={styles.offerPrice}>R$ {item.originalPrice.toFixed(2)}</Text>
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    dealItem: {
        backgroundColor: "#F8F9FA",
        borderRadius: 12,
        padding: 10,
        marginRight: 15,
        width: 140,
        alignItems: 'center',
    },
    dealImage: {
        width: '100%',
        height: 90,
        borderRadius: 8,
        marginBottom: 10,
    },
    dealName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    originalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 6,
    },
    offerPrice: {
        fontSize: 13,
        color: '#FF4757',
        fontWeight: 'bold',
    },
});

export default DealItem;
