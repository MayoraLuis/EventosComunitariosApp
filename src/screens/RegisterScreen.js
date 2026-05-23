import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const registrarUsuario = async () => {
    if (!nombre || !correo || !password || !confirmarPassword) {
      Alert.alert("Campos incompletos", "Completa todos los campos");
      return;
    }

    if (password !== confirmarPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      await api.post("/register", { nombre, correo, password });
      Alert.alert("Éxito", "Usuario registrado correctamente");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.mensaje || "No se pudo registrar el usuario");
    }
  };

  return (
    <View style={styles.container}>
      <ThemeToggleButton />

      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput style={styles.input} placeholder="Nombre completo" placeholderTextColor={theme.subText} value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor={theme.subText} value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor={theme.subText} value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirmar contraseña" placeholderTextColor={theme.subText} value={confirmarPassword} onChangeText={setConfirmarPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={registrarUsuario}>
        <Text style={styles.buttonText}>Registrarme</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("Login")}>
        <Text style={styles.link}>Ya tengo cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.text,
      marginBottom: 30,
    },
    input: {
      backgroundColor: theme.card,
      color: theme.text,
      padding: 14,
      borderRadius: 10,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    button: {
      backgroundColor: theme.secondary,
      padding: 15,
      borderRadius: 10,
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