import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

interface DecodedToken extends JwtPayload {
  sub: string;
  "custom:role"?: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (userRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "Token not found!" });
        return;
      }
      const decoded = jwt.decode(token) as DecodedToken;
      const userRole = decoded["custom:role"] || "";
      const userId = decoded.sub;
      const hasAccess = userRoles.includes(userRole);
      if (!hasAccess) {
        res.status(403).json({ message: "Access Denied!" });
        return;
      }
      req.user = {
        id: userId,
        role: userRole,
      };
    } catch (error: any) {
      console.log("Failed to fetch token", error.message ?? error);
      res.status(400).json({ message: "Invalid Token" });
      return;
    }
    next();
  };
};
