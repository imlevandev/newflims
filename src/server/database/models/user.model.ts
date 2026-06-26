import { model, models, Schema, type Model } from "mongoose";

export interface UserDbObject {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "client";
  status: "active" | "pending";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDbObject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      required: true,
      default: "client",
    },
    status: {
      type: String,
      enum: ["active", "pending"],
      required: true,
      default: "active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel =
  (models.User as Model<UserDbObject>) || model<UserDbObject>("User", userSchema);
