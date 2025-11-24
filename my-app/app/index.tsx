import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthStore } from '@/store/authStore';
import Parse from '@/services/parseConfig';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Renomeado para IndexScreen e alterada a rota de navegação
export default function IndexScreen() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      
      const user = await Parse.User.logIn(username, password);
      
      
      setUser(user);
      
      Alert.alert('Sucesso', `Bem-vindo de volta, ${user.get('username')}!`);
      
      // Mudar a navegação para as abas
      router.replace('/(tabs)/home');
      
    } catch (error: any) {
      
      Alert.alert('Falha no Login', 'Usuário ou senha inválidos. Verifique com o Back-end.');
      console.error('Error logging in: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      
      <IconSymbol name="house.fill" size={80} color="#FFA500" style={{ marginBottom: 20 }} />
      
      <ThemedText type="title" style={styles.title}>Daily Meals</ThemedText>
      <ThemedText style={styles.subtitle}>Gerencie suas refeições diárias</ThemedText>

      <ThemedView style={styles.inputContainer}>
        <ThemedText type="defaultSemiBold">Usuário</ThemedText>
        <TextInput 
          style={styles.input}
          placeholder="Digite seu usuário"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <ThemedText type="defaultSemiBold">Senha</ThemedText>
        <TextInput 
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </ThemedView>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <ThemedText style={styles.buttonText}>Entrar</ThemedText>
        )}
      </TouchableOpacity>

      
      <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.push('/signup')}>
        <ThemedText type="link">Não tem conta? Cadastre-se</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    color: '#FFA500', 
  },
  subtitle: {
    marginBottom: 40,
    opacity: 0.7,
  },
  inputContainer: {
    width: '100%',
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
    backgroundColor: '#f9f9f9', 
    color: '#000',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFA500',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});