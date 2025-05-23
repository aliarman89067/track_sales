import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface GetOrganizationRequest extends Request {
  params: {
    adminCognitoId: string;
  };
}

export const getOrganizations = async (
  req: GetOrganizationRequest,
  res: Response
) => {
  const { adminCognitoId } = req.params;
  try {
    const organizations = await prisma.organization.findMany({
      where: {
        adminCognitoId,
      },
      include: {
        members: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(organizations);
  } catch (error) {
    console.log("Failed to fetch organizations ", error);
    res.status(400).json({ message: "Failed to fetch oraganizations" });
  }
};

interface GetOrganizationNameRequest extends Request {
  params: {
    organizationId: string;
    adminCognitoId: string;
  };
}

export const getOrganizationName = async (
  req: GetOrganizationNameRequest,
  res: Response
) => {
  try {
    const { organizationId, adminCognitoId } = req.params;
    if (!organizationId || !adminCognitoId) {
      res.status(400).json({ message: "Payload is not correct!" });
      return;
    }
    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
        adminCognitoId,
      },
      include: {
        members: true,
      },
    });
    if (!organization) {
      res.status(404).json({ message: "Organization not found!" });
      return;
    }
    res.json(organization);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get organization name" });
  }
};

interface CreateOrganizationRequest extends Request {
  body: {
    adminCognitoId: string;
    imageUrl: string;
    organizationName: string;
    organizationKeyword: string;
    isMember: boolean;
    members?: {
      imageUrl: string;
      id: number;
      name: string;
      email: string;
      phoneNumber?: string;
      monthlyTarget: number;
      salary: number;
      targetCurrency: string;
      salaryCurrency: string;
    }[];
  };
}

export const createOrganization = async (
  req: CreateOrganizationRequest,
  res: Response
) => {
  const {
    imageUrl,
    adminCognitoId,
    organizationName,
    organizationKeyword,
    isMember,
    members,
  } = req.body;

  try {
    if (
      !imageUrl ||
      !adminCognitoId ||
      !organizationName ||
      !organizationKeyword ||
      isMember === undefined ||
      isMember === null
    ) {
      res.status(500).json({ message: "Request Body is not correct!" });
      return;
    }

    if (isMember) {
      if (!members) {
        res.status(500).json({ message: "Members data is not exist!" });
        return;
      }
      for (let i = 0; i < members.length; i++) {
        if (
          !members[i].name ||
          !members[i].email ||
          !members[i].salary ||
          isNaN(members[i].salary) ||
          !members[i].monthlyTarget ||
          isNaN(members[i].monthlyTarget) ||
          !members[i].imageUrl ||
          !members[i].targetCurrency ||
          !members[i].salaryCurrency
        ) {
          res.status(500).json({ message: "Members data is not correct!" });
          return;
        }
      }
    }

    const organization = await prisma.organization.create({
      data: {
        imageUrl,
        adminCognitoId,
        organizationName,
        organizationKeyword,
      },
    });

    if (isMember && members) {
      const createMembers = members.map(async (memberData) => {
        const {
          name,
          email,
          salary,
          monthlyTarget,
          phoneNumber,
          imageUrl,
          targetCurrency,
          salaryCurrency,
        } = memberData;
        // Create Calendars Data
        const todayData = new Date();
        const year = todayData.getFullYear();
        const month = todayData.getMonth();
        const totalDays = new Date(year, month + 1, 0).getDate();

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const dateResult: {
          date: string;
          day: number;
          status: "SALE" | "NOT_SALE" | "LEAVE" | "HOLIDAY" | "REMAINING_DAY";
          month: string;
          year: number;
        }[] = [];

        for (let day = 1; day <= totalDays; day++) {
          const currentDate = new Date(year, month, day);

          const monthName = monthNames[month];
          const yearName = year;

          const dayName = currentDate.toLocaleDateString("en-us", {
            weekday: "short",
          });

          const status:
            | "SALE"
            | "NOT_SALE"
            | "LEAVE"
            | "HOLIDAY"
            | "REMAINING_DAY" =
            currentDate < todayData ? "NOT_SALE" : "REMAINING_DAY";
          dateResult.push({
            date: currentDate.toISOString().split("T")[0],
            day,
            status: dayName.toLowerCase() === "sun" ? "HOLIDAY" : status,
            month: monthName,
            year: yearName,
          });
        }

        const member = await prisma.member.create({
          data: {
            imageUrl,
            name,
            email,
            salary: Number(salary),
            monthlyTarget: Number(monthlyTarget),
            phoneNumber,
            todaySale: 0,
            currentSale: 0,
            overallSale: 0,
            organizationId: organization.id,
            targetCurrency,
            salaryCurrency,
            keyword: organizationKeyword,
            createdAt: todayData,
          },
        });
        dateResult.map(async (date) => {
          await prisma.calendarDays.create({
            data: {
              day: date.day,
              date: date.date,
              status: date.status,
              memberId: member.id,
              month: date.month,
              year: date.year,
            },
          });
        });
      });
      await Promise.all(createMembers);
    }
    res.status(201).json(organization);
  } catch (error) {
    console.log("Failed to create organizations ", error);
    res.status(400).json({ message: "Failed to create oraganizations" });
  }
};

