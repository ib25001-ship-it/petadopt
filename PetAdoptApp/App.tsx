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
  Modal,
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

  // Control de pestañas de navegación inferior: 'catalogo' | 'carrito' | 'perfil'
  const [pestanaActiva, setPestanaActiva] = useState<'catalogo' | 'carrito' | 'perfil'>('catalogo');

  // Estado de favoritos
  const [favoritos, setFavoritos] = useState<{ [key: string]: boolean }>({});

  // Carrito de adopción
  const [carrito, setCarrito] = useState<any[]>([]);

  // Estados para la vista de detalle de mascota
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Estados editables del Perfil
  const [nombreUsuario, setNombreUsuario] = useState('César Antonio Ibáñez Bautista');
  const [rolUsuario, setRolUsuario] = useState('Estudiante en Ingeniería de Desarrollo de Software');
  const [ubicacionUsuario, setUbicacionUsuario] = useState('Sonsonate, El Salvador');
  const [institucionUsuario, setInstitucionUsuario] = useState('Escuela Superior Franciscana Especializada (ESFE / AGAPE)');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [inputAvatarTemp, setInputAvatarTemp] = useState('');
  const [editandoPerfil, setEditandoPerfil] = useState(false);

  useEffect(() => {
    fetchMascotas();
    cargarDatosPerfil();
  }, []);

  async function fetchMascotas() {
    try {
      const { data, error } = await supabase.from('mascota').select('*');
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

  async function cargarDatosPerfil() {
    try {
      const savedNombre = await AsyncStorage.getItem('@perfil_nombre');
      const savedRol = await AsyncStorage.getItem('@perfil_rol');
      const savedUbicacion = await AsyncStorage.getItem('@perfil_ubicacion');
      const savedInstitucion = await AsyncStorage.getItem('@perfil_institucion');
      const savedAvatar = await AsyncStorage.getItem('@perfil_avatar');

      if (savedNombre) setNombreUsuario(savedNombre);
      if (savedRol) setRolUsuario(savedRol);
      if (savedUbicacion) setUbicacionUsuario(savedUbicacion);
      if (savedInstitucion) setInstitucionUsuario(savedInstitucion);
      if (savedAvatar) {
        setAvatarUrl(savedAvatar);
        setInputAvatarTemp(savedAvatar);
      }
    } catch (e) {
      console.error('Error al cargar perfil local', e);
    }
  }

  async function guardarPerfil() {
    try {
      await AsyncStorage.setItem('@perfil_nombre', nombreUsuario);
      await AsyncStorage.setItem('@perfil_rol', rolUsuario);
      await AsyncStorage.setItem('@perfil_ubicacion', ubicacionUsuario);
      await AsyncStorage.setItem('@perfil_institucion', institucionUsuario);
      await AsyncStorage.setItem('@perfil_avatar', inputAvatarTemp);
      setAvatarUrl(inputAvatarTemp);
      setEditandoPerfil(false);
      Alert.alert('¡Éxito!', 'Tus datos de perfil han sido actualizados correctamente.');
    } catch (e) {
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    }
  }

  const toggleFavorito = (id: string | number) => {
    setFavoritos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAdoptar = (item: any) => {
    const mascotaId = item.id_mascota || item.id;
    const yaExiste = carrito.some((m) => (m.id_mascota || m.id) === mascotaId);

    if (yaExiste) {
      Alert.alert('Aviso', `${item.nombre} ya está agregado a tu carrito de adopción.`);
    } else {
      setCarrito((prev) => [...prev, item]);
      Alert.alert(
          '¡Agregado al Carrito!',
          `Has solicitado iniciar el proceso de adopción para ${item.nombre}. Revisa tu sección de Carrito.`
      );
    }
  };

  const eliminarDelCarrito = (mascotaId: any) => {
    setCarrito((prev) => prev.filter((m) => (m.id_mascota || m.id) !== mascotaId));
  };

  const verDetalleMascota = (item: any) => {
    setMascotaSeleccionada(item);
    setModalVisible(true);
  };

  // Filtrar mascotas
  const mascotasFiltradas = mascotas.filter((item) => {
    const nombre = item.nombre?.toLowerCase() || '';
    const raza = item.raza?.toLowerCase() || '';
    const textoMatch = nombre.includes(busqueda.toLowerCase()) || raza.includes(busqueda.toLowerCase());

    if (categoriaSeleccionada === 'Todos') return textoMatch;
    if (categoriaSeleccionada === 'Perros') return textoMatch && (raza.includes('perro') || raza.includes('labrador') || raza.includes('bulldog') || raza.includes('golden') || raza.includes('pastor') || raza.includes('salchicha'));
    if (categoriaSeleccionada === 'Gatos') return textoMatch && (raza.includes('gato') || raza.includes('gata') || raza.includes('siamés') || raza.includes('persa') || raza.includes('atigrado'));
    if (categoriaSeleccionada === 'Aves') return textoMatch && (raza.includes('ave') || raza.includes('perico') || raza.includes('loro') || raza.includes('canario'));
    if (categoriaSeleccionada === 'Roedores') return textoMatch && (raza.includes('hámster') || raza.includes('hamster') || raza.includes('conejo') || raza.includes('cuyo'));

    return textoMatch;
  });

  const renderItemMascota = ({ item }: { item: any }) => {
    const mascotaId = item.id_mascota || item.id;
    const esFavorito = favoritos[mascotaId] || false;

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => verDetalleMascota(item)}>
          <View style={styles.imageContainer}>
            <Image
                source={{
                  uri: item.imagen || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
                }}
                style={styles.cardImage}
            />
            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorito(mascotaId);
                }}
            >
              <Text style={[styles.heartText, esFavorito && styles.heartTextActive]}>
                {esFavorito ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardCategory}>{item.estado || 'DISPONIBLE'}</Text>
            <Text style={styles.petName}>{item.nombre}</Text>
            <Text style={styles.petDetails} numberOfLines={1}>Raza: {item.raza}</Text>
            <Text style={styles.petDetails}>Edad: {item.edad} años</Text>

            <TouchableOpacity
                style={styles.adoptButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleAdoptar(item);
                }}
            >
              <Text style={styles.adoptButtonText}>+ Adoptar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
    );
  };

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        {/* Barra superior */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>🐾 PetAdopt - Catálogo Ejecutivo</Text>
          </View>
        </View>

        {/* CONTENIDO SEGÚN LA PESTAÑA ACTIVA */}
        {pestanaActiva === 'catalogo' && (
            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
              <View style={styles.subHeader}>
                <Text style={styles.exploradorText}>EXPLORADOR</Text>
                <Text style={styles.catalogoText}>Catálogo de Mascotas</Text>
              </View>

              <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar perros, gatos, razas..."
                    placeholderTextColor="#94A3B8"
                    value={busqueda}
                    onChangeText={setBusqueda}
                />
              </View>

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
                      keyExtractor={(item, index) => (item.id_mascota ? item.id_mascota.toString() : index.toString())}
                      numColumns={2}
                      scrollEnabled={false}
                      columnWrapperStyle={styles.rowWrapper}
                      ListEmptyComponent={
                        <Text style={styles.text}>No hay mascotas registradas para esta categoría.</Text>
                      }
                  />
              )}
            </ScrollView>
        )}

        {pestanaActiva === 'carrito' && (
            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
              <View style={styles.subHeader}>
                <Text style={styles.exploradorText}>SOLICITUDES</Text>
                <Text style={styles.catalogoText}>Carrito de Adopción ({carrito.length})</Text>
              </View>

              {carrito.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>🛒</Text>
                    <Text style={styles.emptyText}>Tu carrito está vacío.</Text>
                    <Text style={styles.emptySubText}>Explora el catálogo y solicita adoptar a tu compañero ideal.</Text>
                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => setPestanaActiva('catalogo')}
                    >
                      <Text style={styles.exploreButtonText}>Ver Catálogo</Text>
                    </TouchableOpacity>
                  </View>
              ) : (
                  <>
                    {carrito.map((item, index) => {
                      const mId = item.id_mascota || item.id || index;
                      return (
                          <View key={mId} style={styles.cartCard}>
                            <Image
                                source={{ uri: item.imagen || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1' }}
                                style={styles.cartImage}
                            />
                            <View style={styles.cartInfo}>
                              <Text style={styles.cartName}>{item.nombre}</Text>
                              <Text style={styles.cartDetails}>Raza: {item.raza}</Text>
                              <Text style={styles.cartDetails}>Edad: {item.edad} años</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => eliminarDelCarrito(mId)}
                            >
                              <Text style={styles.deleteButtonText}>✕</Text>
                            </TouchableOpacity>
                          </View>
                      );
                    })}

                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={() => {
                          Alert.alert('¡Proceso Enviado!', 'Tus solicitudes de adopción han sido enviadas al refugio exitosamente.');
                          setCarrito([]);
                        }}
                    >
                      <Text style={styles.checkoutButtonText}>Confirmar Solicitudes de Adopción</Text>
                    </TouchableOpacity>
                  </>
              )}
            </ScrollView>
        )}

        {pestanaActiva === 'perfil' && (
            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
              <View style={styles.profileHeaderCard}>
                <View style={styles.avatarContainer}>
                  {avatarUrl ? (
                      <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                  ) : (
                      <Text style={styles.avatarText}>{nombreUsuario ? nombreUsuario.charAt(0) : 'C'}</Text>
                  )}
                </View>
                <Text style={styles.profileName}>{nombreUsuario}</Text>
                <Text style={styles.profileRole}>{rolUsuario}</Text>
                <Text style={styles.profileLocation}>📍 {ubicacionUsuario}</Text>
              </View>

              {editandoPerfil ? (
                  <View style={styles.editFormContainer}>
                    <Text style={styles.sectionTitle}>Editar Información Personal</Text>

                    <Text style={styles.inputLabel}>Nombre Completo:</Text>
                    <TextInput style={styles.inputField} value={nombreUsuario} onChangeText={setNombreUsuario} />

                    <Text style={styles.inputLabel}>Rol / Profesión:</Text>
                    <TextInput style={styles.inputField} value={rolUsuario} onChangeText={setRolUsuario} />

                    <Text style={styles.inputLabel}>Ubicación:</Text>
                    <TextInput style={styles.inputField} value={ubicacionUsuario} onChangeText={setUbicacionUsuario} />

                    <Text style={styles.inputLabel}>Institución:</Text>
                    <TextInput style={styles.inputField} value={institucionUsuario} onChangeText={setInstitucionUsuario} />

                    <Text style={styles.inputLabel}>URL de Foto de Perfil:</Text>
                    <TextInput
                        style={styles.inputField}
                        placeholder="https://ejemplo.com/foto.jpg"
                        placeholderTextColor="#94A3B8"
                        value={inputAvatarTemp}
                        onChangeText={setInputAvatarTemp}
                    />

                    <View style={styles.editButtonsRow}>
                      <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={() => setEditandoPerfil(false)}>
                        <Text style={styles.cancelBtnText}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={guardarPerfil}>
                        <Text style={styles.saveBtnText}>Guardar Cambios</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
              ) : (
                  <>
                    <View style={styles.profileSection}>
                      <Text style={styles.sectionTitle}>Información Académica</Text>
                      <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>Institución:</Text>
                        <Text style={styles.infoValue}>{institucionUsuario}</Text>
                      </View>
                    </View>

                    <View style={styles.profileSection}>
                      <Text style={styles.sectionTitle}>Actividad en PetAdopt</Text>
                      <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>Mascotas en Carrito:</Text>
                        <Text style={styles.infoValue}>{carrito.length} solicitudes activas</Text>
                      </View>
                      <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>Estado de Cuenta:</Text>
                        <Text style={[styles.infoValue, { color: '#10B981', fontWeight: 'bold' }]}>Activo / Verificado</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                        style={styles.editProfileButton}
                        onPress={() => setEditandoPerfil(true)}
                    >
                      <Text style={styles.editProfileButtonText}>Editar Perfil y Foto</Text>
                    </TouchableOpacity>
                  </>
              )}
            </ScrollView>
        )}

        {/* MODAL / PANTALLA DE DETALLE DE MASCOTA */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {mascotaSeleccionada && (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Image
                        source={{ uri: mascotaSeleccionada.imagen || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1' }}
                        style={styles.modalImage}
                    />

                    <TouchableOpacity
                        style={styles.closeModalBtn}
                        onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeModalBtnText}>✕</Text>
                    </TouchableOpacity>

                    <View style={styles.modalBody}>
                      <Text style={styles.modalCategory}>{mascotaSeleccionada.estado || 'DISPONIBLE'}</Text>
                      <Text style={styles.modalTitle}>{mascotaSeleccionada.nombre}</Text>

                      <View style={styles.modalInfoRow}>
                        <View style={styles.modalBadge}>
                          <Text style={styles.modalBadgeText}>Raza: {mascotaSeleccionada.raza}</Text>
                        </View>
                        <View style={styles.modalBadge}>
                          <Text style={styles.modalBadgeText}>Edad: {mascotaSeleccionada.edad} años</Text>
                        </View>
                      </View>

                      <Text style={styles.modalSectionTitle}>Acerca de {mascotaSeleccionada.nombre}:</Text>
                      <Text style={styles.modalDescription}>
                        {mascotaSeleccionada.descripcion || 'Sin descripción detallada registrada para esta mascota. ¡Es un excelente compañero que busca un hogar lleno de amor!'}
                      </Text>

                      <TouchableOpacity
                          style={styles.modalAdoptBtn}
                          onPress={() => {
                            setModalVisible(false);
                            handleAdoptar(mascotaSeleccionada);
                          }}
                      >
                        <Text style={styles.modalAdoptBtnText}>Solicitar Adopción</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
              )}
            </View>
          </View>
        </Modal>

        {/* Barra de Navegación Inferior */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
              style={styles.navItem}
              onPress={() => {
                setPestanaActiva('catalogo');
                setCategoriaSeleccionada('Todos');
                setBusqueda('');
              }}
          >
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={[styles.navLabel, pestanaActiva === 'catalogo' && styles.navLabelActive]}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.navItem}
              onPress={() => {
                setPestanaActiva('catalogo');
                setCategoriaSeleccionada('Todos');
              }}
          >
            <Text style={styles.navIcon}>🐾</Text>
            <Text style={[styles.navLabel, pestanaActiva === 'catalogo' && styles.navLabelActive]}>Mascotas</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.navItem}
              onPress={() => setPestanaActiva('carrito')}
          >
            <View>
              <Text style={styles.navIcon}>🛒</Text>
              {carrito.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{carrito.length}</Text>
                  </View>
              )}
            </View>
            <Text style={[styles.navLabel, pestanaActiva === 'carrito' && styles.navLabelActive]}>Carrito</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.navItem}
              onPress={() => {
                setPestanaActiva('perfil');
                setEditandoPerfil(false);
              }}
          >
            <Text style={styles.navIcon}>👤</Text>
            <Text style={[styles.navLabel, pestanaActiva === 'perfil' && styles.navLabelActive]}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingVertical: 16, paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1E293B', letterSpacing: 0.5 },
  scrollBody: { padding: 18, paddingBottom: 90 },
  subHeader: { marginBottom: 14 },
  exploradorText: { fontSize: 10, color: '#64748B', fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  catalogoText: { fontSize: 24, fontWeight: '700', color: '#0F172A', letterSpacing: -0.5 },
  searchContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 18, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 2, elevation: 1 },
  searchInput: { fontSize: 14, color: '#1E293B', height: 44 },
  categoriesContainer: { marginBottom: 18 },
  categoryChip: { backgroundColor: '#F1F5F9', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, marginRight: 10, height: 38, justifyContent: 'center' },
  categoryChipSelected: { backgroundColor: '#0F172A' },
  categoryText: { color: '#475569', fontWeight: '500', fontSize: 13 },
  categoryTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  resultsInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  resultsCount: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  relevanceText: { fontSize: 13, color: '#0F172A', fontWeight: '600' },
  rowWrapper: { justifyContent: 'space-between' },

  card: { backgroundColor: '#FFFFFF', borderRadius: 16, width: '48%', marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  imageContainer: { height: 140, position: 'relative' },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  favoriteButton: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 14, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  heartText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  heartTextActive: { color: '#F43F5E' },
  cardContent: { padding: 12 },
  cardCategory: { fontSize: 10, color: '#64748B', fontWeight: '700', letterSpacing: 0.8, marginBottom: 4, textTransform: 'uppercase' },
  petName: { fontSize: 16, fontWeight: '700', color: '#0F172A', letterSpacing: -0.3 },
  petDetails: { fontSize: 12, color: '#475569', marginTop: 3 },
  adoptButton: { backgroundColor: '#0F172A', borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginTop: 10 },
  adoptButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
  text: { textAlign: 'center', color: '#64748B', marginTop: 20 },

  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
  emptyIcon: { fontSize: 50, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  emptySubText: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  exploreButton: { backgroundColor: '#0F172A', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  exploreButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  cartCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  cartImage: { width: 75, height: 75, borderRadius: 10, resizeMode: 'cover' },
  cartInfo: { flex: 1, marginLeft: 14 },
  cartName: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  cartDetails: { fontSize: 12, color: '#475569', marginTop: 3 },
  deleteButton: { padding: 10 },
  deleteButtonText: { fontSize: 16, color: '#EF4444', fontWeight: 'bold' },
  checkoutButton: { backgroundColor: '#10B981', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  checkoutButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },

  profileHeaderCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  avatarContainer: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', marginBottom: 14, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarText: { color: '#FFFFFF', fontSize: 36, fontWeight: '700' },
  profileName: { fontSize: 20, fontWeight: '700', color: '#0F172A', textAlign: 'center', marginBottom: 4 },
  profileRole: { fontSize: 13, color: '#475569', fontWeight: '600', textAlign: 'center', marginBottom: 6 },
  profileLocation: { fontSize: 12, color: '#64748B' },
  profileSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 10, letterSpacing: -0.2 },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  infoLabel: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  infoValue: { fontSize: 13, color: '#0F172A', fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  editProfileButton: { backgroundColor: '#0F172A', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  editProfileButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
  editFormContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 6, marginTop: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputField: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#0F172A' },
  editButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#F1F5F9', marginRight: 8 },
  cancelBtnText: { color: '#475569', fontWeight: '600' },
  saveBtn: { backgroundColor: '#0F172A', marginLeft: 8 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '85%', paddingBottom: 36, overflow: 'hidden' },
  modalImage: { width: '100%', height: 260, resizeMode: 'cover' },
  closeModalBtn: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: 18, width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  closeModalBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  modalBody: { padding: 24 },
  modalCategory: { fontSize: 11, color: '#64748B', fontWeight: '700', letterSpacing: 1.2, marginBottom: 4, textTransform: 'uppercase' },
  modalTitle: { fontSize: 26, fontWeight: '700', color: '#0F172A', marginBottom: 14, letterSpacing: -0.5 },
  modalInfoRow: { flexDirection: 'row', marginBottom: 20 },
  modalBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginRight: 10 },
  modalBadgeText: { fontSize: 13, color: '#0F172A', fontWeight: '600' },
  modalSectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 8, letterSpacing: -0.2 },
  modalDescription: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 28 },
  modalAdoptBtn: { backgroundColor: '#0F172A', borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 },
  modalAdoptBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0', elevation: 10 },
  navItem: { alignItems: 'center', position: 'relative' },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#64748B', marginTop: 3, fontWeight: '500' },
  navLabelActive: { color: '#0F172A', fontWeight: '700' },
  badge: { position: 'absolute', top: -4, right: -10, backgroundColor: '#F43F5E', borderRadius: 8, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3 },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '700' },
});