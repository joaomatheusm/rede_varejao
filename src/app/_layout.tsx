import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </AuthProvider>
  );
}

function MainLayout() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Aguarda carregar a sessão

    if (user) {
      router.replace("/(panel)/home/page");
    } else {
      router.replace("/(auth)/signin/page");
    }
  }, [user, loading]);

  return (
    // DEFINA TELAS DE NAVEGAÇÃO AQUI
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen
        name="(auth)/signin/page"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="(auth)/signup/page"
        options={{ headerShown: false }}
      />

      <Stack.Screen name="(panel)/home/page" options={{ headerShown: false }} />
      <Stack.Screen name="(panel)/profile/page" options={{ headerShown: false }} />
      <Stack.Screen name="(panel)/cart/page" options={{ headerShown: false }} />
      <Stack.Screen name="(panel)/category/[id]" options={{ headerShown: false }} /> 
    </Stack>
  );
}
