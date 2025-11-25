import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TextInput,
  ScrollView 
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const { user } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.get('username') || '');
      setEmail(user.get('email') || '');
    }
  }, [user]);

  return (
    <ScrollView style={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <IconSymbol name="person.circle.fill" size={80} color="#FFA500" />
          <ThemedText type="title" style={styles.title}>Meu Perfil</ThemedText>
          <ThemedText style={styles.subtitle}>{username}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Informações Básicas
          </ThemedText>

          <ThemedView style={styles.inputContainer}>
            <ThemedText type="defaultSemiBold">Usuário</ThemedText>
            <TextInput 
              style={[styles.input, styles.disabledInput]}
              value={username}
              editable={false}
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText type="defaultSemiBold">E-mail</ThemedText>
            <TextInput 
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
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
    fontSize: 28,
    marginTop: 10,
    color: '#FFA500',
  },
  subtitle: {
    marginTop: 5,
    opacity: 0.7,
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginTop: 5,
    backgroundColor: '#fff',
    color: '#000',
  },
  disabledInput: {
    backgroundColor: '#e9e9e9',
    color: '#666',
  },
});