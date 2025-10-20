import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = "#4CAF50";
const SECONDARY_COLOR = "#FF9800";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    scrollContent: {
        paddingBottom: 100,
    },
    
    // Header Section
    header: {
        backgroundColor: "#fff",
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
        marginBottom: 20,
    },
    avatarSection: {
        alignItems: "center",
        position: "relative",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: PRIMARY_COLOR,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#fff",
    },
    editAvatarButton: {
        position: "absolute",
        bottom: 10,
        right: width/2 - 60,
        backgroundColor: SECONDARY_COLOR,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#fff",
    },
    userInfo: {
        alignItems: "center",
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: "#666",
        marginBottom: 12,
    },
    membershipBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF3E0",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#FFB74D",
    },
    membershipText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#FF8F00",
        marginLeft: 4,
    },

    // Stats Section
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 16,
        paddingVertical: 20,
        marginBottom: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "bold",
        color: PRIMARY_COLOR,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
    },
    statDivider: {
        width: 1,
        backgroundColor: "#e0e0e0",
        marginVertical: 10,
    },

    // Menu Sections
    menuSection: {
        marginBottom: 25,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
        marginLeft: 4,
    },
    menuContainer: {
        backgroundColor: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f5f5f5",
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    menuItemContent: {
        flex: 1,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 2,
    },
    menuItemDescription: {
        fontSize: 13,
        color: "#666",
    },

    // Logout Button
    logoutButton: {
        flexDirection: "row",
        backgroundColor: "#FF4757",
        marginHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#FF4757",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginBottom: 20,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
    bottomSpace: {
        height: 20,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        maxWidth: 320,
        width: "100%",
    },
    modalIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#FFE5E5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
        textAlign: "center",
    },
    modalMessage: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: "row",
        width: "100%",
        gap: 12,
    },
    modalCancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
    },
    modalCancelText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#666",
    },
    modalConfirmButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#FF4757",
        alignItems: "center",
    },
    modalConfirmText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },

    // Legacy styles (manter compatibilidade)
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
    profileName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    profileEmail: {
        fontSize: 16,
        color: "#6c757d",
    },
});