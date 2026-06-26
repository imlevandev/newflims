import { AppError } from "@/server/common/errors/app-error";

import type { CreateUserDto } from "./dto/create-user.dto";
import { UsersRepository } from "./users.repository";

export class UsersService {
  constructor(private readonly usersRepository = new UsersRepository()) {}

  async listUsers() {
    return this.usersRepository.findAll();
  }

  async createUser(dto: CreateUserDto) {
    if (await this.usersRepository.existsByEmail(dto.email)) {
      throw new AppError("Email already exists", 409, "EMAIL_EXISTS");
    }

    return this.usersRepository.create(dto);
  }
}
