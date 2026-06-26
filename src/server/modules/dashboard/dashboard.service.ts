import { connectDb } from "@/server/database/connect-db";
import { UserModel } from "@/server/database/models/user.model";
import { ensureDatabaseSeeded } from "@/server/database/seed";

export class DashboardService {
  async getStats() {
    await connectDb();
    await ensureDatabaseSeeded();

    const [totalUsers, admins, clients, activeUsers] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ role: "admin" }),
      UserModel.countDocuments({ role: "client" }),
      UserModel.countDocuments({ status: "active" }),
    ]);

    return {
      totalUsers,
      admins,
      clients,
      activeUsers,
    };
  }
}
