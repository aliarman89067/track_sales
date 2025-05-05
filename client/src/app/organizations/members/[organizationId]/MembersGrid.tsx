"use client";

import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import {
  useGetAuthUserQuery,
  useGetOrganizationMembersQuery,
} from "@/state/api";
import { ArrowRight, CircleAlert, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const MembersGrid = ({ organizationId }: MembersGrid) => {
  const {
    data: authData,
    isLoading: isAuthLoading,
    error: authError,
  } = useGetAuthUserQuery();
  const {
    data: organizationData,
    isLoading: isOrganizationLoading,
    error: organizationError,
  } = useGetOrganizationMembersQuery(
    {
      organizationId,
      adminCognitoId: authData?.cognitoId,
    },
    {
      skip: !authData || !authData.cognitoId,
    }
  );

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

  return (
    <section className="w-full flex flex-col gap-5 max-w-screen-xl mx-auto mb-4">
      <div className="w-full mt-10">
        <BackButton title="Back" href="/organizations" />
      </div>
      {authError || organizationError ? (
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
      ) : (
        <GridContainer organization={organizationData} />
      )}
    </section>
  );
};

export default MembersGrid;

const GridContainer = ({
  organization,
}: {
  organization: OrganizationsProps | undefined;
}) => {
  const router = useRouter();

  return (
    <>
      {organization &&
        organization.members &&
        organization.members.length &&
        organization.members && (
          <div className="flex flex-col w-full mt-3">
            <h2 className="text-xl font-semibold text-secondaryGray">
              {organization.organizationName}
            </h2>
            <div className="grid grid-cols-4 gap-4 w-full mt-1">
              {organization.members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white px-3 py-3 rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 ease-in-out"
                >
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
                      <Image
                        src={member.imageUrl}
                        alt={`${member.name} profile image`}
                        width={600}
                        height={600}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1.5 my-2">
                      <h2 className="text-secondaryGray font-semibold text-lg text-center">
                        {member.name}
                      </h2>
                      <span className="text-secondaryGray/90 text-base text-center">
                        {member.email}
                      </span>
                      <div className="text-secondaryGray/90 text-base text-center px-4 py-1 border border-gray-400 rounded-full">
                        {organization.organizationKeyword} Sales Agent
                      </div>
                      <span className="text-primaryGray text-base text-center font-semibold mt-1">
                        {member.monthlyTarget}
                        {member.targetCurrency} Target
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-between w-full mt-3">
                      <Button
                        onClick={() =>
                          router.push(`/organizations/member/${member.id}`)
                        }
                        variant="custom"
                        className="w-full rounded-lg text-sm font-normal h-11"
                      >
                        View Profile
                        <ArrowRight />
                      </Button>
                      <Button
                        variant="custom"
                        className="w-full rounded-lg text-sm font-normal h-11"
                      >
                        Enter Data
                        <ArrowRight />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </>
  );
};
