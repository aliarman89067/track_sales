import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import AWS from "aws-sdk";
import { Loader2 } from "lucide-react";

const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  signatureVersion: "v4",
});

const ImageInput = ({
  form,
  title,
  size = "sm",
  isTitle,
  fieldName,
  isMembersState,
  setMembers,
  index,
  isOptional = false,
  memberId,
}: ImageInputProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageInputClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current?.click();
    }
  };

  const handleImageInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const fileName = `organizations/${Date.now()}-${file.name}`;
        const params = {
          Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
          Key: fileName,
          Body: file,
          ContentType: file.type,
          ACL: "public-read",
        };
        const { Location } = await s3.upload(params).promise();

        form.setValue(fieldName, Location);
        if (setMembers && isMembersState && memberId) {
          setMembers((prevMembers) => {
            if (!prevMembers) return prevMembers;
            return prevMembers.map((member) => {
              if (member.id === memberId) {
                return { ...member, imageUrl: Location };
              } else {
                return member;
              }
            });
          });
        }
      } catch (error) {
        console.log(error);
        // TODO: add sonner toast error notification
      } finally {
        setIsUploading(false);
      }
    }
  };
  useEffect(() => {}, [form.getValues(fieldName)]);
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          {isTitle && (
            <FormLabel className="font-medium text-secondaryGray flex items-center gap-2">
              <span className="text-lg">{title}</span>
              {isOptional && <span className="text-sm">(optional)</span>}
            </FormLabel>
          )}
          <FormControl>
            <label className="flex items-center gap-4 w-fit">
              <div
                className={cn(
                  "rounded-full bg-gray-100 flex items-center justify-center overflow-hidden",
                  size === "lg" ? "w-20 h-20" : "w-16 h-16"
                )}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-6 animate-spin text-secondaryGray" />
                  </>
                ) : (
                  <Image
                    src={field.value || ""}
                    alt="Main Image"
                    width={1000}
                    height={1000}
                    className="w-[80%] h-[80%] object-cover rounded-full"
                  />
                )}
              </div>
              <Input
                ref={imageInputRef}
                disabled={isUploading}
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleImageInputChange}
              />
              <div className="flex flex-col gap-1 items-center">
                <Button
                  type="button"
                  disabled={isUploading}
                  onClick={handleImageInputClick}
                  variant="outline"
                  className="flex flex-col items-center h-16 w-36"
                  size={size === "lg" ? "lg" : "default"}
                >
                  {isUploading ? (
                    <span>Uploading...</span>
                  ) : (
                    <span>Choose Image</span>
                  )}
                  {isOptional && !isTitle && (
                    <FormLabel className="font-medium text-secondaryGray">
                      <span className="text-sm">(optional)</span>
                    </FormLabel>
                  )}
                </Button>
                {/* {isOptional && isMembersState && (
                  <span className="text-sm font-semibold text-secondaryGray">
                    (optional)
                  </span>
                )} */}
              </div>
            </label>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageInput;
