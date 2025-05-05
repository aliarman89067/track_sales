import { Button } from "@/components/ui/button";
import { cn, getRemainingDays } from "@/lib/utils";
import { ArrowUp, BriefcaseBusiness, Calendar, Check, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { ClientRow } from "./ClientRow";

const AgentSheet = ({ memberData }: AgentSheetProps) => {
  const calendarBoxStyle = (status: string) => {
    if (status === "SALE") {
      return "bg-successGreen";
    }
    if (status === "NOT_SALE") {
      return "bg-errorRed";
    }
    if (status === "LEAVE") {
      return "bg-secondaryGray";
    }
    if (status === "HOLIDAY") {
      return "bg-white border border-gray-500";
    }
    return "bg-brand-500";
  };

  const calendarBoxContent = ({
    status,
    day,
  }: {
    status: string;
    day: number;
  }) => {
    if (status === "SALE") {
      return (
        <>
          <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center">
            <Check className="size-3 text-primaryGray" />
          </span>
          <span className="text-white font-medium text-2xl">{day}</span>
        </>
      );
    }
    if (status === "NOT_SALE") {
      return (
        <>
          <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center">
            <X className="size-3 text-primaryGray" />
          </span>
          <span className="text-white font-medium text-2xl">{day}</span>
        </>
      );
    }
    if (status === "LEAVE") {
      return (
        <>
          <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs text-primaryGray">
            L
          </span>
          <span className="text-white font-medium text-2xl">{day}</span>
        </>
      );
    }
    if (status === "HOLIDAY") {
      return <span className="font-medium text-2xl text-primaryGray">H</span>;
    }
    return (
      <>
        <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center">
          <Calendar className="size-3 text-primaryGray" />
        </span>
        <span className="text-white font-medium text-2xl">{day}</span>
      </>
    );
  };

  const getStatus = () => {
    if (Number(memberData.currentSale) < Number(memberData.monthlyTarget)) {
      return "Not Achieved";
    } else {
      return "Achieved";
    }
  };
  console.log(memberData);
  return (
    <section className="flex flex-col mt-6 gap-2 w-full mx-auto h-auto px-8">
      <h2 className="font-medium text-xl text-secondaryGray">
        Current Month History
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4 lg:gap-0">
        <div className="flex-1 flex flex-col w-full border border-secondaryGray max-lg:rounded-xl lg:rounded-tl-xl lg:rounded-bl-xl">
          {/* Left Tab bar */}
          <div className="flex items-center justify-center w-full h-20 border-b border-secondaryGray">
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-base text-gray-500">Today Sales</span>
                <h2 className="font-semibold text-primaryGray text-lg">
                  {memberData.todaySale}
                  {memberData.targetCurrency}
                </h2>
              </div>
            </div>
          </div>
          {/* Calendar Container */}
          <div className="flex flex-col items-center w-full px-3 pt-6">
            {/* Current Sales Details */}
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="font-medium text-secondaryGray text-2xl">
                Monthly Sales
              </span>
              <h1 className="font-bold text-primaryGray text-3xl">
                {memberData.currentSale}
                {memberData.targetCurrency}
              </h1>
            </div>
            {/* Calendar */}
            <div className="border border-gray-500 rounded-lg p-3 my-3 w-[95%] sm:w-[90%] md:w-[70%] lg:w-[90%]">
              <div className="grid grid-cols-6 gap-2 w-full">
                {memberData.calendarDays.map((calendarDay) => (
                  <div
                    key={calendarDay.id}
                    className={cn(
                      "relative aspect-square flex items-center justify-center rounded-lg",
                      calendarBoxStyle(calendarDay.status)
                    )}
                  >
                    {calendarBoxContent({
                      status: calendarDay.status,
                      day: calendarDay.day,
                    })}
                  </div>
                ))}
              </div>
            </div>
            <OverviewOfCalendar calendar={memberData.calendarDays} />
          </div>
          {/* Separator */}
          <div className="w-full h-[1px] bg-secondaryGray mt-6" />
          {/* Target Status */}
          <div className="flex flex-col items-center justify-center pt-8 px-3 gap-1">
            <span className="text-xl text-secondaryGray text-center">
              Target Status
            </span>
            <h1 className="font-bold text-primaryGray text-4xl text-center">
              {getStatus()}
            </h1>
          </div>
          {/* Separator */}
          <div className="w-full h-[1px] bg-secondaryGray mt-8" />
          {/* Target Status */}
          <div className="flex flex-col items-center justify-center py-8 px-3 gap-1">
            <span className="text-xl text-secondaryGray text-center">
              No of Days Remaining
            </span>
            <h1 className="font-bold text-primaryGray text-4xl text-center">
              {getRemainingDays()} {getRemainingDays() < 1 ? "Day" : "Days"}
            </h1>
          </div>
        </div>
        <div className="flex-1 flex flex-col w-full  border lg:border-l-transparent border-secondaryGray max-lg:rounded-xl lg:rounded-tr-xl lg:rounded-br-xl">
          {/* Right Tab bar */}
          <div className="flex items-center justify-center w-full h-20 flex-grow shrink-0 lg:border-b border-secondaryGray">
            <div className="flex-1 flex items-center justify-between px-6 w-full">
              <Button variant="custom" size="lg" className="rounded-lg">
                Client Details
              </Button>
              <span className="text-base text-primaryGray">
                {memberData.sales.length}{" "}
                {memberData.sales.length > 1 ? "Clients" : "Client"}
              </span>
            </div>
          </div>
          {memberData.sales.length < 1 ? (
            <div className="w-full h-full flex items-center justify-center flex-col">
              <Image
                src="/notFound.png"
                alt="No Sales Image"
                width={600}
                height={600}
                className="w-[300px] h-[300px] object-contain"
              />
              <div className="flex flex-col gap-1 items-center mt-4">
                <h2 className="font-bold text-primaryGray text-3xl">
                  {memberData.name}
                </h2>
                <span className="font-medium text-secondaryGray text-xl">
                  has no sales yet!
                </span>
              </div>
            </div>
          ) : (
            <div className="my-2 flex flex-col gap-3 w-full h-full px-6 mt-6">
              {memberData.sales.map((sale, index) => (
                <ClientRow key={index} sale={sale} memberData={memberData} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AgentSheet;

const OverviewOfCalendar = ({
  calendar,
}: {
  calendar: CalendarDaysProps[];
}) => {
  const getCounting = (
    type: "SALE" | "NOT_SALE" | "LEAVE" | "HOLIDAY" | "REMAINING"
  ) => {
    if (type === "SALE") {
      return calendar.reduce(
        (acc, day) => acc + (day.status === "SALE" ? 1 : 0),
        0
      );
    }
    if (type === "NOT_SALE") {
      return calendar.reduce(
        (acc, day) => acc + (day.status === "NOT_SALE" ? 1 : 0),
        0
      );
    }
    if (type === "LEAVE") {
      return calendar.reduce(
        (acc, day) => acc + (day.status === "LEAVE" ? 1 : 0),
        0
      );
    }
    if (type === "HOLIDAY") {
      return calendar.reduce(
        (acc, day) => acc + (day.status === "HOLIDAY" ? 1 : 0),
        0
      );
    }
    return calendar.reduce(
      (acc, day) => acc + (day.status === "REMAINING_DAY" ? 1 : 0),
      0
    );
  };
  return (
    <div className="grid grid-cols-2 gap-3 mt-3 w-[95%] sm:w-[90%] md:w-[70%] lg:w-[90%]">
      {/* Box 1 */}
      <div className="w-full bg-primaryGray flex flex-col items-center justify-center rounded-lg py-2">
        <span className="flex items-center gap-2 text-center">
          <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="size-4 text-white" />
          </span>
          <span className="text-white font-light text-lg">Days With Sales</span>
        </span>
        <span className="font-semibold text-white text-xl">
          {getCounting("SALE")}
        </span>
      </div>
      {/* Box 2 */}
      <div className="w-full bg-primaryGray flex flex-col items-center justify-center rounded-lg py-2">
        <span className="flex items-center gap-2 text-center">
          <span className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
            <X className="size-4 text-white" />
          </span>
          <span className="text-white font-light text-lg">
            Days Without Sales
          </span>
        </span>
        <span className="font-semibold text-white text-xl">
          {getCounting("NOT_SALE")}
        </span>
      </div>
      {/* Box 3 */}
      <div className="w-full bg-primaryGray flex flex-col items-center justify-center rounded-lg py-2">
        <span className="flex items-center gap-2 text-center">
          <span className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-xs text-white">
            L
          </span>
          <span className="text-white font-light text-lg">Days Of Leave</span>
        </span>
        <span className="font-semibold text-white text-xl">
          {getCounting("LEAVE")}
        </span>
      </div>
      {/* Box 4 */}
      <div className="w-full bg-primaryGray flex flex-col items-center justify-center rounded-lg py-2">
        <span className="flex items-center gap-2 text-center">
          <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <BriefcaseBusiness className="size-4 text-primaryGray" />
          </span>
          <span className="text-white font-light text-lg">Days Of Weekend</span>
        </span>
        <span className="font-semibold text-white text-xl">
          {getCounting("HOLIDAY")}
        </span>
      </div>
      {/* Box 5 */}
      <div className="w-full bg-primaryGray flex flex-col items-center justify-center rounded-lg py-2">
        <span className="flex items-center gap-2 text-center">
          <span className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
            <Calendar className="size-4 text-white" />
          </span>
          <span className="text-white font-light text-lg">Days Remaining</span>
        </span>
        <span className="font-semibold text-white text-xl">
          {getCounting("REMAINING")}
        </span>
      </div>
    </div>
  );
};
