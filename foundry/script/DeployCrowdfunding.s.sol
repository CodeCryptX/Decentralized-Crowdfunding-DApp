// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {Crowdfunding_HassanMurtaza} from "../src/Crowdfunding_HassanMurtaza.sol";

contract DeployCrowdfundingScript is Script {
    function run() external {
        address kycRegistry = 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0;

        vm.startBroadcast();
        new Crowdfunding_HassanMurtaza(kycRegistry);
        vm.stopBroadcast();
    }
}
