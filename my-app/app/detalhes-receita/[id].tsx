import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useReceitasStore } from '@/store/receitasStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function DetalhesReceitaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); 
  
  const { user } = useAuthStore();
  const { receitas, isLoading, fetchReceitas, deleteReceita } = useReceitasStore();
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

  // --- VERIFICAÇÃO DE PROPRIEDADE ---
  const owner = receita.get('owner');
  const isOwner = user && owner && user.id === owner.id;

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
  const donoDisplay = receita.get('dono') || owner?.get('username') || 'Desconhecido';

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.titleText}>{nome}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.detailsBox}>
          <ThemedText style={styles.detailItem}>
            <ThemedText type="defaultSemiBold">Criado por:</ThemedText> {donoDisplay}
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

        {/* AÇÕES DO DONO (Só aparecem se isOwner for true) */}
        {isOwner && (
          <ThemedView style={styles.actionsContainer}>
            
            {/* Botão Deletar (Vermelho) */}
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

            {/* Botão Editar (Azul) */}
            <TouchableOpacity 
              style={[styles.button, styles.editButton]} 
              onPress={() => router.push(`/adicionar-receita?id=${id}`)}
              disabled={isDeleting}
            >
              <ThemedText style={styles.buttonText}>Editar Receita</ThemedText>
            </TouchableOpacity>

          </ThemedView>
        )}
        
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Fundo claro padrão
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  
  // --- Cabeçalho ---
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFA500', // Laranja da marca
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255, 165, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },

  // --- Card de Informações ---
  detailsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 12,
    color: '#495057',
    flexDirection: 'row',
    alignItems: 'center',
  },

  // --- Seções de Texto (Ingredientes/Preparo) ---
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0a7ea4', // Azul para subtítulos
    marginBottom: 16,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  listItem: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 28, // Melhor leitura
    color: '#333',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 30,
  },

  // --- Botões de Ação ---
  actionsContainer: {
    marginTop: 10,
    gap: 16,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 50, // Botão pílula
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra nos botões
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  editButton: {
    backgroundColor: '#0a7ea4', // Azul
  },
  deleteButton: {
    backgroundColor: '#D9534F', // Vermelho
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});