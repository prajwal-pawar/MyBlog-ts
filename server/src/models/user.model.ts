import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  name: string;
  password: string;
  profileImg: string;
  // for destructuring
  _doc: any;
}

const userSchema: Schema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
