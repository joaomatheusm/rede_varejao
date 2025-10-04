import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TabBar from "../../../../src/components/TabBar";
import ProductItem from "../../../components/ProductItem";
import {
  fetchProdutosPorCategoria,
  Produto,
} from "../../../lib/produtoService";
import { styles } from "../../../styles/category";

const PRIMARY_COLOR = "#FF4757";

const CategoryScreen = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!id) return;
    async function loadProducts() {
      setLoading(true);
      const productsData = await fetchProdutosPorCategoria(id);
      setProducts(productsData || []);
      setLoading(false);
    }
    loadProducts();
  }, [id]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) {
      return products;
    }
    return products.filter((product) =>
      product.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name || "Categoria"}</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon}/>
        <TextInput
          placeholder={`Buscar em ${name || "Categoria"}...`}
          style={styles.searchInput}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
            </View>
          }
          contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]}
        />
      )}

      <TabBar />
    </SafeAreaView>
  );
};

export default CategoryScreen;