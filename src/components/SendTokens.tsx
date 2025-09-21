import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useRef, useState, useTransition } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function SendTokens() {
  const toAddressRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const wallet = useWallet();
  const { connection } = useConnection();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!wallet.publicKey) {
    return;
  }

  async function sendSol() {
    startTransition(async () => {
      try {
          
          const amount = amountRef.current?.value;
          const toAddress = toAddressRef.current?.value;
          
          if (!amount) {
              throw new Error("Enter the amount");
        }

        if (!toAddress) {
            throw new Error("Enter the receiver address");
        }
        
        // console.log(amount);
        // console.log(toAddress);
        
        // create transaction object
        const transaction = new Transaction();

        // add instruction to the transaction object
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey!,
            toPubkey: new PublicKey(toAddress),
            lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
          })
        );

        // send transaction to the dev net
        await wallet.sendTransaction(transaction, connection);
        setError("");
        setSuccess(`Sent ${amount} SOL to ${toAddress}`);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Error while sending SOL"
        );
      } finally {
        if (amountRef.current && toAddressRef.current) {
          amountRef.current.value = "";
          toAddressRef.current.value = "";
        }
      }
    });
  }

  return (
    <div className="flex flex-col items-center mt-10 gap-2">
      <h1 className="text-xl font-semibold">Send SOL</h1>
      <input
        type="text"
        className="p-2 focus-within:outline-0 border rounded-sm"
        ref={toAddressRef}
        placeholder="to"
      />
      <input
        type="text"
        className="p-2 focus-within:outline-0 border rounded-sm"
        ref={amountRef}
        placeholder="amount"
      />
      <button
        className={`px-4 py-2 font-semibold text-white ${
          isPending ? "bg-sky-300" : "bg-sky-500"
        } rounded-sm cursor-pointer hover:bg-emerald-900 transition-colors duration-200`}
        onClick={sendSol}
      >
        Send
      </button>
      <div className="text-red-400 w-1/2">{error}</div>
      <div className="text-green-400 w-1/2">{success}</div>
    </div>
  );
}
