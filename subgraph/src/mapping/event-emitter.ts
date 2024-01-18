import {
  CompleteLoan as CompleteLoanEvent,
  NewRequestLoan as NewRequestLoanEvent,
  SlotUserCreated as SlotUserCreatedEvent,
  SuppliedLoan as SuppliedLoanEvent
} from "../../generated/EventEmitter/EventEmitter"
import {
  User,
  Collection,
  SlotUser,
  NFT,
  Loan
} from "../../generated/schema"
import { MAX_UINT256, ADDRESS_ZERO, ZERO_BI } from "../utils/constants"
import { fetchTokenName, fetchTokenSymbol, fetchUri } from "../utils/erc721"
import { Address, log } from "@graphprotocol/graph-ts"


export function handleSlotUserCreated(event: SlotUserCreatedEvent): void {

    let user = User.load(event.params.owner.toHexString())

    if(!user){
      user = new User(event.params.owner.toHexString())
    }

    user.save()

    let slot = SlotUser.load(event.params.slot)

    if(!slot){
      slot = new SlotUser(event.params.slot)
    }
    slot.user = user.id

    slot.save()

}

export function handleNewRequestLoan(event: NewRequestLoanEvent): void {

  let slot = SlotUser.load(event.params.slot)

  let loan = new Loan(event.transaction.hash.toHex() + "-" + event.logIndex.toString())

  let collection = Collection.load(event.params.tokenContract.toHexString())

  if(!collection){
    collection = new Collection(event.params.tokenContract.toHexString())
    let name = fetchTokenName(event.params.tokenContract)
    let symbol = fetchTokenSymbol(event.params.tokenContract)
    collection.name = name
    collection.symbol = symbol
    collection.save()
  }

  let nftId = event.params.tokenContract.toHexString().concat("-").concat(event.params.tokenId.toString())
  let nft = NFT.load(nftId)

  if(!nft){
    nft = new NFT(nftId)
    nft.collection = collection.id
    nft.uri = fetchUri(event.params.tokenContract, event.params.tokenId)
    nft.save()
  }

  loan.slot = event.params.slot
  loan.user = slot!.user
  loan.nft = nftId
  loan.tokenRequest = event.params.tokenRequest
  loan.amountRequest = event.params.amountRequest
  loan.tokenToBorrow = event.params.tokenToBorrow
  loan.rewards = event.params.rewards
  loan.loanDuration = event.params.loanDuration
  loan.deadline = MAX_UINT256
  loan.supplier = ADDRESS_ZERO
  loan.chainSelector = ZERO_BI
  loan.completedSuccessfully = false
  loan.amountWithdraw = ZERO_BI
  loan.activeLoan =  true

  loan.save()

  //Active loan in slot
  if(slot){
    slot.loan = loan.id;
    slot.save()
  }

}

export function handleSuppliedLoan(event: SuppliedLoanEvent): void {
    let slot = SlotUser.load(event.params.slot);

    if(!slot){
      log.error("SlotUser {} not found on Supplied Loan event. tx_hash: {}", [
        event.params.slot.toHexString(),
        event.transaction.hash.toHexString()
      ]);
      return
    }

    if(!slot || !slot.loan){
      log.error("Loan not found on Supplied Loan event. tx_hash: {}", [
        event.transaction.hash.toHexString()
      ]);
      return
    }

    let loan = Loan.load(slot.loan as string)

    if(!loan){
      log.error("Loan {} not found on Supplied Loan event. tx_hash: {}", [
        slot.loan as string,
        event.transaction.hash.toHexString()
      ]);
      return
    }

    loan.supplier = event.params.supplier
    loan.activeLoan = true
    loan.chainSelector = event.params.chainSelector
    loan.deadline = loan.loanDuration.plus(event.block.timestamp)

    loan.save();
    

}

export function handleCompleteLoan(event: CompleteLoanEvent): void {
  let slot = SlotUser.load(event.params.slot);

  if(!slot){
    log.error("SlotUser {} not found on Supplied Loan event. tx_hash: {}", [
      event.params.slot.toHexString(),
      event.transaction.hash.toHexString()
    ]);
    return
  }

  if(!slot.loan){
    log.error("Loan not found on Supplied Loan event. tx_hash: {}", [
      event.transaction.hash.toHexString()
    ]);
    return
  }

  let loan = Loan.load(slot.loan as string)

  if(!loan){
    log.error("Loan {} not found on Supplied Loan event. tx_hash: {}", [
      slot.loan as string,
      event.transaction.hash.toHexString()
    ]);
    return
  }

  loan.completedSuccessfully = event.params.successfull
  loan.activeLoan = false
  loan.amountWithdraw = event.params.amountWithdraw

  loan.save()
  
}

