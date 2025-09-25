import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

// Mova os tipos que o componente precisa
type Deal = {
    id: string;
    name: string;
    price: string;
    image: string;
};

type DealItemProps = {
    item: Deal;
};

const DealItem = ({ item }: DealItemProps) => (
    <TouchableOpacity style={styles.dealItem}>
        <Image source={{ uri: item.image }} style={styles.dealImage} resizeMode="cover" />
        <Text style={styles.dealName}>{item.name}</Text>
        <Text style={styles.dealPrice}>{item.price}</Text>
    </TouchableOpacity>
);

// Mova APENAS os estilos que este componente usa
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
    dealPrice: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
});

export default DealItem;