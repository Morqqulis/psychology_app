import { api } from "@/shared/lib/axios";
import type { RegisterResponse } from "@/services/auth/types";
import { useMutation } from "@tanstack/react-query";
import { EditProfileFormData } from "@/shared/schemas/auth";

export const userApi = {
  updateProfile: async (
    id: number,
    userData: Partial<EditProfileFormData>
  ): Promise<RegisterResponse> => {
    const { data } = await api.patch<RegisterResponse>(
      `/users/${id}`,
      userData
    );
    return data;
  },
};

const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.status === 400) {
    return "Yanlış məlumatlar daxil edilib";
  }
  if (error?.response?.status === 409) {
    return "Bu email artıq istifadə olunur";
  }
  if (error?.response?.status >= 500) {
    return "Server xətası baş verdi";
  }
  return "Xəta baş verdi";
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: number;
      userData: Partial<EditProfileFormData>;
    }) => userApi.updateProfile(id, userData),
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
};
