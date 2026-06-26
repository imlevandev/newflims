import { connectDb } from "@/server/database/connect-db";
import { ensureDatabaseSeeded } from "@/server/database/seed";
import { UserModel } from "@/server/database/models/user.model";

export class AuthRepository {
  async findUserByEmail(email: string) {
    await connectDb();
    await ensureDatabaseSeeded();

    return UserModel.findOne({
      email: email.toLowerCase(),
    })
      .exec();
  }
}
