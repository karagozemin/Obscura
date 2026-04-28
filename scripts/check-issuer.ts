import hardhat from "hardhat";

const { ethers } = hardhat;

async function main() {
  const dealRoomAddress = process.env.NEXT_PUBLIC_DEAL_ROOM_ADDRESS;
  if (!dealRoomAddress) {
    throw new Error("NEXT_PUBLIC_DEAL_ROOM_ADDRESS env var required");
  }

  const dealIdEnv = process.env.DEAL_ID;
  const dealId = dealIdEnv ? BigInt(dealIdEnv) : null;

  const DealRoom = await ethers.getContractFactory("ObscuraDealRoom");
  const dealRoom = DealRoom.attach(dealRoomAddress);

  const count = await dealRoom.getDealsCount();
  const lastId = count > 0n ? count - 1n : 0n;

  const idsToCheck = dealId !== null ? [dealId] : [lastId];

  for (const id of idsToCheck) {
    const deal = await dealRoom.getDeal(id);
    console.log(`dealId=${id.toString()} issuer=${deal.issuer}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
