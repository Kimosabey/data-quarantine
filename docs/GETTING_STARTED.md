# 🚀 Getting Started with DataQuarantine

> **Prerequisites**
> *   **Docker Desktop** (Engine + Compose)
> *   **PowerShell** (for automation scripts)
> *   **Python 3.11+** (for test scripts)

## 1. Environment Setup

The system relies on Docker to orchestrate 8 services (Kafka, Zookeeper, Postgres, MinIO, Validation Service, API, Dashboard, Grafana).

**Backend (`.env`)**
Configured automatically by `start.ps1`, but defaults are:
```ini
KAFKA_BROKER=localhost:9092
POSTGRES_URL=postgresql://user:pass@localhost:5432/quarantine
MINIO_ENDPOINT=localhost:9000
```

---

## 2. Installation & Launch (3 Commands)

We have a "One-Click" PowerShell automator.

```powershell
# 1. Start the Stack (Approx 90 seconds for first run)
.\start.ps1
```

**What this does:**
1.  Starts all Docker containers.
2.  Waits for Kafka & Postgres health checks.
3.  Creates required Topics (`raw-events`, `dlq`) and Buckets.
4.  Launches the Next.js Dashboard.

### Manual Launch (Validation)
If you prefer not to use the script:
```bash
docker-compose up -d
# Wait 30s
docker logs -f dataquarantine-api
```

---

## 3. Usage Guide

### A. Access Interfaces
| Service | URL | Credentials |
| :--- | :--- | :--- |
| **Dashboard** | `http://localhost:3000` | - |
| **Kafka UI** | `http://localhost:8090` | - |
| **Grafana** | `http://localhost:3001` | `admin` / `admin` |
| **MinIO** | `http://localhost:9001` | `minioadmin` / `minioadmin` |

### B. Simulate Traffic
To see the Quarantine in action, we need to send mixed traffic (Good & Bad).

```bash
# In a new terminal
python scripts/simulate_traffic.py
```
*   **Green Log**: Valid message sent.
*   **Red Log**: Invalid message (Missing Schema Field) sent.

### C. Verify in Dashboard
1.  Go to `http://localhost:3000`.
2.  Check the **"Quarantine Rate"** chart (should trigger).
3.  Go to **"Quarantine Browser"** tab.
4.  Click a red row to see the **JSON Diff** (Expected vs Received).

---

## 4. Running Tests

### Unit Tests (Python)
```bash
# Inside the container or venv
pytest
```

### End-to-End Validation
```bash
python scripts/test_validation.py
# Sends 7 specific payloads covering all error types (Schema, Type, Business Rule)
```
