"use client";

import { EmptyPaperPlaneCTA } from "@/components/EmptyPaperPlaneCTA";
import { Button } from "@/components/ui/button";
import {
  useGetAuthUserQuery,
  useGetMemberOrganizationQuery,
} from "@/state/api";
import { CircleAlert, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Agent = () => {
  const router = useRouter();
  const {
    isLoading: isAuthLoading,
    error: authError,
    data: authData,
  } = useGetAuthUserQuery();

  const {
    isLoading: isOrganizationLoading,
    error: organizationError,
    data: organizationData,
    refetch,
  } = useGetMemberOrganizationQuery(
    {
      adminCognitoId: authData?.cognitoId,
    },
    {
      skip: !authData || authData.role !== "admin",
    }
  );

  useEffect(() => {
    if (!isAuthLoading && authData?.cognitoId) {
      refetch();
    }
    if (!authData || authData.role !== "admin") {
      router.replace("/");
      return;
    }
  }, [isAuthLoading, authData]);

  if (isAuthLoading || isOrganizationLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="flex justify-center items-center gap-2">
          <Loader2 className="size-5 text-primaryGray animate-spin" />
          <span className="text-base text-primaryGray">Loading...</span>
        </div>
      </div>
    );
  }
  if (authError || organizationError) {
    return (
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
    );
  }

  return (
    <>
      {organizationData && organizationData.length > 0 ? (
        <section className="flex flex-col max-w-screen-xl w-full mx-auto mt-10 px-5 lg:px-0">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-primaryGray text-2xl">
              Select Organization
            </h1>
            <p className="font-medium text-secondaryGray text-lg">
              Choose the organization in which you want to add new member
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
            {organizationData?.map((organization) => (
              <div
                key={organization.id}
                className="w-full p-5 rounded-xl border border-secondaryGray flex flex-col gap-1"
              >
                <h1 className="font-semibold text-xl text-primaryGray">
                  {organization.organizationName}
                </h1>
                <span className="text-base text-secondaryGray">
                  {organization.members?.length}{" "}
                  {organization.members?.length &&
                  organization.members?.length > 1
                    ? "Members"
                    : "Member"}{" "}
                  Added
                </span>
                <button
                  onClick={() =>
                    router.push(`/organizations/member/add/${organization.id}`)
                  }
                  className="bg-brand-500 w-full py-3 text-center rounded-lg border-none outline-none font-medium text-lg text-white mt-3"
                >
                  Add Member
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="w-full">
          <EmptyPaperPlaneCTA
            title="Create Your First Organization"
            onClick={() => router.push("/organizations/create")}
          />
        </div>
      )}
    </>
  );
};

export default Agent;
