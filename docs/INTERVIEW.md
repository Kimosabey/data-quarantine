# DataQuarantine - Interview Guide

**Project**: DataQuarantine  
**Type**: Streaming Schema Enforcer & Data Quality Gateway  
**Author**: Harshan Aiyappa

---

## 🎯 Project Overview Questions

### Q1: What is DataQuarantine and what problem does it solve?

**Answer:**

DataQuarantine is a production-ready streaming schema enforcement system that validates, quarantines, and monitors data quality in real-time streaming pipelines.

**The Business Problem:**
In production streaming pipelines:
- **Bad data corrupts downstream systems** → Analytics dashboards show wrong metrics, ML models train on garbage data
- **Schema violations go undetected** → Failures happen far downstream, debugging is painful
- **No centralized data quality governance** → Each team builds their own validation (inconsistent)
- **Invalid data gets lost** → No audit trail for compliance

**The Solution:**
A **real-time validation gateway** that:
1. Validates every message against a schema (JSON Schema, Avro)
2. Routes valid messages to clean topics
3. Quarantines invalid messages to DLQ (Dead Letter Queue)
4. Stores invalid records in MinIO for analysis
5. Logs metadata in PostgreSQL for queries
6. Provides real-time metrics and alerting
7. Enables reprocessing after fixes

**Business Impact:**
- ✅ Prevents bad data from reaching production systems
- ✅ Reduces debugging time from hours to minutes
- ✅ Provides compliance audit trail
- ✅ Enables safe schema evolution

---

## 🏗️ Architecture Questions

### Q2: Walk me through the system architecture

**Answer:**

**6-Layer Architecture:**

**1. Data Sources** → Mobile apps, web APIs, IoT devices

**2. Kafka Message Queue** → 3 topics:
   - `raw-events` (unvalidated)
   - `validated-events` (clean)
   - `quarantine-dlq` (invalid)

**3. Validator Engine** → Python service:
   - Consumes from `raw-events`
   - Validates against schema
   - Routes to appropriate topic
   - Commits offset (zero data loss)

**4. Storage Layer:**
   - PostgreSQL → Metadata (fast queries, ACID)
   - MinIO → Full payloads (S3-compatible, cheap)

**5. Monitoring Stack:**
   - Prometheus → Metrics collection
   - Grafana → Dashboards and alerts

**6. Frontend** → Next.js dashboard:
   - Real-time metrics
   - Quarantine browser
   - Live monitoring

**Key Design Decisions:**
- **Kafka** for durability and replay
- **Dual storage** (Postgres + MinIO) for flexibility
- **Manual offset commit** for zero data loss
- **Next.js UI** for modern developer experience

---

### Q3: Explain the data flow for a valid vs invalid message

**Answer:**

**Happy Path (Valid Message):**
```
Producer → raw-events topic
         → Validator consumes
         → Fetches schema from registry
         → Validation passes ✅
         → Publishes to validated-events
         → Commits Kafka offset
         → Downstream consumers process
```
**Time:** ~5-10ms  
**Result:** Clean data flows to analytics/ML

**Unhappy Path (Invalid Message):**
```
Producer → raw-events topic
         → Validator consumes
         → Validation fails ❌ (e.g., missing field)
         → Publishes to quarantine-dlq topic
         → Stores full payload in MinIO
         → Logs metadata in PostgreSQL:
             - Error type: "MISSING_FIELD"
             - Field: "user_id"
             - Timestamp: "2026-01-10T19:50:00Z"
         → Commits Kafka offset
         → UI shows quarantined record
         → Data engineer reviews → Fixes → Reprocesses
```
**Time:** ~15-20ms (extra storage writes)  
**Result:** Bad data quarantined, not lost, reviewable

**Key Point:** Both paths commit the offset → **zero data loss** even on errors

---

## 🧠 Validation & Schema Questions

### Q4: How does schema validation work?

**Answer:**

**Multi-Layer Validation:**

**Layer 1: Structural Validation (JSON Schema)**
```json
{
  "type": "object",
  "properties": {
    "user_id": { "type": "string", "pattern": "^USER[0-9]{6}$" },
    "event_type": { "type": "string", "enum": ["view", "click", "purchase"] },
    "timestamp": { "type": "string", "format": "date-time" }
  },
  "required": ["user_id", "event_type", "timestamp"]
}
```

**Layer 2: Type Validation (Pydantic)**
```python
class UserEvent(BaseModel):
    user_id: str
    event_type: Literal["view", "click", "purchase"]
    timestamp: datetime
```

