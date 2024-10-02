//TODO - query from chain
export function getAddressType(address: string) {
  const unprefixedAddress = address.slice(7);

  if (unprefixedAddress.includes("i") || unprefixedAddress.includes("u")) {
    return "validator";
  }

  return unprefixedAddress.includes("a") ? "account" : "contract";
}
