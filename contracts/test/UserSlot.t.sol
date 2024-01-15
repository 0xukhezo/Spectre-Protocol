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

    MockERC721 public mockERC721;
    UserSlotFactory slotFactory;
    IEventEmitter eventEmitter;
    UserSlot public aliceSlot;

    uint256 rewardsForLoan = 100 ether; //GHO 18 decimals

    IERC20 constant WETH = IERC20(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
    IERC20 constant aWETH = IERC20(0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8);

    address constant GHO = 0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f;
    address constant aDebtGHO = 0x3FEaB6F8510C73E05b8C0Fdf96Df012E3A144319; //variable

    address constant richHolderWETH = 0x2fEb1512183545f48f6b9C5b4EbfCaF49CfCa6F3;
    address constant richHolderGHO = 0xE831C8903de820137c13681E78A5780afDdf7697;

    address constant aavePool = 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2;
    address constant poolDataProvider = 0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3;

    address constant ALICE = address(0x1111);
    address constant BOB = address(0x1112);
    address constant CHARLES = address(0x1113);

    /**
     * Alice own 1 NFT and want GHO but have not collateral
     * Bob own 1 ether and want supply collateral on behalf of Alice to earn interest
     */
    function setUp() public {
        forkHelper = new ForkHelper();
        forkHelper.fork(vm);

        address ccipConnector = address(0x11);

        slotFactory = new UserSlotFactory(aavePool, poolDataProvider, ccipConnector);
        eventEmitter = slotFactory.eventEmitter();

        //Alice Deploy her Slot
        vm.startPrank(ALICE);
        vm.recordLogs();
        slotFactory.createSlot();
        Vm.Log[] memory entries = vm.getRecordedLogs();
        aliceSlot = UserSlot(address(uint160(uint256(entries[1].topics[2]))));
        assertTrue(aliceSlot.owner() == ALICE, "ALICE is not owner of own slot.");
        vm.stopPrank();

        mockERC721 = new MockERC721("MockERC721", "ME7");
        mockERC721.mint(ALICE, 1);
        assertTrue(mockERC721.ownerOf(1) == ALICE, "The NFT could not be minted to ALICE");

        vm.startPrank(richHolderWETH);
        WETH.transfer(BOB, 1 ether);
        assertTrue(WETH.balanceOf(BOB) == 1 ether, "Could not get WETH from richHolder.");
        vm.stopPrank();
    }

    /**
    * Alice wants to be given 1 ether to use as supply in her name to borrow, and she is going to 
    * offer a reward of 100 GHO to anyone who provides that supply. 
    * Additionally, she will use her NFT as collateral for the borrowed supply.
    */
    function test_AliceOpenRequestLoan() public {
        (
            address tokenContractExpected,
            uint256 tokenIdExpected,
            address tokenRequestExpected,
            uint256 amountRequestExpected,
            address tokenToBorrowExpected,
            uint256 rewardsExpected,
            uint256 deadlineExpected
        ) = (address(mockERC721), 1, address(WETH), 1 ether, address(GHO), rewardsForLoan, 30 days);

        aliceOpenRequestLoan(
            tokenContractExpected,
            tokenIdExpected,
            tokenRequestExpected,
            amountRequestExpected,
            tokenToBorrowExpected,
            rewardsForLoan,
            deadlineExpected
        );

        (
            address tokenContract,
            uint256 tokenId,
            address tokenRequest,
            uint256 amountRequest,
            address tokenToBorrow,
            uint256 loanDeadline,
            address supplier,
            uint256 rewards,
            uint64 chainSelector,
            bool activeLoan
        ) = aliceSlot.position();

        assertTrue(
            tokenContract == tokenContractExpected,
            "The token contract address does not match the expected ERC721 address."
        );
        assertTrue(tokenId == tokenIdExpected, "The token ID does not match the expected value.");
        assertTrue(
            tokenRequest == tokenRequestExpected, "The requested token address does not match the expected value."
        );
        assertTrue(amountRequest == amountRequestExpected, "The requested amount does not match the expected value.");
        assertTrue(
            tokenToBorrow == tokenToBorrowExpected, "The token to borrow address does not match the expected value."
        );
        assertTrue(loanDeadline == deadlineExpected, "The loan deadline does not match the expected value.");
        assertTrue(supplier == address(0), "The supplier address is not the expected zero address.");
        assertTrue(rewards == rewardsExpected, "The rewards amount does not match the expected value.");
        assertTrue(chainSelector == 0, "The chain selector does not match the expected value.");
        assertTrue(activeLoan == true, "The activeLoan value does not match the expected value.");

        assertTrue(
            mockERC721.ownerOf(1) == address(aliceSlot), "The owner of token ID 1 does not match the expected address."
        );
    }

    function test_BobSupplyRequestOnBehalOfAlice() public {
        (
            address tokenContract,
            uint256 tokenId,
            address tokenRequest,
            uint256 amountRequest,
            address tokenToBorrow,
            uint256 deadline
        ) = (address(mockERC721), 1, address(WETH), 1 ether, address(USDC), block.timestamp + 30 days);

        aliceOpenRequestLoan(
            tokenContract, tokenId, tokenRequest, amountRequest, tokenToBorrow, rewardsForLoan, deadline
        );

        bobSupplyRequestLoan(IERC20(tokenRequest), amountRequest);
        (,,,,,, address supplier,,,) = aliceSlot.position();

        assertTrue(supplier == BOB, "The supplier address is not the expected BOB address.");
        assertTrue(aWETH.balanceOf(address(aliceSlot)) == 1 ether, "Amount of AToken wrong.");

        (, address stableDebtTokenAddress, address variableDebtTokenAddress) =
            IPoolDataProvider(poolDataProvider).getReserveTokensAddresses(tokenToBorrow);
        assertTrue(
            ICreditDelegationToken(stableDebtTokenAddress).borrowAllowance(address(aliceSlot), ALICE)
                == type(uint256).max,
            "Stable debt token borrow allowance does not match the expected value."
        );
        assertTrue(
            ICreditDelegationToken(variableDebtTokenAddress).borrowAllowance(address(aliceSlot), ALICE)
                == type(uint256).max,
            "Variable debt token borrow allowance does not match the expected value."
        );
    }

    function test_AliceBorrow() public {
        test_BobSupplyRequestOnBehalOfAlice();

        uint256 borrowAmount = 1000000000;

        aliceBorrow(USDC, borrowAmount, 2, address(aliceSlot));
        assertTrue(IERC20(USDC).balanceOf(address(ALICE)) == borrowAmount, "Loan not executed successfully.");
        assertTrue(IERC20(USDC).balanceOf(address(aliceSlot)) == 0, "Contract has borrowed tokens.");
        assertTrue(
            IERC20(aDebtUSDC).balanceOf(address(aliceSlot)) == borrowAmount, "Contract has not the correct debt."
        );
    }

    function test_RepayDebt() public {
        test_AliceBorrow();

        vm.warp(block.timestamp + 2 days);

        aliceRepayDebt(aDebtUSDC, USDC, richHolderUSDC, 2);

        assertTrue(IERC20(USDC).balanceOf(address(ALICE)) == 0, "Balance of Alice is not as expected.");
        assertTrue(IERC20(USDC).balanceOf(address(aliceSlot)) == 0, "Balance of contract is not as expected.");
        assertTrue(IERC20(aDebtUSDC).balanceOf(address(aliceSlot)) == 0, "ADebt balance is not as expected.");
    }

    function test_CompleteLoanOwnerWithRepay() public {
        test_RepayDebt();

        uint256 balanceBeforeCompleteBob = WETH.balanceOf(BOB);

        uint256 balanceSlotAToken = IERC20(aWETH).balanceOf(address(aliceSlot));
        vm.expectEmit(true, true, true, true);
        emit IEventEmitter.CompleteLoan(address(aliceSlot), true, balanceSlotAToken);

        aliceCompleteLoan();
        uint256 balanceAfterCompleteBob = WETH.balanceOf(BOB);

        assertTrue(balanceAfterCompleteBob - balanceBeforeCompleteBob > 1000000000, "Bob has not recovered his tokens.");
        assertTrue(mockERC721.ownerOf(1) == ALICE, "Alice has not recovered his token.");
        assertTrue(BOB.balance == rewardsForLoan, "BOB has not received the rewards.");
    }

    function test_CompleteLoanOwnerWithoutRepay() public {
        test_AliceBorrow();

        uint256 balanceBeforeCompleteBob = WETH.balanceOf(BOB);
        vm.expectRevert(abi.encodeWithSelector(IUserSlot.PendingDebtExists.selector));
        aliceCompleteLoan();
        uint256 balanceAfterCompleteBob = WETH.balanceOf(BOB);

        assertTrue(balanceAfterCompleteBob - balanceBeforeCompleteBob == 0, "Bob has not expected balance tokens.");
        assertTrue(mockERC721.ownerOf(1) == address(aliceSlot), "Contract not own token nft.");
    }

    function test_CompleteLoanSupplierWithRepay() public {
        test_RepayDebt();

        vm.warp(block.timestamp + 31 days);

        uint256 balanceBeforeCompleteBob = WETH.balanceOf(BOB);

        uint256 balanceSlotAToken = IERC20(aWETH).balanceOf(address(aliceSlot));
        vm.expectEmit(true, true, true, true);
        emit IEventEmitter.CompleteLoan(address(aliceSlot), true, balanceSlotAToken);

        bobCompleteLoan();
        uint256 balanceAfterCompleteBob = WETH.balanceOf(BOB);

        assertTrue(balanceAfterCompleteBob - balanceBeforeCompleteBob > 1000000000, "Bob has not recovered his tokens.");
        assertTrue(mockERC721.ownerOf(1) == ALICE, "Alice has not recovered his token.");
        assertTrue(BOB.balance == rewardsForLoan, "BOB has not received the rewards.");
    }

    function test_CompleteLoanSupplierWithoutRepayDebt() public {
        test_AliceBorrow();

        vm.warp(block.timestamp + 31 days);

        uint256 balanceBeforeCompleteBob = WETH.balanceOf(BOB);

        vm.expectEmit(true, true, true, true);
        emit IEventEmitter.CompleteLoan(address(aliceSlot), false, 0);

        bobCompleteLoan();
        uint256 balanceAfterCompleteBob = WETH.balanceOf(BOB);

        assertTrue(balanceAfterCompleteBob - balanceBeforeCompleteBob == 0, "Bob has not recovered his tokens.");
        assertTrue(mockERC721.ownerOf(1) == BOB, "BOB has not recovered NFT token.");
        assertTrue(BOB.balance == rewardsForLoan, "BOB has not received the rewards.");
    }

    /**
     * Utils
     */

    function aliceOpenRequestLoan(
        address erc721,
        uint256 tokenId,
        address tokenRequest,
        uint256 amountRequest,
        address tokenToBorrow,
        uint256 rewards,
        uint256 deadline
    ) public {
        vm.deal(ALICE, rewards);
        vm.startPrank(ALICE);
        mockERC721.approve(address(aliceSlot), tokenId);

        vm.expectEmit(true, true, true, true);
        emit IEventEmitter.NewRequestLoan(
            address(aliceSlot), erc721, tokenId, tokenRequest, amountRequest, tokenToBorrow, rewards, deadline
        );

        aliceSlot.openRequest{value: rewards}(
            erc721, tokenId, tokenRequest, amountRequest, tokenToBorrow, rewards, deadline
        );
        vm.stopPrank();
    }

    function bobSupplyRequestLoan(IERC20 token, uint256 amountSupply) public {
        vm.startPrank(BOB);
        token.approve(address(aliceSlot), amountSupply);

        vm.expectEmit(true, true, true, true);
        emit IEventEmitter.SuppliedLoan(address(aliceSlot), BOB, 0);

        aliceSlot.supplyRequest();
        vm.stopPrank();
    }

    function aliceBorrow(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf) public {
        vm.startPrank(ALICE);
        IPool(aavePool).borrow(asset, amount, interestRateMode, 0, onBehalfOf);
        vm.stopPrank();
    }

    function aliceRepayDebt(
        address debtToken,
        address tokenBorrowed,
        address richHolderTokenBorrowed,
        uint256 interestRateMode
    ) public {
        uint256 currentDebt = IERC20(debtToken).balanceOf(address(aliceSlot));

        vm.startPrank(richHolderTokenBorrowed);
        SafeERC20.safeTransfer(IERC20(tokenBorrowed), ALICE, currentDebt - IERC20(tokenBorrowed).balanceOf(ALICE));
        assertTrue(IERC20(tokenBorrowed).balanceOf(ALICE) == currentDebt, "Alice has not enought token to repay debt.");
        vm.stopPrank();

        //Pay debt
        vm.startPrank(ALICE);
        IERC20(tokenBorrowed).approve(aavePool, currentDebt);
        IPool(aavePool).repay(tokenBorrowed, currentDebt, interestRateMode, address(aliceSlot));
        vm.stopPrank();
    }

    function aliceCompleteLoan() public {
        vm.startPrank(ALICE);
        aliceSlot.completeLoanOwner();
        vm.stopPrank();
    }

    function bobCompleteLoan() public {
        vm.startPrank(BOB);
        aliceSlot.completeLoanSupplier();
        vm.stopPrank();
    }
}
