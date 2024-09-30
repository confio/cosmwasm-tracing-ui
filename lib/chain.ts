//TODO - query from chain
export function getAddressType(_address: string) {
  if (Math.random() < 0.5) {
    return "account";
  }

  return Math.random() < 0.5 ? "contract" : "validator";
}
