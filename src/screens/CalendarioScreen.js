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
import { Calendar } from "react-native-calendars";

import ThemeToggleButton from "../components/ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function CalendarioScreen({ navigation }) {
  const { theme, darkMode } = useTheme();
  const styles = createStyles(theme);

  const [eventos, setEventos] = useState([]);
  const [eventosFecha, setEventosFecha] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [loading, setLoading] = useState(true);

  const obtenerEventos = async () => {
    try {
      setLoading(true);

      const response = await api.get("/eventos");
      setEventos(response.data);

      const hoy = new Date().toISOString().substring(0, 10);
      setFechaSeleccionada(hoy);

      const eventosHoy = response.data.filter(
        (evento) => evento.fecha?.substring(0, 10) === hoy
      );

      setEventosFecha(eventosHoy);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      obtenerEventos();
    }, [])
  );

  const fechasMarcadas = {};

  eventos.forEach((evento) => {
    const fecha = evento.fecha?.substring(0, 10);

    if (fecha) {
      fechasMarcadas[fecha] = {
        marked: true,
        dotColor: theme.primary,
        selected: fecha === fechaSeleccionada,
        selectedColor: theme.primary,
      };
    }
  });

  if (fechaSeleccionada) {
    fechasMarcadas[fechaSeleccionada] = {
      ...(fechasMarcadas[fechaSeleccionada] || {}),
      selected: true,
      selectedColor: theme.primary,
    };
  }

  const seleccionarFecha = (day) => {
    const fecha = day.dateString;

    setFechaSeleccionada(fecha);

    const filtrados = eventos.filter(
      (evento) => evento.fecha?.substring(0, 10) === fecha
    );

    setEventosFecha(filtrados);
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

      <Text style={styles.title}>Calendario de Eventos</Text>

      <Calendar
        markedDates={fechasMarcadas}
        onDayPress={seleccionarFecha}
        theme={{
          calendarBackground: theme.card,
          dayTextColor: theme.text,
          monthTextColor: theme.text,
          textSectionTitleColor: theme.subText,
          selectedDayBackgroundColor: theme.primary,
          selectedDayTextColor: "#ffffff",
          todayTextColor: theme.primary,
          arrowColor: theme.primary,
          dotColor: theme.primary,
          textDisabledColor: darkMode ? "#475569" : "#CBD5E1",
        }}
        style={styles.calendar}
      />

      <Text style={styles.subtitle}>
        Eventos para: {fechaSeleccionada}
      </Text>

      {eventosFecha.length === 0 ? (
        <Text style={styles.emptyText}>
          No hay eventos registrados para esta fecha.
        </Text>
      ) : (
        <FlatList
          data={eventosFecha}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.eventTitle}>{item.titulo}</Text>
              <Text style={styles.text}>Hora: {item.hora}</Text>
              <Text style={styles.text}>Ubicación: {item.ubicacion}</Text>
              <Text style={styles.text}>{item.descripcion}</Text>
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
      marginTop: 45,
      marginBottom: 15,
    },
    backText: {
      color: theme.primary,
      fontWeight: "bold",
      fontSize: 16,
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 15,
    },
    calendar: {
      borderRadius: 12,
      marginBottom: 20,
      overflow: "hidden",
    },
    subtitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 12,
    },
    emptyText: {
      color: theme.subText,
      textAlign: "center",
      marginTop: 20,
      fontWeight: "bold",
    },
    card: {
      backgroundColor: theme.card,
      padding: 15,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    eventTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 6,
    },
    text: {
      color: theme.subText,
      marginBottom: 3,
    },
  });