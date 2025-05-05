import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CreateNewUserProps {
  userData: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
  fetchWithBQ: any;
}

export const createNewUser = async ({
  userData,
  fetchWithBQ,
}: CreateNewUserProps) => {
  const endpoint =
    userData.role.toLowerCase() === "admin" ? "/admin" : "/agent";
  const createUserResponse = await fetchWithBQ({
    url: endpoint,
    method: "POST",
    body: userData,
  });
  if (createUserResponse.error) {
    throw new Error("Failed to create new user");
  }
  return createUserResponse;
};

export const getNameByRole = ({
  idToken,
  userRole,
}: {
  idToken: any;
  userRole: string;
}) => {
  return userRole.toLowerCase() === "admin"
    ? typeof idToken?.payload?.["custom:adminname"] === "string"
      ? idToken?.payload?.["custom:adminname"]
      : ""
    : typeof idToken?.payload?.["custom:adminname"] === "string"
    ? idToken?.payload?.["custom:agentname"]
    : "";
};

export const getRemainingDays = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  let remainingDaysCount = 0;
  for (let day = 0; day < totalDays; day++) {
    const currentDay = new Date(year, month, day);
    const isPast = currentDay < today;
    remainingDaysCount = isPast
      ? remainingDaysCount
      : (remainingDaysCount += 1);
  }
  return remainingDaysCount;
};

export const getRemainingTarget = ({
  currentSale,
  monthlyTarget,
}: {
  currentSale: number;
  monthlyTarget: number;
}) => {
  if (currentSale >= monthlyTarget) return 0;
  const remainingTarget = Math.round(monthlyTarget - currentSale);
  return remainingTarget;
};
