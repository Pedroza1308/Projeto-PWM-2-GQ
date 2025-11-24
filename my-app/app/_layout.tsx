// app/_layout.tsx

// --- INÍCIO DOS POLYFILLS ---
// Adicione isso ANTES de qualquer outro import para garantir que o Parse/WS encontre o que precisa.

import '../polyfills';
import { Buffer } from 'buffer';

// Polyfill do Buffer
global.Buffer = global.Buffer || Buffer;

// Polyfill do Process
if (typeof global.process === 'undefined') {
  global.process = require('process');
} else {
  // Se o process já existir, garantimos que o nextTick (usado pelo WS) esteja lá
  const processPolyfill = require('process');
  if (!global.process.nextTick) {
    global.process.nextTick = processPolyfill.nextTick;
  }
}
// --- FIM DOS POLYFILLS ---

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
// Importante: Mantenha o gerador de números aleatórios se o Parse reclamar de crypto
import 'react-native-get-random-values';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* A tela index.tsx é o login */}
        <Stack.Screen name="index" options={{ headerShown: false }} /> 
        
        {/* A tela signup.tsx será a de cadastro */}
        <Stack.Screen name="signup" options={{ title: 'Criar Conta' }} /> 
        
        {/* As abas são a área logada */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}