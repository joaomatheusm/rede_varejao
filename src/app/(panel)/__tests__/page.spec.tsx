import { render } from "@testing-library/react-native";
import ProfileScreen from "../profile/page";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "test@test.com" },
    setAuth: jest.fn(),
  }),
}));

jest.mock("../../../components/TabBar", () => "TabBar");
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => children,
}));

describe("ProfileScreen", () => {
  test("botão Sair da Conta aparece na tela", () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText("Sair da Conta")).toBeTruthy();
  });
});
