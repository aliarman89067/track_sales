import {
  Authenticator,
  Heading,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { usePathname } from "next/navigation";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

interface Props {
  role: "agent" | "admin";
}

export const AdminAuth = ({ role }: Props) => {
  const pathname = usePathname();

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
                {role === "admin" ? "Sign In as Admin" : "Sign In as Agent"}
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
              {role === "admin" && (
                <p className="text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={toSignUp}
                    className="text-primary hover:underline bg-transparent border-none p-0"
                  >
                    Sign up here
                  </button>
                </p>
              )}
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

  return (
    <Authenticator
      key="admin-auth"
      initialState={pathname === "/signup" ? "signUp" : "signIn"}
      components={getComponents(role)}
      formFields={formFields}
      loginMechanisms={["email"]}
    />
  );
};
