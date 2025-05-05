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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdmin = exports.createAdmin = exports.getAdmin = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { cognitoId } = req.params;
    try {
        const admin = yield prisma.admin.findUnique({
            where: {
                cognitoId,
            },
        });
        if (!admin) {
            res.status(404).json({ message: "Admin not exist" });
            return;
        }
        res.status(200).json(admin);
    }
    catch (error) {
        console.log("Failed to fetch admin ", (_a = error.message) !== null && _a !== void 0 ? _a : error);
        res.status(400).json({ message: "Failed to fatch admin" });
    }
});
exports.getAdmin = getAdmin;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id, name, email, phoneNumber, role } = req.body;
    try {
        const admin = yield prisma.admin.create({
            data: {
                cognitoId: id,
                adminName: name,
                email,
                phoneNumber,
                role,
            },
        });
        res.status(201).json(admin);
    }
    catch (error) {
        console.log("Failed to creating new admin ", (_a = error.message) !== null && _a !== void 0 ? _a : error);
        res.status(400).json({ message: "Failed to create new admin" });
    }
});
exports.createAdmin = createAdmin;
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.updateAdmin = updateAdmin;
