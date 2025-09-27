import { api } from "@/shared/lib/axios";
import type {
  LoginResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  AuthResponse,
} from "@/services/auth/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/users/login", credentials);
    return data;
  },

  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>("/users", userData);
    return data;
  },

  getProfile: async (): Promise<AuthResponse> => {
    const { data } = await api.get<AuthResponse>("/users/me");
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/users/logout");
  },
};

const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.status === 400) {
    return "Yanlış məlumatlar daxil edilib";
  }
  if (error?.response?.status === 401) {
    return "Email və ya parol yanlışdır";
  }
  if (error?.response?.status === 409) {
    return "Bu email artıq istifadə olunur";
  }
  if (error?.response?.status >= 500) {
    return "Server xətası baş verdi";
  }
  return "Xəta baş verdi";
};

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 3,
    enabled: true,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: authApi.logout,
  });
};
