import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { IUser } from "@/shared/lib/types/user";

interface IUserContext {
  user: IUser | undefined;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  // getUser: () => void;
}

const UserContext = createContext<IUserContext>({
  user: {} as IUser | undefined,
  loading: false,
  setUser: () => {},
  // getUser: async () => {},
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const getUser = useCallback(async () => {
    try {
      setLoading(true);
      const timeout = setTimeout(() => {
        setUser({
          _id: "1",
          name: "John Doe",
          role: "user",
        });
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timeout);
    } catch (error: any) {
      console.log("error in getUser", error?.response?.data?.message || error);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        // setUser,
        // getUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
