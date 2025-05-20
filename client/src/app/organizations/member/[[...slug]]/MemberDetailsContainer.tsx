"use client";
import React, { useEffect } from "react";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import {
  useDeleteMemberMutation,
  useGetAuthUserQuery,
  useGetMemberQuery,
} from "@/state/api";
import {
  CircleAlert,
  Loader2,
  Settings2Icon,
  SettingsIcon,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { cn, getRemainingDays, getRemainingTarget } from "@/lib/utils";
import SalesPercentageChart from "@/components/SalesPercentageChart";
import AgentSheet from "./AgentSheet";
import PreviousMonthsHistory from "./PreviousMonthsHistory";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetHeader,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const MemberDetailsContainer = ({
  memberId,
  organizationId,
}: MemberDetailsContainerProps) => {
  const router = useRouter();

  const {
    data: authData,
    isLoading: isAuthLoading,
    error: authError,
  } = useGetAuthUserQuery();

  const {
    data: memberData,
    isLoading: isMemberLoading,
    error: memberError,
  } = useGetMemberQuery({
    memberId,
  });
  const [deleteMember] = useDeleteMemberMutation();

  // useEffect(() => {
  //   if (!isAuthLoading && !authData) {
  //     router.push("/");
  //   } else if (!isAuthLoading && !authError) {
  //     router.push("/");
  //   }
  // }, [isAuthLoading, authData]);

  if (isMemberLoading || isAuthLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="flex justify-center items-center gap-2">
          <Loader2 className="size-5 text-primaryGray animate-spin" />
          <span className="text-base text-primaryGray">Loading...</span>
        </div>
      </div>
    );
  }
  const handleUpdateMember = () => {
    router.push(`/organizations/member/update/${memberId}`);
  };

  const handleDeleteMember = async () => {
    try {
      await deleteMember({
        memberId,
      });
      router.back();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later!");
    }
  };

  return (
    <section className="w-full flex flex-col gap-5 max-w-screen-xl mx-auto mb-4">
      <div className="w-full mt-10">
        <BackButton title="Back" href="/organizations" />
      </div>
      {memberError && !memberData && (
        <div className="flex items-center justify-center w-full h-[60vh]">
          <div className="flex flex-col items-center gap-2  pointer-events-none select-none">
            <Image
              src="/notFound.png"
              alt="Not Found Image"
              width={1000}
              height={1000}
              className="w-[300px] object-contain pointer-events-none select-none"
            />
            <span className="flex items-center gap-2 text-2xl text-rose-500 font-bold">
              Something Went Wrong <CircleAlert />
            </span>
            <p>Please try again later</p>
          </div>
        </div>
      )}
      {!memberError && memberData && (
        <div className="flex flex-col w-full h-auto mt-1">
          <div className="flex flex-col items-center gap-1 mt-3">
            <div className="w-32 h-32 overflow-hidden rounded-full flex items-center justify-center">
              <Image
                src={memberData.imageUrl}
                alt={`${memberData.name} Profile Image`}
                width={1000}
                height={1000}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h3 className="text-xl font-bold text-primaryGray text-center">
              {memberData.name}
            </h3>
            <span className="text-sm text-secondaryGray text-center">
              {memberData.keyword} Sale Agent
            </span>
            <span className="text-sm text-secondaryGray text-center">
              Join at {format(memberData.createdAt, "dd-MMM-yyy")}
            </span>
          </div>
          {authData && authData.role === "admin" && (
            <div className="flex flex-col gap-4 items-center">
              <div className="flex items-center justify-center gap-4 my-2">
                <Button
                  onClick={() =>
                    router.push(`/agent/add/data/${memberId}/${organizationId}`)
                  }
                  variant="outline"
                  size="lg"
                  className="shadow-md hover:shadow-lg text-primaryGray"
                >
                  Add Data
                </Button>
                <Button
                  onClick={() => router.push(`/agent/add/leave/${memberId}`)}
                  variant="outline"
                  size="lg"
                  className="shadow-md hover:shadow-lg text-primaryGray"
                >
                  Add Leave
                </Button>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    More Options
                    <SettingsIcon />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>More options</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col mt-4 gap-2 w-full">
                    <span
                      onClick={handleUpdateMember}
                      className="bg-gray-200 hover:bg-gray-300 py-4 px-3 rounded-md transition-all duration-150 ease-linear cursor-pointer"
                    >
                      <h2 className="text-primaryGray text-lg font-medium">
                        Update Member
                      </h2>
                    </span>
                    <AlertDialog>
                      <AlertDialogTrigger className="w-full flex-1">
                        <div className="bg-red-400 hover:bg-red-500 py-4 px-3 w-full rounded-md transition-all duration-150 ease-linear cursor-pointer text-left">
                          <h2 className="text-white text-lg font-medium">
                            Delete Member
                          </h2>
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are You Sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This process can't be undone and member data will
                            remove permenantly from our servers
                          </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteMember}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogHeader>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
          <div className="max-w-screen-md w-full hidden md:grid grid-cols-3 gap-5 lg:gap-10 mx-auto mt-8">
            <StatusBox
              title="Target"
              curreny={memberData.targetCurrency}
              amount={memberData.monthlyTarget}
            />
            <StatusBox
              title="Current Sales"
              curreny={memberData.targetCurrency}
              amount={memberData.currentSale}
              isDark
            />
            <StatusBox
              title="Overall Sales"
              curreny={memberData.targetCurrency}
              amount={memberData.overallSale}
            />
          </div>
          <div className="md:hidden flex flex-col items-center gap-4 mt-8 w-full px-4">
            <StatusBox
              title="Current Sales"
              curreny={memberData.targetCurrency}
              amount={memberData.currentSale}
              isDark
            />
            <div className="flex items-center justify-center gap-5 w-full">
              <StatusBox
                title="Target"
                curreny={memberData.targetCurrency}
                amount={memberData.monthlyTarget}
              />
              <StatusBox
                title="Overall Sales"
                curreny={memberData.targetCurrency}
                amount={memberData.overallSale}
              />
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center w-full h-full flex-grow shrink-0 flex-1">
            <SalesPercentageChart
              currentSale={memberData.currentSale}
              monthlyTarget={memberData.monthlyTarget}
            />
            <span className="font-bold text-primaryGray text-xl text-center mt-3">
              {getRemainingDays()} {getRemainingDays() > 1 ? "days" : "days"}{" "}
              left
            </span>
            <span className="text-lg text-secondaryGray mt-1">
              {getRemainingTarget({
                monthlyTarget: memberData.monthlyTarget,
                currentSale: memberData.currentSale,
              })}
              {memberData.targetCurrency} is required to complete the target.
            </span>
          </div>
          <AgentSheet memberData={memberData} />
          <PreviousMonthsHistory
            prevMonthHistory={memberData.previousMonths}
            targetCurrency={memberData.targetCurrency}
          />
        </div>
      )}
    </section>
  );
};

export default MemberDetailsContainer;

const StatusBox = ({
  title,
  curreny,
  amount,
  isDark = false,
}: {
  title: string;
  amount: number;
  curreny: string;
  isDark?: boolean;
}) => {
  return (
    <div
      className={cn(
        "transform max-w-[300px] w-full border border-gray-400 hover:border-gray-500 py-7 rounded-xl transition-all duration-200 ease-in-out",
        isDark ? "bg-primaryGray -translate-y-3" : "bg-white translate-y-0"
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-medium text-base text-center",
            isDark ? "text-white" : "text-secondaryGray"
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            "text-xl font-bold text-center flex items-center",
            isDark ? "text-white" : "text-secondaryGray"
          )}
        >
          {amount}
          {curreny}
        </span>
      </div>
    </div>
  );
};
