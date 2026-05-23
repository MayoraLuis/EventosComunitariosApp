import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggleButton() {
  const { darkMode, theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={toggleTheme}
    >
      <Text style={{ color: theme.text, fontWeight: "bold" }}>
        {darkMode ? "☀ Claro" : "🌙 Oscuro"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 45,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 10,
  },
});