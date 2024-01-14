// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {ForkHelper} from "test/utils/ForkHelper.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract UserSlotTest is Test {
    using SafeERC20 for IERC20;

    ForkHelper internal forkHelper;

    function setUp() public {
        forkHelper = new ForkHelper();
        forkHelper.fork(vm);
    }

    function test_AliceOpenRequestLoan() public {}

    function test_BobSupplyRequestOnBehalOfAlice() public {}

    function test_AliceBorrow() public {}

    function test_RepayDebt() public {}

    function test_CompleteLoanOwnerWithRepay() public {}

    function test_CompleteLoanOwnerWithoutRepay() public {}

    function test_CompleteLoanSupplierWithRepay() public {}

    function test_CompleteLoanSupplierWithoutRepayDebt() public {}
}
