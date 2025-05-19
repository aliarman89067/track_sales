"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authMiddleware = (userRoles) => {
    return (req, res, next) => {
        var _a, _b;
        try {
            const fullToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            const tokenType = fullToken === null || fullToken === void 0 ? void 0 : fullToken.split("tokenType")[1];
            const token = fullToken === null || fullToken === void 0 ? void 0 : fullToken.split("tokenType")[0];
            if (!token) {
                res.status(401).json({ message: "Token not found!" });
                return;
            }
            if (tokenType === "COGNITO") {
                const decoded = jsonwebtoken_1.default.decode(token);
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
            }
            else if (tokenType === "JWT") {
                const { id } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                req.user = {
                    id,
                    role: "agent",
                };
            }
            else {
                throw new Error("User in unauthorized!");
            }
        }
        catch (error) {
            console.log("Failed to fetch token", (_b = error.message) !== null && _b !== void 0 ? _b : error);
            res.status(400).json({ message: "Invalid Token" });
            return;
        }
        next();
    };
};
exports.authMiddleware = authMiddleware;