**Layer 3: Custom Business Rules**
```yaml
rules:
  - name: "future_timestamp_check"
    expression: "timestamp <= now()"
    error: "Timestamp cannot be in future"
```

**Validation Flow in Code:**
```python
def validate_message(msg):
    # 1. Parse JSON
    data = json.loads(msg.value)
    
    # 2. Validate schema
    validate(data, schema)  # raises ValidationError
    
    # 3. Validate with Pydantic
    event = UserEvent(**data)  # raises ValidationError
    
    # 4. Custom rules
    if not all_rules_pass(event):
        raise BusinessRuleError
    
    return ValidationResult(valid=True)
```

---

### Q5: How do you handle schema evolution without breaking production?

**Answer:**

**Schema Versioning Strategy:**

**1. Semantic Versioning**
```
user_event_v1.0.0 → Initial schema
user_event_v1.1.0 → Add optional field (backward compatible)
user_event_v2.0.0 → Remove field (breaking change)
```

**2. Compatibility Checks**
Before deploying a new schema:
```python
def check_compatibility(old_schema, new_schema):
    # Backward compatible: Can read old data with new schema
    # Forward compatible: Can read new data with old schema
    return compatibility_checker.compare(old, new)
```

**3. Gradual Rollout**
```
Day 1-7: Deploy v2 schema to registry (don't enforce)
Day 8: Start sending v2 data (producers updated)
Day 9: Enable v2 validation (consumers updated)
Day 15: Deprecate v1
```

**4. Fallback Mechanism**
If validation fails with v2, try v1:
```python
for schema_version in [v2, v1]:
    try:
        validate(msg, schema_version)
        return  # Success
    except ValidationError:
        continue
# All versions failed → quarantine
```

**Benefits:**
- ✅ No downtime during schema changes
- ✅ Safe rollback if issues arise
- ✅ Clear audit trail of schema changes

---

## ⚙️ Technical Implementation Questions

### Q6: How do you ensure zero data loss?

**Answer:**

**Strategy: Manual Offset Commit with Transactional Processing**

**The Problem:**
Auto-commit can lose data if consumer crashes after committing but before processing.

**The Solution:**
```python
# Configure consumer
consumer = KafkaConsumer(
    enable_auto_commit=False,  # ← Key setting
    max_poll_records=100
)

for message in consumer:
    try:
        # 1. Validate
        result = validate(message)
        
        # 2. Route
        if result.valid:
            producer.send("validated-events", message)
        else:
            producer.send("quarantine-dlq", message)
            minio_client.put(message)
            db.insert_metadata(message)
        
        # 3. Wait for all writes to complete
        producer.flush()
        
        # 4. ONLY NOW commit the offset
        consumer.commit()
        
    except Exception as e:
        # DON'T commit → Kafka will redeliver
        logger.error(f"Processing failed: {e}")
        # Optional: backoff and retry
```

**Guarantees:**
- ✅ Message processed **at least once**
- ✅ No data loss even on crashes
- ⚠️ Possible duplicates (must handle idempotency)

**Idempotency Handling:**
```python
# Use message ID as deduplication key
db.execute("""
    INSERT INTO quarantine (message_id, payload)
    VALUES (%s, %s)
    ON CONFLICT (message_id) DO NOTHING
""")
```

---

### Q7: How does the system handle failures (Kafka, Postgres, MinIO)?

**Answer:**

**Failure Scenarios & Mitigations:**

**1. Kafka Broker Failure**
- **Mitigation**: Kafka replication (3 replicas, min in-sync = 2)
- **Config**: `acks=all` (wait for all replicas)
- **Result**: No data loss, ~5s downtime during leader election

**2. PostgreSQL Failure**
- **Strategy**: Fail-open with degraded mode
- **Action**:
  ```python
  try:
      db.insert_metadata(record)
  except DatabaseError:
      # Fallback: log to local file
      logger.warning("DB down, using file backup")
      with open("backup.jsonl", "a") as f:
          f.write(json.dumps(record) + "\n")
  ```
- **Recovery**: Background job syncs file → DB when DB recovers
- **Result**: Pipeline continues, metadata delayed

**3. MinIO Failure**
- **Strategy**: Local disk fallback
- **Action**:
  ```python
  try:
      minio.put_object("quarantine", key, data)
  except MinioError:
      local_path = f"/tmp/quarantine/{key}"
      with open(local_path, "wb") as f:
          f.write(data)
      # Background sync later
  ```
