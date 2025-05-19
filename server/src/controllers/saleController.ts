import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addNewSale = async (req: Request, res: Response) => {
  try {
    const {
      clientName,
      clientEmail,
      totalPayment,
      paidAmount,
      remainingAmount,
      clientImageUrl,
      clientPhoneNumber,
      description,
      organizationId,
      memberId,
    } = req.body;
    if (
      !clientName ||
      !clientEmail ||
      !totalPayment ||
      !memberId ||
      !organizationId
    ) {
      res.status(404).json({ message: "Request payload is not correct!" });
      return;
    }

    const date = new Date();

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

    const specialDateFormat = `${monthNames[date.getMonth()]}-${date
      .getFullYear()
      .toString()}`;

    const month = monthNames[date.getMonth()];
    const year = date.getFullYear().toString();

    let overallSalesAmount = 0;
    const findOverallSales = await prisma.sale.findMany({
      where: {
        memberId,
      },
    });
    findOverallSales.forEach((sale) => {
      overallSalesAmount += Number(sale.totalPayment);
    });
    overallSalesAmount += Number(totalPayment);

    const findSales = await prisma.sale.findMany({
      where: {
        memberId,
        createDate: specialDateFormat,
      },
    });
    let totalSalesAmount = 0;
    findSales.forEach((sale) => {
      totalSalesAmount += Number(sale.totalPayment);
    });
    totalSalesAmount += Number(totalPayment);

    await prisma.member.update({
      where: {
        id: memberId,
      },
      data: {
        currentSale: totalSalesAmount,
        overallSale: overallSalesAmount,
      },
    });

    const response = await prisma.sale.create({
      data: {
        year,
        month,
        clientName,
        clientEmail,
        totalPayment,
        paidAmount: paidAmount > 0 ? paidAmount : "0",
        remainingAmount: remainingAmount > 0 ? remainingAmount : "0",
        clientImageUrl,
        clientPhoneNumber,
        description,
        memberId,
        organizationId,
        createDate: specialDateFormat,
        createdAt: date.toDateString(),
      },
    });
    let pastCurrentSale = 0;
    const existingCurrentCalendar = await prisma.calendarDays.findFirst({
      where: {
        memberId,
        date: date.toISOString().split("T")[0],
      },
    });
    if (existingCurrentCalendar && existingCurrentCalendar.status === "SALE") {
      pastCurrentSale = Number(existingCurrentCalendar.sale);
    }
    await prisma.calendarDays.updateMany({
      where: {
        memberId,
        date: date.toISOString().split("T")[0],
      },
      data: {
        status: "SALE",
        sale: JSON.stringify(Number(response.totalPayment) + pastCurrentSale),
      },
    });
    res.status(201).json(response);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Failed to add new sale ${error.message ?? error}` });
  }
};
