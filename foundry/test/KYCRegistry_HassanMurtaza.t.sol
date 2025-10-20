// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/KYCRegistry_HassanMurtaza.sol";

contract KYCRegistry_HassanMurtazaTest is Test {
    KYCRegistry_HassanMurtaza kyc;
    address admin = address(0x1);
    address user = address(0x2);

    function setUp() public {
        vm.prank(admin);
        kyc = new KYCRegistry_HassanMurtaza();
    }

    function testSubmitKYC() public {
        vm.prank(user);
        kyc.submitKYC("Alice", "12345-6789012-3");
        (string memory name, string memory cnic, bool approved, bool exists) = kyc.kycRequests(user);
        assertEq(name, "Alice");
        assertEq(cnic, "12345-6789012-3");
        assertEq(approved, false);
        assertEq(exists, true);
    }

    function testApproveKYC() public {
        vm.prank(user);
        kyc.submitKYC("Bob", "98765-4321098-7");
        vm.prank(admin);
        kyc.approveKYC(user);
        bool verified = kyc.isVerified(user);
        assertTrue(verified);
    }

    function testRejectKYC() public {
        vm.prank(user);
        kyc.submitKYC("Charlie", "11111-2222222-3");
        vm.prank(admin);
        kyc.rejectKYC(user);
        (, , , bool exists) = kyc.kycRequests(user);
        assertEq(exists, false);
    }
}
