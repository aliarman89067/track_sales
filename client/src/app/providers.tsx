"use client";
import React, { PropsWithChildren } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import Auth from "./(auth)/authProvider";
import { ReduxProvider } from "@/state/redux";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ReduxProvider>
      <Authenticator.Provider>
        <Auth>{children}</Auth>
      </Authenticator.Provider>
    </ReduxProvider>
  );
};
