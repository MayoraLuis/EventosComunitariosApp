import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";


export default function DetalleEventoScreen({ route }) {
  const evento = route.params?.evento;
  const { darkMode, theme, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{evento?.nombre || "Detalle del evento"}</Text>
      <Text style={styles.text}>Fecha: {evento?.fecha || "Sin fecha"}</Text>
      <Text style={styles.text}>Ubicación: Parque Central</Text>
      <Text style={styles.text}>
        Evento comunitario para fomentar la participación local.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F7FB",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1E3A5F",
  },
  text: {
    fontSize: 17,
    marginBottom: 10,
  },
});