import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the Akuntabel contract using the deployer account
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployAkuntabel: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Akuntabel", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const akuntabel = await hre.ethers.getContract<Contract>("Akuntabel", deployer);
  const address = await akuntabel.getAddress();
  console.log("Akuntabel contract deployed at:", address);
};

export default deployAkuntabel;

deployAkuntabel.tags = ["Akuntabel"];
