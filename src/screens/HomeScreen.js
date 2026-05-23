import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserHomeScreen({ navigation, route }) {
  const nombreUsuario = route.params?.nombreUsuario || "Usuario";
  const usuarioId = route.params?.usuarioId;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos Comunitarios</Text>
      <Text style={styles.name}>Bienvenido, {nombreUsuario}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Eventos", {
            rol: "usuario",
            usuarioId: usuarioId,
          })
        }
      >
        <Text style={styles.buttonText}>Ver Eventos Disponibles</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() =>
          navigation.navigate("MisEventos", {
            usuarioId: usuarioId,
          })
        }
      >
        <Text style={styles.buttonText}>Mis eventos inscritos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F4F7FB",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E3A5F",
  },
  name: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 25,
    color: "#2563EB",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: "#16A34A",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: "#DC2626",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});