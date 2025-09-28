import { router } from 'expo-router';
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Category = {
    id: string;
    name: string;
    image: string;
};

type CategoryItemProps = {
    item: Category;
};

const CategoryItem = ({ item }: CategoryItemProps) => {
    const handlePress = () => {
        router.push({
            pathname: "/(panel)/category/[id]", 
            params: { 
                id: item.id,    
                name: item.name  
            }
        });
    };

    return (
        <TouchableOpacity style={styles.categoryItem} onPress={handlePress}> 
            <View style={styles.categoryImageContainer}>
                <Image source={{ uri: item.image }} style={styles.categoryImage} resizeMode="contain" />
            </View>
            <Text style={styles.categoryText}>{item.name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    categoryItem: {
        width: "30%",
        alignItems: "center",
        marginBottom: 20,
    },
    categoryImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#F8F9FA",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        padding: 10,
    },
    categoryImage: {
        width: "100%",
        height: "100%",
    },
    categoryText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
        textAlign: "center",
    },
});

export default CategoryItem;