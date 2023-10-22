const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-etherscan");
async function main() {
// Verify the contract after deploying
    await hre.run("verify:verify", {
        address: "0xBB16aA856629D0C9f6185B8d7eC4B9f095F26df4",
        constructorArguments: ["0xf69251C51cfBc28b112248D0E9B6a8CD58859dd8", "0x9790FcCcaE35c07a7476044e495E88a490d0236c"],
        // for example, if your constructor argument took an address, do something like constructorArguments: ["0xABCDEF..."],
});
}
// Call the main function and catch if there is any error
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});