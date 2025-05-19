"use client";
import { PropsWithChildren, useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Image from "next/image";
import { BackButton } from "@/components/BackButton";
import { usePathname, useRouter } from "next/navigation";
import { AuthToggler } from "./AuthToggler";
import { Loader2 } from "lucide-react";
import { AdminAuth } from "@/components/auth/AdminAuth";
import { AgentAuth } from "@/components/auth/AgentAuth";

const Auth = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<"admin" | "agent">("admin");

  const { user, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);

  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/organizations") ||
    pathname.startsWith("/tenants") ||
    pathname.startsWith("/tenant");

  useEffect(() => {
    if (isAuthPage && user) {
      router.push("/");
    }
  }, [user, router, pathname]);

  if (authStatus === "configuring") {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="flex justify-center items-center gap-2">
          <Loader2 className="size-5 text-primaryGray animate-spin" />
          <span className="text-base text-primaryGray">Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    if (!user) {
      return (
        <div className="relative flex w-full h-screen justify-between">
          <div className="absolute w-[50%] top-6 left-14">
            <div className="flex flex-col w-[90%]">
              <BackButton title="Back" href="/" />
              <AuthToggler role={role} setRole={setRole} />
            </div>
          </div>

          {/* For agent, always show sign-in only */}
          {/* {role === "agent" ? (
            <Authenticator
              key="agent-auth"
              initialState="signIn"
              hideSignUp={true}
              components={getComponents(role)}
              formFields={formFields}
              loginMechanisms={["email"]}
            />
          ) : (
            <Authenticator
              key="admin-auth"
              initialState={pathname === "/signup" ? "signUp" : "signIn"}
              components={getComponents(role)}
              formFields={formFields}
              loginMechanisms={["email"]}
            />
          )} */}
          {role === "admin" && <AdminAuth role={role} />}
          {role === "agent" && <AgentAuth />}

          <div className="fixed top-0 right-0 w-[50%] h-full bg-purple-400 flex items-center justify-center">
            <Image
              src="/authPageBackground.jpg"
              alt="Auth Page Background Image"
              fill
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default Auth;
