import {
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function NotificationBox({
  message,
  type = "success",
}) {
  if (!message) return null;

  const estilos = {
    success: {
      backgroundColor: "#DCFCE7",
      borderColor: "#16A34A",
      textColor: "#166534",
      icon: "✔",
    },

    warning: {
      backgroundColor: "#FEF3C7",
      borderColor: "#F59E0B",
      textColor: "#92400E",
      icon: "⚠",
    },

    error: {
      backgroundColor: "#FEE2E2",
      borderColor: "#DC2626",
      textColor: "#991B1B",
      icon: "✖",
    },
  };

  const estilo = estilos[type];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: estilo.backgroundColor,
          borderColor: estilo.borderColor,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: estilo.textColor,
          },
        ]}
      >
        {estilo.icon} {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
  },

  text: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
});