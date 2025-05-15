"use client";

import { EmptyPaperPlaneCTA } from "@/components/EmptyPaperPlaneCTA";
import {
  useGetAuthUserQuery,
  useGetMemberOrganizationQuery,
  useGetMembersOrganizationQuery,
} from "@/state/api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppSidebar } from "../appSidebar";
import { DashboardGrid } from "./DashboardGrid";

const DashboardAdminPage = () => {
  const router = useRouter();
  const [targetOrganization, setTargetOrganization] =
    useState<null | OrganizationsWithMembersProps>(null);

  const { data: authData, isLoading: isAuthLoading } = useGetAuthUserQuery();
  const {
    data: organizationsData,
    isLoading: isOrganizationsLoading,
    refetch,
  } = useGetMembersOrganizationQuery(
    {
      adminCognitoId: authData?.cognitoId,
    },
    {
      skip: !authData?.cognitoId,
    }
  );

  useEffect(() => {
    if (!isAuthLoading && authData?.cognitoId) {
      refetch();
    }
    if (organizationsData) {
      setTargetOrganization(organizationsData[0]);
    }
  }, [isAuthLoading, authData?.cognitoId, organizationsData]);

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
      <AppSidebar
        organizations={organizationsData}
        setOrganization={setTargetOrganization}
        selectedOrganizationId={targetOrganization?.id!!}
      />
      {organizationsData ? (
        <div className="flex max-w-screen-sm lg:max-w-screen-lg xl:max-w-screen-xl w-full mx-auto mt-3">
          {targetOrganization && (
            <div className="flex flex-col gap-8 w-full">
              <div className="pl-16 sm:pl-12">
                <h1 className="text-primaryGray text-3xl font-bold">
                  {targetOrganization.organizationName}
                </h1>
              </div>
              <DashboardGrid organization={targetOrganization} />
            </div>
          )}
        </div>
      ) : (
        <EmptyPaperPlaneCTA
          onClick={() => router.push("/organizations/create")}
          title="Create Your First Organization"
        />
      )}
    </section>
  );
};
export default DashboardAdminPage;
