import React, { useState, useEffect, useCallback } from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image,} from 'react-native';
import { useRouter } from 'expo-router';

const API_URL = 'http://10.92.201.130:3000/filmes';

export default function catalogo() {
  const router = useRouter();

  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchFilmes = async () => {
    try {
      setError(null);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Erro na resposta do servidor: ${response.status}`);
      }

      const data = await response.json();
      setFilmes(data);
    } catch (err) {
      console.error('Erro ao procurar os filmes:', err);
      setError('Não foi possível carregar o catálogo. Verifique a sua ligação.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFilmes();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFilmes();
  }, []);

  const renderFilmeItem = ({ item }) => {
    const nome = item.nome || item.titulo || 'Sem título';
    const ano = item.ano || item.year || '';
    const duracao = item.duracao || item.duration || '';
    const genero = item.genero || item.genre || 'Geral';
    const imagemUri = item.imagem || item.poster || item.capa;

    const detalhes = item.detalhes || [ano, duracao].filter(Boolean).join(' · ');

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.7}
        onPress={() => {
        router.push({
          pathname: '/detalhes',
          params: { id: item.id },
        });
}}
      >
        {imagemUri ? (
          <Image source={{ uri: imagemUri }} style={styles.posterImage} />
        ) : (
          <View style={styles.posterPlaceholder} />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.itemTitle}>{nome}</Text>
          {detalhes ? <Text style={styles.itemDetails}>{detalhes}</Text> : null}
          <View style={styles.genreTag}>
            <Text style={styles.genreText}>{genero}</Text>
          </View>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SENAIFLIX</Text>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Catálogo</Text>
      </View>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E52312" />
          <Text style={styles.loadingText}>A carregar o catálogo...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchFilmes}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filmes}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderFilmeItem}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#E52312']}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>Nenhum filme encontrado.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: '#222222',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#E52312',
    letterSpacing: -0.5,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D0D0',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D0D0',
    backgroundColor: '#F2F2F2',
  },
  posterPlaceholder: {
    width: 75,
    height: 105,
    backgroundColor: '#EBEBEB',
    borderWidth: 1.5,
    borderColor: '#B0B0B0',
    marginRight: 16,
  },
  posterImage: {
    width: 75,
    height: 105,
    marginRight: 16,
    borderRadius: 2,
    backgroundColor: '#EBEBEB',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 8,
  },
  genreTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
  },
  genreText: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 22,
    color: '#111111',
    fontWeight: '400',
    marginLeft: 8,
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
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
  retryButton: {
    backgroundColor: '#E52312',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});