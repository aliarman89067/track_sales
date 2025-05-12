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
exports.addNewSale = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addNewSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { clientName, clientEmail, totalPayment, paidAmount, remainingAmount, clientImageUrl, clientPhoneNumber, description, organizationId, memberId, } = req.body;
        if (!clientName ||
            !clientEmail ||
            !totalPayment ||
            !memberId ||
            !organizationId) {
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
        const findOverallSales = yield prisma.sale.findMany({
            where: {
                memberId,
            },
        });
        findOverallSales.forEach((sale) => {
            overallSalesAmount += Number(sale.totalPayment);
        });
        overallSalesAmount += Number(totalPayment);
        const findSales = yield prisma.sale.findMany({
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
        yield prisma.member.update({
            where: {
                id: memberId,
            },
            data: {
                currentSale: totalSalesAmount,
                overallSale: overallSalesAmount,
            },
        });
        const response = yield prisma.sale.create({
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
        yield prisma.calendarDays.updateMany({
            where: {
                memberId,
                date: date.toISOString().split("T")[0],
            },
            data: {
                status: "SALE",
            },
        });
        res.status(201).json(response);
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: `Failed to add new sale ${(_a = error.message) !== null && _a !== void 0 ? _a : error}` });
    }
});
exports.addNewSale = addNewSale;
