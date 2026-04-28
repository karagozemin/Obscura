import { formatUnits } from "viem";

export function formatToken(value?: bigint, decimals = 18) {
  if (value === undefined) return "0";
  return formatUnits(value, decimals);
}
