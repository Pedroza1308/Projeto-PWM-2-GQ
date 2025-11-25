import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useReceitasStore } from '@/store/receitasStore';
import { useAuthStore } from '@/store/authStore'; // Importa o AuthStore
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function DetalhesReceitaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); 
  
  // Pega o usuário logado do store
  const { user } = useAuthStore();

  const { 
    receitas, 
    isLoading, 
    fetchReceitas, 
    deleteReceita 
  } = useReceitasStore();

  const [isDeleting, setIsDeleting] = useState(false);
  
  const receita = useMemo(() => {
    return receitas.find(r => r.id === id);
  }, [id, receitas]);

  useEffect(() => {
    if (!receita && receitas.length === 0 && !isLoading && id) {
        fetchReceitas(); 
    }
  }, [receita, receitas.length, isLoading, id]);

  if (isLoading || !id) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={{ marginTop: 10 }}>Carregando detalhes...</ThemedText>
      </ThemedView>
    );
  }
  
  if (!receita) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText type="subtitle">Receita não encontrada.</ThemedText>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.replace('/(tabs)')}>
          <ThemedText type="link">Voltar para Home</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // --- Lógica de Permissão ---
  // Verifica se existe um usuário logado e se o ID dele bate com o ID do dono da receita
  const owner = receita.get('owner');
  const isOwner = user && owner && user.id === owner.id;
  // ---------------------------

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a receita "${receita.get('nome')}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: async () => {
          setIsDeleting(true);
          const success = await deleteReceita(id);
          if (success) {
            Alert.alert('Sucesso', 'Receita excluída.');
            router.replace('/(tabs)');
          } else {
            Alert.alert('Erro', 'Falha ao excluir receita. Verifique suas permissões.');
            setIsDeleting(false);
          }
        }},
      ]
    );
  };
  
  const nome = receita.get('nome');
  const tempoPreparo = receita.get('tempoPreparo');
  const dificuldade = receita.get('dificuldade');
  const ingredientes = receita.get('ingredientes')?.split('\n').filter(Boolean).map((item: string, index: number) => 
    <ThemedText key={index} style={styles.listItem}>• {item.trim()}</ThemedText>
  );
  const modoPreparo = receita.get('modoPreparo');
  const tipoCozinhaNome = receita.get('tipoCozinha')?.get('nome') || 'Desconhecido';
  const ownerName = owner?.get('username') || 'Desconhecido';

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.titleText}>{nome}</ThemedText>
          
          {/* Só mostra o botão de editar se for o dono */}
          {isOwner && (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => router.push(`/adicionar-receita?id=${id}`)}
            >
              <IconSymbol name="square.and.pencil" size={24} color="#0a7ea4" />
            </TouchableOpacity>
          )}
        </ThemedView>

        <ThemedView style={styles.detailsBox}>
          <ThemedText style={styles.detailItem}>
            <ThemedText type="defaultSemiBold">Criado por:</ThemedText> {ownerName}
          </ThemedText>
          <ThemedText style={styles.detailItem}>
            <ThemedText type="defaultSemiBold">Cozinha:</ThemedText> {tipoCozinhaNome}
          </ThemedText>
          <ThemedText style={styles.detailItem}>
            <ThemedText type="defaultSemiBold">Dificuldade:</ThemedText> {dificuldade}
          </ThemedText>
          <ThemedText style={styles.detailItem}>
            <ThemedText type="defaultSemiBold">Tempo de Preparo:</ThemedText> {tempoPreparo} min
          </ThemedText>
        </ThemedView>

        <ThemedText type="subtitle" style={styles.subtitle}>Ingredientes</ThemedText>
        <ThemedView style={styles.listContainer}>
          {ingredientes && ingredientes.length > 0 ? ingredientes : <ThemedText>Nenhum ingrediente listado.</ThemedText>}
        </ThemedView>

        <ThemedText type="subtitle" style={styles.subtitle}>Modo de Preparo</ThemedText>
        <ThemedText style={styles.bodyText}>{modoPreparo}</ThemedText>

        {/* Só mostra o botão de deletar se for o dono */}
        {isOwner && (
          <TouchableOpacity 
            style={[styles.button, styles.deleteButton]} 
            onPress={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <ThemedText style={styles.buttonText}>Deletar Receita</ThemedText>
            )}
          </TouchableOpacity>
        )}
        
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 28,
    flex: 1,
    marginRight: 10,
    color: '#FFA500', 
  },
  editButton: {
    padding: 5,
  },
  detailsBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    borderLeftWidth: 5,
    borderLeftColor: '#0a7ea4',
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    color: '#0a7ea4',
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  listContainer: {
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    marginLeft: 10,
    lineHeight: 24,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#D9534F', 
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});