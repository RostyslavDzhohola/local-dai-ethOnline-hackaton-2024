// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FakeUSD
 * @dev An ERC20 token representing fake USD with a total supply of 1 billion tokens
 * and a function to mint exactly 1000 tokens per address once
 */
contract FakeUSD is ERC20, Ownable {
    // The number of decimals for the token
    uint8 private constant DECIMALS = 18;
    
    // The total supply of tokens (1 billion)
    uint256 private constant TOTAL_SUPPLY = 1_000_000_000 * 10**DECIMALS;

    // The fixed amount of tokens that will be minted per address (1000)
    uint256 private constant MINT_AMOUNT = 1_000 * 10**DECIMALS;

    // Mapping to keep track of addresses that have minted
    mapping(address => bool) private hasMinted;

    /**
     * @dev Constructor that gives the msg.sender all of the initial supply.
     */
    constructor() ERC20("Fake USD", "FUSD") Ownable() {
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    /**
     * @dev Override the decimals function to return our custom DECIMALS value
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /**
     * @dev Mints exactly 1000 tokens to the caller's address. Can only be called once per address.
     */
    function getCash() external {
        require(!hasMinted[msg.sender], "Address has already minted");
        
        hasMinted[msg.sender] = true;
        _mint(msg.sender, MINT_AMOUNT);
    }

    /**
     * @dev Checks if an address has already minted
     * @param account The address to check
     * @return bool Whether the address has minted or not
     */
    function hasMintedTokens(address account) external view returns (bool) {
        return hasMinted[account];
    }
}
