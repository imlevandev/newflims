import type { UserDbObject } from "@/server/database/models/user.model";
import type { UserEntity } from "@/server/modules/users/entities/user.entity";

type UserRecord = UserDbObject & {
  _id: { toString(): string } | string;
};

export function toUserEntity(user: UserRecord): UserEntity {
  return {
    id: typeof user._id === "string" ? user._id : user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
  };
}
