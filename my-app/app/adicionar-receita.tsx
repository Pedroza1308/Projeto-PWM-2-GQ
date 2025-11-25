import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useReceitasStore } from '@/store/receitasStore';
import { useAuthStore } from '@/store/authStore'; // Importa auth
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

interface ReceitaForm {
  nome: string;
  tempoPreparo: string;
  ingredientes: string;
  modoPreparo: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tipoCozinhaId: string;
}

export default function AdicionarReceitaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>(); 
  const { user } = useAuthStore(); // Usuário atual
  
  const { 
    receitas, 
    tiposCozinha, 
    fetchTiposCozinha, 
    createReceita, 
    updateReceita,
    isLoading: storeIsLoading 
  } = useReceitasStore();

  const [formData, setFormData] = useState<ReceitaForm>({
    nome: '',
    tempoPreparo: '',
    ingredientes: '',
    modoPreparo: '',
    dificuldade: 'Fácil',
    tipoCozinhaId: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const isEditing = !!id;
  const currentReceita = isEditing ? receitas.find(r => r.id === id) : undefined;

  useEffect(() => {
    fetchTiposCozinha();
  }, []);

  useEffect(() => {
    if (isEditing && currentReceita) {
      // --- VERIFICAÇÃO DE SEGURANÇA ---
      const owner = currentReceita.get('owner');
      // Se a receita tem dono e o usuário atual não é o dono
      if (owner && user && owner.id !== user.id) {
        Alert.alert('Acesso Negado', 'Você só pode editar receitas criadas por você.');
        router.back();
        return;
      }
      // --------------------------------

      setFormData({
        nome: currentReceita.get('nome') || '',
        tempoPreparo: String(currentReceita.get('tempoPreparo') || ''),
        ingredientes: currentReceita.get('ingredientes') || '',
        modoPreparo: currentReceita.get('modoPreparo') || '',
        dificuldade: currentReceita.get('dificuldade') || 'Fácil',
        tipoCozinhaId: currentReceita.get('tipoCozinha')?.id || tiposCozinha[0]?.id || '', 
      });
    } else if (!isEditing && tiposCozinha.length > 0 && formData.tipoCozinhaId === '') {
      setFormData(prev => ({ 
        ...prev, 
        tipoCozinhaId: tiposCozinha[0]?.id || '' 
      }));
    }
  }, [isEditing, currentReceita, tiposCozinha, tiposCozinha.length, user]);

  const handleSave = async () => {
    if (!formData.nome || !formData.tempoPreparo || !formData.ingredientes || !formData.modoPreparo || !formData.tipoCozinhaId) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSaving(true);
    let success = false;
    
    const tempoPreparoNum = parseInt(formData.tempoPreparo, 10);
    if (isNaN(tempoPreparoNum)) {
      Alert.alert('Erro', 'Tempo de Preparo deve ser um número válido.');
      setIsSaving(false);
      return;
    }

    const dataToSave = {
      ...formData,
      tempoPreparo: tempoPreparoNum,
    };
    
    if (isEditing && id) {
      success = await updateReceita(id, dataToSave);
      if (success) {
        Alert.alert('Sucesso', 'Receita atualizada com sucesso!');
      }
    } else {
      success = await createReceita(dataToSave as any); 
      if (success) {
        Alert.alert('Sucesso', 'Receita criada com sucesso!');
      }
    }

    if (success) {
      router.replace('/(tabs)'); 
    }
    setIsSaving(false);
  };

  const isFormLoading = storeIsLoading || (isEditing && !currentReceita && receitas.length > 0);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <ThemedText type="title" style={styles.title}>
          {isEditing ? `Editar ${currentReceita?.get('nome') || 'Receita'}` : 'Nova Receita'}
        </ThemedText>

        {isFormLoading ? (
            <ActivityIndicator size="large" color="#0a7ea4" style={{ marginTop: 50 }} />
        ) : (
          <>
            <ThemedText style={styles.label}>Nome:</ThemedText>
            <TextInput 
              style={styles.input}
              placeholder="Ex: Torta de Limão Rápida"
              value={formData.nome}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nome: text }))}
            />

            <ThemedText style={styles.label}>Tempo de Preparo (minutos):</ThemedText>
            <TextInput 
              style={styles.input}
              placeholder="Ex: 30"
              keyboardType="numeric"
              value={formData.tempoPreparo}
              onChangeText={(text) => setFormData(prev => ({ ...prev, tempoPreparo: text }))}
            />

            <ThemedText style={styles.label}>Ingredientes:</ThemedText>
            <TextInput 
              style={[styles.input, styles.textArea]}
              placeholder="Liste os ingredientes separados por vírgula ou linha"
              multiline
              value={formData.ingredientes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, ingredientes: text }))}
            />
            
            <ThemedText style={styles.label}>Modo de Preparo:</ThemedText>
            <TextInput 
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o passo a passo"
              multiline
              value={formData.modoPreparo}
              onChangeText={(text) => setFormData(prev => ({ ...prev, modoPreparo: text }))}
            />

            <ThemedText style={styles.label}>Dificuldade:</ThemedText>
            <ThemedView style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.dificuldade}
                onValueChange={(itemValue) => setFormData(prev => ({ ...prev, dificuldade: itemValue as 'Fácil' | 'Médio' | 'Difícil' }))}
                style={styles.picker}
              >
                <Picker.Item label="Fácil" value="Fácil" />
                <Picker.Item label="Médio" value="Médio" />
                <Picker.Item label="Difícil" value="Difícil" />
              </Picker>
            </ThemedView>

            <ThemedText style={styles.label}>Tipo de Cozinha:</ThemedText>
            <ThemedView style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.tipoCozinhaId || ''} 
                onValueChange={(itemValue) => setFormData(prev => ({ ...prev, tipoCozinhaId: itemValue }))}
                style={styles.picker}
                enabled={tiposCozinha.length > 0 && !isSaving}
              >
                {tiposCozinha.length > 0 ? (
                  tiposCozinha.map(tipo => (
                    <Picker.Item key={tipo.id} label={tipo.nome} value={tipo.id} />
                  ))
                ) : (
                  <Picker.Item label="Carregando Tipos..." value="" />
                )}
              </Picker>
            </ThemedView>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <ThemedText style={styles.buttonText}>
                  {isEditing ? 'Salvar Alterações' : 'Adicionar Receita'}
                </ThemedText>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', 
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100, 
  },
  title: {
    fontSize: 32,
    fontWeight: '800', 
    color: '#FFA500', 
    marginBottom: 32,
    marginTop: 10,
    textAlign: 'center',
    letterSpacing: -1,
    textShadowColor: 'rgba(255, 165, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  label: {
    fontSize: 14,
    color: '#495057', 
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4, 
    textTransform: 'uppercase', 
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, 
    borderWidth: 1,
    borderColor: '#E9ECEF', 
    paddingHorizontal: 20,
    paddingVertical: 16, 
    fontSize: 16,
    color: '#212529',
    marginBottom: 24,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textArea: {
    minHeight: 120, 
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 24,
    overflow: 'hidden', 
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'center', 
  },
  picker: {
    height: 56,
    width: '100%',
    color: '#212529',
  },
  button: {
    backgroundColor: '#FFA500',
    borderRadius: 50, 
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});