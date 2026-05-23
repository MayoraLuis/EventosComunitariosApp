import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import ThemeToggleButton from "../components/ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const iniciarSesion = async () => {
    if (!correo || !password) {
      Alert.alert("Campos incompletos", "Ingresa correo y contraseña");
      return;
    }

    try {
      const response = await api.post("/login", {
        correo,
        password,
      });

      const usuario = response.data.usuario;

      navigation.replace("MainTabs", {
        nombreUsuario: usuario.nombre,
        usuarioId: usuario.id,
        rol: usuario.rol,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.mensaje || "No se pudo iniciar sesión"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemeToggleButton />

        <LinearGradient
          colors={["#2563EB", "#7C3AED"]}
          style={styles.hero}
        >
          <Text style={styles.logo}>📅</Text>
          <Text style={styles.heroTitle}>Eventos Comunitarios</Text>
          <Text style={styles.heroSubtitle}>
            Conecta con tu comunidad, participa y descubre actividades cerca de ti.
          </Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={theme.subText}
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={theme.subText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={iniciarSesion}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Crear cuenta nueva</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    keyboard: {
      flex: 1,
      backgroundColor: theme.background,
    },

    scrollContent: {
      flexGrow: 1,
      padding: 24,
      paddingTop: 80,
      paddingBottom: 60,
      backgroundColor: theme.background,
      justifyContent: "center",
    },

    hero: {
      padding: 26,
      borderRadius: 30,
      marginBottom: 25,
      alignItems: "center",
      elevation: 8,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 6,
      },
    },

    logo: {
      fontSize: 46,
      marginBottom: 8,
    },

    heroTitle: {
      color: "#fff",
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 8,
    },

    heroSubtitle: {
      color: "#E0E7FF",
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
    },

    card: {
      backgroundColor: theme.card,
      borderRadius: 28,
      padding: 24,
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
    },

    title: {
      fontSize: 26,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "center",
      marginBottom: 6,
    },

    subtitle: {
      fontSize: 15,
      color: theme.subText,
      textAlign: "center",
      marginBottom: 24,
    },

    input: {
      backgroundColor: theme.background,
      color: theme.text,
      padding: 15,
      borderRadius: 16,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },

    button: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 18,
      alignItems: "center",
      marginTop: 8,
    },

    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },

    link: {
      textAlign: "center",
      marginTop: 18,
      color: theme.primary,
      fontWeight: "bold",
    },
  });