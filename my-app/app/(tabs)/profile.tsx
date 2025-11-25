import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, View } from 'react-native'; // Importar ScrollView
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthStore } from '@/store/authStore';
import { useReceitasStore } from '@/store/receitasStore';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

const ReceitaListItem = ({ item, onPress }: { item: any, onPress: () => void }) => (
  <TouchableOpacity 
    style={styles.receitaCard}
    onPress={onPress}
  >
    <ThemedView style={styles.receitaContent}>
      <ThemedText type="defaultSemiBold" style={styles.receitaTitle}>
        {item.get('nome')}
      </ThemedText>
      <ThemedView style={styles.receitaDetails}>
        <ThemedView style={styles.cuisineBadge}>
          <ThemedText style={styles.cuisineText}>
            {item.get('tipoCozinha')?.get('nome') || 'Geral'}
          </ThemedText>
        </ThemedView>
        <ThemedText style={styles.timeText}>
          {item.get('tempoPreparo')} min
        </ThemedText>
      </ThemedView>
    </ThemedView>
    <IconSymbol name="chevron.right" size={20} color="#0a7ea4" style={styles.chevron} />
  </TouchableOpacity>
);


export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { myReceitas, fetchMyReceitas, isLoading } = useReceitasStore();
  const router = useRouter();

  useEffect(() => {
    fetchMyReceitas();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <ScrollView 
        style={styles.scrollViewContainer} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
            // Adiciona a funcionalidade "pull-to-refresh" na rolagem principal
            <View onLayout={() => {}}> 
                {isLoading && myReceitas.length === 0 ? (
                    <ActivityIndicator size="large" color="#0a7ea4" />
                ) : (
                    <View />
                )}
            </View>
        }
        onScroll={({ nativeEvent }) => {
            if (nativeEvent.contentOffset.y < -100 && !isLoading) { 
                fetchMyReceitas();
            }
        }}
    > 
      
      {/* Cabeçalho do Perfil */}
      <ThemedView style={styles.header}>
        <IconSymbol name="person.fill" size={60} color="#FFA500" style={styles.avatarIcon} />
        <ThemedText type="title" style={styles.title}>Meu Perfil</ThemedText>
        <ThemedText style={styles.username}>@{user?.get('username')}</ThemedText>
      </ThemedView>

      {/* Seção de Informações Básicas */}
      <ThemedView style={styles.infoSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Informações</ThemedText>
        
        <ThemedView style={styles.infoCard}>
          <ThemedView style={styles.infoRow}>
            <IconSymbol name="person.circle" size={20} color="#0a7ea4" />
            <ThemedView style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Usuário</ThemedText>
              <ThemedText style={styles.infoValue}>{user?.get('username')}</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.divider} />

          <ThemedView style={styles.infoRow}>
            <IconSymbol name="envelope.fill" size={20} color="#0a7ea4" />
            <ThemedView style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>E-mail</ThemedText>
              <ThemedText style={styles.infoValue}>{user?.get('email')}</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Seção Minhas Receitas - AGORA É ROLÁVEL COM O SCROLLVIEW */}
      <ThemedView style={styles.recipesSection}>
        <ThemedView style={styles.recipesSectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Minhas Receitas</ThemedText>
          <ThemedView style={styles.receitasCountBadge}>
            <ThemedText style={styles.receitasCountText}>{myReceitas.length}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        {/* Lógica de renderização modificada */}
        {isLoading && myReceitas.length === 0 ? (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0a7ea4" />
            <ThemedText style={styles.loadingText}>Carregando suas receitas...</ThemedText>
          </ThemedView>
        ) : myReceitas.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol name="book" size={60} color="#CCC" style={styles.emptyIcon} />
            <ThemedText style={styles.emptyText}>
              Você ainda não criou nenhuma receita
            </ThemedText>
            <TouchableOpacity 
              style={styles.addRecipeButton}
              onPress={() => router.push('/adicionar-receita')}
            >
              <ThemedText style={styles.addRecipeButtonText}>
                Criar minha primeira receita
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <View> 
            {myReceitas.map((item) => (
                <ReceitaListItem
                    key={item.id}
                    item={item}
                    onPress={() => router.push(`/detalhes-receita/${item.id}`)}
                />
            ))}
          </View>
        )}
      </ThemedView>

      {/* Botão de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <IconSymbol name="arrow.right.square.fill" size={20} color="#FFF" />
        <ThemedText style={styles.logoutText}>Sair da Conta</ThemedText>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 80,
  },

  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F8F9FA',
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  avatarIcon: {
    marginBottom: 12,
  },
  title: {
    color: '#212529',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  username: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '500',
  },

  infoSection: {
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    color: '#2E86AB',
    marginBottom: 16,
    fontWeight: '600',
    fontSize: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: 'transparent',
  },
  infoLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginVertical: 12,
  },

  recipesSection: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  recipesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  receitasCountBadge: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  receitasCountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  receitaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F3F4',
    minHeight: 80,
  },
  receitaContent: {
    flex: 1,
    marginRight: 16,
    backgroundColor: 'transparent',
  },
  receitaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  receitaDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
  },
  cuisineBadge: {
    backgroundColor: '#E7F5FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cuisineText: {
    fontSize: 12,
    color: '#0A7EA4',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  chevron: {
    opacity: 0.7,
  },

  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: 'transparent',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C757D',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6C757D',
    lineHeight: 24,
    marginBottom: 24,
  },
  addRecipeButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  addRecipeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },

  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#DC3545',
    borderRadius: 16,
    shadowColor: '#DC3545',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 20, 
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});