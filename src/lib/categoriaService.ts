import { supabase } from './supabase';

export async function fetchCategorias() {
  const { data, error } = await supabase
    .from('categoria')
    .select('*');

  if (error) {
    console.error('Erro ao buscar categorias:', error.message);
    return [];
  }

  return data;
}
