"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// LIBRARY IMPORTS
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
// ROUTES IMPORT
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const agentRoutes_1 = __importDefault(require("./routes/agentRoutes"));
const organizationRoutes_1 = __importDefault(require("./routes/organizationRoutes"));
const memberRoutes_1 = __importDefault(require("./routes/memberRoutes"));
const saleRoutes_1 = __importDefault(require("./routes/saleRoutes"));
// MIDDLEWARE IMPORTS
const authMiddleware_1 = require("./middleware.ts/authMiddleware");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use("/admin", (0, authMiddleware_1.authMiddleware)(["admin"]), adminRoutes_1.default);
app.use("/agent", agentRoutes_1.default);
app.use("/organizations", (0, authMiddleware_1.authMiddleware)(["admin", "agent"]), organizationRoutes_1.default);
app.use("/members", (0, authMiddleware_1.authMiddleware)(["admin"]), memberRoutes_1.default);
app.use("/sale", (0, authMiddleware_1.authMiddleware)(["admin", "agent"]), saleRoutes_1.default);
// TESTING ROUTE
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield prisma.admin.findMany();
    res.json(members);
}));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
