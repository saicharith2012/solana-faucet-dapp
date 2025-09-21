import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useRef, useState, useTransition } from "react";

export function RequestAirdrop() {
  const wallet = useWallet(); // provided by the WalletProvider context
  const publicKey = wallet.publicKey;
  const { connection } = useConnection(); // provided by the ConnectionProvider context
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const [isPending, startTransition] = useTransition();
  async function requestAirdrop() {
    setSuccess("");
    setError("");
    startTransition(async () => {
      try {
        if (inputRef.current?.value === "") {
          throw new Error("Enter a number");
        }
        const amount = parseInt(inputRef.current?.value || "1");
        await connection.requestAirdrop(publicKey!, amount * LAMPORTS_PER_SOL);
        console.log(
          `${amount} SOL airdropped to ${publicKey?.toString()}. Please check your wallet.`
        );
        setSuccess(
          `${amount} SOL airdropped to ${publicKey?.toString()}. Please check your wallet.`
        );
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setError("");
      } catch (error) {
        console.log(
          error instanceof Error ? error.message : "Error while airdropping SOL"
        );
        setError(
          error instanceof Error ? error.message : "Error while airdropping SOL"
        );
      }
    });
  }

  if (!publicKey?.toString()) {
    return;
  }

  return (
    <div className="flex flex-col items-center mt-10 gap-5">
      <h1 className="text-xl font-semibold">Request for Airdrop</h1>

      <input
        className="p-2 focus-within:outline-0 border rounded-sm"
        type="number"
        placeholder="amount..."
        ref={inputRef}
      />
      <button
        className={`px-4 py-2 font-semibold text-white ${
          isPending ? "bg-emerald-300" : "bg-emerald-500"
        } rounded-sm cursor-pointer hover:bg-emerald-900 transition-colors duration-200`}
        onClick={requestAirdrop}
      >
        {isPending ? "Requesting Airdrop..." : "Request Airdrop"}
      </button>
      <div className="text-red-400 w-1/2">{error}</div>
      <div className="text-green-400 w-1/2">{success}</div>

      {/* {wallet.publicKey?.toString()} */}
      {/* <button
        onClick={() => {
          console.log(!publicKey?.toString() ? "no wallet connected." : publicKey.toString());
        }}
      >
        print public key
      </button> */}
    </div>
  );
}
