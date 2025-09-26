import { Stack } from "expo-router";
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

function MainLayout() {
  const {setAuth} = useAuth();

  useEffect( () => {
    supabase.auth.onAuthStateChange( (_event, session) => {
      if(session){
        setAuth(session.user);
        router.replace("/(panel)/home/page");
      }
      
      setAuth(null);
      router.replace('/(auth)/signin/page');

    })
  }, []);

  return (
    // DEFINA TELAS DE NAVEGAÇÃO AQUI
    <Stack> 
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />

      <Stack.Screen
        name="(auth)/signin/page"
        options={{ headerShown: false }}
      />  
      
      <Stack.Screen
        name="(auth)/signup/page"
        options={{ headerShown: false }}
      />  
      
      <Stack.Screen
        name="(panel)/home/page" 
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
