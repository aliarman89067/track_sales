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
exports.updateAgent = exports.createAgent = exports.getAgent = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { cognitoId } = req.params;
    try {
        const agent = yield prisma.agent.findUnique({
            where: {
                cognitoId,
            },
        });
        if (!agent) {
            res.status(404).json({ message: "Agent not exist" });
            return;
        }
        res.status(200).json(agent);
    }
    catch (error) {
        console.log("Failed to fetch agent ", (_a = error.message) !== null && _a !== void 0 ? _a : error);
        res.status(400).json({ message: "Failed to fatch agent" });
    }
});
exports.getAgent = getAgent;
const createAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id, name, email, phoneNumber, role } = req.body;
    try {
        const agent = yield prisma.agent.create({
            data: {
                cognitoId: id,
                agentName: name,
                email,
                phoneNumber,
                role,
            },
        });
        res.status(201).json(agent);
    }
    catch (error) {
        console.log("Failed to creating new agent ", (_a = error.message) !== null && _a !== void 0 ? _a : error);
        res.status(400).json({ message: "Failed to create new agent" });
    }
});
exports.createAgent = createAgent;
const updateAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.updateAgent = updateAgent;
