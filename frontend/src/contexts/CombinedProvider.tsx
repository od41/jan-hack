
import React from "react";
import { Web3Provider } from "./Web3Provider";
import { AppProvider } from "./AppProvider";

export const CombinedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Web3Provider>
      <AppProvider>
        {children}
      </AppProvider>
    </Web3Provider>
  );
};
