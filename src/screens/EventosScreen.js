import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import Animated, { FadeInUp } from "react-native-reanimated";

import NotificationBox from "../components/NotificationBox";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function EventosScreen({ navigation, route }) {
  const rol = route.params?.rol || "usuario";
  const usuarioId = route.params?.usuarioId;

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");

  const [busqueda, setBusqueda] = useState("");
  const [filtroUbicacion, setFiltroUbicacion] = useState("");
  const [soloProximos, setSoloProximos] = useState(false);

  const obtenerEventos = async () => {
    try {
      setLoading(true);

      const response = await api.get("/eventos");

      setEventos(response.data);
    } catch (error) {
      mostrarMensaje("No se pudieron cargar los eventos", "error");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      obtenerEventos();
    }, [])
  );

  const mostrarMensaje = (texto, tipo = "success") => {
    setMensaje(texto);
    setTipoMensaje(tipo);

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  };

  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) => {
      const titulo = evento.titulo?.toLowerCase() || "";
      const ubicacion = evento.ubicacion?.toLowerCase() || "";

      const coincideTitulo = titulo.includes(busqueda.toLowerCase());
      const coincideUbicacion = ubicacion.includes(
        filtroUbicacion.toLowerCase()
      );

      const fechaTexto = evento.fecha?.substring(0, 10);
      const horaTexto = evento.hora || "00:00:00";

      const fechaHoraEvento = new Date(`${fechaTexto}T${horaTexto}`);
      const esProximo = fechaHoraEvento >= new Date();

      if (soloProximos) {
        return coincideTitulo && coincideUbicacion && esProximo;
      }

      return coincideTitulo && coincideUbicacion;
    });
  }, [eventos, busqueda, filtroUbicacion, soloProximos]);

  const inscribirseEvento = async (eventoId) => {
    if (!usuarioId) {
      mostrarMensaje("No se encontró el usuario logueado.", "error");
      return;
    }

    try {
      const response = await api.post("/participaciones", {
        usuario_id: usuarioId,
        evento_id: eventoId,
      });

      mostrarMensaje(
        response.data?.mensaje || "Te has inscrito correctamente al evento",
        "success"
      );
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensaje || "No se pudo realizar la inscripción";

      mostrarMensaje(mensajeError, "warning");
    }
  };

  const eliminarEvento = async (id) => {
    try {
      await api.delete(`/eventos/${id}`);

      Alert.alert("Éxito", "Evento eliminado correctamente");

      obtenerEventos();
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensaje || "No se pudo eliminar el evento";

      Alert.alert("Error", mensajeError);
    }
  };

  const generarTextoEvento = (evento) => {
  return `Te comparto este evento comunitario:

${evento.titulo}

Fecha: ${evento.fecha?.substring(0, 10)}
Hora: ${evento.hora}
Ubicación: ${evento.ubicacion}

Descripción:
${evento.descripcion || "Sin descripción"}

¡Anímate a participar!`;
};

const compartirEvento = async (evento) => {
  try {
    const texto = generarTextoEvento(evento);

    await Share.share({
      title: evento.titulo,
      message: texto,
    });
  } catch (error) {
    Alert.alert("Error", "No se pudo compartir el evento");
  }
};

const compartirPorCorreo = async (evento) => {
  const asunto = encodeURIComponent(`Evento comunitario: ${evento.titulo}`);
  const cuerpo = encodeURIComponent(generarTextoEvento(evento));

  const url = `mailto:?subject=${asunto}&body=${cuerpo}`;

  try {
    const soportado = await Linking.canOpenURL(url);

    if (soportado) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Aviso", "No hay una app de correo configurada en este dispositivo");
    }
  } catch (error) {
    Alert.alert("Error", "No se pudo abrir el correo");
  }
};

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroUbicacion("");
    setSoloProximos(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemeToggleButton />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Regresar</Text>
      </TouchableOpacity>

      {rol === "admin" && (
        <TouchableOpacity
          style={styles.botonCrear}
          onPress={() => navigation.navigate("CrearEvento")}
        >
          <Text style={styles.botonTexto}>+ Crear Evento</Text>
        </TouchableOpacity>
      )}

      <View style={styles.filtrosCard}>
        <Text style={styles.filtrosTitle}>Buscar eventos</Text>

        <TextInput
          style={styles.input}
          placeholder="Buscar por título"
          placeholderTextColor={theme.subText}
          value={busqueda}
          onChangeText={setBusqueda}
        />

        <TextInput
          style={styles.input}
          placeholder="Filtrar por ubicación"
          placeholderTextColor={theme.subText}
          value={filtroUbicacion}
          onChangeText={setFiltroUbicacion}
        />

        <View style={styles.filtroBotones}>
          <TouchableOpacity
            style={[
              styles.filtroButton,
              soloProximos && styles.filtroButtonActivo,
            ]}
            onPress={() => setSoloProximos(!soloProximos)}
          >
            <Text
              style={[
                styles.filtroButtonText,
                soloProximos && styles.filtroButtonTextActivo,
              ]}
            >
              Solo próximos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.limpiarButton} onPress={limpiarFiltros}>
            <Text style={styles.limpiarButtonText}>Limpiar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <NotificationBox message={mensaje} type={tipoMensaje} />

      <Text style={styles.resultadosText}>
        Resultados: {eventosFiltrados.length}
      </Text>

      <FlatList
        data={eventosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No se encontraron eventos con esos filtros.
          </Text>
        }
        renderItem={({ item }) => (
          <Animated.View
            entering={FadeInUp.duration(500)}
            style={styles.card}
          >
            {item.imagen && item.imagen.trim() !== "" ? (
              <Image
                source={{ uri: item.imagen }}
                style={styles.eventImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noImageBox}>
                <Text style={styles.noImageText}>Sin imagen</Text>
              </View>
            )}

            <View style={styles.badge}>
              <Text style={styles.badgeText}>Evento disponible</Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("DetalleEvento", { evento: item })}
            >
              <Text style={styles.nombre}>{item.titulo}</Text>

              <Text style={styles.text}>
                📅 Fecha: {item.fecha?.substring(0, 10)}
              </Text>

              <Text style={styles.text}>⏰ Hora: {item.hora}</Text>

              <Text style={styles.text}>📍 Ubicación: {item.ubicacion}</Text>
            </TouchableOpacity>

            {rol === "admin" ? (
              <View style={styles.acciones}>
                <TouchableOpacity
                  style={styles.botonEditar}
                  onPress={() =>
                    navigation.navigate("EditarEvento", {
                      evento: item,
                    })
                  }
                >
                  <Text style={styles.botonAccionTexto}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botonEliminar}
                  onPress={() => eliminarEvento(item.id)}
                >
                  <Text style={styles.botonAccionTexto}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.botonInscribirse}
                onPress={() => inscribirseEvento(item.id)}
              >
                <Text style={styles.botonAccionTexto}>Inscribirme</Text>
              </TouchableOpacity>
            )}

            <View style={styles.compartirContainer}>
  <TouchableOpacity
    style={styles.compartirButton}
    onPress={() => compartirEvento(item)}
  >
    <Text style={styles.compartirText}>Compartir</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.emailButton}
    onPress={() => compartirPorCorreo(item)}
  >
    <Text style={styles.compartirText}>Correo</Text>
  </TouchableOpacity>
