import { supabase } from './supabase';

export async function fetchProdutos() {
  const { data, error } = await supabase
    .from('produto')
    .select('*')
    .eq('is_oferta', true); 

  if (error) {
    console.error('Erro ao buscar produtos:', error.message);
    return [];
  }

  return data;
}
