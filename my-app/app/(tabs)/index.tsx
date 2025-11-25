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
    tiposCozinha, // <--- Estes são objetos JS simples ({ id, nome, cor })
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
      nome: tipo.nome
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 10,
  },
  addButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    minHeight: 56,
  },
  filterLabel: {
    fontSize: 16,
    marginRight: 12,
    color: '#495057',
    fontWeight: '600',
  },
  picker: {
    flex: 1,
    height: 54,
    color: '#212529',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 80,
    fontSize: 16,
    color: '#6C757D',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  }
});

const itemStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F3F4',
    minHeight: 80,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  details: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  cuisineBadge: {
    backgroundColor: '#E7F5FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  cuisineText: {
    fontSize: 12,
    color: '#0A7EA4',
    fontWeight: '600',
  },
  arrowIcon: {
    opacity: 0.7,
  }
});