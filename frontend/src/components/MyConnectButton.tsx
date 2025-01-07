import { ConnectKitButton } from "connectkit";

export const MyConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address }) => {
        return (
          <button onClick={show} style={{}} className="bg-purple-600 text-white px-3 py-1.5 text-sm rounded-full w-full">
            {isConnected ? `${address?.substring(0, 5)}...${address?.substring(address.length - 2)} | Lens` : "Connect Account"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};