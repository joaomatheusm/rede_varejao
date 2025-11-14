import { render } from "@testing-library/react-native";
import LoginScreen from "./page";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

jest.mock("expo-router", () => ({
  Link: ({ children }: any) => children,
  router: { replace: jest.fn() },
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => children,
}));

describe("LoginScreen", () => {
  test("botão Entrar aparece na tela", () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText("Entrar")).toBeTruthy();
  });
});
