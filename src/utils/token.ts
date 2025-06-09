import jwt from "jsonwebtoken";
import type { JwtPayload, UserPayload } from "../auth/auth.types";
import env from "../config/env";

const JWT_SECRET = env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN || "1h";
const REFRESH_TOKEN_EXPIRES_IN = env.REFRESH_TOKEN_EXPIRES_IN || "1d";

export const generateToken = (user: UserPayload) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: /*JWT_EXPIRES_IN||*/ "1h" }
  );
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: /*REFRESH_TOKEN_EXPIRES_IN||*/ "1d" }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
