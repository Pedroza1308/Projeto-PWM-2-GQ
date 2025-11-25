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
      router.replace('/(tabs)');
      
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
    padding: 24, // Mais espaço nas bordas
    backgroundColor: '#F8F9FA', // Fundo cinza claro moderno
  },
  title: {
    fontSize: 34,
    fontWeight: '800', // Fonte extra bold
    marginBottom: 8,
    color: '#FFA500', // Laranja da marca
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: '#6C757D', // Cinza elegante
    textAlign: 'center',
    lineHeight: 24,
    opacity: 1, // Removi a opacidade padrão para usar a cor exata
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20, // Mais espaço entre os campos
  },
  input: {
    width: '100%',
    height: 56, // Altura maior para toque
    borderColor: '#E9ECEF', // Borda sutil
    borderWidth: 1,
    borderRadius: 16, // Bordas bem arredondadas
    paddingHorizontal: 20,
    marginTop: 8, // Espaço entre o título do campo e o input
    backgroundColor: '#FFFFFF', // Fundo branco para contraste
    fontSize: 16,
    color: '#212529',
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFA500',
    borderRadius: 50, // Botão estilo pílula
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    // Sombra colorida brilhante
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});