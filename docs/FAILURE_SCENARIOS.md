# 🛡️ Failure Scenarios & Resilience

> "In a streaming pipeline, you cannot stop the flow for one bad message."

This document details how DataQuarantine guarantees system stability and Zero Data Loss.

## 1. Failure Matrix

| Component | Failure Mode | Impact | Recovery Strategy |
| :--- | :--- | :--- | :--- |
| **Kafka Broker** | Down/Unreachable | **Critical**. Pipeline stops. | **Buffering**. Producers buffer messages locally until buffer fills, then throw errors. Kafka Cluster (in prod) mitigates this via replication. |
| **PostgreSQL** | Database Down | **Major**. Cannot log metadata. | **Fail-Open (Degraded)**. Validator logs error to stdout but *does not crash*. Retries metadata insert or writes to backup log file. |
| **Validator** | Service Crash | **Critical**. Processing stops. | **Consumer Groups**. Kafka automatically rebalances partitions to remaining consumer instances. |
| **MinIO** | Write Error | **Major**. Cannot store payload. | **Local Fallback**. Write payload to local disk (`/tmp/quarantine`) and retry sync later. |

---

## 2. Deep Dive: Zero Data Loss Strategy

### The "Poison Pill" Problem
If a consumer crashes while processing a specific message, it might restart, read the same message, and crash again. This is an infinite boot loop.

### Our Solution: Safe Offset Commiting
1.  **Read** Message (Offset N).
2.  **Try** Processing.
3.  **Catch** specific exceptions (Schema Error, Business Error):
    *   **Route** to DLQ.
4.  **Catch** unexpected exceptions (System Error):
    *   **Do Not Commit**. Let Kafka redeliver after backoff.
5.  **Commit** Offset N only after successful routing (to Success or DLQ).

This ensures that "Bad Data" is handled as a logic flow, not a crash, while "System Errors" trigger retry.

---

## 3. Resilience Testing

### Test 1: Validator Crash
1.  Start the traffic simulator.
2.  Kill the validator container: `docker stop dataquarantine-validator`.
3.  Start a second validator instance (scale up).
4.  **Expectation**: New instance picks up from the exact last committed offset. No duplicates, no loss.

### Test 2: Database Outage
1.  Stop Postgres.
2.  Send invalid data.
3.  **Expectation**: Validator enters "Degraded Mode". Metrics show errors, but the Kafka Consumer **does not hang**.
