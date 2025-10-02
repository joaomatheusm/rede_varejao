import { Produto } from './produtoService';
import { supabase } from './supabase';

export type CartItem = {
    id: number;
    quantidade: number;
    produto_id: number;
    produto: Produto;
};

export async function fetchCart(): Promise<CartItem[]> {
    const { data, error } = await supabase.rpc('get_cart_with_products');

    if (error) {
        console.error("Erro ao buscar carrinho via RPC:", error);
        throw error;
    }
    
    return (data as CartItem[]) || [];
}

export async function addToCart(productId: number) {
    const { error } = await supabase.rpc('add_to_cart', { product_id_to_add: productId });
    if (error) throw error;
}

export async function removeFromCart(cartItemId: number) {
    const { error } = await supabase.rpc('remove_from_cart', { cart_item_id_to_remove: cartItemId });
    if (error) throw error;
}

export async function updateQuantity(cartItemId: number, newQuantity: number) {
    const { error } = await supabase.rpc('update_cart_quantity', {
        cart_item_id_to_update: cartItemId,
        new_quantity: newQuantity
    });
    if (error) throw error;
}