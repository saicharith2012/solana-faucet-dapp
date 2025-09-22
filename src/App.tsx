import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";
import { RequestAirdrop } from "./components/RequestAirdrop";
import ShowSolBalance from "./components/ShowSolBalance";
import SendTokens from "./components/SendTokens";
import SignMessage from "./components/SignMessage";

function App() {
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="w-screen h-screen flex flex-col justify-center items-center font-roboto">
            <WalletMultiButton />
            <RequestAirdrop/>
            <ShowSolBalance/>
            <SendTokens/>
            <SignMessage/>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
