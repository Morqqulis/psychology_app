import { IThemNames } from "@/providers/MainProvider";
import { ColorValue, Platform } from "react-native";
// 0a7ea4
const tintColorLight = "#FFA001";
const tintColorDark = "#FFA001";

export const Colors: Record<IThemNames, { [key: string]: string }> = {
  dark: {
    text: "#f9fafb",
    black: "#1a1a1a",
    tint: tintColorDark,
    tabIconDefault: "#fff",
    icon: "#6b7280",
    error: "#ef4444",
    light: "#f9fafb",
    primary: "#818cf8",
    surface: "#1f2937",
    success: "#34d399",
    charcoal: "#eff",
    lightgray: "#d1d5db",
    background: "#111827",
    bubble: "#374151",
    white: "#ffffff",
    blue: "#007bff",

    // istifadə edilmiyənlər
    outline: "#667eea",
    secondary: "#a78bfa",
    accent: "#f472b6",
    warning: "#fbbf24",
  },
  light: {
    text: "#1a1a1a",
    black: "#1a1a1a",
    tint: tintColorLight,
    tabIconDefault: "#fff",
    icon: "#9ca3af",
    error: "#ef4444",
    light: "#f9fafb",
    primary: "#667eea",
    surface: "#f8f9fa",
    success: "#4ade80",
    charcoal: "#1f2937",
    lightgray: "#d1d5db",
    background: "#e9e9e9",
    bubble: "#f3f4f6",
    white: "#ffffff",
    blue: "#007bff",

    // istifadə edilmiyənlər
    outline: "#fff",
    secondary: "#764ba2",
    accent: "#f093fb",
    warning: "#fbbf24",
  },
};
export const gradients: Record<
  IThemNames,
  { [key: string]: [ColorValue, ColorValue, ...ColorValue[]] }
> = {
  light: {
    splash: ["#667eea", "#764ba2", "#f093fb"],
    btnContainer: ["#664ba2", "#667eea"],
    glass: ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.0)"],
  },
  dark: {
    splash: ["#1a1a2e", "#16213e", "#0f3460"],
    btnContainer: ["#667eea", "#764ba2"],
    glass: ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.0)"],
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
