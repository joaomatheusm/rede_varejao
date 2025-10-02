import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 15,
    },
    logo: {
        width: 80,
        height: 40,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
        borderRadius: 12,
        height: 50,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    specialOfferBanner: {
        height: 150,
        justifyContent: "center",
        marginBottom: 30,
    },
    bannerOverlay: {
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: 16,
        padding: 20,
        flex: 1,
        justifyContent: "center",
    },
    bannerTitle: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
    },
    bannerSubtitle: {
        color: "white",
        fontSize: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    categoriesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
});