import { artifacts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HttpNetworkConfig } from "hardhat/src/types";

import * as dotenv from "dotenv";
dotenv.config();

import * as path from "path";

const deployConduitController: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const { address: contractAddress } = await deploy("AvaDID", {
        from: deployer,
        args: [],
        log: true,
        deterministicDeployment: false,
    });

    try {
        // verify
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: [],
        });
    } catch (e) {
        console.log(e);
    }
};

deployConduitController.tags = ["Ava"];

export default deployConduitController;
