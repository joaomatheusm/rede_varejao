import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchFavorites, toggleFavorite as toggleFavoriteService } from '../lib/favoritesService';
import { Produto } from '../lib/produtoService';
import { useAuth } from './AuthContext';

type FavoritesContextData = {
    favoriteProducts: Produto[];
    favoriteIds: Set<number>;
    toggleFavorite: (product: Produto) => Promise<void>;
    isFavorited: (productId: number) => boolean;
    loading: boolean;
};

const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [favoriteProducts, setFavoriteProducts] = useState<Produto[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            loadFavorites();
        } else {
            setFavoriteProducts([]);
        }
    }, [user]);

    useEffect(() => {
        const ids = new Set(favoriteProducts.map(p => p.id));
        setFavoriteIds(ids);
    }, [favoriteProducts]);

    const loadFavorites = async () => {
        setLoading(true);
        try {
            const data = await fetchFavorites();
            setFavoriteProducts(data);
        } catch (error) {
            console.error("Falha ao carregar favoritos:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (product: Produto) => {
        const isCurrentlyFavorited = favoriteIds.has(product.id);
        if (isCurrentlyFavorited) {
            setFavoriteProducts(prev => prev.filter(p => p.id !== product.id));
        } else {
            setFavoriteProducts(prev => [...prev, product]);
        }

        try {
            await toggleFavoriteService(product.id);
        } catch (error) {
            loadFavorites();
        }
    };
    
    const isFavorited = (productId: number) => favoriteIds.has(productId);

    const value = { favoriteProducts, favoriteIds, toggleFavorite, isFavorited, loading };

    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
    return useContext(FavoritesContext);
}
