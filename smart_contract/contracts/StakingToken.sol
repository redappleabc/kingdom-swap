// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract STRGToken is ERC20{
    constructor() ERC20("TestStakingToken", "TST") {
        _mint(msg.sender,100000000*uint256(10**decimals()));
    }
}