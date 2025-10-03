import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Endereco } from "../lib/enderecoService";

const PRIMARY_COLOR = "#FF4757";

interface AddressItemProps {
  endereco: Endereco;
  isSelected?: boolean;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const AddressItem: React.FC<AddressItemProps> = ({
  endereco,
  isSelected = false,
  onPress,
  onEdit,
  onDelete,
}) => {
  const getIconName = (apelido: string) => {
    switch (apelido.toLowerCase()) {
      case "casa":
        return "home";
      case "trabalho":
        return "business";
      default:
        return "location";
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este endereço?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: onDelete },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconContainer,
              isSelected && styles.selectedIconContainer,
            ]}
          >
            <Ionicons
              name={getIconName(endereco.apelido) as any}
              size={20}
              color={isSelected ? "#fff" : PRIMARY_COLOR}
            />
          </View>
          <View style={styles.addressInfo}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, isSelected && styles.selectedTitle]}>
                {endereco.apelido}
              </Text>
            </View>
            <Text style={styles.address}>
              {endereco.logradouro}, {endereco.numero}
            </Text>
            <Text style={styles.neighborhood}>
              {endereco.bairro}, {endereco.cidade} - {endereco.estado}
            </Text>
            <Text style={styles.cep}>CEP: {endereco.cep}</Text>
          </View>
        </View>

        {isSelected && (
          <View style={styles.checkIconContainer}>
            <Ionicons name="checkmark-circle" size={24} color={PRIMARY_COLOR} />
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Ionicons name="pencil" size={16} color="#FF4757" />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Ionicons name="trash" size={16} color="#ff4444" />
          <Text style={[styles.actionText, { color: "#ff4444" }]}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedContainer: {
    borderColor: PRIMARY_COLOR,
    borderWidth: 2,
    backgroundColor: "#f8fff8",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f8f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  selectedIconContainer: {
    backgroundColor: PRIMARY_COLOR,
  },
  addressInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  selectedTitle: {
    color: PRIMARY_COLOR,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  neighborhood: {
    fontSize: 13,
    color: "#888",
    marginBottom: 2,
  },
  cep: {
    fontSize: 12,
    color: "#aaa",
  },
  checkIconContainer: {
    marginLeft: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
});

export default AddressItem;
