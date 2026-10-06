import { network } from "hardhat";

const { ethers } = await network.connect();

const [deployer] = await ethers.getSigners();

console.log("Deploying from:", deployer.address);

const balance = await ethers.provider.getBalance(deployer.address);

console.log(
  "Deployer balance:",
  ethers.formatEther(balance),
  "ETH"
);

const HoneyChainRegistry =
  await ethers.getContractFactory("HoneyChainRegistry");

const registry = await HoneyChainRegistry.deploy(
  deployer.address
);

await registry.waitForDeployment();

const address = await registry.getAddress();

console.log("\n=================================");
console.log("HoneyChainRegistry deployed!");
console.log("Contract:", address);
console.log("Network: Sepolia");
console.log("=================================\n");