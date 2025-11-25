import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExternalLink } from '@/components/external-link';
import { IconSymbol } from '@/components/ui/icon-symbol';
import ParallaxScrollView from '@/components/parallax-scroll-view';

export default function AboutScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFF8E1', dark: '#1E1E1E' }}
      headerImage={
        <IconSymbol
          size={250}
          color="#FFA500"
          name="house.fill"
          style={styles.headerImage}
        />
      }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>Daily Meals</ThemedText>
      </ThemedView>
      
      <ThemedText style={styles.subtitle}>
        Seu catálogo de receitas pessoais, prático e organizado.
      </ThemedText>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Funcionalidades</ThemedText>
        <ThemedText style={styles.introText}>
          O Daily Meals foi projetado para simplificar o gerenciamento das suas receitas caseiras. Confira o que você pode fazer:
        </ThemedText>
        
        <FeatureItem 
          icon="chevron.right" 
          text="Cadastro Completo: Adicione receitas com nome, ingredientes, modo de preparo, tempo e dificuldade." 
        />
        <FeatureItem 
          icon="chevron.right" 
          text="Classifique seus pratos por Tipos de Cozinha (ex: Italiana, Brasileira, Japonesa, etc)." 
        />
        <FeatureItem 
          icon="chevron.right" 
          text="Filtros Rápidos: Encontre exatamente o que procura filtrando sua lista por categorias." 
        />
        <FeatureItem 
          icon="chevron.right" 
          text="Edite ou remova receitas a qualquer momento." 
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Tecnologias</ThemedText>
        <ThemedText style={styles.techText}>
          Este projeto utiliza o <ThemedText type="defaultSemiBold">React Native</ThemedText> com <ThemedText type="defaultSemiBold">Expo</ThemedText>. 
          O backEnd foi arquitetado usando <ThemedText type="defaultSemiBold">Back4App (Parse)</ThemedText>, 
          enquanto o <ThemedText type="defaultSemiBold">Zustand</ThemedText> cuida do gerenciamento de estado global da aplicação.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.footer}>
        <ExternalLink href="https://github.com/pedroza1308/projeto-pwm-2-gq">
          <ThemedText type="link">
            <IconSymbol name="paperplane.fill" size={18} color="#0a7ea4" /> Ver projeto no GitHub
          </ThemedText>
        </ExternalLink>
      </ThemedView>
    </ParallaxScrollView>
  );
}

function FeatureItem({ icon, text }: { icon: any, text: string }) {
  return (
    <ThemedView style={styles.featureItem}>
      <IconSymbol name={icon} size={20} color="#0a7ea4" style={styles.featureIcon} />
      <ThemedText style={styles.featureText}>{text}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -50,
    left: -30,
    position: 'absolute',
    opacity: 0.8,
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
    marginBottom: 20,
  },
});