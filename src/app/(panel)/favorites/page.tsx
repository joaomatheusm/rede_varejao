import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductItem from '../../../components/ProductItem';
import TabBar from '../../../components/TabBar';
import { useFavorites } from '../../../contexts/FavoritesContext';

const PRIMARY_COLOR = "#FF4757";

const FavoritesScreen = () => {
    const { favoriteProducts, loading } = useFavorites();

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <View style={styles.header}>
                <Text style={styles.title}>Meus Favoritos</Text>
            </View>

            {loading ? (
                <ActivityIndicator style={{ flex: 1 }} size="large" color={PRIMARY_COLOR} />
            ) : (
                <FlatList
                    data={favoriteProducts}
                    renderItem={({ item }) => <ProductItem item={item} variant="verticalGrid" />}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Você ainda não tem favoritos.</Text>
                            <Text style={styles.emptySubtext}>Clique no coração dos produtos para adicioná-los aqui.</Text>
                        </View>
                    }
                    contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 100 }}
                />
            )}
            
            <TabBar />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
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
        paddingTop: '40%',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#AAA',
        marginTop: 8,
    },
});

export default FavoritesScreen;