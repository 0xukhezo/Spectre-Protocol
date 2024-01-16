// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {UserSlot} from "src/core/UserSlot.sol";
import {EventEmitter} from "src/core/EventEmitter.sol";
import {IUserSlotFactory} from "src/interfaces/IUserSlotFactory.sol";

contract UserSlotFactory is Ownable, IUserSlotFactory {
    EventEmitter public immutable eventEmitter;
    address public immutable aavePool;
    address public immutable aaveDataProvider;
    address public immutable ghoToken;
    address public immutable connector;

    mapping(address => bool) public slots;

    constructor(address _aavePool, address _aaveDataProvider, address _connector, address _ghoToken)
        Ownable(_msgSender())
    {
        if (_aavePool == address(0)) {
            revert InvalidAddressForConstructorArgument("aavePool");
        }
        if (_aaveDataProvider == address(0)) {
            revert InvalidAddressForConstructorArgument("aaveDataProvider");
        }
        if (_ghoToken == address(0)) {
            revert InvalidAddressForConstructorArgument("ghoToken");
        }
        if (_connector == address(0)) {
            revert InvalidAddressForConstructorArgument("connector");
        }

        eventEmitter = new EventEmitter(address(this));
        aavePool = _aavePool;
        aaveDataProvider = _aaveDataProvider;
        ghoToken = _ghoToken;
        connector = _connector;
    }

    function createSlot() public {
        UserSlot userSlot =
            new UserSlot(aavePool, aaveDataProvider, connector, address(eventEmitter), ghoToken, _msgSender());
        slots[address(userSlot)] = true;
        eventEmitter.emitUserSlotCreated(_msgSender(), address(userSlot));
    }

    function slotExists(address _slotAddress) public view returns (bool) {
        return slots[_slotAddress];
    }
}
