import {APIClient} from '../client'
import {UInt32} from '../../chain/integer'
import {Name, NameType} from '../../chain/name'
import {PackedTransaction, SignedTransaction, SignedTransactionType} from '../../chain/transaction'

import {
    AccountObject,
    GetAbiResponse,
    GetBlockResponse,
    GetInfoResponse,
    PushTransactionResponse,
} from './types'

export class ChainAPI {
    constructor(private client: APIClient) {}

    async get_abi(accountName: NameType) {
        return this.client.call<GetAbiResponse>({
            path: '/v1/chain/get_abi',
            params: {account_name: Name.from(accountName)},
        })
    }

    async get_account(accountName: NameType) {
        return this.client.call({
            path: '/v1/chain/get_account',
            params: {account_name: Name.from(accountName)},
            responseType: AccountObject,
        })
    }

    async get_block(block_num_or_id: string | number | UInt32) {
        return this.client.call({
            path: '/v1/chain/get_block',
            params: {block_num_or_id},
            responseType: GetBlockResponse,
        })
    }

    async get_currency_balance(contract: NameType, accountName: NameType, symbol?: string) {
        const params: any = {
            account: Name.from(accountName),
            code: Name.from(contract),
        }
        if (symbol) {
            params.symbol = symbol
        }
        return this.client.call({
            path: '/v1/chain/get_currency_balance',
            params,
            responseType: 'asset[]',
        })
    }

    async get_info() {
        return this.client.call({
            path: '/v1/chain/get_info',
            responseType: GetInfoResponse,
        })
    }

    async push_transaction(tx: SignedTransactionType | PackedTransaction) {
        if (!(tx instanceof PackedTransaction)) {
            tx = PackedTransaction.fromSigned(SignedTransaction.from(tx))
        }
        return this.client.call<PushTransactionResponse>({
            path: '/v1/chain/push_transaction',
            params: tx,
        })
    }
}
