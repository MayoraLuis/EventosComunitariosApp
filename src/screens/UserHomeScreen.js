import { LinearGradient } from "expo-linear-gradient";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ThemeToggleButton from "../components/ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";

export default function UserHomeScreen({ navigation, route }) {
  const nombreUsuario = route.params?.nombreUsuario || "Usuario";
  const usuarioId = route.params?.usuarioId;

  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ThemeToggleButton />

      <LinearGradient
        colors={["#2563EB", "#7C3AED"]}
        style={styles.hero}
      >
        <Text style={styles.heroGreeting}>Hola, {nombreUsuario} 👋</Text>
        <Text style={styles.heroTitle}>Descubre eventos comunitarios</Text>
        <Text style={styles.heroSubtitle}>
          Explora, inscríbete y participa en actividades cerca de ti.
        </Text>
      </LinearGradient>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.glassButton}
          onPress={() =>
            navigation.navigate("Eventos", {
              rol: "usuario",
              usuarioId,
            })
          }
        >
          <Text style={styles.buttonIcon}>🎟️</Text>
          <View>
            <Text style={styles.buttonTitle}>Eventos disponibles</Text>
            <Text style={styles.buttonSubtitle}>Explora actividades nuevas</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.glassButton}
          onPress={() =>
            navigation.navigate("MisEventos", {
              usuarioId,
            })
          }
        >
          <Text style={styles.buttonIcon}>✅</Text>
          <View>
            <Text style={styles.buttonTitle}>Mis eventos inscritos</Text>
            <Text style={styles.buttonSubtitle}>Consulta tus participaciones</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.glassButton}
          onPress={() =>
            navigation.navigate("EventosPasados", {
              usuarioId,
            })
          }
        >
          <Text style={styles.buttonIcon}>🕘</Text>
          <View>
            <Text style={styles.buttonTitle}>Eventos pasados</Text>
            <Text style={styles.buttonSubtitle}>Revisa el historial</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.glassButton}
          onPress={() => navigation.navigate("Calendario")}
        >
          <Text style={styles.buttonIcon}>📅</Text>
          <View>
            <Text style={styles.buttonTitle}>Calendario</Text>
            <Text style={styles.buttonSubtitle}>Visualiza eventos por fecha</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
      paddingTop: 70,
    },

    scrollContent: {
      paddingBottom: 140,
    },

    hero: {
      padding: 24,
      borderRadius: 28,
      marginBottom: 25,
      elevation: 8,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 6,
      },
    },

    heroGreeting: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
    },

    heroTitle: {
      color: "#fff",
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 8,
    },

    heroSubtitle: {
      color: "#E0E7FF",
      fontSize: 15,
      lineHeight: 22,
    },

    menuContainer: {
      gap: 14,
    },

    glassButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      borderRadius: 20,
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 4,
      },
    },

    buttonIcon: {
      fontSize: 28,
      marginRight: 15,
    },

    buttonTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold",
    },

    buttonSubtitle: {
      color: theme.subText,
      fontSize: 13,
      marginTop: 3,
    },

    logoutButton: {
      backgroundColor: theme.danger,
      padding: 16,
      borderRadius: 18,
      alignItems: "center",
      marginTop: 5,
    },

    logoutText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  });