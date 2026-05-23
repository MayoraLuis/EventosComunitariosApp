import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function EditarEventoScreen({ navigation, route }) {
  const { evento } = route.params;

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [titulo, setTitulo] = useState(evento.titulo || "");
  const [descripcion, setDescripcion] = useState(evento.descripcion || "");
  const [fecha, setFecha] = useState(
    evento.fecha ? evento.fecha.substring(0, 10) : ""
  );
  const [hora, setHora] = useState(evento.hora || "");
  const [ubicacion, setUbicacion] = useState(evento.ubicacion || "");
  const [imagen, setImagen] = useState(evento.imagen || null);

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert("Permiso requerido", "Debes permitir acceso a la galería");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };

  const actualizarEvento = async () => {
    if (!titulo || !descripcion || !fecha || !hora || !ubicacion) {
      Alert.alert("Campos incompletos", "Completa todos los campos");
      return;
    }

    try {
      await api.put(`/eventos/${evento.id}`, {
        titulo,
        descripcion,
        fecha,
        hora,
        ubicacion,
        imagen,
      });

      Alert.alert("Éxito", "Evento actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.mensaje || "No se pudo actualizar el evento"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemeToggleButton />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Regresar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Editar Evento</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor={theme.subText}
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        placeholderTextColor={theme.subText}
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TextInput
        style={styles.input}
        placeholder="Fecha: 2026-06-10"
        placeholderTextColor={theme.subText}
        value={fecha}
        onChangeText={setFecha}
      />

      <TextInput
        style={styles.input}
        placeholder="Hora: 18:00:00"
        placeholderTextColor={theme.subText}
        value={hora}
        onChangeText={setHora}
      />

      <TextInput
        style={styles.input}
        placeholder="Ubicación"
        placeholderTextColor={theme.subText}
        value={ubicacion}
        onChangeText={setUbicacion}
      />

      <TouchableOpacity style={styles.imageButton} onPress={seleccionarImagen}>
        <Text style={styles.buttonText}>Cambiar / Agregar Imagen</Text>
      </TouchableOpacity>

      {imagen && <Image source={{ uri: imagen }} style={styles.preview} />}

      <TouchableOpacity style={styles.button} onPress={actualizarEvento}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
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
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.text,
    },
    input: {
      backgroundColor: theme.card,
      color: theme.text,
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.border,
    },
    imageButton: {
      backgroundColor: "#64748B",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 15,
    },
    preview: {
      width: "100%",
      height: 180,
      borderRadius: 12,
      marginBottom: 15,
    },
    button: {
      backgroundColor: "#F59E0B",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 40,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });