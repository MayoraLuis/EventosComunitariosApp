import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AdminHomeScreen from "../screens/AdminHomeScreen";
import CalendarioScreen from "../screens/CalendarioScreen";
import DashboardAdminScreen from "../screens/DashboardAdminScreen";
import EventosScreen from "../screens/EventosScreen";
import MisEventosScreen from "../screens/MisEventosScreen";
import UserHomeScreen from "../screens/UserHomeScreen";

import { useTheme } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator({ route }) {
  const { theme } = useTheme();

  const rol = route.params?.rol || "usuario";
  const usuarioId = route.params?.usuarioId;
  const nombreUsuario = route.params?.nombreUsuario;

  const esAdmin = rol === "admin" || rol === "organizador";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subText,

        tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 4,
        },

        tabBarStyle: {
        backgroundColor: theme.card,
        borderTopColor: theme.border,
        height: 120,
        paddingBottom: 12,
        paddingTop: 8,
        paddingHorizontal: 5,

        elevation: 10,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 10,
        },

        tabBarIcon: ({ color, size }) => {
          let iconName = "home-outline";

          if (route.name === "Inicio") {
            iconName = "home-outline";
          } else if (route.name === "EventosTab") {
            iconName = "ticket-outline";
          } else if (route.name === "CalendarioTab") {
            iconName = "calendar-outline";
          } else if (route.name === "DashboardTab") {
            iconName = "stats-chart-outline";
          } else if (route.name === "MisEventosTab") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={esAdmin ? AdminHomeScreen : UserHomeScreen}
        initialParams={{
          rol,
          usuarioId,
          nombreUsuario,
        }}
        options={{
          title: "Inicio",
        }}
      />

      <Tab.Screen
        name="EventosTab"
        component={EventosScreen}
        initialParams={{
          rol,
          usuarioId,
        }}
        options={{
          title: "Eventos",
        }}
      />

      <Tab.Screen
        name="CalendarioTab"
        component={CalendarioScreen}
        options={{
          title: "Calendario",
        }}
      />

      {esAdmin ? (
        <Tab.Screen
          name="DashboardTab"
          component={DashboardAdminScreen}
          options={{
            title: "Dashboard",
          }}
        />
      ) : (
        <Tab.Screen
          name="MisEventosTab"
          component={MisEventosScreen}
          initialParams={{
            usuarioId,
          }}
          options={{
            title: "Mis eventos",
          }}
        />
      )}
    </Tab.Navigator>
  );
}