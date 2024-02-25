import Web3 from "web3";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

import * as fs from "fs";

const web3 = new Web3(process.env.RPC!);

const user_pk = process.env.PK;

const user = web3.eth.accounts.privateKeyToAccount(user_pk!).address;

const referral = "0xc127d868C2FB90295a895973a27B0949ca7656f9";
const admin = user;

async function main() {
    const Referral = JSON.parse(
        fs.readFileSync("./artifacts/contracts/AvaDID.sol/AvaDID.json", "utf-8")
    ).abi;

    const txCount = await web3.eth.getTransactionCount(user);

    const contract = new web3.eth.Contract(Referral, referral);

    const txData = contract.methods
        .grantRole(
            "0x05ad505c284c334db1a6c42c832914414c419f23007c56ea6430812d4f81c375",
            admin
        )
        .encodeABI();
    console.log(txData);

    //using ETH
    const txObj = {
        nonce: txCount,
        gasLimit: web3.utils.toHex("1000000"),
        data: txData,
        to: referral,
        from: user,
    };

    const signedTx = await web3.eth.accounts.signTransaction(txObj, user_pk!);

    const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction!);
    console.log(result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
