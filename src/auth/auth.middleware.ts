import { NextFunction, Request, Response } from "express";
import prisma from "../config/db";
import { verifyToken } from "../utils/token";
import { JwtPayload } from "./auth.types";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  // Check both cookies and authorization header
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // standard "Bearer <token>"
    } else {
      token = authHeader; // handle "just the token"
    }
  }

  //   console.log("token" + req.headers.authorization);
  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    const decoded = verifyToken(token) as JwtPayload & {
      user: { id: number; email: string; role: string };
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.user.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({
      message: "Invalid token",
      error: error?.message || "Token verification failed",
    });
    return;
  }
};

export const authenticateRefresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let refreshToken: string | undefined;

  // Check both cookies and authorization header
  if (req.cookies?.refreshToken) {
    refreshToken = req.cookies.refreshToken;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    refreshToken = req.headers.authorization.split(" ")[1];
  }

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const payload = verifyToken(refreshToken) as JwtPayload;

    // Verify the refresh token matches the one stored in DB
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
        // refreshToken: refreshToken // Ensure the token hasn't been invalidated
      },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    return res.status(401).json({
      message: "Invalid refresh token",
      error: error?.message || "Refresh token verification failed",
    });
  }
};
