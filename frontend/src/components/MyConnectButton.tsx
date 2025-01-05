import { useSIWE, useModal, SIWESession } from "connectkit";
import { useAccount } from "wagmi";
import { useApp } from "../contexts/AppProvider";

export const MyConnectButton = () => {
    const { setOpen } = useModal();
    const { isConnected } = useAccount();
  
    const { data, isRejected, isLoading, isSignedIn, signOut, signIn } = useSIWE();
  
    const handleSignIn = async () => {
        console.log('data', data)

      await signIn()?.then((session?: SIWESession) => {
        // Do something when signed in
        console.log(session)
      });
    };
  
    const handleSignOut = async () => {
      await signOut()?.then(() => {
        // Do something when signed out
      });
    };
  
    /** Wallet is connected and signed in */
    if (isSignedIn) {
      return (
        <>
          <div>Address: {data?.address}</div>
          <div>ChainId: {data?.chainId}</div>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      );
    }
  
    /** Wallet is connected, but not signed in */
    if (isConnected) {
      return (
        <>
          <button onClick={handleSignIn} disabled={isLoading}>
            {isRejected // User Rejected
              ? "Try Again"
              : isLoading // Waiting for signing request
              ? "Awaiting request..."
              : // Waiting for interaction
                "Sign In"}
          </button>
        </>
      );
    }
  
    /** A wallet needs to be connected first */
    return (
      <>
        <button onClick={() => setOpen(true)}>Connect Wallet</button>
      </>
    );
  };

// export const MyConnectButton = () => {
//     const {login} = useApp()
//   return (
//     <ConnectKitButton.Custom>
//       {({ isConnected, show, address, chain }) => {
//         return (
//           <button onClick={show} style={{}}>
//             {isConnected ? `${address?.substring(0, 5)}...${address?.substring(address.length - 2)} ${chain.name}` : "Connect Account"}
//           </button>
//         );
//       }}
//     </ConnectKitButton.Custom>
//   );
// };