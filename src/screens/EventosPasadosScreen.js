import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function EventosPasadosScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [eventosPasados, setEventosPasados] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerEventosPasados = async () => {
    try {
      setLoading(true);
      const response = await api.get("/eventos-pasados");
      setEventosPasados(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      obtenerEventosPasados();
    }, [])
  );

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

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Regresar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Eventos Pasados</Text>

      {eventosPasados.length === 0 ? (
        <Text style={styles.emptyText}>No hay eventos pasados registrados.</Text>
      ) : (
        <FlatList
          data={eventosPasados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.eventTitle}>{item.titulo}</Text>
              <Text style={styles.text}>Fecha: {item.fecha?.substring(0, 10)}</Text>
              <Text style={styles.text}>Hora: {item.hora}</Text>
              <Text style={styles.text}>Ubicación: {item.ubicacion}</Text>
              <Text style={styles.status}>Evento finalizado</Text>
            </View>
          )}
        />
      )}
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
    title: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.text,
    },
    card: {
      backgroundColor: theme.card,
      padding: 18,
      borderRadius: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.border,
    },
    eventTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme.text,
    },
    text: {
      color: theme.subText,
    },
    status: {
      marginTop: 10,
      color: theme.danger,
      fontWeight: "bold",
    },
    emptyText: {
      textAlign: "center",
      marginTop: 40,
      color: theme.subText,
      fontSize: 16,
    },
  });