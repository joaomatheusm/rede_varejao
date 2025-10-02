import { StyleSheet } from "react-native";

const PRIMARY_COLOR = "#FF4757";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginTop: 20,
        marginBottom: 10,
    },
    profileHeader: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: PRIMARY_COLOR,
    },
    profileName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    profileEmail: {
        fontSize: 16,
        color: "#6c757d",
    },
    menuContainer: {
        width: "100%",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    menuItemText: {
        flex: 1,
        marginLeft: 20,
        fontSize: 16,
        color: "#333",
    },
    logoutButton: {
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },
    logoutButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});