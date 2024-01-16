import { Address, BigInt } from '@graphprotocol/graph-ts'
import { ERC721} from '../../generated/EventEmitter/ERC721'


export function fetchTokenName(tokenAddress: Address): string {
    let contract = ERC721.bind(tokenAddress)
    let name = contract.try_name().value
    return name
}

export function fetchTokenSymbol(tokenAddress: Address): string {
    let contract = ERC721.bind(tokenAddress)
    let symbol = contract.try_symbol().value
    return  symbol
}



export function fetchUri(tokenAddress: Address, tokenId: BigInt): string {
    let contract = ERC721.bind(tokenAddress)
    let uri = contract.try_tokenURI(tokenId).value
    return uri
}



