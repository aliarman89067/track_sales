"use client";
import react, { PropsWithChildren, useEffect, useState } from "react";
import {
  Authenticator,
  Heading,
  Input,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View,
  VisuallyHidden,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import Image from "next/image";
import { BackButton } from "@/components/BackButton";
import { usePathname, useRouter } from "next/navigation";
import { AuthToggler } from "./AuthToggler";
import { getCurrentUser } from "aws-amplify/auth";
import { Loader2 } from "lucide-react";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

const formFields = {
  signUp: {
    "custom:adminname": {
      order: 1,
      placeholder: "Enter your name",
      label: "Username",
      isRequired: true,
    },
    email: {
      order: 2,
      placeholder: "Enter your Email Address",
      label: "Email",
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: "Create a password",
      label: "Password",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      isRequired: true,
    },
  },
};
const getComponents = (role: "admin" | "agent") => {
  return {
    SignIn: {
      Header() {
        return (
          <View>
            <Heading className="font-jacquesFrancois font-semibold text-primaryGray text-lg">
              Logo
            </Heading>
            <Heading className="font-medium text-secondaryGray text-xl">
              Sign In as Admin
            </Heading>
          </View>
        );
      },
      Footer() {
        const { toSignUp, toForgotPassword } = useAuthenticator();
        return (
          <View className="mt-2 text-center">
            <span
              onClick={toForgotPassword}
              className="text-sm font-medium text-primary cursor-pointer hover:underline my-3"
            >
              Forgot Password?
            </span>
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button
                onClick={toSignUp}
                className="text-primary hover:underline bg-transparent border-none p-0"
              >
                Sign up here
              </button>
            </p>
          </View>
        );
      },
    },
    SignUp: {
      Header() {
        return (
          <View>
            <Heading className="font-jacquesFrancois font-semibold text-primaryGray text-lg">
              Logo
            </Heading>
            <Heading className="font-medium text-secondaryGray text-xl">
              Sign Up as Admin
            </Heading>
          </View>
        );
      },
      FormFields() {
        const { validationErrors } = useAuthenticator();
        return (
          <>
            <Authenticator.SignUp.FormFields />
            <View className="hidden">
              <RadioGroupField
                legend="Role"
                defaultValue={role}
                isReadOnly
                name="custom:role"
                errorMessage={validationErrors?.["custom:role"]}
                hasError={!!validationErrors?.["custom:role"]}
                isRequired
              >
                <Radio value="admin">Admin</Radio>
                <Radio value="agent">Agent</Radio>
              </RadioGroupField>
            </View>
          </>
        );
      },
      Footer() {
        const { toSignIn } = useAuthenticator();
        return (
          <View className="mt-4 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={toSignIn}
                className="text-primary hover:underline bg-transparent border-none p-0"
              >
                Sign in here
              </button>
            </p>
          </View>
        );
      },
    },
    ForgotPassword: {
      Header() {
        return (
          <View>
            <Heading className="font-jacquesFrancois font-semibold text-primaryGray text-lg">
              Logo
            </Heading>
            <Heading className="font-medium text-secondaryGray text-xl">
              Reset Your Password
            </Heading>
          </View>
        );
      },
      Footer() {
        const { toSignIn } = useAuthenticator();
        return (
          <View className="mt-4 text-center">
            <button
              onClick={toSignIn}
              className="text-primary hover:underline bg-transparent border-none p-0"
            >
              Go Back
            </button>
          </View>
        );
      },
    },
  };
};

const Auth = ({ children }: PropsWithChildren) => {
  const { user, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);

  const router = useRouter();
  const [role, setRole] = useState<"admin" | "agent">("admin");
  const pathname = usePathname();

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

  if (isDashboard) {
    if (!user) {
      return (
        <div className="relative flex w-full h-screen justify-between">
          <div className="absolute w-[50%] top-6 left-14">
            <div className="flex flex-col w-[90%]">
              <BackButton title="Back" href="/" />
              <AuthToggler role={role} setRole={setRole} />
            </div>
          </div>
          <Authenticator
            initialState={pathname.startsWith("/signup") ? "signUp" : "signIn"}
            components={getComponents(role)}
            formFields={formFields}
            loginMechanisms={["email"]}
          />
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
          <Authenticator
            initialState={pathname.startsWith("/signup") ? "signUp" : "signIn"}
            components={getComponents(role)}
            formFields={formFields}
            loginMechanisms={["email"]}
          />
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
  }
  return <>{children}</>;
};

export default Auth;
