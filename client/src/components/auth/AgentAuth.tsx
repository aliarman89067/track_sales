"use client";

import { useLoginAgentMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export const AgentAuth = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const [loginAgent] = useLoginAgentMutation();

  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!inputValue.trim()) {
      toast.error("Please Enter your email to continue!");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await loginAgent({ email: inputValue }).unwrap();
      if (response.isNotAdded) {
        setError("You are not added in any organization!");
        return;
      }
      if (!response.isVerified && response.validateId && response.token) {
        window.localStorage.setItem("track_sale_agent", response.token);
        router.push(`/validate/${response.validateId}`);
        return;
      }
      const { token } = response;
      if (token) {
        window.localStorage.setItem("track_sale_agent", token);
      }
      router.push("/");
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="w-[50%] h-full">
      <div className="bg-white w-[75%] h-full flex justify-center items-start mt-[150px] pl-[35px] mx-auto">
        <form
          onSubmit={handleLogin}
          className="border-2 border-[#5a555c] rounded-[10px] py-[25px] px-[20px] w-full"
        >
          <div className="flex flex-col">
            <h1 className="font-jacquesFrancois font-semibold text-primaryGray text-lg">
              Logo
            </h1>
            <h1 className="font-medium text-secondaryGray text-xl">
              Sign In as Agent
            </h1>
          </div>
          <div className="fle flex-col gap-1 mt-[10px]">
            <span className="text-secondaryGray text-base">Email</span>
            <input
              type="email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your Email"
              className="flex-1 w-full p-[10px] border border-secondaryGray outline-none bg-transparent rounded-lg"
            />
            {error && (
              <p className="text-red-500 font-medium text-base mt-3">{error}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !inputValue}
              className="bg-primaryGray w-full h-12 rounded-lg flex items-center justify-center text-white text-base mt-7 disabled:opacity-80 disabled:cursor-not-allowed"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
