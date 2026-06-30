import { connectDb } from "@/server/database/connect-db";
import { ensureDatabaseSeeded } from "@/server/database/seed";
import { UserModel } from "@/server/database/models/user.model";

export class AuthRepository {
  async createUser(data: { name: string; email: string; passwordHash: string }) {
    await connectDb();
    await ensureDatabaseSeeded();
    return UserModel.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      role: "client",
      status: "active",
    });
  }

  async findUserByEmail(email: string) {
    await connectDb();
    await ensureDatabaseSeeded();

    return UserModel.findOne({
      email: email.toLowerCase(),
    })
      .exec();
  }
}
