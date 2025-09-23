import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log("Login pressed:", { email, password });
    
  };

  const handleSignUp = () => {
    console.log("Sign up pressed");
    // Navegar para tela de cadastro
  };

  const handleForgotPassword = () => {
    console.log("Forgot password pressed");
    // Navegar para tela de recuperação de senha
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* Header com Logo */}
        <View style={styles.header}>
          {/* Logo circular com sua imagem personalizada */}
          <View style={styles.logoContainer}>
            <View>
              <Image
                source={require("../../assets/logo.png")} // Ajuste o nome do arquivo conforme necessário
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitleText}>
            Entre na sua conta para continuar
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          {/* Campo E-mail */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          {/* Campo Senha */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Link Esqueci minha senha */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          {/* Botão Entrar */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          {/* Link Cadastro */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Não tem uma conta? </Text>
            <Link href="/(auth)/signup/page" asChild>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF4757",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 30,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },

  logoImage: {
    width: 120,
    height: 120,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    padding: 5,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: "#FF4757",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#FF4757",
    borderRadius: 12,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#FF4757",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    height: 55,
    flex: 0.48,
  },
  googleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4285F4",
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    paddingVertical: 15,
  },
  signUpText: {
    color: "#666",
    fontSize: 16, // Aumentado de 14 para 16
    fontWeight: "500"
  },
  signUpLink: {
    color: "#FF4757",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginScreen;
