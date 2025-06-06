import dotenv from "dotenv";
import { cleanEnv, str } from "envalid";

dotenv.config();

export default cleanEnv(process.env, {
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: "1h" }),
  REFRESH_TOKEN_EXPIRES_IN: str({ default: "1d" }),
  DATABASE_URL: str(),
  EMAIL_PASS: str(),
  EMAIL_USER: str(),
});
