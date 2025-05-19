"use client";

import { useResendCodeMutation, useVerifyAgentMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

interface Props {
  validateId: string;
}

export const ValidateModel = ({ validateId }: Props) => {
  const router = useRouter();

  const [verifyAgent] = useVerifyAgentMutation();
  const [resendCode] = useResendCodeMutation();

  const [error, setError] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const [isVerify, setIsVerify] = useState(false);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!codeValue) {
      setError("Please enter the code");
      return;
    }
    try {
      setIsVerify(true);
      const response = await verifyAgent({
        code: codeValue.trim(),
        validateId,
      }).unwrap();
      if (response.status === "failed") {
        setError(response.message);
      }
      if (response.status === "success") {
        router.replace("/");
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again");
    } finally {
      setIsVerify(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    try {
      setIsVerify(true);
      resendCode({
        validateId,
      });
      toast.success("Code Resended.");
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again");
    } finally {
      setIsVerify(false);
    }
  };

  return (
    <div className="max-w-lg w-full bg-gradient-to-r from-red-500 to-orange-500 rounded-xl">
      <div className="w-full h-full rounded-xl bg-white/80 p-3 backdrop-blur-xl">
        <form
          onSubmit={handleVerify}
          className="w-full h-full rounded-xl bg-white/10 p-4 backdrop-blur-xl"
        >
          <div>
            <h1 className="text-primaryGray font-semibold text-xl">
              Complete Verification
            </h1>
            <p className="text-secondaryGray text-base">It just take 2 min</p>
            <p className="text-secondaryGray text-base">
              Copy code from your inbox / spam and past it below
            </p>
          </div>
          <input
            type="text"
            value={codeValue}
            onChange={(e) => setCodeValue(e.target.value)}
            placeholder="Enter 4 digit code"
            className="w-full py-1.5 border-2 border-gray-400 outline-none rounded-lg font-medium text-primaryGray text-lg px-4 mt-4"
          />
          {error && (
            <p className="text-red-500 font-medium text-base mt-3">{error}</p>
          )}
          <button
            disabled={!codeValue || isVerify}
            type="submit"
            className="bg-primaryGray w-full py-2.5 rounded-lg text-white text-base mt-3 hover:opacity-90 disabled:opacity-90 disabled:cursor-not-allowed transition-all duration-150 ease-linear"
          >
            Verify
          </button>
          <button
            onClick={handleResendCode}
            type="button"
            className="text-blue-400 mt-3 cursor-pointer bg-transparent border-none outline-none"
          >
            Resend Code
          </button>
        </form>
      </div>
    </div>
  );
};
