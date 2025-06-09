import { NextFunction, Request, Response } from "express";
import prisma from "../config/db"; // Adjust path to your Prisma instance
import { verifyToken } from "../utils/token";
import { UserPayload } from "./auth.types";

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  // Check for token in cookie or header
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }
  }

  // If no token, continue as guest
  //   console.log("optional auth" + token);
  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token) as UserPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (user) {
      req.user = user; // safely assign to req.user
    }
  } catch (error: any) {
    // Token invalid → proceed as guest
    // Optionally log the error but do not send a 401
    console.warn("Invalid token in optionalAuth:", error.message);
  }

  console.log(token);
  return next();
};
