export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: "admin" | "client";
}
