export interface IUser {
  name: string;
  role: "user" | "doctor";
  surname: string;
  gender: "male" | "female";
  email: string;
  id: number;
  updatedAt: string;
  createdAt: string;
  status?: "basic" | "vip";
  totalMessagesUsed?: number;
  invitedCount?: number;
  referralCode?: string;
  referredBy?: string | null;
}
