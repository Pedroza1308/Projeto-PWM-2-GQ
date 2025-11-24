import { create } from 'zustand';
import Parse from '@/services/parseConfig'; // Importa a configuração do Back4App

// --- Interfaces de Dados ---
// Defina as interfaces para as Classes do Back4App
// (Idealmente, você criaria classes reais no Parse para tipagem completa)

// Entidade de Relacionamento (Tipo de Cozinha)
export interface TipoCozinha {
  id: string;
  nome: string;
  cor?: string; // Exemplo de campo adicional
}

// Entidade Principal (Receita)
export interface Receita {
  id: string;
  nome: string;
  tempoPreparo: number;
  ingredientes: string; // Simplificando para String
  modoPreparo: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  // Campo de relacionamento (Pointer)
  tipoCozinha: TipoCozinha; // O Parse SDK deve incluir o objeto completo ao usar 'include'
}

// --- Interface do Store ---
interface ReceitasState {
  // Estados de dados
  receitas: Receita[];
  tiposCozinha: TipoCozinha[];
  isLoading: boolean;
  error: string | null;

  // Ações para o CRUD e busca
  fetchReceitas: () => Promise<void>;
  fetchTiposCozinha: () => Promise<void>;
  createReceita: (data: Omit<Receita, 'id' | 'tipoCozinha'> & { tipoCozinhaId: string }) => Promise<boolean>;
  updateReceita: (id: string, data: Partial<Omit<Receita, 'id' | 'tipoCozinha'>> & { tipoCozinhaId?: string }) => Promise<boolean>;
  deleteReceita: (id: string) => Promise<boolean>;
}

// --- Implementação do Store ---
export const useReceitasStore = create<ReceitasState>((set, get) => ({
  // Estado Inicial
  receitas: [],
  tiposCozinha: [],
  isLoading: false,
  error: null,

  // --- AÇÕES ---

  fetchTiposCozinha: async () => {
    set({ isLoading: true, error: null });
    try {
      const Query = new Parse.Query('TipoCozinha');
      const results = await Query.find();
      
      const tipos: TipoCozinha[] = results.map((item: Parse.Object) => ({
        id: item.id,
        nome: item.get('nome'),
        cor: item.get('cor') || '#ccc',
      }));

      set({ tiposCozinha: tipos });
    } catch (e: any) {
      console.error('Erro ao buscar Tipos de Cozinha: ', e);
      set({ error: `Falha ao buscar categorias: ${e.message}` });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchReceitas: async () => {
    set({ isLoading: true, error: null });
    try {
      const Query = new Parse.Query('Receita');
      Query.include('tipoCozinha'); 
      const results = await Query.find();

      const receitas: Receita[] = results.map((item: Parse.Object) => {
        const tipoCozinhaParse = item.get('tipoCozinha') as Parse.Object;
        
        return {
          id: item.id,
          nome: item.get('nome'),
          tempoPreparo: item.get('tempoPreparo'),
          ingredientes: item.get('ingredientes'),
          modoPreparo: item.get('modoPreparo'),
          dificuldade: item.get('dificuldade'),
          tipoCozinha: {
            id: tipoCozinhaParse.id,
            nome: tipoCozinhaParse.get('nome'),
            cor: tipoCozinhaParse.get('cor') || '#ccc',
          },
        };
      });
      
      set({ receitas });
    } catch (e: any) {
      console.error('Erro ao buscar Receitas: ', e);
      set({ error: `Falha ao buscar receitas: ${e.message}` });
    } finally {
      set({ isLoading: false });
    }
  },

  createReceita: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const ReceitaObject = Parse.Object.extend('Receita');
      const novaReceita = new ReceitaObject();
      
      // Cria o Pointer para TipoCozinha
      const TipoCozinhaObject = Parse.Object.extend('TipoCozinha');
      const tipoCozinhaPointer = TipoCozinhaObject.createWithoutData(data.tipoCozinhaId);

      novaReceita.set('nome', data.nome);
      novaReceita.set('tempoPreparo', data.tempoPreparo);
      novaReceita.set('ingredientes', data.ingredientes);
      novaReceita.set('modoPreparo', data.modoPreparo);
      novaReceita.set('dificuldade', data.dificuldade);
      novaReceita.set('tipoCozinha', tipoCozinhaPointer);
      
      const savedReceita = await novaReceita.save();
      
      // Força a atualização da lista para incluir a nova receita com o relacionamento populado
      await get().fetchReceitas(); 

      return true;
    } catch (e: any) {
      console.error('Erro ao criar Receita: ', e);
      set({ error: `Falha ao criar receita: ${e.message}` });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateReceita: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const ReceitaObject = Parse.Object.extend('Receita');
      const receitaToUpdate = new ReceitaObject();
      receitaToUpdate.set('objectId', id);
      
      if (data.nome) receitaToUpdate.set('nome', data.nome);
      if (data.tempoPreparo !== undefined) receitaToUpdate.set('tempoPreparo', data.tempoPreparo);
      if (data.ingredientes) receitaToUpdate.set('ingredientes', data.ingredientes);
      if (data.modoPreparo) receitaToUpdate.set('modoPreparo', data.modoPreparo);
      if (data.dificuldade) receitaToUpdate.set('dificuldade', data.dificuldade);
      
      // Atualiza o Pointer se o tipoCozinhaId foi fornecido
      if (data.tipoCozinhaId) {
        const TipoCozinhaObject = Parse.Object.extend('TipoCozinha');
        const tipoCozinhaPointer = TipoCozinhaObject.createWithoutData(data.tipoCozinhaId);
        receitaToUpdate.set('tipoCozinha', tipoCozinhaPointer);
      }

      await receitaToUpdate.save();

      // Força a atualização da lista para refletir a mudança na UI
      await get().fetchReceitas(); 
      
      return true;
    } catch (e: any) {
      console.error('Erro ao atualizar Receita: ', e);
      set({ error: `Falha ao atualizar receita: ${e.message}` });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteReceita: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const ReceitaObject = Parse.Object.extend('Receita');
      const receitaToDelete = new ReceitaObject();
      receitaToDelete.set('objectId', id);

      await receitaToDelete.destroy();

      // Remove localmente a receita deletada
      set((state) => ({
        receitas: state.receitas.filter(r => r.id !== id),
      }));

      return true;
    } catch (e: any) {
      console.error('Erro ao deletar Receita: ', e);
      set({ error: `Falha ao deletar receita: ${e.message}` });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

}));