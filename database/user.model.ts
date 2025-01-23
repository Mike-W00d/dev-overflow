import { model, models, Schema } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String, required: true },
    location: { type: String },
    portfolio: { type: String },
    repuation: { type: Number, default: 0 },
  },
  { timestamps: true },
);
// if the user already exists in the database then we will use the existing model otherwise we will create a new model using the type IUser and the UserSchema.
const User = models?.user || model<IUser>("User", UserSchema);

export default User;
