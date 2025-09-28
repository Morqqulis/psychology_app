import z from "zod";

const PasswordSchema = z
  .string({ error: "Şifrəni daxil edin" })
  .trim()
  .min(8, { message: "Şifrə minimum 8  simvoldan ibarət olmalıdır" })
  .regex(/[A-Z]/, { message: "Şifrədə ən az bir böyük hərf olmalıdır" })
  .regex(/[a-z]/, { message: "Şifrədə ən az bir kiçik hərf olmalıdır" })
  .regex(/[0-9]/, { message: "Şifrədə ən az bir rəqəm olmalıdır" })
  .regex(/^\S*$/, { message: "Şifrədə boşluq ola bilməz" });

export const registerSchema = z
  .object({
    email: z.email({ message: "Düzgün email ünvanı daxil edin" }),
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
    name: z
      .string({
        error: "Adınızı daxil edin",
      })
      .trim()
      .min(2, {
        message: "Adınızı daxil edin",
      }),

    surname: z
      .string({
        error: "Soyadınızı daxil edin",
      })
      .trim()
      .min(3, {
        message: "Soyadınızı daxil edin",
      }),

    gender: z.enum(["male", "female"], {
      error: "Cinsinizi seçin",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifrələr uyğun gəlmir",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email({ message: "Düzgün email ünvanı daxil edin" }),
  password: PasswordSchema,
});
export const editProfileSchema = z.object({
  email: z.email({ message: "Düzgün email ünvanı daxil edin" }),
  name: z
    .string({
      error: "Adınızı daxil edin",
    })
    .trim()
    .min(2, {
      message: "Adınızı daxil edin",
    }),

  surname: z
    .string({
      error: "Soyadınızı daxil edin",
    })
    .trim()
    .min(3, {
      message: "Soyadınızı daxil edin",
    }),

  gender: z.enum(["male", "female"], {
    error: "Cinsinizi seçin",
  }),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// const PhoneSchema = z
//   .string({ error: "errNumStr" })
//   .trim()
//   .regex(/^\+[1-9]\d{7,14}$/, {
//     message: "errNumReg",
//   });
// export const ImageSchema = z.string({ error: "errImageRequired" });
// const nonEmptyString = () =>
//   z.string({ error: "invalidFormat" }).nonempty({ message: "fieldRequired" });
