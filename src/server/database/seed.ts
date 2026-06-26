import { UserModel } from "./models/user.model";
import { hashPassword } from "../lib/password";

let seeded = false;

export async function ensureDatabaseSeeded() {
  if (seeded) {
    return;
  }

  const totalUsers = await UserModel.countDocuments();

  if (totalUsers === 0) {
    const [adminPasswordHash, clientPasswordHash] = await Promise.all([
      hashPassword("admin123"),
      hashPassword("client123"),
    ]);

    await UserModel.insertMany([
      {
        name: "Admin Root",
        email: "admin@example.com",
        role: "admin",
        status: "active",
        passwordHash: adminPasswordHash,
      },
      {
        name: "Client Demo",
        email: "client@example.com",
        role: "client",
        status: "active",
        passwordHash: clientPasswordHash,
      },
    ]);
  }

  seeded = true;
}
