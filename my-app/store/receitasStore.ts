import { create } from 'zustand';
import Parse from '@/services/parseConfig'; 
import { Alert } from 'react-native';

// --- Interfaces de Dados ---

export interface TipoCozinha {
  id: string;
  nome: string;
  cor?: string;
}

export interface Receita {
  id: string;
  nome: string;
  tempoPreparo: number;
  ingredientes: string;
  modoPreparo: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tipoCozinha: TipoCozinha;
  dono?: string;
}

type ReceitaParseObject = Parse.Object & {
  id: string;
  get: (key: string) => any;
};

// --- Interface do Store ---
interface ReceitasState {
  receitas: ReceitaParseObject[];   
  myReceitas: ReceitaParseObject[]; 
  tiposCozinha: TipoCozinha[];
  isLoading: boolean;
  error: string | null;

  fetchReceitas: (tipoCozinhaId?: string) => Promise<void>;
  fetchMyReceitas: () => Promise<void>;
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
    } finally {
      set({ isLoading: false });
    }
  },

  fetchReceitas: async (tipoCozinhaId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const ReceitaObject = Parse.Object.extend('Receita');
      const query = new Parse.Query(ReceitaObject);
      
      query.include('tipoCozinha'); 
      query.include('owner'); 
      
      if (tipoCozinhaId) {
        const TipoCozinhaObject = Parse.Object.extend('TipoCozinha');
        const tipoCozinhaPointer = Parse.Object.createWithoutData(TipoCozinhaObject, tipoCozinhaId);
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

  fetchMyReceitas: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        set({ myReceitas: [] });
        return;
      }

      const ReceitaObject = Parse.Object.extend('Receita');
      const query = new Parse.Query(ReceitaObject);
      
      query.equalTo('owner', currentUser);
      query.include('tipoCozinha');
      query.descending('createdAt');

      const results = await query.find();
      set({ myReceitas: results as ReceitaParseObject[] });
    } catch (e: any) {
      console.error('Erro ao buscar Minhas Receitas: ', e);
    } finally {
      set({ isLoading: false });
    }
  },

  createReceita: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return false;
      }

      const ReceitaObject = Parse.Object.extend('Receita');
      const novaReceita = new ReceitaObject();
      
      const TipoCozinhaObject = Parse.Object.extend('TipoCozinha');
      // Correção: Criar o ponteiro de forma explícita
      const tipoCozinhaPointer = new TipoCozinhaObject();
      tipoCozinhaPointer.id = data.tipoCozinhaId;

      novaReceita.set('nome', data.nome);
      novaReceita.set('tempoPreparo', data.tempoPreparo);
      novaReceita.set('ingredientes', data.ingredientes);
      novaReceita.set('modoPreparo', data.modoPreparo);
      novaReceita.set('dificuldade', data.dificuldade);
      novaReceita.set('tipoCozinha', tipoCozinhaPointer);
      
      novaReceita.set('dono', currentUser.get('username'));
      novaReceita.set('owner', currentUser);
      
      const acl = new Parse.ACL(currentUser);
      acl.setPublicReadAccess(true);
      acl.setPublicWriteAccess(false); 
      novaReceita.setACL(acl);
      
      await novaReceita.save();
      
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
      // 1. Busca o objeto real primeiro para garantir que existe e temos permissão
      const ReceitaObject = Parse.Object.extend('Receita');
      const query = new Parse.Query(ReceitaObject);
      const receitaToUpdate = await query.get(id);
      
      if (data.nome) receitaToUpdate.set('nome', data.nome);
      if (data.tempoPreparo !== undefined) receitaToUpdate.set('tempoPreparo', data.tempoPreparo);
      if (data.ingredientes) receitaToUpdate.set('ingredientes', data.ingredientes);
      if (data.modoPreparo) receitaToUpdate.set('modoPreparo', data.modoPreparo);
      if (data.dificuldade) receitaToUpdate.set('dificuldade', data.dificuldade);
      
      if (data.tipoCozinhaId) {
        const TipoCozinhaObject = Parse.Object.extend('TipoCozinha');
        const tipoCozinhaPointer = new TipoCozinhaObject();
        tipoCozinhaPointer.id = data.tipoCozinhaId;
        receitaToUpdate.set('tipoCozinha', tipoCozinhaPointer);
      }

      await receitaToUpdate.save();

      const currentReceitas = get().receitas;
      const currentFilter = currentReceitas.length > 0 && currentReceitas.some(r => r.id === id) 
        ? currentReceitas.find(r => r.id === id)?.get('tipoCozinha')?.id 
        : undefined; 
      
      await get().fetchReceitas(currentFilter);
      await get().fetchMyReceitas();
      
      return true;
    } catch (e: any) {
      console.error('Erro ao atualizar Receita: ', e);
      if (e.code === 101 || e.message.includes('Permission denied')) {
         Alert.alert('Acesso Negado', 'Você não tem permissão para editar esta receita.');
      } else {
         set({ error: `Falha ao atualizar: ${e.message}` });
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // --- CORREÇÃO DO DELETE ---
  deleteReceita: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Verificação de segurança extra: O Parse tem usuário logado?
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        throw new Error("Sessão inválida. Faça logout e login novamente.");
      }

      console.log("Tentando deletar receita ID:", id, "pelo usuário:", currentUser.id);

      const ReceitaObject = Parse.Object.extend('Receita');
      const receitaToDelete = ReceitaObject.createWithoutData(id);

      // O destroy usa automaticamente o token do currentUser validado acima
      await receitaToDelete.destroy();

      // Remove localmente das listas
      set((state) => ({
        receitas: state.receitas.filter(r => r.id !== id) as ReceitaParseObject[],
        myReceitas: state.myReceitas.filter(r => r.id !== id) as ReceitaParseObject[],
      }));

      return true;
    } catch (e: any) {
      console.error('Erro detalhado ao deletar Receita: ', e);
      // Se o erro for 101 ou permissão, o log vai te avisar
      set({ error: `Falha ao deletar: ${e.message}` });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

}));