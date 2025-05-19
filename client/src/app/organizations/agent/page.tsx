"use client";
import React from "react";

import { useGetAgentOrganizationQuery, useGetAuthUserQuery } from "@/state/api";
import { Loader2 } from "lucide-react";

const AgentOrganizations = () => {
  const { data: authData, isLoading: isAuthLoading } = useGetAuthUserQuery();
  const {
    data: organizationsData,
    isLoading: isOrganizationsLoading,
    error: organizationError,
  } = useGetAgentOrganizationQuery();

  if (isAuthLoading || isOrganizationsLoading) {
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
    <section className="max-w-screen-xl w-full mx-auto px-2 sm:px-4">
      {true ? (
        <div className="flex max-w-screen-sm lg:max-w-screen-lg xl:max-w-screen-xl w-full mx-auto justify-center mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full h-fit gap-4"></div>
        </div>
      ) : (
        <></>
      )}
    </section>
  );
};

export default AgentOrganizations;
