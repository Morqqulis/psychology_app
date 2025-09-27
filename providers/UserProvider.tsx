import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/shared/lib/types/user";
import { useProfile } from "@/services/auth/auth";
import { addCookie } from "@/functions/cookieActions";

interface IUserContext {
  user: IUser | undefined;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}

const UserContext = createContext<IUserContext>({
  user: {} as IUser | undefined,
  loading: false,
  setUser: () => {},
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const { data, isLoading } = useProfile();
  useEffect(() => {
    if (!isLoading && data?.token && data.user.id) {
      const { createdAt, email, gender, id, name, role, surname, updatedAt } =
        data.user;
      setUser({ createdAt, email, gender, id, name, role, surname, updatedAt });
      addCookie("token", data.token);
    }
  }, [data, isLoading]);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading: isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
