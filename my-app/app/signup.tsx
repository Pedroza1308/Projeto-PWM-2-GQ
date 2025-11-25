import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Parse from '@/services/parseConfig';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SignupScreen() {
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      const user = new Parse.User();
      user.set('username', username);
      user.set('email', email);
      user.set('password', password);
      
      await user.signUp();
      
      Alert.alert('Sucesso', 'Conta criada! Você já pode fazer login.');
      
      // Redireciona para a tela de Login
      router.replace('/'); 
      
    } catch (error: any) {
      // O Parse retorna erros específicos que podem ser tratados aqui.
      let message = 'Falha ao criar conta. Tente novamente.';
      if (error.code === 202) {
        message = 'Usuário já existe. Escolha outro nome de usuário.';
      } else if (error.code === 203) {
        message = 'E-mail já cadastrado.';
      }
      
      Alert.alert('Erro no Cadastro', message);
      console.error('Error signing up: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      
      <ThemedText type="title" style={styles.title}>Crie Sua Conta</ThemedText>
      <ThemedText style={styles.subtitle}>Junte-se à comunidade Daily Meals!</ThemedText>

      <ThemedView style={styles.inputContainer}>
        <ThemedText type="defaultSemiBold">Usuário</ThemedText>
        <TextInput 
          style={styles.input}
          placeholder="Escolha um nome de usuário"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </ThemedView>
      
      <ThemedView style={styles.inputContainer}>
        <ThemedText type="defaultSemiBold">E-mail</ThemedText>
        <TextInput 
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <ThemedText type="defaultSemiBold">Senha</ThemedText>
        <TextInput 
          style={styles.input}
          placeholder="Crie uma senha"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </ThemedView>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSignup}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <ThemedText style={styles.buttonText}>Cadastrar</ThemedText>
        )}
      </TouchableOpacity>

      
      <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
        <ThemedText type="link">Já tenho conta? Voltar para Login</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    padding: 24, 
    backgroundColor: '#F8F9FA', 
  },
  title: {
    fontSize: 34,
    fontWeight: '800', 
    marginBottom: 8,
    color: '#FFA500', 
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: '#6C757D', 
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20, 
  },
  input: {
    width: '100%',
    height: 56, 
    backgroundColor: '#FFFFFF', 
    borderColor: '#E9ECEF', 
    borderWidth: 1,
    borderRadius: 16, 
    paddingHorizontal: 20,
    marginTop: 8, 
    fontSize: 16,
    color: '#212529',
    
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
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    
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