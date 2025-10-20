// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./KYCRegistry_HassanMurtaza.sol";

/**
 * @title Crowdfunding_HassanMurtaza
 * @dev Manages crowdfunding campaigns, contributions, and withdrawals.
 */
contract Crowdfunding_HassanMurtaza is Ownable {
    KYCRegistry_HassanMurtaza public kycRegistry;

    constructor(address _kycRegistry) Ownable(msg.sender) {
        kycRegistry = KYCRegistry_HassanMurtaza(_kycRegistry);
    }

    struct Campaign {
        string title;
        string description;
        uint256 goal;
        uint256 fundsRaised;
        address creator;
        bool active;
        bool completed;
        bool withdrawn;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;

    // Events
    event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 goal);
    event ContributionReceived(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    event FundsWithdrawn(uint256 indexed campaignId, address indexed creator, uint256 amount);

    // Modifiers
    modifier onlyVerifiedOrAdmin() {
        require(
            kycRegistry.isVerified(msg.sender) || msg.sender == owner(),
            "Not verified or admin"
        );
        _;
    }

    modifier onlyCreator(uint256 campaignId) {
        require(campaigns[campaignId].creator == msg.sender, "Not campaign creator");
        _;
    }

    modifier onlyActive(uint256 campaignId) {
        require(campaigns[campaignId].active, "Campaign not active");
        _;
    }

    /**
     * @dev Create a new crowdfunding campaign.
     * @param title Campaign title
     * @param description Campaign description
     * @param goal Funding goal (in wei)
     */
    function createCampaign(string calldata title, string calldata description, uint256 goal)
        external
        onlyVerifiedOrAdmin
    {
        require(goal > 0, "Goal must be positive");
        campaignCount++;
        campaigns[campaignCount] = Campaign({
            title: title,
            description: description,
            goal: goal,
            fundsRaised: 0,
            creator: msg.sender,
            active: true,
            completed: false,
            withdrawn: false
        });
        emit CampaignCreated(campaignCount, msg.sender, title, goal);
    }

    /**
     * @dev Contribute to a campaign.
     * @param campaignId ID of the campaign
     */
    function contribute(uint256 campaignId) external payable onlyActive(campaignId) {
        require(msg.value > 0, "Contribution must be positive");
        Campaign storage c = campaigns[campaignId];
        require(!c.completed, "Campaign already completed");
        c.fundsRaised += msg.value;
        emit ContributionReceived(campaignId, msg.sender, msg.value);
        if (c.fundsRaised >= c.goal) {
            c.completed = true;
            c.active = false;
        }
    }

    /**
     * @dev Withdraw funds from a completed campaign.
     * @param campaignId ID of the campaign
     */
    function withdraw(uint256 campaignId) external onlyCreator(campaignId) {
        Campaign storage c = campaigns[campaignId];
        require(c.completed, "Campaign not completed");
        require(!c.withdrawn, "Funds already withdrawn");
        uint256 amount = c.fundsRaised;
        c.withdrawn = true;
        (bool sent, ) = payable(c.creator).call{value: amount}("");
        require(sent, "Withdraw failed");
        emit FundsWithdrawn(campaignId, c.creator, amount);
    }

    /**
     * @dev Get campaign details.
     * @param campaignId ID of the campaign
     */
    function getCampaign(uint256 campaignId) external view returns (Campaign memory) {
        return campaigns[campaignId];
    }
}
