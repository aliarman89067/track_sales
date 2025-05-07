import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Props {
  targetCurrency: string;
  prevMonthHistory: {
    id: string;
    memberId: string;
    year: number;
    month: string;
    target: string;
    totalSales: string;
    status: "Not_Achieved" | "Achieved";
    sales: Sales[];
  }[];
}

const PreviousMonthsHistory = ({ prevMonthHistory, targetCurrency }: Props) => {
  return (
    <div className="flex flex-col gap-4 mt-10 px-8">
      <h1 className="font-medium text-xl text-secondaryGray">
        Previous Months History
      </h1>
      {(prevMonthHistory.length === 0 || !prevMonthHistory) && (
        <div className="flex items-center justify-center w-full">
          <div className="flex flex-col items-center mt-4">
            <Image
              src="/calendarBg.png"
              alt="Calendar Image"
              width={800}
              height={800}
              className="w-[200px] object-contain"
            />
            <span className="text-2xl font-bold text-secondaryGray text-center mt-2">
              No History Found!
            </span>
          </div>
        </div>
      )}
      {prevMonthHistory.length > 0 && (
        <div className="w-full gap-4 grid grid-cols-1 lg:grid-cols-2">
          {prevMonthHistory.map((history, index) => (
            <div
              key={index}
              className="group rounded-lg border-2 border-secondaryGray p-4 flex items-center justify-between bg-white hover:bg-primaryGray transition-colors duration-150 ease-linear cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-primaryGray group-hover:text-white text-lg transition-colors duration-150 ease-linear">
                  Year
                </span>
                <span className="font-medium text-secondaryGray group-hover:text-gray-300 text-lg transition-colors duration-150 ease-linear">
                  {history.year}
                </span>
              </div>
              <div className="w-[1px] h-[35px] rounded-lg bg-gray-300" />
              <div className="flex flex-col">
                <span className="font-semibold text-primaryGray group-hover:text-white text-lg transition-colors duration-150 ease-linear">
                  Month
                </span>
                <span className="font-medium text-secondaryGray group-hover:text-gray-300 text-lg transition-colors duration-150 ease-linear">
                  {history.month}
                </span>
              </div>
              <div className="w-[1px] h-[35px] rounded-lg bg-gray-300" />
              <div className="flex flex-col">
                <span className="font-semibold text-primaryGray  group-hover:text-white text-lg transition-colors duration-150 ease-linear">
                  Status
                </span>
                <span
                  className={cn(
                    "font-medium text-lg transition-colors duration-150 ease-linear",
                    history.status === "Achieved"
                      ? "text-green-500"
                      : "text-red-500"
                  )}
                >
                  {history.status === "Achieved" ? "Achieved" : "Not Achieved"}
                </span>
              </div>
              <div className="w-[1px] h-[35px] rounded-lg bg-gray-300" />
              <div className="flex flex-col">
                <span className="font-semibold text-primaryGray group-hover:text-white text-lg transition-colors duration-150 ease-linear">
                  Total Sales
                </span>
                <span className="font-medium text-secondaryGray group-hover:text-gray-300 text-lg transition-colors duration-150 ease-linear">
                  {history.sales.reduce(
                    (sum, sale) => sum + Number(sale.totalPayment),
                    0
                  )}
                  {targetCurrency}
                </span>
              </div>
              <div className="w-[1px] h-[35px] rounded-lg bg-gray-300" />
              <div className="flex flex-col">
                <span className="font-semibold text-primaryGray group-hover:text-white text-lg transition-colors duration-150 ease-linear">
                  Total Clients
                </span>
                <span className="font-medium text-secondaryGray group-hover:text-gray-300 text-lg transition-colors duration-150 ease-linear">
                  {history.sales.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviousMonthsHistory;
