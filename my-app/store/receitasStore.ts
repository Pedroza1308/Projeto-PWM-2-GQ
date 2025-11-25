import { create } from 'zustand';
import Parse from '@/services/parseConfig'; // Importa a configuração do Back4App
import { Alert } from 'react-native';

// --- Interfaces de Dados ---

// Entidade de Relacionamento (Tipo de Cozinha)
export interface TipoCozinha {
  id: string;
  nome: string;
  cor?: string;
}

// Entidade Principal (Receita)
export interface Receita {
  id: string;
  nome: string;
  tempoPreparo: number;
  ingredientes: string;
  modoPreparo: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tipoCozinha: TipoCozinha;
  dono?: string; // Nome do usuário para exibição
}

// Para usar objetos Parse diretamente na lista de receitas no Store
type ReceitaParseObject = Parse.Object & {
  id: string;
  get: (key: string) => any;
};

// --- Interface do Store ---
interface ReceitasState {
  receitas: ReceitaParseObject[];
  myReceitas: ReceitaParseObject[]; // Lista separada para o perfil
  tiposCozinha: TipoCozinha[];
  isLoading: boolean;
  error: string | null;

  fetchReceitas: (tipoCozinhaId?: string) => Promise<void>;
  fetchMyReceitas: () => Promise<void>; // Ação para buscar receitas do usuário
  fetchTiposCozinha: () => Promise<void>;
  createReceita: (data: Omit<Receita, 'id' | 'tipoCozinha' | 'dono'> & { tipoCozinhaId: string }) => Promise<boolean>;
  updateReceita: (id: string, data: Partial<Omit<Receita, 'id' | 'tipoCozinha'>> & { tipoCozinhaId?: string }) => Promise<boolean>;
  deleteReceita: (id: string) => Promise<boolean>;
}

