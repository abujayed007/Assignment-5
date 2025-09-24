import { model, Schema } from "mongoose";
import { IUser, Role, Status } from "./user.interface";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(Role),
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.PENDING,
  },
  commisionRate: { type: Number, default: 0 },
});

export const User = model<IUser>("User", userSchema);
