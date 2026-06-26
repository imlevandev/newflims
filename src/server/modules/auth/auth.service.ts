import { AppError } from "@/server/common/errors/app-error";
import { toUserEntity } from "@/server/database/serializers/user.serializer";
import { verifyPassword } from "@/server/lib/password";

import type { LoginDto } from "./dto/login.dto";
import { AuthRepository } from "./auth.repository";

export class AuthService {
  constructor(private readonly authRepository = new AuthRepository()) {}

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
