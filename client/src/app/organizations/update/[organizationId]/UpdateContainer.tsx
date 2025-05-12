"use client";

import { BackButton } from "@/components/BackButton";
import ImageInput from "@/components/inputs/ImageInput";
import TextInput from "@/components/inputs/TextInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { updateOrganizationSchema, updateOrganizationType } from "@/lib/types";
import {
  useGetAuthUserQuery,
  useGetOrganizationNameQuery,
  useUpdateOrganizationMutation,
} from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  organizationId: string;
}

export const UpdateContainer = ({ organizationId }: Props) => {
  const router = useRouter();
  const {
    data: authData,
    isLoading: isAuthLoading,
    error: authError,
  } = useGetAuthUserQuery();
  const {
    data: organizationData,
    isLoading: isOrganizationLoading,
    error: organizationError,
  } = useGetOrganizationNameQuery(
    {
      organizationId,
      adminCognitoId: authData?.cognitoId,
    },
    {
      skip:
        isAuthLoading || !authData || authData.role !== "admin" || !!authError,
    }
  );
  const [updateOrganization] = useUpdateOrganizationMutation();

  const form = useForm<updateOrganizationType>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      imageUrl: organizationData?.imageUrl ?? "",
      organizationName: organizationData?.organizationName ?? "",
      organizationKeyword: organizationData?.organizationKeyword ?? "",
    },
  });

  useEffect(() => {
    if (!isAuthLoading && authData && authData.role !== "admin") {
      router.push("/");
      return;
    }
    if (!isOrganizationLoading && organizationData) {
      form.reset({
        imageUrl: organizationData.imageUrl,
        organizationName: organizationData.organizationName,
        organizationKeyword: organizationData.organizationKeyword,
      });
    }
  }, [isAuthLoading, organizationData]);

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

  const onSubmit = async (values: updateOrganizationType) => {
    if (!authData) return;
    try {
      await updateOrganization({
        adminCognitoId: authData.cognitoId,
        organizationId,
        ...values,
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
      {organizationError && !organizationData && (
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
      {organizationData && !organizationError && form.getValues("imageUrl") && (
        <div className="mx-auto flex flex-col max-w-xl w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col space-y-3"
            >
              <ImageInput
                form={form}
                title="Organization Image"
                isTitle
                size="lg"
                fieldName="imageUrl"
              />
              <TextInput
                form={form}
                title="Organization Name"
                isTitle
                fieldName="organizationName"
                placeHolder="Template sales team..."
              />
              <div className="w-[50%]">
                <TextInput
                  form={form}
                  title="Organization Keyword"
                  isTitle
                  fieldName="organizationKeyword"
                  placeHolder="Template"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-brand-500 hover:bg-brand-500/90 w-[120px] py-6 mt-6"
              >
                Update
              </Button>
            </form>
          </Form>
        </div>
      )}
    </section>
  );
};
