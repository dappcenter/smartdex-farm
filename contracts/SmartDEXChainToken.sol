// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./libs/Ownable.sol";

// Lightweight token modelled after UNI-LP: https://github.com/Uniswap/uniswap-v2-core/blob/v1.0.1/contracts/UniswapV2ERC20.sol
// Adds:
//   - An exposed `mint()` with minting role
//   - An exposed `burn()`
//   - ERC-3009 (`transferWithAuthorization()`)

contract SmartDEXChain is ERC20, ERC20Detailed, Ownable {
    using SafeMath for uint256;

    uint256 private constant cap = 1000000000 * 10 ** 18;

    address public minter;

    event ChangeMinter(address indexed minter);

    modifier onlyMinter {
        require(msg.sender == minter, "SDC:NOT_MINTER");
        _;
    }

    constructor() ERC20Detailed("SmartDEXChain", "SDC", 18) public {
        _changeMinter(msg.sender);
        owner = msg.sender;
    }

    function mint(address to, uint256 value) external onlyMinter returns (bool) {
        _mint(to, value);
        return true;
    }

    function changeMinter(address newMinter) external onlyOwner {
        _changeMinter(newMinter);
    }


    function _changeMinter(address newMinter) internal {
        minter = newMinter;
        emit ChangeMinter(newMinter);
    }
}