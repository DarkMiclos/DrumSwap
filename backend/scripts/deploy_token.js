const hardhat = require("hardhat");
async function main() {
  const DrumSwapToken = await hardhat.ethers.getContractFactory("DrumSwapToken");
  const drumSwapToken = await DrumSwapToken.deploy();
  await drumSwapToken.deployed();

  console.log("Drum swap token deployed: ", drumSwapToken.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});