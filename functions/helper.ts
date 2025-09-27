import { showBadge } from "@/hooks/showBadge";
import * as Clipboard from "expo-clipboard";

export const handleCopy = async (message: string) => {
  if (message) {
    await Clipboard.setStringAsync(message);
    showBadge("Kopyalandı", "top");
  }
};
