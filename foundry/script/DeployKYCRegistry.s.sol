// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {KYCRegistry_HassanMurtaza} from "../src/KYCRegistry_HassanMurtaza.sol";

contract DeployKYCRegistryScript is Script {
    function run() external {
        vm.startBroadcast();
        new KYCRegistry_HassanMurtaza();
        vm.stopBroadcast();
    }
}
