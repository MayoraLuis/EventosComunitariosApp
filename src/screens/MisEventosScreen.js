import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function MisEventosScreen({ route, navigation }) {
  const usuarioId = route.params?.usuarioId;

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comentarios, setComentarios] = useState({});
  const [calificaciones, setCalificaciones] = useState({});
  const [comentados, setComentados] = useState({});

  const obtenerEventos = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/participaciones/usuario/${usuarioId}`);
      setEventos(response.data);

      const comentadosTemp = {};
      response.data.forEach((evento) => {
        if (evento.comentario || evento.puntuacion) {
          comentadosTemp[evento.id] = true;
        }
      });

      setComentados(comentadosTemp);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar tus eventos");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      obtenerEventos();
    }, [])
  );

  const enviarOpinion = async (eventoId) => {
    const comentario = comentarios[eventoId];
    const puntuacion = calificaciones[eventoId];

    if (!comentario || !puntuacion) {
      Alert.alert("Campos incompletos", "Debes ingresar comentario y calificación");
      return;
    }

    try {
      await api.post("/comentarios", {
        usuario_id: usuarioId,
        evento_id: eventoId,
        comentario,
      });

      await api.post("/calificaciones", {
        usuario_id: usuarioId,
        evento_id: eventoId,
        puntuacion,
      });

      Alert.alert("Éxito", "Comentario y calificación registrados");

      setComentados({
        ...comentados,
        [eventoId]: true,
      });
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || "No se pudo registrar la opinión";

      Alert.alert("Aviso", mensaje);
    }
  };

  const puedeComentar = (fechaEvento, horaEvento) => {
    const fechaHoraEvento = new Date(`${fechaEvento.substring(0, 10)}T${horaEvento}`);
    const unaHoraDespues = new Date(fechaHoraEvento.getTime() + 60 * 60 * 1000);

    return new Date() >= unaHoraDespues;
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
        <ThemeToggleButton />

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Regresar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Mis Eventos Inscritos</Text>

        <FlatList
          data={eventos}
          scrollEnabled={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const habilitado = puedeComentar(item.fecha, item.hora);
            const yaComentado = comentados[item.id];

            return (
              <View style={styles.card}>
                <Text style={styles.nombre}>{item.titulo}</Text>

                <Text style={styles.text}>Fecha: {item.fecha?.substring(0, 10)}</Text>
                <Text style={styles.text}>Hora: {item.hora}</Text>
                <Text style={styles.text}>Ubicación: {item.ubicacion}</Text>

                {!habilitado ? (
                  <View style={styles.grayBox}>
                    <Text style={styles.grayText}>
                      Disponible 1 hora después del inicio del evento
                    </Text>
                  </View>
                ) : yaComentado ? (
                  <View style={styles.grayBox}>
                    <Text style={styles.grayText}>
                      Ya realizaste una opinión para este evento
                    </Text>
                  </View>
                ) : (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Escribe tu comentario"
                      placeholderTextColor={theme.subText}
                      multiline
                      value={comentarios[item.id] || ""}
                      onChangeText={(text) =>
                        setComentarios({
                          ...comentarios,
                          [item.id]: text,
                        })
                      }
                    />

                    <View style={styles.estrellasContainer}>
                      {[1, 2, 3, 4, 5].map((estrella) => (
                        <TouchableOpacity
                          key={estrella}
                          onPress={() =>
                            setCalificaciones({
                              ...calificaciones,
                              [item.id]: estrella,
                            })
                          }
                        >
                          <Text
                            style={[
                              styles.estrella,
                              (calificaciones[item.id] || 0) >= estrella &&
                                styles.estrellaActiva,
                            ]}
                          >
                            ★
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => enviarOpinion(item.id)}
                    >
                      <Text style={styles.buttonText}>Enviar Opinión</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            );
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
    title: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.text,
    },
    card: {
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 12,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.border,
    },
    nombre: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.text,
    },
    text: {
      color: theme.subText,
    },
    input: {
      backgroundColor: theme.card,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      padding: 12,
      marginTop: 15,
      marginBottom: 10,
      minHeight: 90,
      textAlignVertical: "top",
    },
    estrellasContainer: {
      flexDirection: "row",
      marginVertical: 10,
    },
    estrella: {
      fontSize: 35,
      color: "#CBD5E1",
      marginRight: 5,
    },
    estrellaActiva: {
      color: "#FBBF24",
    },
    button: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    grayBox: {
      backgroundColor: theme.border,
      padding: 15,
      borderRadius: 10,
      marginTop: 15,
    },
    grayText: {
      color: theme.subText,
      textAlign: "center",
      fontWeight: "bold",
    },
  });