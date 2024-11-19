import dotenv from "dotenv";

dotenv.config();

const env = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};

export default env;
