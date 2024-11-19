import mongoose from "mongoose";
import env from "./environment";

const MONGO_URL = String(env.mongoUrl);

const connectToMongodb = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(`Connected to mongodb`);
  } catch (err) {
    console.error(`Mongodb connection error`, err);
    process.exit(1);
  }
};

export default connectToMongodb;
