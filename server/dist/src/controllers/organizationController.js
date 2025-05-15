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
exports.getOrganizationsWithMembers = exports.updateOrganization = exports.getOrganizationMembers = exports.createOrganization = exports.getOrganizationName = exports.getOrganizations = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getOrganizations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminCognitoId } = req.params;
    try {
        const organizations = yield prisma.organization.findMany({
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
    }
    catch (error) {
        console.log("Failed to fetch organizations ", error);
        res.status(400).json({ message: "Failed to fetch oraganizations" });
    }
});
exports.getOrganizations = getOrganizations;
const getOrganizationName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organizationId, adminCognitoId } = req.params;
        if (!organizationId || !adminCognitoId) {
            res.status(400).json({ message: "Payload is not correct!" });
            return;
        }
        const organization = yield prisma.organization.findUnique({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get organization name" });
    }
});
exports.getOrganizationName = getOrganizationName;
const createOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageUrl, adminCognitoId, organizationName, organizationKeyword, isMember, members, } = req.body;
    try {
        if (!imageUrl ||
            !adminCognitoId ||
            !organizationName ||
            !organizationKeyword ||
            isMember === undefined ||
            isMember === null) {
            res.status(500).json({ message: "Request Body is not correct!" });
            return;
        }
        if (isMember) {
            if (!members) {
                res.status(500).json({ message: "Members data is not exist!" });
                return;
            }
            for (let i = 0; i < members.length; i++) {
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
        }
        const organization = yield prisma.organization.create({
            data: {
                imageUrl,
                adminCognitoId,
                organizationName,
                organizationKeyword,
            },
        });
        if (isMember && members) {
            const createMembers = members.map((memberData) => __awaiter(void 0, void 0, void 0, function* () {
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
                        status: dayName.toLowerCase() === "sun" ? "HOLIDAY" : status,
                        month: monthName,
                        year: yearName,
                    });
                }
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
                        organizationId: organization.id,
                        targetCurrency,
                        salaryCurrency,
                        keyword: organizationKeyword,
                        createdAt: todayData,
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
            }));
            yield Promise.all(createMembers);
        }
        res.status(201).json(organization);
    }
    catch (error) {
        console.log("Failed to create organizations ", error);
        res.status(400).json({ message: "Failed to create oraganizations" });
    }
});
exports.createOrganization = createOrganization;
const getOrganizationMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { organizationId, adminCognitoId } = req.params;
    try {
        const organization = yield prisma.organization.findUnique({
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
    }
    catch (error) {
        console.log("Failed to get organization member", error);
        res.status(500).json({
            message: `Failed to get organization members ${(_a = error.message) !== null && _a !== void 0 ? _a : ""}`,
        });
    }
});
exports.getOrganizationMembers = getOrganizationMembers;
const updateOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { adminCognitoId, organizationId, imageUrl, organizationName, organizationKeyword, } = req.body;
    try {
        if (!adminCognitoId ||
            !organizationId ||
            !imageUrl ||
            !organizationName ||
            !organizationKeyword) {
            res.status(404).json({ message: "Payload is not correct!" });
            return;
        }
        yield prisma.organization.update({
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
    }
    catch (error) {
        console.log("Failed to update organization", error);
        res.status(500).json({
            message: `Failed to update organization ${(_a = error.message) !== null && _a !== void 0 ? _a : ""}`,
        });
    }
});
exports.updateOrganization = updateOrganization;
const getOrganizationsWithMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminCognitoId } = req.params;
    try {
        const organizations = yield prisma.organization.findMany({
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
    }
    catch (error) {
        console.log("Failed to fetch organizations ", error);
        res.status(400).json({ message: "Failed to fetch oraganizations" });
    }
});
exports.getOrganizationsWithMembers = getOrganizationsWithMembers;
