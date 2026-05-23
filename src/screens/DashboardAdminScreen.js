import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { BarChart, PieChart } from "react-native-chart-kit";

import ThemeToggleButton from "../components/ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

const screenWidth = Dimensions.get("window").width - 30;

export default function DashboardAdminScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [datos, setDatos] = useState(null);
  const [opiniones, setOpiniones] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/dashboard");
      setDatos(response.data);

      const opinionesResponse = await api.get("/admin/opiniones");
      setOpiniones(opinionesResponse.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudieron cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      obtenerDashboard();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const barData = {
    labels: ["Eventos", "Usuarios", "Inscritos", "Pasados"],
    datasets: [
      {
        data: [
          Number(datos?.totalEventos || 0),
          Number(datos?.totalUsuarios || 0),
          Number(datos?.totalInscripciones || 0),
          Number(datos?.eventosPasados || 0),
        ],
      },
    ],
  };

  const pieData = [
    {
      name: "Eventos",
      population: Number(datos?.totalEventos || 0),
      color: theme.primary,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
    {
      name: "Usuarios",
      population: Number(datos?.totalUsuarios || 0),
      color: theme.secondary,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
    {
      name: "Inscritos",
      population: Number(datos?.totalInscripciones || 0),
      color: "#F59E0B",
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
    {
      name: "Pasados",
      population: Number(datos?.eventosPasados || 0),
      color: theme.danger,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: () => theme.subText,
    propsForLabels: {
      fontSize: 10,
    },
  };

  const renderEstrellas = (puntuacion) => {
    const valor = Number(puntuacion || 0);
    return "★".repeat(valor) + "☆".repeat(5 - valor);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemeToggleButton />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Regresar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Dashboard Administrador</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>{datos?.totalEventos}</Text>
          <Text style={styles.cardText}>Total eventos</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>{datos?.totalUsuarios}</Text>
          <Text style={styles.cardText}>Total usuarios</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>{datos?.totalInscripciones}</Text>
          <Text style={styles.cardText}>Inscripciones</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>{datos?.eventosPasados}</Text>
          <Text style={styles.cardText}>Eventos pasados</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Resumen general</Text>

        <BarChart
          data={barData}
          width={screenWidth}
          height={240}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          showValuesOnTopOfBars
        />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Distribución de datos</Text>

        <PieChart
          data={pieData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View style={styles.popularCard}>
        <Text style={styles.popularTitle}>Evento más popular</Text>

        <Text style={styles.popularName}>
          {datos?.eventoPopular?.titulo || "Sin datos"}
        </Text>

        <Text style={styles.popularInfo}>
          Inscritos: {datos?.eventoPopular?.inscritos || 0}
        </Text>
      </View>

      <View style={styles.opinionesCard}>
        <Text style={styles.chartTitle}>Opiniones de usuarios</Text>

        {opiniones.length === 0 ? (
          <Text style={styles.emptyText}>No hay opiniones registradas.</Text>
        ) : (
          opiniones.map((opinion) => (
            <View key={opinion.comentario_id} style={styles.opinionItem}>
              <Text style={styles.opinionUsuario}>{opinion.usuario}</Text>

              <Text style={styles.opinionEvento}>Evento: {opinion.evento}</Text>

              <Text style={styles.opinionComentario}>
                “{opinion.comentario}”
              </Text>

              <Text style={styles.opinionEstrellas}>
                {renderEstrellas(opinion.puntuacion)}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
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
      color: theme.text,
      marginBottom: 20,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },

    card: {
      backgroundColor: theme.card,
      width: "48%",
      padding: 20,
      borderRadius: 12,
      marginBottom: 15,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    cardNumber: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.primary,
    },

    cardText: {
      marginTop: 8,
      color: theme.subText,
      textAlign: "center",
      fontWeight: "bold",
    },

    chartCard: {
      backgroundColor: theme.card,
      paddingVertical: 18,
      paddingHorizontal: 5,
      borderRadius: 12,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.border,
    },

    chartTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 10,
      paddingHorizontal: 15,
    },

    chart: {
      borderRadius: 12,
    },

    popularCard: {
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 12,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.border,
    },

    popularTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 10,
    },

    popularName: {
      fontSize: 18,
      color: theme.primary,
      fontWeight: "bold",
    },

    popularInfo: {
      marginTop: 8,
      color: theme.subText,
    },

    opinionesCard: {
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 12,
      marginBottom: 30,
      borderWidth: 1,
      borderColor: theme.border,
    },

    opinionItem: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingVertical: 12,
    },

    opinionUsuario: {
      fontWeight: "bold",
      color: theme.text,
      fontSize: 16,
    },

    opinionEvento: {
      color: theme.primary,
      marginTop: 3,
      fontWeight: "bold",
    },

    opinionComentario: {
      color: theme.subText,
      marginTop: 6,
      fontStyle: "italic",
    },

    opinionEstrellas: {
      color: "#F59E0B",
      fontSize: 20,
      marginTop: 5,
    },

    emptyText: {
      color: theme.subText,
      textAlign: "center",
      marginTop: 10,
    },
  });