import { createContext, useContext, useMemo } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

export { useColorScheme } from "react-native";
// import Toast from "react-native-toast-message"
// ;
interface IMainContext {
  isDark: boolean;
  // colors: {
  //   primary: string;
  //   background: string;
  //   text: string;
  // };
}

const MainContext = createContext<IMainContext>({} as IMainContext);

export const useMainContext = () => useContext(MainContext);

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const contextValue = useMemo<IMainContext>(() => {
    return {
      isDark,
      // colors: isDark ? darkColors : lightColors,
    };
  }, [isDark]);

  return (
    <MainContext.Provider value={contextValue}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        {children}
        {/* <Toast /> */}
      </ThemeProvider>
      <StatusBar style="auto" />
    </MainContext.Provider>
  );
};
