from fastapi import FastAPI
import uvicorn
import asyncio
from contextlib import asynccontextmanager
from dataquarantine.kafka_consumer import consume_loop

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Run consumer in background
    task = asyncio.create_task(consume_loop())
    yield
    # Shutdown logic if needed

app = FastAPI(lifespan=lifespan)

@app.get("/health")
def health():
    return {"status": "ok", "service": "data-quarantine"}

@app.get("/metrics")
def metrics():
    # In a real app, return Prometheus metrics here
    return {"status": "collecting"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
