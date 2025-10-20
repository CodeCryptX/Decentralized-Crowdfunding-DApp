// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title KYCRegistry_HassanMurtaza
 * @dev Handles user KYC registration and admin approval for crowdfunding platform.
 */
contract KYCRegistry_HassanMurtaza is Ownable {
    struct KYCRequest {
        string name;
        string cnic;
        bool approved;
        bool exists;
    }

    // Mapping from user address to KYC request
    mapping(address => KYCRequest) public kycRequests;

    // Events
    event KYCRequested(address indexed user, string name, string cnic);
    event KYCApproved(address indexed user);
    event KYCRejected(address indexed user);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Submit a KYC request.
     * @param name User's name
     * @param cnic User's CNIC
     */
    function submitKYC(string calldata name, string calldata cnic) external {
        require(!kycRequests[msg.sender].exists, "KYC already submitted");
        kycRequests[msg.sender] = KYCRequest({
            name: name,
            cnic: cnic,
            approved: false,
            exists: true
        });
        emit KYCRequested(msg.sender, name, cnic);
    }

    /**
     * @dev Admin approves a KYC request.
     * @param user Address of the user
     */
    function approveKYC(address user) external onlyOwner {
        require(kycRequests[user].exists, "No KYC submitted");
        require(!kycRequests[user].approved, "Already approved");
        kycRequests[user].approved = true;
        emit KYCApproved(user);
    }

    /**
     * @dev Admin rejects a KYC request.
     * @param user Address of the user
     */
    function rejectKYC(address user) external onlyOwner {
        require(kycRequests[user].exists, "No KYC submitted");
        require(!kycRequests[user].approved, "Already approved");
        delete kycRequests[user];
        emit KYCRejected(user);
    }

    /**
     * @dev Returns true if user is verified (approved).
     */
    function isVerified(address user) external view returns (bool) {
        return kycRequests[user].approved;
    }
}
