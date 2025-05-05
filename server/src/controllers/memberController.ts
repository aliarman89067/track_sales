import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface CreateMembersRequest extends Request {
  body: {
    organizationId: string;
    adminCognitoId: string;
    members: {
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

export const createMembers = async (
  req: CreateMembersRequest,
  res: Response
) => {
  try {
    const { organizationId, adminCognitoId, members } = req.body;

    // Create members and add organizationId to them

    const checkOrganization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
        adminCognitoId,
      },
    });

    if (!checkOrganization) {
      res.status(404).json({ message: "Organization not found!" });
      return;
    }

    for (let i = 1; i < members.length; i++) {
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

    const newMembers = members.map(async (memberData) => {
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

      for (let day = 1; day <= totalDays; day++) {
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
          status: dayName.toLocaleLowerCase() === "sun" ? "HOLIDAY" : status,
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
          organizationId: organizationId,
          targetCurrency,
          salaryCurrency,
          keyword: checkOrganization.organizationKeyword,
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
      return member;
    });
    const newMembersData = await Promise.all(newMembers);
    res.status(201).json(newMembersData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create members" });
  }
};

interface GetMemberRequest extends Request {
  params: {
    memberId: string;
  };
}

export const getMember = async (req: GetMemberRequest, res: Response) => {
  const { memberId } = req.params;
  try {
    if (!memberId) {
      res.status(404).json({ message: "Payload is not correct!" });
    }
    const date = new Date();
    const getTodaySales = await prisma.sale.findMany({
      where: {
        memberId,
        createdAt: date.toDateString(),
      },
    });
    let todaySale = 0;
    getTodaySales.forEach((sale) => {
      todaySale += Number(sale.totalPayment);
    });
    const member = await prisma.member.update({
      where: {
        id: memberId,
      },
      data: {
        todaySale,
      },
      include: {
        calendarDays: {
          orderBy: {
            day: "asc",
          },
        },
        organization: true,
        sales: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    if (!member) {
      res.status(404).json({ message: "No member found!" });
      return;
    }
    res.status(200).json(member);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Failed to retreive member ${error.message ?? ""}` });
  }
};

interface AddLeaveRequest extends Request {
  body: {
    leave: string;
    memberId: string;
  };
}

export const addLeave = async (req: AddLeaveRequest, res: Response) => {
  const { leave, memberId } = req.body;
  try {
    if (!leave || !memberId) {
      res.status(404).json({ message: "Payload is not correct!" });
      return;
    }
    const date = new Date();
    await prisma.calendarDays.updateMany({
      where: {
        memberId,
        date: date.toISOString().split("T")[0],
      },
      data: {
        status: "LEAVE",
        leaveReason: leave,
      },
    });
    res.status(201).json({ success: true, message: "Leaved added!" });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Failed to add leave ${error.message ?? error}` });
  }
};
