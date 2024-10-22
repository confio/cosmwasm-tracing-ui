import { Span } from "@/types/txs";

export const getParsedSpanMap = ({ operationName, startTime, tags }: Span) => {
  const map = new Map<string, string>();

  map.set("Operation", operationName);

  const txHash = tags.get("tx_hash");
  txHash && map.set("Tx Hash", txHash);

  const height = tags.get("height");
  height && map.set("Height", height);

  const tx = tags.get("tx");

  const signer = tx?.match(/signer: (\w+)/)?.[1];
  signer && map.set("Signer", signer);

  const sender = tx?.match(/sender: (\w+)/)?.[1];
  sender && map.set("Sender", sender);

  const recipient = tx?.match(/recipient: (\w+)/)?.[1];
  recipient && map.set("Recipient", recipient);

  const [, amount, denom] = tx?.match(/amount: \[Coin { (\w+) \"(\w+)/) ?? [];
  amount && denom && map.set("Amount", `${amount} ${denom}`);

  const [, feeAmount, feeDenom] =
    tx?.match(/fee: FeeInfo { fee: Some\(Coin { (\w+) \"(\w+)/) ?? [];
  feeAmount && feeDenom && map.set("Fee", `${feeAmount} ${feeDenom}`);

  const gasLimit = tx?.match(/gas_limit: (\w+)/)?.[1];
  gasLimit && map.set("Gas limit", gasLimit);

  const startDate = new Date(startTime / 1000);
  map.set(
    "Start time",
    `${startDate.toLocaleTimeString()} - ${startDate.toLocaleDateString()}`,
  );

  return map;
};
