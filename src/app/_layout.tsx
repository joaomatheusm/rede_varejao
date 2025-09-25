import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    // DEFINA TELAS DE NAVEGAÇÃO AQUI
    <Stack> 
      <Stack.Screen 
        name="index" 
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
