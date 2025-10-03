import { Produto } from './produtoService';
import { supabase } from './supabase';

export async function fetchFavorites(): Promise<Produto[]> {
    const { data, error } = await supabase.rpc('get_my_favorite_products');
    if (error) {
        console.error("Erro ao buscar favoritos:", error);
        return [];
    }
    return data || [];
}

export async function toggleFavorite(productId: number): Promise<void> {
    const { error } = await supabase.rpc('toggle_favorite', {
        product_id_to_toggle: productId,
    });
    if (error) {
        console.error("Erro ao alternar favorito:", error);
        throw error;
    }
}
