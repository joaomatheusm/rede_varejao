import { Endereco } from './enderecoService';
import { Produto } from './produtoService';
import { supabase } from './supabase';

type PedidoItem = {
  id: number;
  quantidade: number;
  preco_unitario: number;
  produto: Produto;
};

export type Pedido = {
  id: number;
  status_id: number;
  valor_total: number;
  taxa_entrega: number;
  metodo_pagamento: string;
  data_criacao: string;
  status_descricao: string;
  endereco: Endereco;
  itens: PedidoItem[];
};

export const orderService = {
  // Busca todos os pedidos do usuário
  fetchOrders: async (): Promise<Pedido[]> => {
    const { data, error } = await supabase.rpc('get_my_pedidos');

    if (error) {
      console.error('Erro ao buscar histórico de pedidos:', error);
      throw error;
    }
    
    return (data as Pedido[]) || [];
  },
};