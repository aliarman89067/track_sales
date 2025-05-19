import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      const fullToken = req.headers.authorization?.split(" ")[1];
      const tokenType = fullToken?.split("tokenType")[1];
      const token = fullToken?.split("tokenType")[0];
      if (!token) {
        res.status(401).json({ message: "Token not found!" });
        return;
      }
      if (tokenType === "COGNITO") {
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
      } else if (tokenType === "JWT") {
        const { id } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = {
          id,
          role: "agent",
        };
      } else {
        throw new Error("User in unauthorized!");
      }
    } catch (error: any) {
      console.log("Failed to fetch token", error.message ?? error);
      res.status(400).json({ message: "Invalid Token" });
      return;
    }
    next();
  };
};
