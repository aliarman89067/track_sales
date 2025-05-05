import { PrismaClient, USER_ROLE } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface GetAdminRequest extends Request {
  params: {
    cognitoId: string;
  };
}

export const getAdmin = async (req: GetAdminRequest, res: Response) => {
  const { cognitoId } = req.params;
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        cognitoId,
      },
    });
    if (!admin) {
      res.status(404).json({ message: "Admin not exist" });
      return;
    }
    res.status(200).json(admin);
  } catch (error: any) {
    console.log("Failed to fetch admin ", error.message ?? error);
    res.status(400).json({ message: "Failed to fatch admin" });
  }
};

interface CreateAdminRequest extends Request {
  body: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: USER_ROLE;
  };
}

export const createAdmin = async (req: CreateAdminRequest, res: Response) => {
  const { id, name, email, phoneNumber, role } = req.body;
  try {
    const admin = await prisma.admin.create({
      data: {
        cognitoId: id,
        adminName: name,
        email,
        phoneNumber,
        role,
      },
    });
    res.status(201).json(admin);
  } catch (error: any) {
    console.log("Failed to creating new admin ", error.message ?? error);
    res.status(400).json({ message: "Failed to create new admin" });
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

export const updateAdmin = async (req: Request, res: Response) => {};
