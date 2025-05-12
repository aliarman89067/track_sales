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
exports.deleteMember = exports.updateMember = exports.addLeave = exports.getMember = exports.createMembers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organizationId, adminCognitoId, members } = req.body;
        // Create members and add organizationId to them
        const checkOrganization = yield prisma.organization.findUnique({
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
            if (!members[i].name ||
                !members[i].email ||
                !members[i].salary ||
                isNaN(members[i].salary) ||
                !members[i].monthlyTarget ||
                isNaN(members[i].monthlyTarget) ||
                !members[i].imageUrl ||
                !members[i].targetCurrency ||
                !members[i].salaryCurrency) {
                res.status(500).json({ message: "Members data is not correct!" });
                return;
            }
        }
        const newMembers = members.map((memberData) => __awaiter(void 0, void 0, void 0, function* () {
            const { name, email, salary, monthlyTarget, phoneNumber, imageUrl, targetCurrency, salaryCurrency, } = memberData;
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
            const dateResult = [];
            for (let day = 1; day <= totalDays; day++) {
                const currentDate = new Date(year, month, day);
                const monthName = monthNames[month];
                const yearName = year;
                const dayName = currentDate.toLocaleDateString("en-us", {
                    weekday: "short",
                });
                const status = currentDate < todayData ? "NOT_SALE" : "REMAINING_DAY";
                dateResult.push({
                    date: currentDate.toISOString().split("T")[0],
                    day,
                    status: dayName.toLocaleLowerCase() === "sun" ? "HOLIDAY" : status,
                    month: monthName,
                    year: yearName,
                });
            }
            // const customDate = new Date(
            //   new Date().setMonth(new Date().getMonth() - 3)
            // );
            const member = yield prisma.member.create({
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
                    createdAt: new Date(),
                },
            });
            dateResult.map((date) => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.calendarDays.create({
                    data: {
                        day: date.day,
                        date: date.date,
                        status: date.status,
                        memberId: member.id,
                        month: date.month,
                        year: date.year,
                    },
                });
            }));
            return member;
        }));
        const newMembersData = yield Promise.all(newMembers);
        res.status(201).json(newMembersData);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create members" });
    }
});
exports.createMembers = createMembers;
const getMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { memberId } = req.params;
    try {
        if (!memberId) {
            res.status(404).json({ message: "Payload is not correct!" });
        }
        const date = new Date();
        const existingMember = yield prisma.member.findFirst({
            where: {
                id: memberId,
            },
            include: {
                sales: true,
            },
        });
        if (!existingMember) {
            res.status(404).json({ message: "Member not found!" });
            return;
        }
        // Checking is CalendarDays exist is not create them
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
        const yearName = date.getFullYear();
        const monthName = monthNames[date.getMonth()];
        const getCalendarDays = yield prisma.calendarDays.findMany({
            where: {
                memberId,
                year: yearName,
                month: monthName,
            },
        });
        if (getCalendarDays.length < 1) {
            console.log("Calendar days not exist. So Creating them");
            const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            console.log("totalDays", totalDays);
            const dateResult = [];
            for (let day = 1; day <= totalDays; day++) {
                const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
                const dayName = currentDate.toLocaleDateString("en-us", {
                    weekday: "short",
                });
                const status = currentDate < date ? "NOT_SALE" : "REMAINING_DAY";
                dateResult.push({
                    date: currentDate.toISOString().split("T")[0],
                    day,
                    status: dayName.toLowerCase() === "sun" ? "HOLIDAY" : status,
                    month: monthName,
                    year: yearName,
                });
            }
            dateResult.map((date) => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.calendarDays.create({
                    data: {
                        day: date.day,
                        date: date.date,
                        status: date.status,
                        memberId,
                        month: date.month,
                        year: date.year,
                    },
                });
            }));
        }
        else {
            console.log("Calendar days exist.");
        }
        const prevMonthInfo = getPrevMonthInfo(existingMember.createdAt);
        for (const data of prevMonthInfo) {
            const existingPrevMonth = yield prisma.previousMonth.findFirst({
                where: {
                    memberId,
                    year: data.year,
                    month: data.month,
                },
            });
            const prevMonthSales = yield prisma.sale.findMany({
                where: {
                    memberId,
                    year: data.year.toString(),
                    month: data.month,
                },
            });
            if (!existingPrevMonth && prevMonthSales.length > 0) {
                console.log("Previous month not exist. So Creating one.");
                const totalSalesAmount = prevMonthSales.reduce((sum, acc) => sum + Number(acc.totalPayment), 0);
                console.log("Total Sales Amount", totalSalesAmount);
                console.log("Member Monthly Target", existingMember.monthlyTarget);
                const status = totalSalesAmount < existingMember.monthlyTarget
                    ? "Not_Achieved"
                    : "Achieved";
                const prevMonth = yield prisma.previousMonth.create({
                    data: {
                        memberId: existingMember.id,
                        year: data.year,
                        month: data.month,
                        target: existingMember.monthlyTarget.toString(),
                        totalSales: existingMember.sales.length.toString(),
                        status, // Optional: include if you want to store it
                    },
                });
                const salesId = prevMonthSales.map((sale) => sale.id);
                for (const saleId of salesId) {
                    yield prisma.sale.update({
                        where: { id: saleId },
                        data: { previousMonthId: prevMonth.id },
                    });
                }
            }
        }
        const getTodaySales = yield prisma.sale.findMany({
            where: {
                memberId,
                createdAt: date.toDateString(),
            },
        });
        let todaySale = 0;
        getTodaySales.forEach((sale) => {
            todaySale += Number(sale.totalPayment);
        });
        const member = yield prisma.member.update({
            where: {
                id: memberId,
            },
            data: {
                todaySale,
            },
            include: {
                calendarDays: {
                    where: {
                        month: monthName,
                        year: yearName,
                    },
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
                previousMonths: {
                    include: {
                        sales: true,
                    },
                },
            },
        });
        if (!member) {
            res.status(404).json({ message: "No member found!" });
            return;
        }
        res.status(200).json(member);
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: `Failed to retreive member ${(_a = error.message) !== null && _a !== void 0 ? _a : ""}` });
    }
});
exports.getMember = getMember;
const getPrevMonthInfo = (dateStr) => {
    const currentDate = new Date();
    const oldDate = new Date(dateStr);
    const yearDiff = currentDate.getFullYear() - oldDate.getFullYear();
    const monthDiff = currentDate.getMonth() - oldDate.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff;
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
    const result = [];
    for (let i = 0; i < totalMonths; i++) {
        const month = monthNames[oldDate.getMonth()];
        const year = oldDate.getFullYear();
        result.push({
            month,
            year,
        });
        oldDate.setMonth(oldDate.getMonth() + 1);
    }
    return result;
};
const addLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { leave, memberId } = req.body;
    try {
        if (!leave || !memberId) {
            res.status(404).json({ message: "Payload is not correct!" });
            return;
        }
        const date = new Date();
        yield prisma.calendarDays.updateMany({
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
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: `Failed to add leave ${(_a = error.message) !== null && _a !== void 0 ? _a : error}` });
    }
});
exports.addLeave = addLeave;
const updateMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id, name, email, imageUrl, monthlyTarget, phoneNumber, salary, targetCurrency, salaryCurrency, } = req.body;
    try {
        if (!id ||
            !name ||
            !email ||
            !imageUrl ||
            !monthlyTarget ||
            !salary ||
            !targetCurrency ||
            !salaryCurrency) {
            res.status(404).json({ message: "Payload request is not correct!" });
            return;
        }
        const updatedMember = yield prisma.member.update({
            where: {
                id,
            },
            data: {
                name,
                email,
                imageUrl,
                monthlyTarget: Number(monthlyTarget),
                phoneNumber,
                salary: Number(salary),
                targetCurrency,
                salaryCurrency,
            },
        });
        res.status(201).json(updatedMember);
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: `Failed to update member ${(_a = error.message) !== null && _a !== void 0 ? _a : error}` });
    }
});
exports.updateMember = updateMember;
const deleteMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { memberId } = req.params;
    try {
        yield prisma.member.delete({
            where: {
                id: memberId,
            },
        });
        res.status(200).json({ message: "Member Deleted Successfully" });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: `Failed to delete member ${(_a = error.message) !== null && _a !== void 0 ? _a : error}` });
    }
});
exports.deleteMember = deleteMember;
