import { supabase } from "./supabase";

export interface Endereco {
  id?: number;
  usuario_id: string; // UUID do Supabase Auth
  data_criacao?: string;
  data_ult_atualizacao?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  apelido: string;
  logradouro: string;
  numero: string;
}

export const enderecoService = {
  // Criar novo endereço
  async criarEndereco(endereco: Omit<Endereco, 'id' | 'data_criacao' | 'data_ult_atualizacao'>) {
    try {
      console.log("Tentando criar endereço:", endereco);
      
      const dadosParaInserir = {
        ...endereco,
        data_criacao: new Date().toISOString(),
        data_ult_atualizacao: new Date().toISOString()
      };
      
      console.log("Dados preparados para inserção:", dadosParaInserir);
      
      const { data, error } = await supabase
        .from('endereco')
        .insert([dadosParaInserir])
        .select()
        .single();

      if (error) {
        console.error('Erro detalhado do Supabase:', error);
        console.error('Código do erro:', error.code);
        console.error('Mensagem do erro:', error.message);
        throw error;
      }

      console.log("Endereço criado com sucesso:", data);
      return data;
    } catch (error) {
      console.error('Erro no serviço de criação de endereço:', error);
      throw error;
    }
  },

  // Buscar endereços do usuário
  async buscarEnderecosPorUsuario(usuarioId: string) {
    try {
      const { data, error } = await supabase
        .from('endereco')
        .select('*')
        .eq('usuario_id', usuarioId)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar endereços:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro no serviço de busca de endereços:', error);
      throw error;
    }
  },

  // Atualizar endereço
  async atualizarEndereco(id: number, endereco: Partial<Endereco>) {
    try {
      const { data, error } = await supabase
        .from('endereco')
        .update({
          ...endereco,
          data_ult_atualizacao: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar endereço:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro no serviço de atualização de endereço:', error);
      throw error;
    }
  },

  // Deletar endereço
  async deletarEndereco(id: number) {
    try {
      const { error } = await supabase
        .from('endereco')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar endereço:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro no serviço de deleção de endereço:', error);
      throw error;
    }
  },

  // Buscar um endereço específico
  async buscarEnderecoPorId(id: number) {
    try {
      const { data, error } = await supabase
        .from('endereco')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar endereço por ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro no serviço de busca de endereço por ID:', error);
      throw error;
    }
  }
};
