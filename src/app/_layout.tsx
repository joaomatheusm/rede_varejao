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
  const { user, loading, isSigningUp } = useAuth();

  useEffect(() => {
    if (loading || isSigningUp) return; // Aguarda carregar a sessão ou finalizar cadastro

    if (user) {
      router.replace("/(panel)/home/page");
    } else {
      router.replace("/(auth)/signin/page");
    }
  }, [user, loading, isSigningUp]);

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
      <Stack.Screen
        name="(panel)/profile/page"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="(panel)/cart/page" options={{ headerShown: false }} />
      <Stack.Screen
        name="(panel)/cart/address/page"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(panel)/category/[id]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