</View>
          </Animated.View>
        )}
      />
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: theme.background,
    },

    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },

    backButton: {
      marginBottom: 15,
      marginTop: 45,
    },

    backText: {
      color: theme.primary,
      fontWeight: "bold",
      fontSize: 16,
    },

    botonCrear: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
      alignItems: "center",
    },

    botonTexto: {
      color: "#fff",
      fontWeight: "bold",
    },

    filtrosCard: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 18,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 3,
    },

    filtrosTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 10,
    },

    input: {
      backgroundColor: theme.card,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 12,
      borderRadius: 12,
      marginBottom: 10,
    },

    filtroBotones: {
      flexDirection: "row",
      gap: 10,
    },

    filtroButton: {
      flex: 1,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.primary,
      alignItems: "center",
    },

    filtroButtonActivo: {
      backgroundColor: theme.primary,
    },

    filtroButtonText: {
      color: theme.primary,
      fontWeight: "bold",
    },

    filtroButtonTextActivo: {
      color: "#fff",
    },

    limpiarButton: {
      flex: 1,
      padding: 12,
      borderRadius: 12,
      backgroundColor: "#64748B",
      alignItems: "center",
    },

    limpiarButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },

    resultadosText: {
      color: theme.subText,
      fontWeight: "bold",
      marginBottom: 10,
    },

    emptyText: {
      color: theme.subText,
      textAlign: "center",
      marginTop: 30,
      fontWeight: "bold",
    },

    card: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 22,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 6,
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      overflow: "hidden",
    },

    eventImage: {
      width: "100%",
      height: 210,
      borderRadius: 18,
      marginBottom: 14,
      backgroundColor: "#E5E7EB",
    },

    noImageBox: {
      width: "100%",
      height: 150,
      borderRadius: 18,
      marginBottom: 14,
      backgroundColor: "#475569",
      justifyContent: "center",
      alignItems: "center",
    },

    noImageText: {
      color: "#fff",
      fontWeight: "bold",
    },

    badge: {
      alignSelf: "flex-start",
      backgroundColor: "#DCFCE7",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      marginBottom: 10,
    },

    badgeText: {
      color: "#166534",
      fontWeight: "bold",
      fontSize: 12,
    },

    nombre: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme.text,
    },

    text: {
      color: theme.subText,
      fontSize: 15,
      marginBottom: 4,
    },

    acciones: {
      flexDirection: "row",
      marginTop: 15,
      gap: 10,
    },

    botonEditar: {
      backgroundColor: "#F59E0B",
      padding: 13,
      borderRadius: 12,
      flex: 1,
      alignItems: "center",
    },

    botonEliminar: {
      backgroundColor: theme.danger,
      padding: 13,
      borderRadius: 12,
      flex: 1,
      alignItems: "center",
    },

    botonInscribirse: {
      backgroundColor: theme.secondary,
      padding: 14,
      borderRadius: 14,
      marginTop: 15,
      alignItems: "center",
    },

    botonAccionTexto: {
      color: "#fff",
      fontWeight: "bold",
    },

    compartirContainer: {
  flexDirection: "row",
  gap: 10,
  marginTop: 12,
},

compartirButton: {
  flex: 1,
  backgroundColor: "#0EA5E9",
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
},

emailButton: {
  flex: 1,
  backgroundColor: "#7C3AED",
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
},

compartirText: {
  color: "#fff",
  fontWeight: "bold",
},
  });