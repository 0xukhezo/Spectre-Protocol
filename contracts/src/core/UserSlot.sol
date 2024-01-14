// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IPool} from "aave-v3-core/contracts/interfaces/Ipool.sol";
import {IPoolDataProvider} from "aave-v3-core/contracts/interfaces/IpoolDataProvider.sol";
import {ICreditDelegationToken} from "aave-v3-core/contracts/interfaces/ICreditDelegationToken.sol";

import {IUserSlot} from "src/interfaces/IUserSlot.sol";
import {ICCIPConnector} from "src/interfaces/ICCIPConnector.sol";
import {IEventEmitter} from "src/interfaces/IEventEmitter.sol";

contract UserSlot is IUserSlot, Ownable, ERC721Holder {
    using SafeERC20 for IERC20;

    IPool immutable pool;
    IPoolDataProvider immutable protocolDataProvider;
    ICCIPConnector immutable connector;
    IEventEmitter immutable eventEmitter;

    Position public position;

    constructor(address _pool, address _aaveDataProvider, address _connector, address _eventEmitter, address _owner)
        Ownable(_owner)
    {
        pool = IPool(_pool);
        protocolDataProvider = IPoolDataProvider(_aaveDataProvider);
        connector = ICCIPConnector(_connector);
        eventEmitter = IEventEmitter(_eventEmitter);
    }
}
