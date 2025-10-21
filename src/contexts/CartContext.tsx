import React, { createContext, useContext, useEffect, useState } from "react";
import {
  addToCart as addToCartService,
  CartItem,
  createOrderFromCart as createOrderService,
  fetchCart,
  removeFromCart as removeFromCartService,
  updateQuantity as updateQuantityService,
} from "../lib/cartService";
import { Produto } from "../lib/produtoService";
import { useAuth } from "./AuthContext";

type CartContextData = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  addToCart: (product: Produto) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, newQuantity: number) => Promise<void>;
  createOrder: (enderecoId: number, metodoPagamento: string, taxaEntrega: number) => Promise<number | null>;
};

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const cartItems = await fetchCart();
      setItems(cartItems);
    } catch (error) {
      console.error("Falha ao carregar o carrinho:", error);
    } finally {
      setLoading(false);
    }
  };

  async function addToCart(product: Produto) {
    const previousItems = items;
    const existingItem = items.find((item) => item.produto_id === product.id);
    if (existingItem) {
      setItems(
        items.map((item) =>
          item.produto_id === product.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        produto_id: product.id,
        quantidade: 1,
        produto: product,
      };
      setItems((currentItems) => [...currentItems, newItem]);
    }

    try {
      await addToCartService(product.id);
    } catch (error) {
      console.error("Falha ao salvar no banco. Revertendo a UI.", error);
      setItems(previousItems);
    }
  }

  const performCartAction = async (action: () => Promise<void>) => {
    setLoading(true);
    try {
      await action();
      await loadCart();
    } catch (error) {
      console.error("Erro ao executar ação no carrinho:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (cartItemId: number) =>
    performCartAction(() => removeFromCartService(cartItemId));
  const updateQuantity = (cartItemId: number, newQuantity: number) =>
    performCartAction(() => updateQuantityService(cartItemId, newQuantity));

  const createOrder = async (
    enderecoId: number, 
    metodoPagamento: string, 
    taxaEntrega: number
  ): Promise<number | null> => {
    if (items.length === 0) {
      console.warn("Tentativa de criar pedido com carrinho vazio.");
      return null;
    }
    setLoading(true);
    try {
      const newOrderId = await createOrderService(enderecoId, metodoPagamento, taxaEntrega);
      
      setItems([]); 
      
      return newOrderId;
    } catch (error) {
      console.error("Falha ao criar o pedido no contexto:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const totalItems = items.reduce((sum, item) => sum + item.quantidade, 0);

  const totalPrice = items.reduce((sum, item) => {
    const price =
      item.produto.is_oferta && item.produto.preco_oferta
        ? item.produto.preco_oferta
        : item.produto.preco;
    return sum + price * item.quantidade;
  }, 0);

  const value = {
    items,
    totalItems,
    totalPrice,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    createOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}
