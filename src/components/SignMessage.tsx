import { useWallet } from "@solana/wallet-adapter-react";
import { useRef, useState, useTransition } from "react";
import { ed25519 } from "@noble/curves/ed25519";
import bs58 from "bs58";

export default function SignMessage() {
  const messageRef = useRef<HTMLInputElement>(null);
  const { publicKey, signMessage } = useWallet();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function signUserMessage() {
    setSuccess("");
    setError("");
    startTransition(async () => {
      try {
        if (!publicKey) {
          throw new Error("Please connect to a wallet");
        }

        if (!signMessage) {
          throw new Error("Wallet doesn't support signing the message");
        }

        const message = messageRef.current?.value;

        if (message === "") {
          throw new Error("Message cannot be blank");
        }

        const encodedMessage = new TextEncoder().encode(message);

        const signature = await signMessage(encodedMessage);

        if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
          throw new Error("Message Signature Invalid");
        }

        setSuccess(`Message signature: ${bs58.encode(signature)}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error while signing the message.";
        console.log(errorMessage);
        setError(errorMessage);
      } finally {
        if (messageRef.current) {
          messageRef.current.value = "";
        }
      }
    });
  }

  if (!publicKey?.toString()) {
    return;
  }

  return (
    <div className="flex flex-col items-center mt-10 gap-2">
      <h1 className="text-xl font-semibold">Sign a message</h1>
      <input
        type="text"
        className="p-2 focus-within:outline-0 border rounded-sm"
        ref={messageRef}
        placeholder="message"
      />
      <button
        className={`px-4 py-2 font-semibold text-white ${
          isPending ? "bg-pink-300" : "bg-pink-500"
        } rounded-sm cursor-pointer hover:bg-emerald-900 transition-colors duration-200`}
        onClick={signUserMessage}
      >
        Sign message
      </button>
      <div className="text-red-400 w-1/2">{error}</div>
      <div className="text-green-400 w-1/2">{success}</div>
    </div>
  );
}
