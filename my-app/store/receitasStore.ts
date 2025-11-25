import { create } from 'zustand';
import Parse from '@/services/parseConfig'; // Importa a configuração do Back4App
import { Alert } from 'react-native';

// --- Interfaces de Dados ---
// Define as interfaces para as Classes do Back4App

// Entidade de Relacionamento (Tipo de Cozinha)
// Nota: Parse.Object é usado para objetos não tipados, mas definimos o mínimo tipado.
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

// Para usar objetos Parse diretamente na lista de receitas no Store
// Isso simplifica a tipagem, pois o resultado do fetch é um Parse.Object.
type ReceitaParseObject = Parse.Object & {
  id: string;
  get: (key: string) => any;
};

// --- Interface do Store ---
interface ReceitasState {
  // Estados de dados
  // Armazenamos como Parse.Object para facilitar o acesso aos métodos .get() e id
  receitas: ReceitaParseObject[];
  tiposCozinha: TipoCozinha[];
  isLoading: boolean;
  error: string | null;

  // Ações para o CRUD e busca
  // Modificado para aceitar tipoCozinhaId opcional para filtro
  fetchReceitas: (tipoCozinhaId?: string) => Promise<void>; 
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

  // FUNÇÃO DE BUSCA CORRIGIDA COM LÓGICA DE FILTRO
  fetchReceitas: async (tipoCozinhaId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const ReceitaObject = Parse.Object.extend('Receita');
      const query = new Parse.Query(ReceitaObject);
      
      // Adiciona o relacionamento (essencial para mostrar o nome do Tipo de Cozinha na lista)
      query.include('tipoCozinha'); 
      
      // >>> LÓGICA DE FILTRO <<<
      if (tipoCozinhaId) {
        // Cria um objeto Parse Pointer para o filtro
        const TipoCozinhaObject = Parse.Object.extend('TipoCozinha');
        // Usamos createWithoutData para criar uma referência (Pointer) apenas com o ID
        const tipoCozinhaPointer = Parse.Object.createWithoutData(
          TipoCozinhaObject,
          tipoCozinhaId
        );
        // Filtra a Query para ser igual ao Tipo de Cozinha selecionado
        query.equalTo('tipoCozinha', tipoCozinhaPointer);
      }
      // >>> FIM DA LÓGICA DE FILTRO <<<
      
      // Ordenação para ter um histórico visual
      query.descending('createdAt');

      // O Parse.find() já retorna Parse.Object[], que se ajusta à nova tipagem do store
      const results = await query.find();

      // Forçamos o cast para o tipo ReceitaParseObject[] (Parse.Object + id)
      set({ receitas: results as ReceitaParseObject[] });
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
      
      await novaReceita.save();
      
      // Força a atualização da lista (sem filtro, para exibir a nova)
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
      // Criar um objeto Parse com o ID para apenas enviar a atualização (melhor performance)
      const receitaToUpdate = ReceitaObject.createWithoutData(id);
      
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
      // Mantém o filtro atual, se houver
      const currentReceitas = get().receitas;
      const currentFilter = currentReceitas.length > 0 && currentReceitas.some(r => r.id === id) 
        ? currentReceitas.find(r => r.id === id)?.get('tipoCozinha')?.id 
        : undefined; 
      
      await get().fetchReceitas(currentFilter);
      
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
      const receitaToDelete = ReceitaObject.createWithoutData(id);

      await receitaToDelete.destroy();

      // Remove localmente a receita deletada
      set((state) => ({
        receitas: state.receitas.filter(r => r.id !== id) as ReceitaParseObject[],
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