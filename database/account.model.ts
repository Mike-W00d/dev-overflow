import { model, models, Schema, Types } from "mongoose";

export interface IAccount {
  UserID: Types.ObjectId;
  name: string;
  image?: string;
  password?: string;
  provider?: string;
  ProviderAccountID: string;
}

const AccountSchema = new Schema<IAccount>(
  {
    UserID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    image: { type: String },
    password: { type: String },
    provider: { type: String },
    ProviderAccountID: { type: String, required: true },
  },
  { timestamps: true },
);
// if models already exists user that if not create a new model of type IAccount and AccountSchema and export it.
const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default Account;
