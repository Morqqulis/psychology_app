export interface IUser {
  id: number;
  name: string;
  role: "user" | "doctor";
  surname: string;
  gender: "male" | "female";
  updatedAt: string;
  createdAt: string;
  email: string;
}
