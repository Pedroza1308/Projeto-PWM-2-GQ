import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useReceitasStore } from '@/store/receitasStore';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
// Certifique-se de instalar: npx expo install @react-native-picker/picker
import { Picker } from '@react-native-picker/picker'; 

// Componente para exibir um item da receita na lista
// Recebe um objeto Parse e a função de navegação
const ReceitaListItem = ({ receita, onPress }: { receita: any, onPress: () => void }) => {
  const nomeReceita = receita.get('nome');
  // Obtém o nome do TipoCozinha através do relacionamento
  const tipoCozinha = receita.get('tipoCozinha')?.get('nome') || 'Não especificado'; 
  
  return (
    <TouchableOpacity style={itemStyles.card} onPress={onPress}>
      <ThemedView style={itemStyles.textContainer}>
        <ThemedText type="subtitle" style={itemStyles.title}>{nomeReceita}</ThemedText>
        {/* Exibição do relacionamento (TipoCozinha) - Requisito do projeto */}
        <ThemedText style={itemStyles.details}>Cozinha: {tipoCozinha}</ThemedText>
      </ThemedView>
      <IconSymbol name="chevron.right" size={20} color="#0a7ea4" />
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { 
    receitas, 
    tiposCozinha, 
    fetchReceitas, 
    fetchTiposCozinha, 
    isLoading, 
    error 
  } = useReceitasStore();

  // Estado para o filtro: undefined significa "Todas"
  const [selectedTipoCozinhaId, setSelectedTipoCozinhaId] = useState<string | undefined>('all');
  
  // Carrega os dados na montagem
  useEffect(() => {
    fetchTiposCozinha(); // Carrega os tipos de cozinha
  }, []);

  // Recarrega as receitas sempre que o filtro muda
  useEffect(() => {
    // Chama fetchReceitas com o ID do filtro
    const filterValue = selectedTipoCozinhaId === 'all' ? undefined : selectedTipoCozinhaId;
    fetchReceitas(filterValue); 
  }, [selectedTipoCozinhaId]);

  // Exibe o erro se houver
  if (error) {
    Alert.alert('Erro de Carregamento', error);
  }

  // Memoiza as opções de filtro para incluir "Todas as Receitas"
  const filterOptions = useMemo(() => [
    { objectId: undefined, nome: 'Todas as Receitas' },
    ...tiposCozinha.map(tipo => ({
      objectId: tipo.id,
      // Garante que o nome seja uma String pura
      nome: String(tipo.get('nome')) 
    }))
  ], [tiposCozinha]);

  return (
    <ThemedView style={styles.container}>
      
      {/* Cabeçalho e Botão de Adicionar */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Receitas</ThemedText>
        <TouchableOpacity 
          style={styles.addButton} 
          // Navega para a tela de adicionar receita
          onPress={() => router.push('/adicionar-receita')}
        >
          <IconSymbol name="plus.circle.fill" size={30} color="#FFA500" />
        </TouchableOpacity>
      </ThemedView>

      {/* Seletor de Filtro (Requisito: Exibição e Relacionamento) */}
      <ThemedView style={styles.filterContainer}>
        <ThemedText style={styles.filterLabel}>Filtrar:</ThemedText>
        <Picker
          selectedValue={selectedTipoCozinhaId || 'all'} 
          onValueChange={(itemValue) => setSelectedTipoCozinhaId(itemValue === 'all' ? undefined : itemValue)}
          style={styles.picker}
        >
          {filterOptions.map((option) => (
            <Picker.Item 
              key={option.objectId || 'all'} 
              // Garante que o label seja uma String pura
              label={String(option.nome)} 
              value={option.objectId || 'all'}
            />
          ))}
        </Picker>
      </ThemedView>

      {/* Lista de Receitas */}
      {isLoading && receitas.length === 0 ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <ThemedText style={{ marginTop: 10 }}>Carregando Receitas...</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={receitas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReceitaListItem 
              receita={item} 
              onPress={() => {
                // Navega para a tela de detalhes (CRUD - Read/Update/Delete)
                router.push(`/detalhes-receita/${item.id}`); 
              }} 
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            !isLoading && (
              <ThemedText style={styles.emptyText}>
                {selectedTipoCozinhaId 
                  ? 'Nenhuma receita encontrada para este tipo de cozinha.'
                  : 'Nenhuma receita cadastrada. Adicione a primeira!'}
              </ThemedText>
            )
          )}
          refreshing={isLoading && receitas.length > 0} 
          onRefresh={() => fetchReceitas(selectedTipoCozinhaId)}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    padding: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9', 
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  }
});

const itemStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#FFF', 
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});