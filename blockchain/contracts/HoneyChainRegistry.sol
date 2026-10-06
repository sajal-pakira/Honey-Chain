// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract HoneyChainRegistry is AccessControl {
    bytes32 public constant RECORDER_ROLE =
        keccak256("RECORDER_ROLE");

    struct Batch {
        string batchCode;
        bytes32 proofHash;
        string hiveId;
        uint256 harvestDate;
        uint256 harvestedWeightGrams;
        bool exists;
    }

    struct SupplyChainEvent {
        string eventType;
        string location;
        uint256 timestamp;
        bytes32 eventHash;
    }

    mapping(bytes32 => Batch) private batches;

    mapping(bytes32 => SupplyChainEvent[])
        private batchEvents;

    event BatchRegistered(
        bytes32 indexed batchId,
        string batchCode,
        bytes32 proofHash,
        string hiveId
    );

    event SupplyChainEventRecorded(
        bytes32 indexed batchId,
        string eventType,
        string location,
        uint256 timestamp,
        bytes32 eventHash
    );

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(RECORDER_ROLE, admin);
    }

    function registerBatch(
        bytes32 batchId,
        string calldata batchCode,
        bytes32 proofHash,
        string calldata hiveId,
        uint256 harvestDate,
        uint256 harvestedWeightGrams
    ) external onlyRole(RECORDER_ROLE) {
        require(
            !batches[batchId].exists,
            "Batch already registered"
        );

        batches[batchId] = Batch({
            batchCode: batchCode,
            proofHash: proofHash,
            hiveId: hiveId,
            harvestDate: harvestDate,
            harvestedWeightGrams: harvestedWeightGrams,
            exists: true
        });

        emit BatchRegistered(
            batchId,
            batchCode,
            proofHash,
            hiveId
        );
    }

    function recordSupplyChainEvent(
        bytes32 batchId,
        string calldata eventType,
        string calldata location,
        uint256 timestamp,
        bytes32 eventHash
    ) external onlyRole(RECORDER_ROLE) {
        require(
            batches[batchId].exists,
            "Batch not registered"
        );

        batchEvents[batchId].push(
            SupplyChainEvent({
                eventType: eventType,
                location: location,
                timestamp: timestamp,
                eventHash: eventHash
            })
        );

        emit SupplyChainEventRecorded(
            batchId,
            eventType,
            location,
            timestamp,
            eventHash
        );
    }

    function getBatch(
        bytes32 batchId
    ) external view returns (Batch memory) {
        require(
            batches[batchId].exists,
            "Batch not found"
        );

        return batches[batchId];
    }

    function getBatchEvents(
        bytes32 batchId
    )
        external
        view
        returns (SupplyChainEvent[] memory)
    {
        require(
            batches[batchId].exists,
            "Batch not found"
        );

        return batchEvents[batchId];
    }

    function verifyBatch(
        bytes32 batchId,
        bytes32 proofHash
    ) external view returns (bool) {
        if (!batches[batchId].exists) {
            return false;
        }

        return batches[batchId].proofHash == proofHash;
    }
}