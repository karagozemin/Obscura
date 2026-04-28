import hardhat from "hardhat";

const { ethers } = hardhat;

async function main() {
  const confidentialToken = process.env.CONFIDENTIAL_TOKEN_ADDRESS;
  if (!confidentialToken) {
    throw new Error("CONFIDENTIAL_TOKEN_ADDRESS env var required");
  }

  const DealRoom = await ethers.getContractFactory("ObscuraDealRoom");
  const dealRoom = await DealRoom.deploy(confidentialToken);
  await dealRoom.waitForDeployment();

  console.log("ObscuraDealRoom deployed to:", await dealRoom.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