- **Result**: No data loss, stored locally temporarily

**4. Validator Service Crash**
- **Strategy**: Kafka consumer groups
- **Setup**: 3 validators in same consumer group
- **Result**: Another validator takes over partitions (~30s failover)

**5. High Error Rate (DDoS or Schema Issue)**
- **Strategy**: Circuit breaker
- **Logic**:
  ```python
  if error_rate > 50% for 5 minutes:
      pause_processing()
      send_alert("Critical: 50% error rate")
      # Requires manual investigation
  ```
- **Result**: Prevents cascading failures

---

## 📊 Monitoring & observability Questions

### Q8: What metrics do you track and why?

**Answer:**

**Key Metrics:**

**1. Validation Success Rate**
```promql
rate(records_valid_total[5m]) / 
rate(records_processed_total[5m])
```
**Why:** Core health indicator. Drop below 95% = investigate

**2. Quarantine Rate by Error Type**
```promql
sum by (error_type) (records_invalid_total)
```
**Why:** Identify root cause (e.g., sudden spike in "MISSING_FIELD" → upstream bug)

**3. Processing Latency (p50, p95, p99)**
```promql
histogram_quantile(0.99, validation_duration_seconds)
```
**Why:** Ensure SLA (target: p99 < 50ms)

**4. Kafka Consumer Lag**
```promql
kafka_lag{topic="raw-events", partition="0"}
```
**Why:** Lag > 10k messages = need to scale consumers

**5. Database Connection Pool**
```promql
postgres_pool_active_connections / postgres_pool_max_connections
```
**Why:** > 80% = potential bottleneck

**Grafana Dashboard Panels:**
- Time-series graph: Validation rate over time
- Pie chart: Error distribution
- Heatmap: Latency percentiles
- Gauge: Current consumer lag

---

### Q9: How would you scale this system to handle 1M messages/second?

**Answer:**

**Current Bottlenecks (at ~10k msg/sec):**
1. Single validator instance
2. PostgreSQL write throughput
3. Kafka partition count

**Scaling Plan:**

**Phase 1: Horizontal Scaling (10k → 100k msg/sec)**
- **Kafka**: Increase partitions (10 → 100)
- **Validators**: Deploy 100 instances (Kubernetes HPA)
- **PostgreSQL**: Add read replicas, partition tables by date
- **Cost**: ~$500/month (AWS)

**Phase 2: Optimize Hot Path (100k → 500k msg/sec)**
- **Batch Processing**: Validate 100 msgs at once (reduce overhead)
- **Async I/O**: Use `asyncio` for parallel DB/MinIO writes
- **Schema Caching**: Cache schemas in-memory (avoid registry lookups)
- **Code**:
  ```python
  async def process_batch(messages):
    results = await asyncio.gather(*[
        validate_async(msg) for msg in messages
    ])
    await bulk_insert_db(results)
  ```

**Phase 3: Rearchitecture (500k → 1M msg/sec)**
- **Stream Processing Framework**: Switch to Flink/Spark Streaming
- **Distributed Cache**: Redis for schema caching
- **Time-series DB**: ClickHouse for faster metadata queries
- **Object Storage**: S3 instead of MinIO (better throughput)

**Estimated Infrastructure (1M msg/sec):**
- Kafka: 20 brokers (3x replication)
- Validators: 500 pods (Kubernetes)
- PostgreSQL: Sharded across 10 instances
- Cost: ~$10k/month

---

## 💼 Resume Talking Points

**Key Achievements:**
- Built production-grade streaming data quality platform
- Implemented Dead Letter Queue pattern with zero data loss guarantee
- Designed dual-storage architecture (PostgreSQL + MinIO) for metadata and payloads
- Created real-time validation engine with Pydantic and JSON Schema
- Developed modern Next.js dashboard with glassmorphism design
- Achieved <50ms p99 validation latency at 10k msg/sec

**Technologies Demonstrated:**
- Streaming: Apache Kafka, event-driven architecture
- Backend: Python, FastAPI, Pydantic
- Databases: PostgreSQL, MinIO (S3-compatible)
- Monitoring: Prometheus, Grafana
- Frontend: Next.js 14, TypeScript, Framer Motion
- DevOps: Docker, Docker Compose

**Patterns & Practices:**
- Dead Letter Queue (DLQ) pattern
- Circuit breaker pattern
- Schema versioning strategies
- Zero data loss guarantees
- Observability-driven development

---

**Built with ❤️ by Harshan Aiyappa**