// --- Implementação do Store ---
export const useReceitasStore = create<ReceitasState>((set, get) => ({
  receitas: [],
  myReceitas: [],
  tiposCozinha: [],
  isLoading: false,
  error: null,

  // --- AÇÕES ---

  fetchTiposCozinha: async () => {
    set({ isLoading: true, error: null });
    try {
      const TipoCozinhaObject = Parse.Object.extend('TipoCozinha');
      const Query = new Parse.Query(TipoCozinhaObject);
      const results = await Query.find();
      
      const tipos: TipoCozinha[] = results.map((item: Parse.Object) => ({
        id: item.id,
        nome: item.get('nome'),
        cor: item.get('cor') || '#ccc',
      }));

      set({ tiposCozinha: tipos });
    } catch (e: any) {
      console.error('Erro ao buscar Tipos de Cozinha: ', e);
      Alert.alert('Erro no Back4App', `Falha ao buscar categorias: ${e.message}`, [{ text: 'OK' }]);
      set({ error: `Falha ao buscar categorias: ${e.message}` });
    } finally {
      set({ isLoading: false });
    }
  },

  // Busca geral (Home)
  fetchReceitas: async (tipoCozinhaId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const ReceitaObject = Parse.Object.extend('Receita');
      const query = new Parse.Query(ReceitaObject);
      
      query.include('tipoCozinha');
      query.include('owner'); 
      
      if (tipoCozinhaId) {
        const TipoCozinhaObject = Parse.Object.extend('TipoCozinha');
        const tipoCozinhaPointer = Parse.Object.createWithoutData(
          TipoCozinhaObject,
          tipoCozinhaId
        );
        query.equalTo('tipoCozinha', tipoCozinhaPointer);
      }
      
      query.descending('createdAt');

      const results = await query.find();
      set({ receitas: results as ReceitaParseObject[] });
    } catch (e: any) {
      console.error('Erro ao buscar Receitas: ', e);
      set({ error: `Falha ao buscar receitas: ${e.message}` });
    } finally {
      set({ isLoading: false });
    }
  },

  // Busca específica do usuário (Perfil)
  fetchMyReceitas: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        // Se não tiver usuário logado, limpa a lista
        set({ myReceitas: [] });
        return;
      }

      const ReceitaObject = Parse.Object.extend('Receita');
      const query = new Parse.Query(ReceitaObject);
      
      // Filtra apenas receitas onde o ponteiro "owner" é o usuário atual
      query.equalTo('owner', currentUser);
      query.include('tipoCozinha');
      query.descending('createdAt');

      const results = await query.find();
      set({ myReceitas: results as ReceitaParseObject[] });
    } catch (e: any) {
      console.error('Erro ao buscar Minhas Receitas: ', e);
      set({ error: `Falha ao buscar suas receitas: ${e.message}` });
    } finally {
      set({ isLoading: false });
    }
  },

  createReceita: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = await Parse.User.currentAsync();
      
      if (!currentUser) {
        Alert.alert('Erro', 'Você precisa estar logado para criar uma receita.');
        return false;
      }

      const ReceitaObject = Parse.Object.extend('Receita');
      const novaReceita = new ReceitaObject();
      
      const TipoCozinhaObject = Parse.Object.extend('TipoCozinha');
      const tipoCozinhaPointer = TipoCozinhaObject.createWithoutData(data.tipoCozinhaId);

      novaReceita.set('nome', data.nome);
      novaReceita.set('tempoPreparo', data.tempoPreparo);
      novaReceita.set('ingredientes', data.ingredientes);
      novaReceita.set('modoPreparo', data.modoPreparo);
      novaReceita.set('dificuldade', data.dificuldade);
      novaReceita.set('tipoCozinha', tipoCozinhaPointer);
      
      // Salva o nome do usuário como String (para exibição simples)
      novaReceita.set('dono', currentUser.get('username'));

      // Define a relação de propriedade (Pointer) e ACL (Permissões)
      novaReceita.set('owner', currentUser);
      
      const acl = new Parse.ACL(currentUser);
      acl.setPublicReadAccess(true);   // Todos podem ler
      acl.setPublicWriteAccess(false); // Só o criador pode editar/deletar
      novaReceita.setACL(acl);
      
      await novaReceita.save();
      
      // Atualiza ambas as listas
      await get().fetchReceitas(); 
      await get().fetchMyReceitas();

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
      const receitaToUpdate = ReceitaObject.createWithoutData(id);
      
      if (data.nome) receitaToUpdate.set('nome', data.nome);
      if (data.tempoPreparo !== undefined) receitaToUpdate.set('tempoPreparo', data.tempoPreparo);
      if (data.ingredientes) receitaToUpdate.set('ingredientes', data.ingredientes);
      if (data.modoPreparo) receitaToUpdate.set('modoPreparo', data.modoPreparo);
      if (data.dificuldade) receitaToUpdate.set('dificuldade', data.dificuldade);
      
      if (data.tipoCozinhaId) {
        const TipoCozinhaObject = Parse.Object.extend('TipoCozinha');
        const tipoCozinhaPointer = TipoCozinhaObject.createWithoutData(data.tipoCozinhaId);
        receitaToUpdate.set('tipoCozinha', tipoCozinhaPointer);
      }

      await receitaToUpdate.save();

      // Atualiza listas para refletir mudanças
      const currentReceitas = get().receitas;
      // Tenta manter o filtro atual da Home se possível
      const currentFilter = currentReceitas.length > 0 && currentReceitas.some(r => r.id === id) 
        ? currentReceitas.find(r => r.id === id)?.get('tipoCozinha')?.id 
        : undefined; 
      
      await get().fetchReceitas(currentFilter);
      await get().fetchMyReceitas();
      
      return true;
    } catch (e: any) {
      console.error('Erro ao atualizar Receita: ', e);
      if (e.code === 101 || e.message.includes('Permission denied')) {
         set({ error: 'Você não tem permissão para editar esta receita.' });
      } else {
         set({ error: `Falha ao atualizar receita: ${e.message}` });
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteReceita: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const ReceitaObject = Parse.Object.extend('Receita');
      const receitaToDelete = ReceitaObject.createWithoutData(id);

      await receitaToDelete.destroy();

      // Remove localmente das listas para feedback instantâneo
      set((state) => ({
        receitas: state.receitas.filter(r => r.id !== id) as ReceitaParseObject[],
        myReceitas: state.myReceitas.filter(r => r.id !== id) as ReceitaParseObject[],
      }));

      return true;
    } catch (e: any) {
      console.error('Erro ao deletar Receita: ', e);
      if (e.code === 101 || e.message.includes('Permission denied')) {
         set({ error: 'Você não tem permissão para excluir esta receita.' });
      } else {
         set({ error: `Falha ao deletar receita: ${e.message}` });
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

}));