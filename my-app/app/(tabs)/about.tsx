import { StyleSheet, View, ScrollView } from 'react-native';
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
          size={260}
          color="#FFA500"
          name="info.circle.fill"
          style={styles.headerImage}
        />
      }>
      
      <View style={styles.contentContainer}>
        
        
        <View style={styles.mainHeader}>
          <ThemedText style={styles.appTitle}>Daily Meals</ThemedText>
          <ThemedText style={styles.appSubtitle}>Versão 1.0.0</ThemedText>
        </View>

        
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <IconSymbol name="house.fill" size={22} color="#FFA500" />
            <ThemedText style={styles.cardTitle}>Sobre o Projeto</ThemedText>
          </View>
          <ThemedText style={styles.cardBody}>
            O Daily Meals é o seu assistente pessoal de cozinha. Organize suas receitas favoritas, filtre por categorias e nunca mais esqueça aquele ingrediente especial.
          </ThemedText>
        </View>

        
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <IconSymbol name="star.fill" size={22} color="#FFA500" />
            <ThemedText style={styles.cardTitle}>O que você pode fazer</ThemedText>
          </View>
          
          <View style={styles.featureList}>
            <FeatureRow text="Cadastrar novas receitas completas" />
            <FeatureRow text="Filtrar por tipo de cozinha" />
            <FeatureRow text="Gerenciar tempo e dificuldade" />
            <FeatureRow text="Excluir ou editar registros" />
          </View>
        </View>

        
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <IconSymbol name="chevron.left.forwardslash.chevron.right" size={22} color="#FFA500" />
            <ThemedText style={styles.cardTitle}>Tech Stack</ThemedText>
          </View>
          <ThemedText style={styles.cardBody}>
            Desenvolvido com tecnologias modernas para garantir performance e escalabilidade.
          </ThemedText>
          
          <View style={styles.techRow}>
            <TechBadge text="React Native" />
            <TechBadge text="Expo" />
            <TechBadge text="TypeScript" />
            <TechBadge text="Zustand" />
            <TechBadge text="Parse / Back4App" />
          </View>
        </View>

        
        <View style={styles.footerContainer}>
          <ExternalLink href="https://github.com/pedroza1308/projeto-pwm-2-gq" style={styles.githubButton}>
            <IconSymbol name="paperplane.fill" size={20} color="#FFF" style={{marginRight: 10}} />
            <ThemedText style={styles.githubButtonText}>Acessar Repositório</ThemedText>
          </ExternalLink>
          
          <ThemedText style={styles.copyright}>
            © 2025 Daily Meals Team
          </ThemedText>
        </View>

      </View>
    </ParallaxScrollView>
  );
}


function FeatureRow({ text }: { text: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.bullet} />
      <ThemedText style={styles.featureText}>{text}</ThemedText>
    </View>
  );
}

// Componente auxiliar para Badge de tecnologia
function TechBadge({ text }: { text: string }) {
  return (
    <View style={styles.techBadge}>
      <ThemedText style={styles.techBadgeText}>{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
 
  headerImage: {
    bottom: -50,
    left: -30,
    position: 'absolute',
    opacity: 0.2, // Marca d'água suave
    transform: [{ rotate: '-15deg' }]
  },
  
  
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    backgroundColor: 'transparent', 
  },

  
  mainHeader: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFA500', 
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, 
    padding: 20,
    marginBottom: 16,
    

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4, 
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529', 
    marginLeft: 10,
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6C757D', 
  },

 
  featureList: {
    marginTop: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFA500', 
    marginRight: 10,
  },
  featureText: {
    fontSize: 15,
    color: '#495057',
    fontWeight: '500',
  },

 
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  techBadge: {
    backgroundColor: '#FFF8E1', 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  techBadgeText: {
    color: '#E65100', 
    fontSize: 12,
    fontWeight: '600',
  },


  footerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  githubButton: {
    backgroundColor: '#212529', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 50, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    width: '100%',
  },
  githubButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  copyright: {
    marginTop: 16,
    fontSize: 12,
    color: '#ADB5BD',
  }
});