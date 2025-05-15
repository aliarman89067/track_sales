import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowUp,
  BriefcaseBusiness,
  CalendarIcon,
  Check,
  X,
} from "lucide-react";
import Image from "next/image";

const AgentHistoryPanel = () => {
  const calendarData: {
    day: number;
    status: "sale" | "not_sale" | "holiday" | "remaining" | "leave";
  }[] = [
    {
      day: 1,
      status: "sale",
    },
    {
      day: 2,
      status: "sale",
    },
    {
      day: 3,
      status: "sale",
    },
    {
      day: 4,
      status: "not_sale",
    },
    {
      day: 5,
      status: "sale",
    },
    {
      day: 6,
      status: "sale",
    },
    {
      day: 7,
      status: "holiday",
    },
    {
      day: 8,
      status: "sale",
    },
    {
      day: 9,
      status: "sale",
    },
    {
      day: 10,
      status: "not_sale",
    },
    {
      day: 11,
      status: "sale",
    },
    {
      day: 12,
      status: "leave",
    },
    {
      day: 13,
      status: "sale",
    },
    {
      day: 14,
      status: "holiday",
    },
    {
      day: 15,
      status: "sale",
    },
    {
      day: 16,
      status: "not_sale",
    },
    {
      day: 17,
      status: "sale",
    },
    {
      day: 18,
      status: "sale",
    },
    {
      day: 19,
      status: "leave",
    },
    {
      day: 20,
      status: "sale",
    },
    {
      day: 21,
      status: "holiday",
    },
    {
      day: 22,
      status: "sale",
    },
    {
      day: 23,
      status: "not_sale",
    },
    {
      day: 24,
      status: "sale",
    },
    {
      day: 25,
      status: "remaining",
    },
    {
      day: 26,
      status: "remaining",
    },
    {
      day: 27,
      status: "remaining",
    },
    {
      day: 28,
      status: "holiday",
    },
    {
      day: 29,
      status: "remaining",
    },
    {
      day: 30,
      status: "remaining",
    },
  ];

  const calendarDetailsData: {
    title: string;
    count: number;
    type: "sale" | "not_sale" | "leave" | "weekend" | "remaining";
  }[] = [
    {
      title: "Days With Sales",
      count: 16,
      type: "sale",
    },
    {
      title: "Days Without Sales",
      count: 5,
      type: "not_sale",
    },
    {
      title: "Days Of Leave",
      count: 2,
      type: "leave",
    },
    {
      title: "Days Of Weekend",
      count: 4,
      type: "weekend",
    },
    {
      title: "Days Remaining",
      count: 5,
      type: "remaining",
    },
  ];

  const clientsData = [
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "John Doe",
      email: "johndoe233@gmail.com",
      amount: 1500,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Jane Smith",
      email: "janesmith99@gmail.com",
      amount: 2000,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Michael Brown",
      email: "mbrown87@gmail.com",
      amount: 1750,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Emily Davis",
      email: "emilydavis22@gmail.com",
      amount: 1600,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Chris Johnson",
      email: "chrisjohnson11@gmail.com",
      amount: 2100,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Laura Wilson",
      email: "laurawilson33@gmail.com",
      amount: 1950,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "David Martinez",
      email: "davidmartinez44@gmail.com",
      amount: 1400,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Olivia Garcia",
      email: "oliviagarcia66@gmail.com",
      amount: 1800,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "James Anderson",
      email: "jamesanderson99@gmail.com",
      amount: 1550,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Sophia Lee",
      email: "sophialee12@gmail.com",
      amount: 2200,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Daniel Moore",
      email: "danielmoore77@gmail.com",
      amount: 1650,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Mia Thompson",
      email: "miathompson88@gmail.com",
      amount: 1900,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Ethan White",
      email: "ethanwhite55@gmail.com",
      amount: 1750,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Ava Harris",
      email: "avaharris23@gmail.com",
      amount: 1600,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Logan Clark",
      email: "loganclark09@gmail.com",
      amount: 1850,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Isabella Lewis",
      email: "isabellalewis01@gmail.com",
      amount: 2000,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Lucas Walker",
      email: "lucaswalker32@gmail.com",
      amount: 1500,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Amelia Young",
      email: "ameliayoung44@gmail.com",
      amount: 1700,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Mason Hall",
      email: "masonhall76@gmail.com",
      amount: 1950,
    },
    {
      iamgeSrc: "/defaultPersonImage.png",
      name: "Charlotte Allen",
      email: "charlotteallen91@gmail.com",
      amount: 2100,
    },
  ];

  return (
    <section className="w-full bg-primaryGray flex flex-col items-center gap-6 justify-center py-20 max-sm:px-3">
      <h1 className="text-center font-bold text-3xl text-white font-jacquesFrancois">
        Check Out Your Agent History in a Sleek Design
      </h1>
      <div className="max-w-screen-sm lg:max-w-screen-lg xl:max-w-screen-xl w-full flex flex-col lg:flex-row max-lg:gap-4">
        <div className="w-full bg-white border border-secondaryGray max-lg:rounded-xl lg:rounded-tl-xl lg:rounded-bl-xl">
          <div className="h-24 w-full flex items-center justify-center border-b border-secondaryGray">
            <div className="flex flex-col gap-1 items-center">
              <span className="font-medium text-secondaryGray text-xl">
                Today Sales
              </span>
              <span className="font-bold text-secondaryGray text-xl">950$</span>
            </div>
          </div>
          <div className="flex flex-col w-[90%] md:w-[80%] items-center mx-auto">
            <div className="flex flex-col items-center my-5">
              <span className="font-semibold text-secondaryGray text-xl">
                Monthly Sales
              </span>
              <span className="font-bold text-primaryGray text-2xl">2400$</span>
            </div>
            <div className="grid grid-cols-6 gap-2 p-3 border border-secondaryGray rounded-lg w-full">
              {calendarData.map((item) => (
                <div
                  key={item.day}
                  className={cn(
                    "w-full aspect-square flex items-center justify-center relative rounded-lg",
                    item.status === "holiday"
                      ? "bg-white border border-secondaryGray"
                      : item.status === "sale"
                      ? "bg-green-300"
                      : item.status === "remaining"
                      ? "bg-brand-400"
                      : item.status === "leave"
                      ? "bg-secondaryGray"
                      : "bg-red-400"
                  )}
                >
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <>
                      {item.status === "remaining" && (
                        <CalendarIcon className="size-3 text-primaryGray" />
                      )}
                      {item.status === "not_sale" && (
                        <X className="size-3 text-primaryGray" />
                      )}
                      {item.status === "sale" && (
                        <Check className="size-3 text-primaryGray" />
                      )}
                      {item.status === "leave" && (
                        <span className="text-sm">L</span>
                      )}
                    </>
                  </div>
                  <span className="font-bold text-2xl text-white">
                    {item.status === "holiday" ? (
                      <span className="text-secondaryGray font-semibold text-3xl">
                        H
                      </span>
                    ) : (
                      <>{item.day}</>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 w-full my-5">
              {calendarDetailsData.map((item, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col items-center justify-center bg-primaryGray py-2 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center",
                        item.type === "sale"
                          ? "bg-green-400"
                          : item.type === "not_sale"
                          ? "bg-red-500"
                          : item.type === "remaining"
                          ? "bg-brand-500"
                          : item.type === "weekend"
                          ? "bg-white"
                          : "bg-secondaryGray"
                      )}
                    >
                      <>
                        {item.type === "sale" ? (
                          <Check className="size-4 text-white" />
                        ) : item.type === "not_sale" ? (
                          <X className="size-4 text-white" />
                        ) : item.type === "remaining" ? (
                          <CalendarIcon className="size-4 text-white" />
                        ) : item.type === "weekend" ? (
                          <BriefcaseBusiness className="size-4 text-secondaryGray" />
                        ) : (
                          <span className="text-white">L</span>
                        )}
                      </>
                    </div>
                    <span className="text-white text-lg">{item.title}</span>
                  </div>
                  <span className="text-white font-bold text-xl">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-secondaryGray w-full flex items-center justify-center flex-col gap-2 py-9">
            <span className="text-xl text-secondaryGray">Target Status</span>
            <span className="text-4xl font-bold text-primaryGray">
              Achieved
            </span>
          </div>
          <div className="border-t border-secondaryGray w-full flex items-center justify-center flex-col gap-2 py-9">
            <span className="text-xl text-secondaryGray">
              No of Days Remaining
            </span>
            <span className="text-4xl font-bold text-primaryGray">5 Days</span>
          </div>
        </div>
        <div className="w-full bg-white border border-secondaryGray max-lg:rounded-xl lg:rounded-tr-xl lg:rounded-br-xl hidden md:block">
          <div className="h-24 w-full flex items-center justify-center border-b border-secondaryGray">
            <div className="flex items-center justify-between w-full h-full px-4">
              <Button variant="custom" size="lg" className="rounded-md">
                Client Details
              </Button>
              <span className="font-medium text-secondaryGray text-base">
                5 Client
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-4 mt-6 h-[600px] lg:h-[1000px] overflow-y-scroll">
            {clientsData.slice(0, 12).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-secondaryGray bg-white hover:bg-gray-200 transition-colors duration-150 ease-linear"
              >
                {/* Client Image */}
                <div className="py-1 flex flex-grow shrink-0">
                  <Image
                    src={item.iamgeSrc}
                    alt={`${item.name} image`}
                    width={200}
                    height={200}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </div>
                {/* Client Name */}
                <div className="flex flex-col h-full w-full justify-center border-l border-secondaryGray text-center">
                  <div className="text-center flex items-center justify-center h-full px-4">
                    <span className="font-semibold text-base text-primaryGray">
                      Name
                    </span>
                  </div>
                  <div className="h-[1px] w-full bg-secondaryGray" />
                  <div className="text-center flex items-center justify-center h-full px-4">
                    <span className="font-medium text-base text-secondaryGray">
                      {item.name.substring(0, 6)}
                    </span>
                  </div>
                </div>
                {/* Client Name */}
                <div className="flex flex-col h-full w-full justify-center border-l border-secondaryGray text-center">
                  <div className="text-center flex items-center justify-center h-full px-4">
                    <span className="font-semibold text-base text-primaryGray">
                      Email
                    </span>
                  </div>
                  <div className="h-[1px] w-full bg-secondaryGray" />
                  <div className="text-center flex items-center justify-center h-full px-4">
                    <span className="font-medium text-base text-secondaryGray">
                      {item.email.substring(0, 10)}
                    </span>
                  </div>
                </div>
                {/* Client Amount */}
                <div className="flex flex-col h-full w-full justify-center border-l border-secondaryGray text-center">
                  <div className="text-center flex items-center justify-center h-full px-4">
                    <span className="font-semibold text-base text-primaryGray">
                      Amount
                    </span>
                  </div>
                  <div className="h-[1px] w-full bg-secondaryGray" />
                  <div className="text-center flex items-center justify-center h-full px-4">
                    <span className="font-medium text-base text-secondaryGray">
                      {item.amount}$
                    </span>
                  </div>
                </div>
                <div className="group flex h-full px-3 flex-grow shrink-0 items-center justify-center border-l border-secondaryGray cursor-not-allowed">
                  <ArrowUp className="size-5 text-brand-500 rotate-45 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-150 ease-linear" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentHistoryPanel;
