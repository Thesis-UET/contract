import Web3 from "web3";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

import * as fs from "fs";

const web3 = new Web3(process.env.RPC!);

const referral = "0xc127d868C2FB90295a895973a27B0949ca7656f9";

async function main() {
    const Referral = JSON.parse(
        fs.readFileSync("./artifacts/contracts/AvaDID.sol/AvaDID.json", "utf-8")
    ).abi;

    const contract = new web3.eth.Contract(Referral, referral);

    const txData = await contract.methods
        .getCred(
            "123",
            "0x5ab345efdb9a2a1f9753f73fdaa684dc9133d214",
            "did:3:bafy89h4f9a23123" // did
        )
        .call();
    console.log(txData);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
