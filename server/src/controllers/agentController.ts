import { PrismaClient, USER_ROLE } from "@prisma/client";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

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

export const getAgent = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as { id: string; role: string };
    const existingAgent = await prisma.agent.findUnique({
      where: {
        id,
      },
    });
    if (!existingAgent) {
      res.status(401).json({ message: "User is unauthorized!" });
      return;
    }
    res.status(200).json(existingAgent);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Failed to get agent ${error.message ?? error}` });
  }
};

export const loginAgent = async (req: Request, res: Response) => {
  const { email } = req.params;
  try {
    const getAgent = await prisma.agent.findFirst({
      where: {
        email: email.trim(),
      },
    });
    if (!getAgent) {
      res.status(404).json({ message: "Agent is unauthorized!" });
      return;
    }
    // Signing Token
    const token = jwt.sign({ id: getAgent.id }, process.env.JWT_SECRET!, {
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
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Failed to get agent ${error.message ?? error}` });
  }
};

export const createAgent = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    // First we find is any organization has that user
    const getMember = await prisma.member.findFirst({
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
    const newAgent = await prisma.agent.create({
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
    const validate = await prisma.validateAgent.create({
      data: {
        agentId: newAgent.id,
        email,
        code,
        expData: new Date().getTime() + 10 * 60 * 1000,
      },
    });
    // Send email via nodemailer
    await sendMail(email, code);

    const token = jwt.sign({ id: newAgent.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    // now finish the http request and forward user to insert code page
    res.status(201).json({
      message: "Agent created Successfully",
      isVerified: newAgent.isVerified,
      validateId: validate.id,
      token,
    });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Failed to create agent ${error.message ?? error}` });
  }
};

const generate4DigitCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const sendMail = async (email: string, code: string) => {
  const SMTP_EMAIL = process.env.NODEMAILER_EMAIL!;
  const SMPT_PASSWORD = process.env.NODEMAILER_PASSWORD!;
  const transport = nodemailer.createTransport({
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
    } else {
      console.log(`Email send to ${email}`);
    }
  });
};

export const verifyAgent = async (req: Request, res: Response) => {
  try {
    const { validateId, code } = req.body;

    // Find Validate Model
    const validate = await prisma.validateAgent.findUnique({
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
    await prisma.agent.update({
      where: {
        id: validate.agentId,
      },
      data: {
        isVerified: true,
      },
    });
    res.status(200).json({ message: "Agent verified successfully." });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Failed to verify agent ${error.message ?? error}` });
  }
};

export const resendCode = async (req: Request, res: Response) => {
  const { validateId } = req.body;
  try {
    // Find Validate Model
    const getValidate = await prisma.validateAgent.findUnique({
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
    await prisma.validateAgent.update({
      where: {
        id: validateId,
      },
      data: {
        code,
        expData: new Date().getTime() + 10 * 60 * 1000,
      },
    });
    // Send Mail
    await sendMail(getValidate.email, code);
    res.status(200).json({ message: "Code resend successfully" });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Failed to resend Code ${error.message ?? error}` });
  }
};
