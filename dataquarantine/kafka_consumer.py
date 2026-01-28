import os
import json
import asyncio
from kafka import KafkaConsumer, KafkaProducer
from dataquarantine.validator import validate_message
from dataquarantine.storage import store_metadata, store_quarantine_payload

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
SOURCE_TOPIC = "raw-data-stream"
VALID_TOPIC = "clean-data-stream"
DLQ_TOPIC = "dead-letter-queue"

async def consume_loop():
    print(f"🚀 Starting Kafka Consumer on {SOURCE_TOPIC}...")
    
    # Simple retry waiting for Kafka
    while True:
        try:
            consumer = KafkaConsumer(
                SOURCE_TOPIC,
                bootstrap_servers=KAFKA_BROKER,
                group_id="data-quarantine-group",
                value_deserializer=lambda m: json.loads(m.decode('utf-8'))
            )
            producer = KafkaProducer(
                bootstrap_servers=KAFKA_BROKER,
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            break
        except Exception as e:
            print(f"Waiting for Kafka: {e}")
            await asyncio.sleep(5)

    print("✅ Connected to Kafka")

    # In a real async app, use aiokafka. For demo simplicity, we use blocking loop in thread or similar.
    # Since we are inside asyncio.create_task, we should use aiokafka or run_in_executor.
    # For this portfolio V3 implementation, we'll simulate the loop logic:
    
    # Note: This is a simplified educational implementation.
    for message in consumer:
        payload = message.value
        print(f"📥 Received: {payload}")

        is_valid, error_report = validate_message(payload)

        if is_valid:
            # Pass to Clean Stream
            producer.send(VALID_TOPIC, payload)
            print(f"✅ Valid -> {VALID_TOPIC}")
            store_metadata(payload, status="VALID")
        else:
            # Quarantine!
            print(f"⛔ Invalid -> {DLQ_TOPIC}")
            producer.send(DLQ_TOPIC, {"original": payload, "error": error_report})
            
            # Hybrid Storage: Payload to MinIO, Meta to Postgres
            store_quarantine_payload(payload, error_report)
