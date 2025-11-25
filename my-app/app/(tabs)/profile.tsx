import React, { useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthStore } from '@/store/authStore';
import { useReceitasStore } from '@/store/receitasStore';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { myReceitas, fetchMyReceitas, isLoading } = useReceitasStore();
  const router = useRouter();

  // Carrega as receitas do usuário ao montar a tela
  useEffect(() => {
    fetchMyReceitas();
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  // Componente para renderizar cada item da lista
  const renderReceitaItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/detalhes-receita/${item.id}`)}
    >
      <ThemedView style={styles.cardContent}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          {item.get('nome')}
        </ThemedText>
        <ThemedText style={styles.cardSubtitle}>
          {item.get('tipoCozinha')?.get('nome') || 'Geral'} • {item.get('tempoPreparo')} min
        </ThemedText>
      </ThemedView>
      <IconSymbol name="chevron.right" size={20} color="#0a7ea4" />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      
      {/* Cabeçalho do Perfil */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Meu Perfil</ThemedText>
        <ThemedText style={styles.subtitle}>{user?.get('username')}</ThemedText>
      </ThemedView>

      {/* Seção de Informações Básicas */}
      <ThemedView style={styles.infoSection}>
        <ThemedText type="defaultSemiBold" style={styles.sectionHeader}>Informações Básicas</ThemedText>
        
        <ThemedView style={styles.infoItem}>
          <ThemedText style={styles.label}>Usuário</ThemedText>
          <ThemedView style={styles.inputLike}>
            <ThemedText style={{ color: '#000' }}>{user?.get('username')}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.infoItem}>
          <ThemedText style={styles.label}>E-mail</ThemedText>
          <ThemedView style={styles.inputLike}>
            <ThemedText style={{ color: '#000' }}>{user?.get('email')}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Seção Minhas Receitas */}
      <ThemedView style={styles.recipesSection}>
        <ThemedText type="subtitle" style={styles.sectionHeader}>Minhas Receitas</ThemedText>
        
        <FlatList
          data={myReceitas}
          keyExtractor={(item) => item.id}
          renderItem={renderReceitaItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>
              {isLoading ? 'Carregando...' : 'Você ainda não criou nenhuma receita.'}
            </ThemedText>
          }
          refreshing={isLoading}
          onRefresh={fetchMyReceitas}
        />
      </ThemedView>

      {/* Botão de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText style={styles.logoutText}>Sair da Conta</ThemedText>
      </TouchableOpacity>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    color: '#FFA500',
    fontSize: 28,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
  },
  infoSection: {
    backgroundColor: '#f9f9f9', // Fundo claro
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 15,
    fontSize: 18,
    color: '#333', // Ajuste para garantir contraste
  },
  infoItem: {
    marginBottom: 15,
    backgroundColor: 'transparent'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff', 
    backgroundColor: '#151718', 
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    borderRadius: 4,
    overflow: 'hidden',
  },
  inputLike: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 5,
  },
  recipesSection: {
    flex: 1,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E', 
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  cardContent: {
    backgroundColor: 'transparent',
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 16,
  },
  cardSubtitle: {
    color: '#CCC',
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  logoutButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#D9534F',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});