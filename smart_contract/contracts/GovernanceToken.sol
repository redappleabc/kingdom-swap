// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract STRGToken is ERC20 {
    
    constructor() ERC20("Kingdom Swap Governance Token", "veKS2") {
        _mint(msg.sender, 30000000*uint256(10**decimals()));
    }
}