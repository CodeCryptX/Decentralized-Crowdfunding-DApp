// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Crowdfunding_HassanMurtaza.sol";
import "../src/KYCRegistry_HassanMurtaza.sol";

contract Crowdfunding_HassanMurtazaTest is Test {
    KYCRegistry_HassanMurtaza kyc;
    Crowdfunding_HassanMurtaza crowdfunding;
    address admin = address(0x1);
    address user = address(0x2);
    address contributor = address(0x3);

    function setUp() public {
        vm.prank(admin);
        kyc = new KYCRegistry_HassanMurtaza();
        vm.prank(admin);
        crowdfunding = new Crowdfunding_HassanMurtaza(address(kyc));
        vm.prank(user);
        kyc.submitKYC("Alice", "12345-6789012-3");
        vm.prank(admin);
        kyc.approveKYC(user);
    }

    function testCreateCampaignByVerifiedUser() public {
        vm.prank(user);
        crowdfunding.createCampaign("Save the Whales", "Help us protect whales", 1 ether);
        (string memory title, , uint256 goal, , address creator, bool active, , ) = crowdfunding.campaigns(1);
        assertEq(title, "Save the Whales");
        assertEq(goal, 1 ether);
        assertEq(creator, user);
        assertEq(active, true);
    }

    function testContributeAndCompleteCampaign() public {
        vm.prank(user);
        crowdfunding.createCampaign("Plant Trees", "Reforestation", 1 ether);
        vm.deal(contributor, 2 ether);
        vm.prank(contributor);
        crowdfunding.contribute{value: 1 ether}(1);
        (, , , uint256 fundsRaised, , bool active, bool completed, ) = crowdfunding.campaigns(1);
        assertEq(fundsRaised, 1 ether);
        assertEq(active, false);
        assertEq(completed, true);
    }

    function testWithdrawFunds() public {
        vm.prank(user);
        crowdfunding.createCampaign("Clean Water", "Provide clean water", 1 ether);
        vm.deal(contributor, 2 ether);
        vm.prank(contributor);
        crowdfunding.contribute{value: 1 ether}(1);
        vm.prank(user);
        uint256 balanceBefore = user.balance;
        crowdfunding.withdraw(1);
        uint256 balanceAfter = user.balance;
        assertGt(balanceAfter, balanceBefore);
        (, , , , , , , bool withdrawn) = crowdfunding.campaigns(1);
        assertEq(withdrawn, true);
    }
}
