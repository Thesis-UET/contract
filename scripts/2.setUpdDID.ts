import Web3 from "web3";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

import * as fs from "fs";

const web3 = new Web3(process.env.RPC!);

const user_pk = process.env.PK;

const user = web3.eth.accounts.privateKeyToAccount(user_pk!).address;

const referral = "0xB5a07De2679f0FAfB9Ef2003B558C641BD4741e8";
const userWallet = user;

async function main() {
    const Referral = JSON.parse(
        fs.readFileSync("./artifacts/contracts/AvaDID.sol/AvaDID.json", "utf-8")
    ).abi;

    const txCount = await web3.eth.getTransactionCount(user);

    const contract = new web3.eth.Contract(Referral, referral);

    const txData = contract.methods
        .setUpDIDIssuer(
            "did:3:bbfy89h4f9a23123", // did
            "userData",
            userWallet
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
