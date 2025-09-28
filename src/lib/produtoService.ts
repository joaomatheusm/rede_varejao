import { supabase } from './supabase';

export type Produto = {
    id: number;
    categoria_id: number; 
    nome: string;
    descricao: string;
    imagem_url: string;
    preco: number;
    preco_oferta: number | null; 
    unidade_medida: string;
    estoque: number;
    is_oferta: boolean; 
    data_criacao: string; 
    data_ult_atualizacao: string; 
};

export async function fetchProdutos(): Promise<Produto[]> {
    const { data, error } = await supabase
        .from('produto')
        .select('*')
        .eq('is_oferta', true); 

    if (error) {
        console.error('Erro ao buscar produtos em oferta:', error.message);
        return [];
    }

    return (data as Produto[]) || [];
}

export async function fetchProdutosPorCategoria(categoryId: string): Promise<Produto[]> {
    const { data, error } = await supabase
        .from('produto')
        .select('*')
        .eq('categoria_id', parseInt(categoryId, 10)); 

    if (error) {
        console.error(`Erro ao buscar produtos para a categoria ${categoryId}:`, error.message);
        return [];
    }

    return (data as Produto[]) || [];
}