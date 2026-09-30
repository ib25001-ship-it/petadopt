import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://gitbeqrodaclyehxfagz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_adYk2iJVBYC95vZS5rmvbA_d2wugmk1';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Estado para llevar el control de los corazoncitos marcados por ID
  const [favoritos, setFavoritos] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchMascotas();
  }, []);

  async function fetchMascotas() {
    try {
      const { data, error } = await supabase.from('mascota').select('*');
      console.log('Datos recibidos de Supabase:', data);
      if (error) {
        console.error('Error al consultar mascotas:', error);
      } else {
        setMascotas(data || []);
      }
    } catch (err) {
      console.error('Error inesperado:', err);
    } finally {
      setLoading(false);
    }
  }

  // Toggle para favoritos
  const toggleFavorito = (id: string | number) => {
    setFavoritos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Función de alerta para adopción
  const handleAdoptar = (nombreMascota: string) => {
    Alert.alert(
        '¡Solicitud de Adopción!',
        `¿Deseas iniciar el proceso de adopción para ${nombreMascota}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sí, adoptar', onPress: () => Alert.alert('¡Éxito!', 'Tu solicitud ha sido enviada.') },
        ]
    );
  };

  // Filtrar mascotas por texto de búsqueda y por categoría seleccionada
  const mascotasFiltradas = mascotas.filter((item) => {
    const nombre = item.nombre?.toLowerCase() || '';
    const raza = item.raza?.toLowerCase() || '';
    const desc = item.descripcion?.toLowerCase() || '';

    // Filtro por texto del buscador
    const textoMatch = nombre.includes(busqueda.toLowerCase()) || raza.includes(busqueda.toLowerCase());

    // Filtro por categoría superior
    if (categoriaSeleccionada === 'Todos') {
      return textoMatch;
    } else if (categoriaSeleccionada === 'Perros') {
      return textoMatch && (raza.includes('perro') || raza.includes('labrador') || raza.includes('bulldog') || raza.includes('golden') || raza.includes('pastor'));
    } else if (categoriaSeleccionada === 'Gatos') {
      return textoMatch && (raza.includes('gato') || raza.includes('gata') || raza.includes('siamés') || raza.includes('persa'));
    } else if (categoriaSeleccionada === 'Aves') {
      return textoMatch && (raza.includes('ave') || raza.includes('perico') || raza.includes('loro') || raza.includes('canario'));
    } else if (categoriaSeleccionada === 'Roedores') {
      return textoMatch && (raza.includes('hámster') || raza.includes('hamster') || raza.includes('conejo') || raza.includes('cuyo'));
    }

    return textoMatch;
  });

  const renderItemMascota = ({ item }: { item: any }) => {
    const mascotaId = item.id_mascota || item.id;
    const esFavorito = favoritos[mascotaId] || false;

    return (
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
                source={{
                  uri:
                      item.imagen ||
                      'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
                }}
                style={styles.cardImage}
            />
            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorito(mascotaId)}
            >
              <Text style={[styles.heartText, esFavorito && styles.heartTextActive]}>
                {esFavorito ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardCategory}>{item.estado || 'DISPONIBLE'}</Text>
            <Text style={styles.petName}>{item.nombre}</Text>
            <Text style={styles.petDetails} numberOfLines={1}>
              Raza: {item.raza}
            </Text>
            <Text style={styles.petDetails}>Edad: {item.edad} años</Text>

            <TouchableOpacity
                style={styles.adoptButton}
                onPress={() => handleAdoptar(item.nombre)}
            >
              <Text style={styles.adoptButtonText}>+ Adoptar</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  };

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        {/* Barra superior */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>🐾 PetAdopt - Mascotas</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {/* Títulos de sección */}
          <View style={styles.subHeader}>
            <Text style={styles.exploradorText}>EXPLORADOR</Text>
            <Text style={styles.catalogoText}>Catálogo de Mascotas</Text>
          </View>

          {/* Buscador */}
          <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar perros, gatos, edades..."
                placeholderTextColor="#888"
                value={busqueda}
                onChangeText={setBusqueda}
            />
          </View>

          {/* Categorías horizontales */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {['Todos', 'Perros', 'Gatos', 'Aves', 'Roedores'].map((cat) => (
                <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      categoriaSeleccionada === cat && styles.categoryChipSelected,
                    ]}
                    onPress={() => setCategoriaSeleccionada(cat)}
                >
                  <Text
                      style={[
                        styles.categoryText,
                        categoriaSeleccionada === cat && styles.categoryTextSelected,
                      ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.resultsInfoRow}>
            <Text style={styles.resultsCount}>• {mascotasFiltradas.length} mascotas encontradas</Text>
            <Text style={styles.relevanceText}>↕ Relevancia</Text>
          </View>

          {loading ? (
              <Text style={styles.text}>Cargando datos de Supabase...</Text>
          ) : (
              <FlatList
                  data={mascotasFiltradas}
                  renderItem={renderItemMascota}
                  keyExtractor={(item, index) =>
                      item.id_mascota ? item.id_mascota.toString() : index.toString()
                  }
                  numColumns={2}
                  scrollEnabled={false}
                  columnWrapperStyle={styles.rowWrapper}
                  ListEmptyComponent={
                    <Text style={styles.text}>No hay mascotas registradas para esta categoría.</Text>
                  }
              />
          )}
        </ScrollView>

        {/* Barra de Navegación Inferior */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => setCategoriaSeleccionada('Todos')}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabel}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setCategoriaSeleccionada('Todos')}>
            <Text style={styles.navIcon}>🐾</Text>
            <Text style={[styles.navLabel, styles.navLabelActive]}>Mascotas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => Alert.alert('Carrito', 'No hay solicitudes en proceso.')}>
            <Text style={styles.navIcon}>🛒</Text>
            <Text style={styles.navLabel}>Carrito</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => Alert.alert('Perfil', 'Sesión iniciada como Usuario.')}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  header: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 90,
  },
  subHeader: {
    marginBottom: 12,
  },
  exploradorText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '700',
    letterSpacing: 1,
  },
  catalogoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    fontSize: 14,
    color: '#333',
    height: 40,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: '#E4E9F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
  },
  categoryChipSelected: {
    backgroundColor: '#0033cc',
  },
  categoryText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 13,
  },
  categoryTextSelected: {
    color: '#fff',
  },
  resultsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 13,
    color: '#555',
  },
  relevanceText: {
    fontSize: 13,
    color: '#0033cc',
    fontWeight: '600',
  },
  rowWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '48%',
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
    elevation: 2,
  },
  imageContainer: {
    height: 130,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heartTextActive: {
    color: '#ff3366',
  },
  cardContent: {
    padding: 10,
  },
  cardCategory: {
    fontSize: 10,
    color: '#0033cc',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2b2b2b',
  },
  petDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  adoptButton: {
    backgroundColor: '#0033cc',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  adoptButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 18,
  },
  navLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#0033cc',
    fontWeight: 'bold',
  },
});