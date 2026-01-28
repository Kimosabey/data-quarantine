import os

# Mock storage functions for the portfolio demo
# In production, this would connect to Postgres (psycopg2) and MinIO (boto3)

def store_metadata(payload, status):
    # print(f"[DB] Storing metadata: {status}")
    pass

def store_quarantine_payload(payload, error):
    # print(f"[MinIO] Offloading payload to object storage")
    pass
