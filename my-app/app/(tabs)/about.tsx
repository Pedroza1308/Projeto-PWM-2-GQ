import { StyleSheet, Linking, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExternalLink } from '@/components/external-link';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AboutScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Daily Meals
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Seu catálogo de receitas pessoais.
      </ThemedText>
      
      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold">Sobre o Projeto</ThemedText>
        <ThemedText style={styles.text}>
          Este aplicativo é focado na catalogação de receitas pessoais, 
          implementando operações CRUD (Criar, Ler, Atualizar, Deletar) completas para a entidade Receita.
        </ThemedText>
        <ThemedText style={styles.text}>
          Utiliza a arquitetura Expo + Expo Router para navegação e o Back4App (Parse) para o backend e armazenamento de dados.
        </ThemedText>
        <ThemedText style={styles.text}>
          O gerenciamento de estado é feito com Zustand, controlando a lista de Receitas e Tipos de Cozinha (relacionamento 1:N).
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold">Recursos Principais</ThemedText>
        <ThemedText style={styles.text}>• Entidade Principal: Receita (CRUD completo)</ThemedText>
        <ThemedText style={styles.text}>• Entidade Secundária: Tipo de Cozinha (para exibição e filtro)</ThemedText>
        <ThemedText style={styles.text}>• Telas: Home (Lista com filtro), Adicionar/Editar, Detalhes, Login/Cadastro, e Sobre.</ThemedText>
      </ThemedView>

      <ThemedView style={styles.footer}>
        <ExternalLink href="https://github.com/pedroza1308/projeto-pwm-2-gq">
          <ThemedText type="link">
            <IconSymbol name="paperplane.fill" size={16} color="#0a7ea4" /> Ver no GitHub
          </ThemedText>
        </ExternalLink>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
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
  section: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 5,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 20,
    backgroundColor: 'transparent',
  }
});