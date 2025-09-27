import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    ImageBackground,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoryItem from "../../../components/CategoryItem";
import DealItem from "../../../components/DealItem";
import { fetchCategorias } from "../../../lib/categoriaService";
import { fetchProdutos } from "../../../lib/produtoService";
import { styles } from "./styles";

const PRIMARY_COLOR = "#FF4757";

const HomeScreen = () => {
    const [dailyDeals, setDailyDeals] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const [produtosData, categoriasData] = await Promise.all([
                fetchProdutos(),
                fetchCategorias()
            ]);
            setDailyDeals(produtosData || []);
            setCategories(categoriasData || []);
            setLoading(false);
        }
        loadData();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Image
                            source={{ uri: "https://logopng.com.br/logos/mercado-pago-53.png" }}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <TouchableOpacity>
                            <Ionicons name="notifications-outline" size={26} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* Search */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Buscar produtos..."
                            style={styles.searchInput}
                            placeholderTextColor="#999"
                        />
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
                                        id: item.id,
                                        name: item.nome,       // adapte para o nome correto da coluna
                                        image: item.imagem_url // adapte para o nome correto da coluna
                                    }}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Ofertas do Dia */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ofertas do Dia</Text>
                        {loading ? (
                            <Text>Carregando...</Text>
                        ) : (
                            <FlatList
                                data={dailyDeals}
                                renderItem={({ item }) => (
                                    <DealItem
                                        item={{
                                            id: item.id,
                                            name: item.nome,
                                            originalPrice: item.preco,   
                                            offerPrice: item.preco_oferta,  
                                            image: item.imagem_url,
                                        }}
                                    />
                                )}
                                keyExtractor={(item) => item.id.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingVertical: 10 }}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* TabBar */}
            <View style={styles.tabBar}>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="home" size={24} color={PRIMARY_COLOR} />
                    <Text style={[styles.tabLabel, { color: PRIMARY_COLOR }]}>Início</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="search" size={24} color="#999" />
                    <Text style={styles.tabLabel}>Buscar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="cart-outline" size={24} color="#999" />
                    <Text style={styles.tabLabel}>Carrinho</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="heart-outline" size={24} color="#999" />
                    <Text style={styles.tabLabel}>Favoritos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="person-outline" size={24} color="#999" />
                    <Text style={styles.tabLabel}>Perfil</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;