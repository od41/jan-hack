import { ConnectKitButton } from "connectkit";

export const MyConnectButton = () => {
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