import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { UserProvider } from "./UserProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
export { useColorScheme } from "react-native";

export type IThemNames = "dark" | "light";
interface IMainContext {
  isDark: boolean;
  them: IThemNames;
}

const MainContext = createContext<IMainContext>({
  isDark: false,
  them: "dark",
} as IMainContext);

export const useMainContext = () => useContext(MainContext);
export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [them, setThem] = useState<IThemNames>("dark");
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";
  useEffect(() => {
    setThem(isDark ? "dark" : "light");
  }, [isDark]);

  const contextValue = useMemo<IMainContext>(() => {
    return {
      isDark,
      them,
    };
  }, [isDark, them]);

  return (
    <MainContext.Provider value={contextValue}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <UserProvider>
          {children}
          <Toast />
          <StatusBar style="auto" />
        </UserProvider>
      </ThemeProvider>
    </MainContext.Provider>
  );
};
