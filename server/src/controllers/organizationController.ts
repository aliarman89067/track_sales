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

        const dateResult: {
          date: string;
          day: number;
          status: "SALE" | "NOT_SALE" | "LEAVE" | "HOLIDAY" | "REMAINING_DAY";
        }[] = [];

        for (let day = 1; day < totalDays; day++) {
          const currentDate = new Date(year, month, day);

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
          },
        });
        dateResult.map(async (date) => {
          await prisma.calendarDays.create({
            data: {
              day: date.day,
              date: date.date,
              status: date.status,
              memberId: member.id,
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

  console.log(organizationId, adminCognitoId);
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
