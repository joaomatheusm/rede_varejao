import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoryItem from "../../../components/CategoryItem";
import ProductItem from "../../../components/ProductItem";
import TabBar from "../../../components/TabBar";
import { fetchCategorias } from "../../../lib/categoriaService";
import { fetchProdutos, Produto } from "../../../lib/produtoService";
import { styles } from "../../../styles/home";

const PRIMARY_COLOR = "#FF4757";

const HomeScreen = () => {
  const [dailyDeals, setDailyDeals] = useState<Produto[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [produtosData, categoriasData] = await Promise.all([
        fetchProdutos(),
        fetchCategorias(),
      ]);
      setDailyDeals(produtosData || []);
      setCategories(categoriasData || []);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{ uri: "" }}
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={26} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Banner */}
          <ImageBackground
            source={{
              uri: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            }}
            style={styles.specialOfferBanner}
            imageStyle={{ borderRadius: 16 }}
          >
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>Oferta Especial</Text>
              <Text style={styles.bannerSubtitle}>Até 30% de desconto</Text>
            </View>
          </ImageBackground>

          {/* Categorias */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((item) => (
                <CategoryItem
                  key={item.id}
                  item={{
                    id: item.id.toString(),
                    name: item.nome,
                    image: item.imagem_url,
                  }}
                />
              ))}
            </View>
          </View>

          {/* Ofertas do Dia */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ofertas do Dia</Text>
            {loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 150,
                }}
              >
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
              </View>
            ) : (
              <FlatList
                data={dailyDeals}
                renderItem={({ item }) => (
                  <ProductItem item={item} variant="horizontalScroll" />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 10, paddingLeft: 8 }}
              />
            )}
          </View>
        </View>
      </ScrollView>

      <TabBar />
    </SafeAreaView>
  );
};

export default HomeScreen;
