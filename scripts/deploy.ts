import hardhat from "hardhat";

const { ethers } = hardhat;

async function main() {
  const confidentialToken = process.env.CONFIDENTIAL_TOKEN_ADDRESS;
  if (!confidentialToken) {
    throw new Error("CONFIDENTIAL_TOKEN_ADDRESS env var required");
  }

  // Deploy ERC-3643 IdentityRegistry
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy();
  await identityRegistry.waitForDeployment();
  const registryAddress = await identityRegistry.getAddress();
  console.log("IdentityRegistry deployed to:", registryAddress);

  // Deploy ObscuraDealRoom with both token + identity registry
  const DealRoom = await ethers.getContractFactory("ObscuraDealRoom");
  const dealRoom = await DealRoom.deploy(confidentialToken, registryAddress);
  await dealRoom.waitForDeployment();
  const dealRoomAddress = await dealRoom.getAddress();
  console.log("ObscuraDealRoom deployed to:", dealRoomAddress);

  console.log("\nSet these env vars:");
  console.log(`NEXT_PUBLIC_DEAL_ROOM_ADDRESS=${dealRoomAddress}`);
  console.log(`NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=${registryAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
