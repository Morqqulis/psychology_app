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
import { BadgeToast } from "@/hooks/showBadge";
export { useColorScheme } from "react-native";

export type IThemNames = "dark" | "light";
interface IMainContext {
  isDark: boolean;
  them: IThemNames;
  setThem: React.Dispatch<React.SetStateAction<IThemNames>>;
}

const MainContext = createContext<IMainContext>({
  isDark: false,
  them: "dark",
  setThem: () => {},
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
      setThem,
    };
  }, [isDark, them]);

  return (
    <MainContext.Provider value={contextValue}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <UserProvider>
          {children}
          <Toast />
          <BadgeToast />
          <StatusBar style="auto" />
        </UserProvider>
      </ThemeProvider>
    </MainContext.Provider>
  );
};
