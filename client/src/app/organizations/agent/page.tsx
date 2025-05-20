"use client";
import React, { useEffect } from "react";

import { useGetAgentOrganizationQuery, useGetAuthUserQuery } from "@/state/api";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AgentOrganizations = () => {
  const router = useRouter();
  const {
    data: authData,
    isLoading: isAuthLoading,
    error: authError,
  } = useGetAuthUserQuery();
  const {
    data: organizationsData,
    isLoading: isOrganizationsLoading,
    error: organizationError,
  } = useGetAgentOrganizationQuery();

  useEffect(() => {
    if (authData && authData.role === "admin") {
      router.push("/organizations/admin");
      return;
    }
    if (authError) {
      router.push("/");
      return;
    }
  }, [isAuthLoading, authData, authError]);

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
  console.log(organizationsData);
  return (
    <section className="max-w-screen-xl w-full mx-auto px-2 sm:px-4">
      {organizationsData && organizationsData.length > 0 && (
        <div className="flex max-w-screen-sm lg:max-w-screen-lg xl:max-w-screen-xl w-full mx-auto justify-center mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full h-fit gap-4">
            {organizationsData.map((organization) => (
              <Link
                key={organization.id}
                href={`/organizations/member/${organization.id}/${organization.organization.id}`}
                className="w-full p-3 rounded-lg border border-secondaryGray flex gap-3 items-center shadow-sm hover:shadow-xl bg-white hover:bg-gray-100 transition-all duration-150 ease-linear cursor-pointer"
              >
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <Image
                    src={organization.organization.imageUrl}
                    alt={`${organization.organization.organizationName} image url`}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="px-3 py-1.5 rounded-full border border-secondaryGray flex items-center justify-center text-secondaryGray text-sm">
                    {organization.organization.organizationKeyword}
                  </span>
                  <h2 className="font-semibold text-xl text-secondaryGray">
                    {organization.organization.organizationKeyword} Sales Team
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {organizationsData && organizationsData.length < 1 && (
        <div className="flex flex-col items-center justify-center w-full h-screen">
          <Image
            src="/notFound.png"
            alt="Not found image"
            width={800}
            height={800}
            className="w-[400px] h-[350px] object-contain"
          />
          <h2 className="text-center font-medium text-primaryGray text-2xl">
            You&apos;r not added in any team!
          </h2>
        </div>
      )}
      {organizationError && (
        <div className="flex flex-col items-center justify-center w-full h-screen">
          <Image
            src="/notFound.png"
            alt="Not found image"
            width={800}
            height={800}
            className="w-[400px] h-[350px] object-contain"
          />
          <h2 className="text-center font-medium text-primaryGray text-2xl">
            Something wen&apos;t wrong please try again later!
          </h2>
        </div>
      )}
    </section>
  );
};

export default AgentOrganizations;
