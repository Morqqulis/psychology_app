import * as SecureStore from "expo-secure-store";

export const removeCookie = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("Tokeni silməyə çalışarkən xəta:", error);
  }
};

export const addCookie = async (key: string, value: any) => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (error) {
    console.error("Cookieni saxlamağa çalışarkən xəta:", error);
  }
};

export const getCookie = async (key: string) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.log(key, " Cookieni okumağa çalışarkən xəta: ", error);
  }
};
