// snowFlakeIdGenerator.js

// Custom epoch: 2020-01-01
const EPOCH = 1577836800000n;

const MACHINE_ID_BITS = 10n;
const SEQUENCE_BITS = 12n;

const MAX_MACHINE_ID = (1n << MACHINE_ID_BITS) - 1n;
const MAX_SEQUENCE = (1n << SEQUENCE_BITS) - 1n;

const MACHINE_ID_SHIFT = SEQUENCE_BITS;
const TIMESTAMP_SHIFT = SEQUENCE_BITS + MACHINE_ID_BITS;

const machineId = 1n; // 0-1023

let lastTimestamp = -1n;
let sequence = 0n;

// The actual generate function
export default function generateSnowflakeId() {
    let currentTimestamp = BigInt(Date.now());

    if (currentTimestamp < lastTimestamp) {
        throw new Error("Clock moved backwards");
    }

    if (currentTimestamp === lastTimestamp) {
        sequence = (sequence + 1n) & MAX_SEQUENCE;
        if (sequence === 0n) {
            // wait for next millisecond
            while ((currentTimestamp = BigInt(Date.now())) <= lastTimestamp) {}
        }
    } else {
        sequence = 0n;
    }

    lastTimestamp = currentTimestamp;

    return ((currentTimestamp - EPOCH) << TIMESTAMP_SHIFT)
            | (machineId << MACHINE_ID_SHIFT)
            | sequence;
}
