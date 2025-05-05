"use client";
import { useGetAuthUserQuery, useGetMemberQuery } from "@/state/api";

import { CircleAlert, Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import AddAgentDataForm from "./AddAgentDataForm";

const AddAgentDataContainer = ({
  memberId,
  organizationId,
}: AddAgentDataContainerProps) => {
  const {
    isLoading: isAuthLoading,
    data: authData,
    error: authError,
  } = useGetAuthUserQuery();
  const {
    isLoading: isMemberLoading,
    data: memberData,
    error: memberError,
  } = useGetMemberQuery(
    {
      memberId,
    },
    {
      skip: !authData || authData.role.toLowerCase() !== "admin",
    }
  );

  if (isAuthLoading || isMemberLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="flex justify-center items-center gap-2">
          <Loader2 className="size-5 text-primaryGray animate-spin" />
          <span className="text-base text-primaryGray">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <section>
      {(authError || memberError) && (
        <div className="flex items-center justify-center w-full h-[80vh]">
          <div className="flex flex-col gap-4 items-center">
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
      {authData && memberData && (
        <div className="flex flex-col items-center mx-auto max-w-xl w-full mt-16 gap-3">
          <Image
            src={memberData.imageUrl}
            alt={`${memberData.name} image`}
            width={200}
            height={200}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="flex flex-col items-center my-2">
            <h1 className="font-semibold text-2xl text-primaryGray">
              Enter data for {memberData.name}
            </h1>
            <p className="text-base text-secondaryGray">
              Add new data in {memberData.name} sales history
            </p>
          </div>
          <AddAgentDataForm
            memberId={memberId}
            organizationId={organizationId}
          />
        </div>
      )}
    </section>
  );
};

export default AddAgentDataContainer;
