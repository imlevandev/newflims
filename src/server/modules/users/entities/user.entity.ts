export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: "admin" | "client";
  status: "active" | "pending";
  createdAt: string;
}
