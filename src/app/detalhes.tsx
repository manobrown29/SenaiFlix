import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView, Image, ActivityIndicator} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const API_URL = 'http://10.92.201.130:3000/filmes';

export default function DetalhesScreen() {
  const { id } = useLocalSearchParams();

  const [filme, setFilme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetalhesFilme = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error(`Erro na resposta do servidor: ${response.status}`);
        }

        const data = await response.json();
        const filmeData = Array.isArray(data) ? data[0] : data;
        setFilme(filmeData);
      } catch (err) {
        console.error('Erro ao procurar detalhes do filme:', err);
        setError('Não foi possível carregar os detalhes do filme.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetalhesFilme();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E52312" />
          <Text style={styles.loadingText}>A carregar detalhes...</Text>
        </View>
      </View>
    );
  }

  if (error || !filme) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {error || 'Filme não encontrado.'}
          </Text>
        </View>
      </View>
    );
  }

  const titulo = filme.nome ||'Sem título';
  const ano = filme.ano || '';
  const duracao = filme.duracao || '';
  const classificacao = filme.classificacao ='L';
  const sinopse = filme.sinopse = 'Nenhuma sinopse disponível.';
  const genero = filme.genero = 'Geral';
  const direcao = filme.diretor = 'Não informada';
  const bannerUri = filme.poster ;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner Superior do Filme */}
        <View style={styles.bannerContainer}>
          {bannerUri ? (
            <Image
              source={{ uri: bannerUri }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.bannerPlaceholder}>
              <View style={styles.bannerBadge}>
                <Text style={styles.bannerBadgeText}>banner do filme</Text>
              </View>
            </View>
          )}
        </View>

        {/* Informações e Detalhes do Filme */}
        <View style={styles.contentContainer}>
          {/* Título do Filme */}
          <Text style={styles.title}>{titulo}</Text>

          {/* Linha de Metadados: Ano · Duração · Classificação */}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {[ano, duracao].filter(Boolean).join('  ·  ')}
              {ano || duracao ? '  ·  ' : ''}
            </Text>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>{classificacao}</Text>
            </View>
          </View>

          {/* Botão Assistir */}
          <TouchableOpacity
            style={styles.playButton}
            activeOpacity={0.8}
            onPress={() => console.log('Assistir:', titulo)}
          >
            <Text style={styles.playIcon}>▶</Text>
            <Text style={styles.playButtonText}>Assistir</Text>
          </TouchableOpacity>

          {/* Botão Minha Lista */}
          <TouchableOpacity
            style={styles.listButton}
            activeOpacity={0.8}
            onPress={() => console.log('Adicionado à lista:', titulo)}
          >
            <Text style={styles.listIcon}>+</Text>
            <Text style={styles.listButtonText}>Minha lista</Text>
          </TouchableOpacity>

          {/* Divisor */}
          <View style={styles.divider} />

          {/* Secção Sinopse */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SINOPSE</Text>
            <Text style={styles.synopsisText}>{sinopse}</Text>
          </View>

          {/* Divisor */}
          <View style={styles.divider} />

          {/* Linhas de Informações Secundárias */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gênero</Text>
            <Text style={styles.infoValue}>{genero}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Direção</Text>
            <Text style={styles.infoValue}>{direcao}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    fontSize: 16,
    color: '#E52312',
    textAlign: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#EBEBEB',
    borderBottomWidth: 1.5,
    borderBottomColor: '#222222',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: '#EBEBEB',
  },
  bannerBadge: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  bannerBadgeText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#333333',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  metaText: {
    fontSize: 15,
    color: '#555555',
    fontWeight: '500',
  },
  ratingBox: {
    borderWidth: 1.5,
    borderColor: '#E52312',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  ratingText: {
    color: '#E52312',
    fontSize: 13,
    fontWeight: '700',
  },
  playButton: {
    backgroundColor: '#E52312',
    height: 50,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 10,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  listButton: {
    backgroundColor: '#EAEAEA',
    height: 50,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: '#B0B0B0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  listIcon: {
    color: '#111111',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 10,
  },
  listButtonText: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '800',
  },
  divider: {
    height: 1.5,
    backgroundColor: '#B0B0B0',
    marginVertical: 16,
  },
  section: {
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  synopsisText: {
    fontSize: 15,
    color: '#222222',
    lineHeight: 22,
    fontWeight: '400',
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'center',
  },
  infoLabel: {
    width: 90,
    fontSize: 15,
    color: '#666666',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: '#111111',
    fontWeight: '600',
  },
});