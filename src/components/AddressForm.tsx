import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DeliveryCheck, deliveryService } from "../lib/deliveryService";
import { Endereco } from "../lib/enderecoService";

interface FormData {
  apelido: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface AddressFormProps {
  onSubmit: (data: FormData, deliveryCheck?: DeliveryCheck) => Promise<void>;
  initialData?: Partial<Endereco>;
  loading?: boolean;
  submitButtonText?: string;
  checkDelivery?: boolean; // Nova prop para habilitar verificação de entrega
}

const PRIMARY_COLOR = "#FF4D4D";

const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  initialData = {},
  loading = false,
  submitButtonText = "Salvar Endereço",
  checkDelivery = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    apelido: initialData.apelido || "Casa",
    cep: initialData.cep || "",
    logradouro: initialData.logradouro || "",
    numero: initialData.numero || "",
    complemento: initialData.complemento || "",
    bairro: initialData.bairro || "",
    cidade: initialData.cidade || "",
    estado: initialData.estado || "",
  });

  const [padrao, setPadrao] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [locationLoading, setLocationLoading] = useState(false);
  const [deliveryCheck, setDeliveryCheck] = useState<DeliveryCheck | null>(
    null
  );
  const [checkingDelivery, setCheckingDelivery] = useState(false);

  // Atualizar formData quando initialData mudar (para modo de edição)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        apelido: initialData.apelido || "Casa",
        cep: initialData.cep || "",
        logradouro: initialData.logradouro || "",
        numero: initialData.numero || "",
        complemento: initialData.complemento || "",
        bairro: initialData.bairro || "",
        cidade: initialData.cidade || "",
        estado: initialData.estado || "",
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.cep.trim()) {
      newErrors.cep = "CEP é obrigatório";
    } else if (!/^\d{5}-?\d{3}$/.test(formData.cep.replace(/\D/g, ""))) {
      newErrors.cep = "CEP deve ter 8 dígitos";
    }

    if (!formData.logradouro.trim()) {
      newErrors.logradouro = "Logradouro é obrigatório";
    }

    if (!formData.numero.trim()) {
      newErrors.numero = "Número é obrigatório";
    }

    if (!formData.bairro.trim()) {
      newErrors.bairro = "Bairro é obrigatório";
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = "Cidade é obrigatória";
    }

    if (!formData.estado.trim()) {
      newErrors.estado = "Estado é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Erro", "Por favor, corrija os campos obrigatórios.");
      return;
    }

    // Se checkDelivery estiver habilitado, verificar antes de submeter
    if (checkDelivery) {
      await checkDeliveryAvailability();
      return; // A verificação chamará o submit se aprovado
    }

    try {
      await onSubmit(formData, deliveryCheck || undefined);
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar o endereço. Tente novamente."
      );
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Limpar verificação de entrega quando dados do endereço mudarem
    if (
      deliveryCheck &&
      ["cep", "logradouro", "numero", "bairro", "cidade", "estado"].includes(
        field
      )
    ) {
      setDeliveryCheck(null);
    }
  };

  const checkDeliveryAvailability = async () => {
    setCheckingDelivery(true);
    setDeliveryCheck(null);

    try {
      // Montar endereço completo para verificação
      const fullAddress = `${formData.logradouro}, ${formData.numero}, ${formData.bairro}, ${formData.cidade}, ${formData.estado}, ${formData.cep}`;

      const result = await deliveryService.checkDeliveryAvailability(
        fullAddress
      );
      setDeliveryCheck(result);

      if (result.available) {
        // Endereço dentro do raio, mostrar confirmação e permitir prosseguir
        Alert.alert("Entrega Disponível! ✅", result.message, [
          {
            text: "Continuar",
            style: "default",
            onPress: async () => {
              try {
                await onSubmit(formData, result);
              } catch (error) {
                console.error("Erro ao submeter formulário:", error);
                Alert.alert(
                  "Erro",
                  "Não foi possível salvar o endereço. Tente novamente."
                );
              }
            },
          },
          {
            text: "Verificar Novamente",
            style: "cancel",
          },
        ]);
      } else {
        // Endereço fora do raio, mostrar erro
        Alert.alert("Área não atendida", result.message, [
          {
            text: "Entendi",
            style: "default",
          },
          {
            text: "Alterar Endereço",
            style: "cancel",
          },
        ]);
      }
    } catch (error) {
      console.error("Erro ao verificar entrega:", error);
      Alert.alert(
        "Erro na Verificação",
        "Não foi possível verificar a disponibilidade de entrega. Verifique sua conexão e tente novamente.",
        [
          {
            text: "Tentar Novamente",
            onPress: () => checkDeliveryAvailability(),
          },
          {
            text: "Cancelar",
            style: "cancel",
          },
        ]
      );
    } finally {
      setCheckingDelivery(false);
    }
  };

  const formatCEP = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 5) {
      return numericValue;
    }
    return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);

    try {
      // Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão Negada",
          "É necessário permitir o acesso à localização para usar esta funcionalidade."
        );
        return;
      }

      // Obter localização atual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Fazer geocoding reverso para obter endereço
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];

        // Preencher campos do formulário com dados da localização
        setFormData((prev) => ({
          ...prev,
          logradouro: address.street || "",
          numero: address.streetNumber || "",
          bairro: address.district || address.subregion || "",
          cidade: address.city || "",
          estado: address.region || "",
          cep: address.postalCode || "",
        }));

        Alert.alert(
          "Localização Obtida",
          "Os campos foram preenchidos com base na sua localização atual!"
        );
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível obter informações de endereço para esta localização."
        );
      }
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      Alert.alert(
        "Erro",
        "Não foi possível obter sua localização. Verifique se o GPS está ativado."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <View style={styles.form}>
        <Text style={styles.label}>Tipo de endereço</Text>
        <View style={styles.row}>
          {[
            { tipo: "Casa", icon: "home-outline" },
            { tipo: "Trabalho", icon: "business-outline" },
            { tipo: "Outro", icon: "location-outline" },
          ].map(({ tipo, icon }) => (
            <TouchableOpacity
              key={tipo}
              style={[
                styles.tipoBtn,
                formData.apelido === tipo && styles.tipoBtnAtivo,
              ]}
              onPress={() => updateField("apelido", tipo)}
            >
              <Ionicons
                name={icon as any}
                size={20}
                color={formData.apelido === tipo ? "#fff" : PRIMARY_COLOR}
                style={styles.tipoBtnIcon}
              />
              <Text
                style={[
                  styles.tipoText,
                  formData.apelido === tipo && styles.tipoTextAtivo,
                ]}
              >
                {tipo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão para usar localização atual */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={getCurrentLocation}
          disabled={locationLoading}
        >
          <Ionicons
            name="location"
            size={20}
            color={locationLoading ? "#999" : PRIMARY_COLOR}
          />
          <Text
            style={[
              styles.locationButtonText,
              locationLoading && styles.locationButtonTextDisabled,
            ]}
          >
            {locationLoading
              ? "Obtendo localização..."
              : "Usar Localização Atual"}
          </Text>
          {locationLoading && (
            <ActivityIndicator
              size="small"
              color="#999"
              style={styles.locationLoader}
            />
          )}
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Ionicons
            name="location-outline"
            size={20}
            color="#999"
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.inputWithIcon, errors.cep && styles.inputError]}
            value={formData.cep}
            onChangeText={(value) => updateField("cep", formatCEP(value))}
            placeholder="CEP"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={9}
          />
        </View>
        {errors.cep && <Text style={styles.errorText}>{errors.cep}</Text>}

        <View style={styles.inputContainer}>
          <Ionicons
            name="home-outline"
            size={20}
            color="#999"
            style={styles.inputIcon}
          />
          <TextInput
            style={[
              styles.inputWithIcon,
              errors.logradouro && styles.inputError,
            ]}
            value={formData.logradouro}
            onChangeText={(value) => updateField("logradouro", value)}
            placeholder="Rua / Avenida"
            placeholderTextColor="#999"
          />
        </View>
        {errors.logradouro && (
          <Text style={styles.errorText}>{errors.logradouro}</Text>
        )}

        <View style={styles.row}>
          <View
            style={[styles.inputContainer, styles.flex1, styles.marginRight]}
          >
            <Ionicons
              name="keypad-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.inputWithIcon, errors.numero && styles.inputError]}
              value={formData.numero}
              onChangeText={(value) => updateField("numero", value)}
              placeholder="Número"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
          <View
            style={[styles.inputContainer, styles.flex1, styles.marginLeft]}
          >
            <Ionicons
              name="business-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.inputWithIcon}
              value={formData.complemento}
              onChangeText={(value) => updateField("complemento", value)}
              placeholder="Complemento (opcional)"
              placeholderTextColor="#999"
            />
          </View>
        </View>
        {errors.numero && <Text style={styles.errorText}>{errors.numero}</Text>}

        <View style={styles.inputContainer}>
          <Ionicons
            name="map-outline"
            size={20}
            color="#999"
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.inputWithIcon, errors.bairro && styles.inputError]}
            value={formData.bairro}
            onChangeText={(value) => updateField("bairro", value)}
            placeholder="Bairro"
            placeholderTextColor="#999"
          />
        </View>
        {errors.bairro && <Text style={styles.errorText}>{errors.bairro}</Text>}

        <View style={styles.row}>
          <View
            style={[styles.inputContainer, styles.flex1, styles.marginRight]}
          >
            <Ionicons
              name="locate-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.inputWithIcon, errors.cidade && styles.inputError]}
              value={formData.cidade}
              onChangeText={(value) => updateField("cidade", value)}
              placeholder="Cidade"
              placeholderTextColor="#999"
            />
          </View>
          <View
            style={[styles.inputContainer, styles.flex1, styles.marginLeft]}
          >
            <Ionicons
              name="flag-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.inputWithIcon, errors.estado && styles.inputError]}
              value={formData.estado}
              onChangeText={(value) =>
                updateField("estado", value.toUpperCase())
              }
              placeholder="Estado"
              placeholderTextColor="#999"
              maxLength={2}
            />
          </View>
        </View>
        {(errors.cidade || errors.estado) && (
          <Text style={styles.errorText}>{errors.cidade || errors.estado}</Text>
        )}

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, padrao && styles.checkboxChecked]}
            onPress={() => setPadrao(!padrao)}
          >
            {padrao && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>Definir como endereço padrão</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (loading || checkingDelivery) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading || checkingDelivery}
        >
          {loading || checkingDelivery ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#FFF" />
              <Text style={styles.submitButtonText}>
                {checkingDelivery ? "Verificando entrega..." : "Salvando..."}
              </Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>
              {checkDelivery ? "Verificar e Continuar" : submitButtonText}
            </Text>
          )}
        </TouchableOpacity>

        {/* Status da verificação de entrega */}
        {deliveryCheck && (
          <View
            style={[
              styles.deliveryStatus,
              deliveryCheck.available
                ? styles.deliverySuccess
                : styles.deliveryError,
            ]}
          >
            <Text
              style={[
                styles.deliveryStatusText,
                deliveryCheck.available
                  ? styles.deliverySuccessText
                  : styles.deliveryErrorText,
              ]}
            >
              {deliveryCheck.message}
            </Text>
            {deliveryCheck.distance && (
              <Text style={styles.deliveryDistance}>
                Distância do estabelecimento: {deliveryCheck.distance}km
              </Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingBottom: Platform.OS === "ios" ? 50 : 30,
  },
  form: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 60 : 40,
    minHeight: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  tipoBtn: {
    flex: 1,
    padding: 14,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  tipoBtnIcon: {
    marginBottom: 4,
  },
  tipoBtnAtivo: {
    backgroundColor: PRIMARY_COLOR,
  },
  tipoText: {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
  },
  tipoTextAtivo: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    minHeight: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    paddingLeft: 12,
    paddingRight: 8,
  },
  inputWithIcon: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 0,
  },
  inputError: {
    borderColor: PRIMARY_COLOR,
  },
  errorText: {
    color: PRIMARY_COLOR,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  flex1: {
    flex: 1,
  },
  marginRight: {
    marginRight: 8,
  },
  marginLeft: {
    marginLeft: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkboxText: {
    fontSize: 15,
    color: "#333",
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 52,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    marginTop: 15,
    marginBottom: 20,
  },
  locationButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  locationButtonTextDisabled: {
    color: "#999",
  },
  locationLoader: {
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deliveryStatus: {
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  deliverySuccess: {
    backgroundColor: "#f0f9ff",
    borderColor: "#22c55e",
  },
  deliveryError: {
    backgroundColor: "#fef2f2",
    borderColor: "#ef4444",
  },
  deliveryStatusText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  deliverySuccessText: {
    color: "#16a34a",
  },
  deliveryErrorText: {
    color: "#dc2626",
  },
  deliveryDistance: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
});

export default AddressForm;
