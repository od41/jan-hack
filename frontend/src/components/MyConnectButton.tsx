import { ConnectKitButton } from "connectkit";
import { useApp } from "../contexts/AppProvider";

export const MyConnectButton = () => {
    const {login} = useApp()
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address, chain }) => {
        return (
          <button onClick={show} style={{}}>
            {isConnected ? `${address?.substring(0, 5)}...${address?.substring(address.length - 2)} ${chain.name}` : "Connect Account"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};