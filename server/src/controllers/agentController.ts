import { PrismaClient, USER_ROLE } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface GetAgentRequest extends Request {
  params: {
    cognitoId: string;
  };
}

export const getAgent = async (req: GetAgentRequest, res: Response) => {
  const { cognitoId } = req.params;
  try {
    const agent = await prisma.agent.findUnique({
      where: {
        cognitoId,
      },
    });
    if (!agent) {
      res.status(404).json({ message: "Agent not exist" });
      return;
    }
    res.status(200).json(agent);
  } catch (error: any) {
    console.log("Failed to fetch agent ", error.message ?? error);
    res.status(400).json({ message: "Failed to fatch agent" });
  }
};

interface CreateAgentRequest extends Request {
  body: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: USER_ROLE;
  };
}

export const createAgent = async (req: CreateAgentRequest, res: Response) => {
  const { id, name, email, phoneNumber, role } = req.body;
  try {
    const agent = await prisma.agent.create({
      data: {
        cognitoId: id,
        agentName: name,
        email,
        phoneNumber,
        role,
      },
    });
    res.status(201).json(agent);
  } catch (error: any) {
    console.log("Failed to creating new agent ", error.message ?? error);
    res.status(400).json({ message: "Failed to create new agent" });
  }
};

interface UpdateAdminRequest extends Request {
  params: {
    adminId: string;
  };
  body: {
    userName: string;
    email: string;
  };
}

export const updateAgent = async (req: Request, res: Response) => {};
