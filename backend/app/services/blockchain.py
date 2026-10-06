import os
from typing import Optional

from web3 import Web3
from web3.exceptions import ContractLogicError


SEPOLIA_RPC_URL = os.getenv("SEPOLIA_RPC_URL")
PRIVATE_KEY = os.getenv("SEPOLIA_PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("HONEYCHAIN_CONTRACT_ADDRESS")


if not SEPOLIA_RPC_URL:
    raise RuntimeError(
        "SEPOLIA_RPC_URL is not configured in backend/.env"
    )

if not PRIVATE_KEY:
    raise RuntimeError(
        "SEPOLIA_PRIVATE_KEY is not configured in backend/.env"
    )

if not CONTRACT_ADDRESS:
    raise RuntimeError(
        "HONEYCHAIN_CONTRACT_ADDRESS is not configured in backend/.env"
    )


w3 = Web3(Web3.HTTPProvider(SEPOLIA_RPC_URL))

if not w3.is_connected():
    raise RuntimeError(
        "Could not connect to Ethereum Sepolia RPC"
    )


CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "batchId",
                "type": "bytes32",
            },
            {
                "internalType": "string",
                "name": "batchCode",
                "type": "string",
            },
            {
                "internalType": "bytes32",
                "name": "proofHash",
                "type": "bytes32",
            },
            {
                "internalType": "string",
                "name": "hiveId",
                "type": "string",
            },
            {
                "internalType": "uint256",
                "name": "harvestDate",
                "type": "uint256",
            },
            {
                "internalType": "uint256",
                "name": "harvestedWeightGrams",
                "type": "uint256",
            },
        ],
        "name": "registerBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "batchId",
                "type": "bytes32",
            }
        ],
        "name": "getBatch",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "batchCode",
                        "type": "string",
                    },
                    {
                        "internalType": "bytes32",
                        "name": "proofHash",
                        "type": "bytes32",
                    },
                    {
                        "internalType": "string",
                        "name": "hiveId",
                        "type": "string",
                    },
                    {
                        "internalType": "uint256",
                        "name": "harvestDate",
                        "type": "uint256",
                    },
                    {
                        "internalType": "uint256",
                        "name": "harvestedWeightGrams",
                        "type": "uint256",
                    },
                    {
                        "internalType": "bool",
                        "name": "exists",
                        "type": "bool",
                    },
                ],
                "internalType": "struct HoneyChainRegistry.Batch",
                "name": "",
                "type": "tuple",
            }
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "batchId",
                "type": "bytes32",
            },
            {
                "internalType": "bytes32",
                "name": "proofHash",
                "type": "bytes32",
            },
        ],
        "name": "verifyBatch",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool",
            }
        ],
        "stateMutability": "view",
        "type": "function",
    },
]


contract = w3.eth.contract(
    address=Web3.to_checksum_address(CONTRACT_ADDRESS),
    abi=CONTRACT_ABI,
)


def _proof_to_bytes32(proof: str) -> bytes:
    proof = proof.removeprefix("0x")

    if len(proof) != 64:
        raise ValueError(
            "Blockchain proof must contain exactly 64 hexadecimal characters"
        )

    return bytes.fromhex(proof)


def register_batch_on_chain(
    batch_code: str,
    proof: str,
    hive_id: str,
    harvest_timestamp: int,
    harvested_weight_kg: float,
) -> str:
    account = w3.eth.account.from_key(PRIVATE_KEY)

    batch_id = Web3.keccak(text=batch_code)
    proof_hash = _proof_to_bytes32(proof)

    harvested_weight_grams = int(
        round(harvested_weight_kg * 1000)
    )

    nonce = w3.eth.get_transaction_count(
        account.address,
        "pending",
    )

    gas_price = w3.eth.gas_price

    transaction = contract.functions.registerBatch(
        batch_id,
        batch_code,
        proof_hash,
        hive_id,
        harvest_timestamp,
        harvested_weight_grams,
    ).build_transaction(
        {
            "from": account.address,
            "nonce": nonce,
            "chainId": 11155111,
            "gas": 500000,
            "gasPrice": gas_price,
        }
    )

    signed_transaction = w3.eth.account.sign_transaction(
        transaction,
        PRIVATE_KEY,
    )

    tx_hash = w3.eth.send_raw_transaction(
        signed_transaction.raw_transaction
    )

    receipt = w3.eth.wait_for_transaction_receipt(
        tx_hash
    )

    if receipt.status != 1:
        raise RuntimeError(
            "Blockchain transaction failed"
        )

    return tx_hash.hex()


def verify_batch_on_chain(
    batch_code: str,
    proof: str,
) -> bool:
    batch_id = Web3.keccak(text=batch_code)

    proof_hash = _proof_to_bytes32(proof)

    return contract.functions.verifyBatch(
        batch_id,
        proof_hash,
    ).call()