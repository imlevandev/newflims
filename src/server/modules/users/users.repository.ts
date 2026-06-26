import { connectDb } from "@/server/database/connect-db";
import { UserModel } from "@/server/database/models/user.model";
import { ensureDatabaseSeeded } from "@/server/database/seed";
import { toUserEntity } from "@/server/database/serializers/user.serializer";
import { hashPassword } from "@/server/lib/password";

import type { CreateUserDto } from "./dto/create-user.dto";
import type { UserEntity } from "./entities/user.entity";

export class UsersRepository {
  async findAll(): Promise<UserEntity[]> {
    await connectDb();
    await ensureDatabaseSeeded();

    const users = await UserModel.find()
      .sort({ createdAt: -1 })
      .exec();

    return users.map((user) => toUserEntity(user));
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    await connectDb();

    const passwordHash = await hashPassword(dto.password);
    const user = await UserModel.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      role: dto.role,
      passwordHash,
      status: "active" as const,
    });

    return toUserEntity(user);
  }

  async existsByEmail(email: string) {
    await connectDb();
    const total = await UserModel.countDocuments({
      email: email.toLowerCase(),
    });
    return total > 0;
  }
}
