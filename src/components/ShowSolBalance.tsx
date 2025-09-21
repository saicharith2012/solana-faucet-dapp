import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function ShowSolBalance() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    async function getUserBalance() {
      const balance = await connection.getBalance(wallet.publicKey!);
      setBalance(balance / LAMPORTS_PER_SOL);
    }
    if (wallet.publicKey?.toString()) {
      getUserBalance();
    }
  }, [connection, wallet.publicKey]);
  if (!wallet.publicKey) {
    return;
  }
  return <div>Balance: {balance} SOL</div>;
}
