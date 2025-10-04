import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductItem from '../../../components/ProductItem';
import TabBar from '../../../components/TabBar';
import { Produto, searchProdutos } from '../../../lib/produtoService';

const PRIMARY_COLOR = "#FF4757";

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!query) {
            setResults([]);
            return;
        }
        setLoading(true);
        setHasSearched(true);
        const searchResults = await searchProdutos(query);
        setResults(searchResults);
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <View style={styles.header}>
                <Text style={styles.title}>Buscar Produtos</Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    placeholder="O que você procura?"
                    style={styles.searchInput}
                    placeholderTextColor="#999"
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
            </View>

            {loading ? (
                <ActivityIndicator style={{ flex: 1 }} size="large" color={PRIMARY_COLOR} />
            ) : (
                <FlatList
                    data={results}
                    renderItem={({ item }) => <ProductItem item={item} variant="verticalGrid" />}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    ListEmptyComponent={
                        <View style={styles.resultsContainer}>
                            <Text style={styles.placeholderText}>
                                {hasSearched ? 'Nenhum produto encontrado.' : 'Digite para buscar por produtos.'}
                            </Text>
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        margin: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: '#333',
    },
    resultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 16,
        color: '#AAA',
    },
});

export default SearchScreen;