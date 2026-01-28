# 🎤 Interview Cheat Sheet: DataQuarantine

## 1. The Elevator Pitch (2 Minutes)

"DataQuarantine is a **Streaming Quality Gateway** that sits between data producers and downstream analytics.

In most pipelines, bad data (like a missing 'user_id' or a string in a number field) crashes the consumer or corrupts the Data Lake.
I solved this by implementing the **Dead Letter Queue (DLQ) Pattern**:
1.  **Validate**: A Python engine intercepts every Kafka message in real-time.
2.  **Separate**: Valid data goes to the 'Clean' topic. Invalid data is routed to a 'Quarantine' topic.
3.  **Observability**: I built a Next.js Dashboard to inspect, fix, and replay the bad data.

This ensures the analytics team only ever sees clean, trusted data."

---

## 2. "Explain Like I'm 5" (The Airport Security)

"Think of it like Airport Security (TSA).
*   **The Passengers** are the Data Messages.
*   **The Plane** is the Database.
*   **The Problem**: If a passenger brings a bomb (Bad Data), the plane crashes.
*   **My Solution**: I put a Security Checkpoint (Validator) before the gate.
    *   Good passengers go to the gate.
    *   Bad passengers (Liquids, Weapons) are pulled aside to a separate room (Quarantine).
    *   They don't stop the line. The line keeps moving fast."

---

## 3. Tough Technical Questions

### Q: Why Kafka? Why not just validate in the API?
**A:** "Validating in the ingestion API (Synchronous) adds latency to the client. If schema validation takes 50ms, the user waits 50ms. By using Kafka (Asynchronous), the API accepts the data instantly, and we validate it in the background. It also decouples the producers from the validation logic—I can update the schema without redeploying the API."

### Q: How do you handle Schema Evolution?
**A:** "I support **Semantic Versioning** for schemas.
*   **Backward Compatibility**: Adding a new optional field is fine.
*   **Breaking Changes**: If a field is renamed, we deploy a new Consumer Group that handles Schema V2, while the old consumer drains the V1 messages. The system tags every message with a `schema_version` header to know which validation logic to apply."

### Q: Why use MinIO *and* Postgres?
**A:** "This is the **Claim Check Pattern**. Kafka and Postgres are bad at storing large blobs (like 1MB JSON payloads). It slows them down. So, I store the fat payload in MinIO (Object Storage), and I only store the *reference* (the Claim Check) and metadata in Postgres. This keeps my database indexes small and fast."
