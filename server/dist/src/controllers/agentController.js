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
exports.resendCode = exports.verifyAgent = exports.createAgent = exports.loginAgent = exports.getAgent = void 0;
const client_1 = require("@prisma/client");
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
// interface GetAgentRequest extends Request {
//   params: {
//     cognitoId: string;
//   };
// }
// export const getAgent = async (req: GetAgentRequest, res: Response) => {
//   const { cognitoId } = req.params;
//   try {
//     const agent = await prisma.agent.findUnique({
//       where: {
//         cognitoId,
//       },
//     });
//     if (!agent) {
//       res.status(404).json({ message: "Agent not exist" });
//       return;
//     }
//     res.status(200).json(agent);
//   } catch (error: any) {
//     console.log("Failed to fetch agent ", error.message ?? error);
//     res.status(400).json({ message: "Failed to fatch agent" });
//   }
// };
// interface CreateAgentRequest extends Request {
//   body: {
//     id: string;
//     name: string;
//     email: string;
//     phoneNumber: string;
//     role: USER_ROLE;
//   };
// }
// export const createAgent = async (req: CreateAgentRequest, res: Response) => {
//   const { id, name, email, phoneNumber, role } = req.body;
//   try {
//     const agent = await prisma.agent.create({
//       data: {
//         cognitoId: id,
//         agentName: name,
//         email,
//         phoneNumber,
//         role,
//       },
//     });
//     res.status(201).json(agent);
//   } catch (error: any) {
//     console.log("Failed to creating new agent ", error.message ?? error);
//     res.status(400).json({ message: "Failed to create new agent" });
//   }
// };
// interface UpdateAdminRequest extends Request {
//   params: {
//     adminId: string;
//   };
//   body: {
//     userName: string;
//     email: string;
//   };
// }
// export const updateAgent = async (req: Request, res: Response) => {};
const getAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.user;
        const existingAgent = yield prisma.agent.findUnique({
            where: {
                id,
            },
        });
        if (!existingAgent) {
            res.status(401).json({ message: "User is unauthorized!" });
            return;
        }
        res.status(200).json(existingAgent);
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: `Failed to get agent ${(_a = error.message) !== null && _a !== void 0 ? _a : error}` });
    }
});
exports.getAgent = getAgent;
const loginAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = req.params;
    try {
        const getAgent = yield prisma.agent.findFirst({
            where: {
                email: email.trim(),
            },
        });
        if (!getAgent) {
            res.status(404).json({ message: "Agent is unauthorized!" });
            return;
        }
        // Signing Token
        const token = jsonwebtoken_1.default.sign({ id: getAgent.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        // if (!getAgent.isVerified) {
        //   res.status(401).json({ message: "Agent is not authenticated!", token });
        //   return;
        // }
        const isVerified = getAgent.isVerified;
        res
            .status(200)
            .json({ message: "Agent is logged in successfully", token, isVerified });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: `Failed to get agent ${(_a = error.message) !== null && _a !== void 0 ? _a : error}` });
    }
});
exports.loginAgent = loginAgent;
const createAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email } = req.body;
        // First we find is any organization has that user
        const getMember = yield prisma.member.findFirst({
            where: {
                email: email.trim(),
            },
        });
        // is not throw an error
        if (!getMember) {
            res
                .status(404)
                .json({ message: "Agent is not a member of any Organization" });
            return;
        }
        //if yes create agent is database and set isVerified value to false
        const newAgent = yield prisma.agent.create({
            data: {
                email,
                agentName: getMember.name,
                role: "agent",
                imageUrl: getMember.imageUrl,
                isVerified: false,
            },
        });
        //create 4 digit code
        const code = generate4DigitCode();
        // Create Agent Validate Model
        const validate = yield prisma.validateAgent.create({
            data: {
                agentId: newAgent.id,
                email,
                code,
                expData: new Date().getTime() + 10 * 60 * 1000,
            },
        });
        // Send email via nodemailer
        yield sendMail(email, code);
        const token = jsonwebtoken_1.default.sign({ id: newAgent.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        // now finish the http request and forward user to insert code page
        res.status(201).json({
            message: "Agent created Successfully",
            isVerified: newAgent.isVerified,
            validateId: validate.id,
            token,
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: `Failed to create agent ${(_a = error.message) !== null && _a !== void 0 ? _a : error}` });
    }
});
exports.createAgent = createAgent;
const generate4DigitCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
const sendMail = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    const SMTP_EMAIL = process.env.NODEMAILER_EMAIL;
    const SMPT_PASSWORD = process.env.NODEMAILER_PASSWORD;
    const transport = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: SMTP_EMAIL,
            pass: SMPT_PASSWORD,
        },
    });
    const mailOptions = {
        from: SMTP_EMAIL,
        to: email,
        subject: "Your verification code",
        text: code,
    };
    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(`Error while sending mail ${err}`);
        }
        else {
            console.log(`Email send to ${email}`);
        }
    });
});
const verifyAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { validateId, code } = req.body;
        // Find Validate Model
        const validate = yield prisma.validateAgent.findUnique({
            where: {
                id: validateId,
                code,
            },
        });
        if (!validate) {
            res.status(404).json({ message: "Validate data not found!" });
            return;
        }
        // Check its expiry
        if (validate.expData < new Date().getTime()) {
            res.status(410).json({ message: "Validate is expired!" });
            return;
        }
        // Update User
        yield prisma.agent.update({
            where: {
                id: validate.agentId,
            },
            data: {
                isVerified: true,
            },
        });
        res.status(200).json({ message: "Agent verified successfully." });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: `Failed to verify agent ${(_a = error.message) !== null && _a !== void 0 ? _a : error}` });
    }
});
exports.verifyAgent = verifyAgent;
const resendCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { validateId } = req.body;
    try {
        // Find Validate Model
        const getValidate = yield prisma.validateAgent.findUnique({
            where: {
                id: validateId,
            },
        });
        if (!getValidate) {
            res.status(404).json({ message: "Validate Model not found!" });
            return;
        }
        // Create new Code
        const code = generate4DigitCode();
        // Update Validate Model
        yield prisma.validateAgent.update({
            where: {
                id: validateId,
            },
            data: {
                code,
                expData: new Date().getTime() + 10 * 60 * 1000,
            },
        });
        // Send Mail
        yield sendMail(getValidate.email, code);
        res.status(200).json({ message: "Code resend successfully" });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: `Failed to resend Code ${(_a = error.message) !== null && _a !== void 0 ? _a : error}` });
    }
});
exports.resendCode = resendCode;
