import { AppError } from "@/server/common/errors/app-error";
import { toUserEntity } from "@/server/database/serializers/user.serializer";
import { hashPassword, verifyPassword } from "@/server/lib/password";

import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";
import { AuthRepository } from "./auth.repository";

export class AuthService {
  constructor(private readonly authRepository = new AuthRepository()) {}

  async register(dto: RegisterDto) {
    const existing = await this.authRepository.findUserByEmail(dto.email);
    if (existing) {
      throw new AppError("Email already in use", 409, "EMAIL_EXISTS");
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await this.authRepository.createUser({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    const safeUser = toUserEntity(user);

    return {
      accessToken: `token-${safeUser.id}`,
      user: {
        id: safeUser.id,
        name: safeUser.name,
        email: safeUser.email,
        role: safeUser.role,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.authRepository.findUserByEmail(dto.email);

    if (!user) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const isPasswordValid = await verifyPassword(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const safeUser = toUserEntity(user);

    return {
      accessToken: `token-${safeUser.id}`,
      user: {
        id: safeUser.id,
        name: safeUser.name,
        email: safeUser.email,
        role: safeUser.role,
      },
    };
  }
}