interface GetOrganizationMembersRequest {
  params: {
    organizationId: string;
    adminCognitoId: string;
  };
}

export const getOrganizationMembers = async (
  req: GetOrganizationMembersRequest,
  res: Response
) => {
  const { organizationId, adminCognitoId } = req.params;

  try {
    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
        adminCognitoId,
      },
      include: {
        members: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!organization) {
      res.status(404).json({ message: "No organization found!" });
      return;
    }
    res.status(200).json(organization);
  } catch (error: any) {
    console.log("Failed to get organization member", error);
    res.status(500).json({
      message: `Failed to get organization members ${error.message ?? ""}`,
    });
  }
};

export const updateOrganization = async (req: Request, res: Response) => {
  const {
    adminCognitoId,
    organizationId,
    imageUrl,
    organizationName,
    organizationKeyword,
  } = req.body;
  try {
    if (
      !adminCognitoId ||
      !organizationId ||
      !imageUrl ||
      !organizationName ||
      !organizationKeyword
    ) {
      res.status(404).json({ message: "Payload is not correct!" });
      return;
    }
    await prisma.organization.update({
      where: {
        id: organizationId,
        adminCognitoId,
      },
      data: {
        imageUrl,
        organizationName,
        organizationKeyword,
      },
    });
    res.status(200).json({ message: "Organization updated successfully." });
  } catch (error: any) {
    console.log("Failed to update organization", error);
    res.status(500).json({
      message: `Failed to update organization ${error.message ?? ""}`,
    });
  }
};

export const getOrganizationsWithMembers = async (
  req: Request,
  res: Response
) => {
  const { adminCognitoId } = req.params;
  try {
    const organizations = await prisma.organization.findMany({
      where: {
        adminCognitoId,
      },
      include: {
        sales: true,
        members: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            calendarDays: true,
            sales: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(organizations);
  } catch (error) {
    console.log("Failed to fetch organizations ", error);
    res.status(400).json({ message: "Failed to fetch oraganizations" });
  }
};

export const deleteOrganization = async (req: Request, res: Response) => {
  const { organizationId } = req.params;
  try {
    if (!organizationId) {
      res.status(404).json({ message: "OrganizationId is not provided!" });
      return;
    }
    await prisma.organization.delete({
      where: {
        id: organizationId,
      },
    });
    res.status(200).json({ message: "Organization Delete Successfully!" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: `Failed to delete organization ${error.message ?? error}`,
    });
  }
};

export const getAgentOrganizations = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;
    if (!id) {
      res.status(404).json({ message: "Agent id is not exist in middleware!" });
      return;
    }
    // Find Agent
    const existingAgent = await prisma.agent.findFirst({
      where: {
        id,
      },
    });
    if (!existingAgent) {
      res.status(404).json({ message: "Agent is not found!" });
      return;
    }
    // Get all organization with only that agent
    const organizations = await prisma.member.findMany({
      where: {
        email: "luddo8906@gmail.com",
      },
      include: {
        organization: {
          include: {
            members: false,
          },
        },
      },
    });
    res.status(200).json(organizations);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: `Failed to get organizations ${error.message ?? error}`,
    });
  }
};
