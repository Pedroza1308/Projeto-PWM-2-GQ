import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExternalLink } from '@/components/external-link';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AboutScreen() {
  // Detecta o tema atual (claro ou escuro) para definir a cor do cabeçalho manualmente
  const colorScheme = useColorScheme() ?? 'light';
  const headerBackgroundColor = colorScheme === 'light' ? '#FFF8E1' : '#1E1E1E';

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Cabeçalho Estático (Substitui o Parallax) */}
        <View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
          <IconSymbol
            size={200}
            color="#FFA500"
            name="house.fill"
            style={styles.headerImage}
          />
        </View>

        <ThemedView style={styles.content}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>Daily Meals</ThemedText>
          </ThemedView>
          
          <ThemedText style={styles.subtitle}>
            Seu catálogo de receitas pessoais, prático e organizado.
          </ThemedText>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Funcionalidades</ThemedText>
            <ThemedText style={styles.introText}>
              O Daily Meals foi projetado para simplificar o gerenciamento das suas refeições diárias. Confira o que você pode fazer:
            </ThemedText>
            
            <FeatureItem 
              icon="plus.circle.fill" 
              text="Cadastro Completo: Adicione receitas com nome, ingredientes, modo de preparo, tempo e dificuldade." 
            />
            <FeatureItem 
              icon="chevron.right" 
              text="Organização Inteligente: Classifique seus pratos por Tipos de Cozinha (ex: Italiana, Brasileira)." 
            />
            <FeatureItem 
              icon="chevron.right" 
              text="Filtros Rápidos: Encontre exatamente o que procura filtrando sua lista por categorias." 
            />
            <FeatureItem 
              icon="chevron.right" 
              text="Gestão Total: Edite ou remova receitas conforme seu cardápio evolui." 
            />
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Tecnologias</ThemedText>
            <ThemedText style={styles.techText}>
              Este projeto utiliza o poder do <ThemedText type="defaultSemiBold">React Native</ThemedText> com <ThemedText type="defaultSemiBold">Expo</ThemedText>. 
              O armazenamento seguro e escalável é garantido pelo <ThemedText type="defaultSemiBold">Back4App (Parse)</ThemedText>, 
              enquanto o <ThemedText type="defaultSemiBold">Zustand</ThemedText> cuida do estado da aplicação de forma leve e eficiente.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.footer}>
            <ExternalLink href="https://github.com/pedroza1308/projeto-pwm-2-gq">
              <ThemedText type="link">
                <IconSymbol name="paperplane.fill" size={18} color="#0a7ea4" /> Ver projeto no GitHub
              </ThemedText>
            </ExternalLink>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

// Componente auxiliar para itens da lista de funcionalidades
function FeatureItem({ icon, text }: { icon: any, text: string }) {
  return (
    <ThemedView style={styles.featureItem}>
      <IconSymbol name={icon} size={20} color="#0a7ea4" style={styles.featureIcon} />
      <ThemedText style={styles.featureText}>{text}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    height: 250, // Altura similar ao header original
    width: '100%',
    justifyContent: 'flex-end', // Alinha ícone mais para baixo
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  headerImage: {
    opacity: 0.8,
    position: 'absolute',
    bottom: -30,
    left: -20,
  },
  content: {
    padding: 32,
    gap: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#FFA500',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#0a7ea4',
    marginBottom: 12,
    fontWeight: '700',
  },
  introText: {
    marginBottom: 12,
    lineHeight: 22,
  },
  techText: {
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  featureIcon: {
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
});