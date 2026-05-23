import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdminHomeScreen from "../screens/AdminHomeScreen";
import CalendarioScreen from "../screens/CalendarioScreen";
import CrearEventoScreen from "../screens/CrearEventoScreen";
import DashboardAdminScreen from "../screens/DashboardAdminScreen";
import DetalleEventoScreen from "../screens/DetalleEventoScreen";
import EditarEventoScreen from "../screens/EditarEventoScreen";
import EventosPasadosScreen from "../screens/EventosPasadosScreen";
import EventosScreen from "../screens/EventosScreen";
import LoginScreen from "../screens/LoginScreen";
import MisEventosScreen from "../screens/MisEventosScreen";
import RegisterScreen from "../screens/RegisterScreen";
import UserHomeScreen from "../screens/UserHomeScreen";
import BottomTabsNavigator from "./BottomTabsNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Iniciar sesión" }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Registro" }}
        />

        <Stack.Screen
          name="AdminHome"
          component={AdminHomeScreen}
          options={{ title: "Administrador" }}
        />

        <Stack.Screen
          name="UserHome"
          component={UserHomeScreen}
          options={{ title: "Usuario" }}
        />

        <Stack.Screen
          name="Eventos"
          component={EventosScreen}
          options={{ title: "Eventos" }}
        />

        <Stack.Screen
          name="MisEventos"
          component={MisEventosScreen}
          options={{ title: "Mis eventos inscritos" }}
        />

        <Stack.Screen
          name="CrearEvento"
          component={CrearEventoScreen}
          options={{ title: "Crear Evento" }}
        />

        <Stack.Screen
          name="EditarEvento"
          component={EditarEventoScreen}
          options={{ title: "Editar Evento" }}
        />

        <Stack.Screen
          name="DetalleEvento"
          component={DetalleEventoScreen}
          options={{ title: "Detalle del evento" }}
        />

        <Stack.Screen
  name="EventosPasados"
  component={EventosPasadosScreen}
  options={{ title: "Eventos Pasados" }}
/>

<Stack.Screen
  name="Calendario"
  component={CalendarioScreen}
  options={{ title: "Calendario de Eventos" }}
/>

<Stack.Screen
  name="DashboardAdmin"
  component={DashboardAdminScreen}
  options={{ title: "Dashboard" }}
/>

<Stack.Screen
  name="MainTabs"
  component={BottomTabsNavigator}
  options={{ headerShown: false }}
/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}