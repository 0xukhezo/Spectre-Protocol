import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { CompleteLoan } from "../generated/schema"
import { CompleteLoan as CompleteLoanEvent } from "../generated/EventEmitter/EventEmitter"
import { handleCompleteLoan } from "../src/mapping/event-emitter"
import { createCompleteLoanEvent } from "./event-emitter-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let slot = Address.fromString("0x0000000000000000000000000000000000000001")
    let successfull = "boolean Not implemented"
    let amountWithdraw = BigInt.fromI32(234)
    let newCompleteLoanEvent = createCompleteLoanEvent(
      slot,
      successfull,
      amountWithdraw
    )
    handleCompleteLoan(newCompleteLoanEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CompleteLoan created and stored", () => {
    assert.entityCount("CompleteLoan", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CompleteLoan",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "slot",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CompleteLoan",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "successfull",
      "boolean Not implemented"
    )
    assert.fieldEquals(
      "CompleteLoan",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amountWithdraw",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
