"use client";
import SalesPercentageChart from "@/components/SalesPercentageChart";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  organization: OrganizationsWithMembersProps;
}

export const DashboardGrid = ({ organization }: Props) => {
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getUTCDate(); // getUTCDate() gives the day of the month
    const month = date.getUTCMonth() + 1; // Months are 0-indexed
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  }

  const getNewDays = (member: any) => {
    if (!member) return [];
    const date = new Date();
    const sortedCalenderDays = [...member.calendarDays].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const indexOfTargetDay = sortedCalenderDays.findIndex(
      (day) => day.day === date.getDate()
    );
    const checkIndexValid =
      indexOfTargetDay - 4 >= 0 ? indexOfTargetDay - 4 : 0;
    const targetCalendarDays = sortedCalenderDays.slice(
      checkIndexValid,
      indexOfTargetDay + 1
    );
    return targetCalendarDays;
  };
  return (
    <div className="grid xl:grid-cols-2 gap-4 w-full">
      {organization.members && organization.members?.length > 0 && (
        <>
          {organization.members.map((member) => {
            const targetDays = getNewDays(member);
            console.log(targetDays);
            return (
              <div
                key={member.id}
                className="w-full lg:w-[70%] xl:w-full py-2 px-4 rounded-xl border border-gray-400 flex flex-col gap-3"
              >
                <div className="flex justify-between">
                  <div className="flex gap-5">
                    <Image
                      src={member.imageUrl}
                      width={1000}
                      height={1000}
                      alt={`${member.name} image`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h2 className="text-lg text-primaryGray font-semibold">
                        {member.name}
                      </h2>
                      <span className="text-base text-secondaryGray">
                        {member.email}
                      </span>
                      <span className="text-base text-secondaryGray">
                        Join at {formatDate(member.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg text-primaryGray font-semibold">
                      Target
                    </h2>
                    <span className="text-base text-secondaryGray">
                      {member.monthlyTarget}
                      {member.targetCurrency}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg text-primaryGray font-semibold">
                      Current Sale
                    </h2>
                    <span className="text-base text-secondaryGray">
                      {member.currentSale}
                      {member.targetCurrency}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-4">
                    {targetDays?.map((calendarDay, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-1 items-center"
                      >
                        <div
                          className={cn(
                            "w-6 h-36 rounded-full",
                            calendarDay.status === "SALE"
                              ? "bg-green-400"
                              : calendarDay.status === "NOT_SALE"
                              ? "bg-red-400"
                              : calendarDay.status === "LEAVE"
                              ? "bg-primaryGray"
                              : calendarDay.status === "HOLIDAY"
                              ? "bg-gray-200"
                              : "bg-brand-500"
                          )}
                        ></div>
                        {calendarDay.status === "SALE" && (
                          <span className="text-secondaryGray font-semibold text-base">
                            {calendarDay.sale}
                            {member.targetCurrency}
                          </span>
                        )}
                        {calendarDay.status === "NOT_SALE" && (
                          <span className="text-secondaryGray font-semibold text-base">
                            --
                          </span>
                        )}
                        {calendarDay.status === "LEAVE" && (
                          <span className="text-secondaryGray font-semibold text-base">
                            L
                          </span>
                        )}
                        {calendarDay.status === "HOLIDAY" && (
                          <span className="text-secondaryGray font-semibold text-base">
                            H
                          </span>
                        )}
                        {calendarDay.status === "REMAINING_DAY" && (
                          <span className="text-secondaryGray font-semibold text-base">
                            R
                          </span>
                        )}
                        <span className="text-secondaryGray text-xs">
                          {formatDate(calendarDay.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="ml-auto max-sm:hidden">
                    <SalesPercentageChart
                      currentSale={member.currentSale}
                      monthlyTarget={member.monthlyTarget}
                      isSmall
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
