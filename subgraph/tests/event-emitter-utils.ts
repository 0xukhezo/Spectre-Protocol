import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CompleteLoan,
  NewRequestLoan,
  SlotUserCreated,
  SuppliedLoan
} from "../generated/EventEmitter/EventEmitter"

export function createCompleteLoanEvent(
  slot: Address,
  successfull: boolean,
  amountWithdraw: BigInt
): CompleteLoan {
  let completeLoanEvent = changetype<CompleteLoan>(newMockEvent())

  completeLoanEvent.parameters = new Array()

  completeLoanEvent.parameters.push(
    new ethereum.EventParam("slot", ethereum.Value.fromAddress(slot))
  )
  completeLoanEvent.parameters.push(
    new ethereum.EventParam(
      "successfull",
      ethereum.Value.fromBoolean(successfull)
    )
  )
  completeLoanEvent.parameters.push(
    new ethereum.EventParam(
      "amountWithdraw",
      ethereum.Value.fromUnsignedBigInt(amountWithdraw)
    )
  )

  return completeLoanEvent
}

export function createNewRequestLoanEvent(
  slot: Address,
  tokenContract: Address,
  tokenId: BigInt,
  tokenRequest: Address,
  amountRequest: BigInt,
  tokenToBorrow: Address,
  rewards: BigInt,
  loanDeadline: BigInt
): NewRequestLoan {
  let newRequestLoanEvent = changetype<NewRequestLoan>(newMockEvent())

  newRequestLoanEvent.parameters = new Array()

  newRequestLoanEvent.parameters.push(
    new ethereum.EventParam("slot", ethereum.Value.fromAddress(slot))
  )
  newRequestLoanEvent.parameters.push(
    new ethereum.EventParam(
      "tokenContract",
      ethereum.Value.fromAddress(tokenContract)
    )
  )
  newRequestLoanEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  newRequestLoanEvent.parameters.push(
    new ethereum.EventParam(
      "tokenRequest",
      ethereum.Value.fromAddress(tokenRequest)
    )
  )
  newRequestLoanEvent.parameters.push(
    new ethereum.EventParam(
      "amountRequest",
      ethereum.Value.fromUnsignedBigInt(amountRequest)
    )
  )
  newRequestLoanEvent.parameters.push(
    new ethereum.EventParam(
      "tokenToBorrow",
      ethereum.Value.fromAddress(tokenToBorrow)
    )
  )
  newRequestLoanEvent.parameters.push(
    new ethereum.EventParam(
      "rewards",
      ethereum.Value.fromUnsignedBigInt(rewards)
    )
  )
  newRequestLoanEvent.parameters.push(
    new ethereum.EventParam(
      "loanDeadline",
      ethereum.Value.fromUnsignedBigInt(loanDeadline)
    )
  )

  return newRequestLoanEvent
}

export function createSlotUserCreatedEvent(
  owner: Address,
  slot: Address
): SlotUserCreated {
  let slotUserCreatedEvent = changetype<SlotUserCreated>(newMockEvent())

  slotUserCreatedEvent.parameters = new Array()

  slotUserCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  slotUserCreatedEvent.parameters.push(
    new ethereum.EventParam("slot", ethereum.Value.fromAddress(slot))
  )

  return slotUserCreatedEvent
}

export function createSuppliedLoanEvent(
  slot: Address,
  supplier: Address,
  chainSelector: BigInt
): SuppliedLoan {
  let suppliedLoanEvent = changetype<SuppliedLoan>(newMockEvent())

  suppliedLoanEvent.parameters = new Array()

  suppliedLoanEvent.parameters.push(
    new ethereum.EventParam("slot", ethereum.Value.fromAddress(slot))
  )
  suppliedLoanEvent.parameters.push(
    new ethereum.EventParam("supplier", ethereum.Value.fromAddress(supplier))
  )
  suppliedLoanEvent.parameters.push(
    new ethereum.EventParam(
      "chainSelector",
      ethereum.Value.fromUnsignedBigInt(chainSelector)
    )
  )

  return suppliedLoanEvent
}
