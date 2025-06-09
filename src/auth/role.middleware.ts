import { NextFunction, Request, Response } from "express";

export const requireRole = (requiredRole: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user is authenticated (from previous middleware)

    if (!req.user?.role) {
      res.status(401).json({
        error: "Authentication required",
        message: "Please authenticate first",
      });
      return;
    }

    // Check if user has the required role
    if (!requiredRole.includes(req.user.role)) {
      res.status(403).json({
        error: "Insufficient permissions",
        message: `Requires ${requiredRole} role`,
        yourRole: req.user.role,
      });
      return;
    }

    // User has the required role, proceed
    next();
  };
};

// Specific role middlewares
export const requireAdmin = requireRole(["ADMIN"]);
export const requireUser = requireRole(["USER"]);
export const requireUserAdmin = requireRole(["USER", "ADMIN"]);
export const requireEditor = requireRole(["EDITOR", "ADMIN"]);
