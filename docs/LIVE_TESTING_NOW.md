# ✅ YOUR LIVE TESTING CHECKLIST
**Date**: December 28, 2025 22:40 IST  
**Status**: 🔴 SIMULATION RUNNING NOW!

---

## 🎯 **WHAT TO DO RIGHT NOW:**

### ✅ **Step 1: Simulation is Running**
The simulation is generating ~10 messages/second for 30 seconds (~300 total messages).

---

### 📊 **Step 2: Open These in Your Browser (Do This Now!)**

Open 6 browser tabs:

**Tab 1: Next.js Dashboard**
- URL: http://localhost:3000
- What to see: Animated dashboard with metrics

**Tab 2: Kafka UI**
- URL: http://localhost:8090
- Click: **Topics** → **raw-events** → **Messages**
- Watch: Messages appearing in real-time!

**Tab 3: Prometheus**
- URL: http://localhost:9090
- Click: **Graph** tab
- Query: `dataquarantine_records_processed_total`
- Click: **Execute**
- Watch: Numbers increasing!

**Tab 4: Grafana** (Set up later)
- URL: http://localhost:3001
- Login: admin / admin

**Tab 5: MinIO**
- URL: http://localhost:9001
- Login: minioadmin / minioadmin

**Tab 6: Kafka UI - Validated Messages**
- URL: http://localhost:8090
- Click: **Topics** → **validated-events** → **Messages**

---

## 📝 **Step 3: Open DBeaver (Do This Now!)**

### **Connect to PostgreSQL**:
1. Open DBeaver
2. New Connection → PostgreSQL
3. Host: `localhost`
4. Port: `5432`
5. Database: `dataquarantine`
6. Username: `quarantine_user`
7. Password: `quarantine_pass`
8. Test Connection → Finish

### **Run This Query** (Keep refreshing every 10 seconds):
```sql
SELECT COUNT(*) as total_quarantined FROM quarantine_records;
```

✅ **You should see the count INCREASING as simulation runs!**

---

## 🔍 **Step 4: Check Each Service (While Simulation Runs)**

### **1. Kafka UI** (http://localhost:8090)
- [ ] Go to **Topics**
- [ ] Click **raw-events**
- [ ] See messages appearing
- [ ] Note the total message count

### **2. Next.js Dashboard** (http://localhost:3000)
- [ ] Dashboard loads with animations
- [ ] 4 stat cards visible
- [ ] Charts display

### **3. Prometheus** (http://localhost:9090)
- [ ] Graph tab open
- [ ] Query works
- [ ] Numbers show data

---

## ⏱️ **Step 5: After 30 Seconds (Simulation Stops)**

Press **Ctrl+C** in the simulation terminal when you see:
```
[00300] ...
```

Then run these verification queries:

### **DBeaver Queries**:

**Query 1: Count Records**
```sql
SELECT COUNT(*) FROM quarantine_records;
```
✅ Expected: ~75 records (25% of 300 messages)

**Query 2: Latest 10 Records**
```sql
SELECT 
    error_type,
    error_message,
    created_at
FROM quarantine_records
ORDER BY created_at DESC
LIMIT 10;
```
✅ Expected: See different error types

**Query 3: Error Distribution**
```sql
SELECT 
    error_type,
    COUNT(*) as count
FROM quarantine_records
GROUP BY error_type
ORDER BY count DESC;
```
✅ Expected: 7 different error types

---

## 📋 **Step 6: Verification Checklist**

Run through this after simulation completes:

### **Kafka UI** (http://localhost:8090)
- [ ] `raw-events` has ~300 messages
- [ ] `validated-events` has ~225 messages (75%)
- [ ] `quarantine-dlq` has ~75 messages (25%)
- [ ] Consumer lag is 0

### **PostgreSQL/DBeaver**
- [ ] `quarantine_records` table has ~75 rows
- [ ] 7 different error types visible
- [ ] Timestamps are recent (last few minutes)

### **Prometheus** (http://localhost:9090)
Queries to run:
```promql
# Total processed
dataquarantine_records_processed_total

# Valid records
dataquarantine_records_valid_total

# Invalid records
dataquarantine_records_invalid_total

# Success rate
(dataquarantine_records_valid_total / dataquarantine_records_processed_total) * 100
```
- [ ] All queries return data
- [ ] Success rate is ~75%

### **Grafana** (http://localhost:3001)
- [ ] Login works (admin/admin)
- [ ] Can add Prometheus data source
- [ ] URL: `http://prometheus:9090`
- [ ] "Data source is working" message appears

### **Next.js Dashboard** (http://localhost:3000)
- [ ] Dashboard page loads
- [ ] Animated cards display
- [ ] Can click "Quarantine" in sidebar
- [ ] Quarantine page shows records

---

## 🎬 **Step 7: Take Screenshots!**

Take screenshots of:
1. ✅ Kafka UI showing 3 topics with! message counts
2. ✅ DBeaver SQL results (error distribution)
3. ✅ Prometheus metrics query
4. ✅ Next.js Dashboard
5. ✅ Grafana dashboard (if you create one)

---

## ❓ **If Something Doesn't Work**

### **No messages in Kafka?**
```powershell
docker logs dataquarantine-api --tail 50
```

### **No records in PostgreSQL?**
Check API logs for database errors:
```powershell
docker logs dataquarantine-api | findstr "database"
```

### **Prometheus shows no data?**
Check if metrics are being collected:
```powershell
curl http://localhost:8080/metrics
```

---

## ✅ **SUCCESS CRITERIA**

You're successful if:
- ✅ Simulation sent 300 messages
- ✅ Kafka shows all 3 topics with messages
- ✅ PostgreSQL has quarantine records
- ✅ Prometheus shows metrics
- ✅ Next.js UI loads and displays data
- ✅ No errors in docker logs

---

**🎉 Once all checks pass, YOU'RE READY TO DEMO!**

---

## 📞 **NEXT: What to Test**

After this works, you can:
1. Create Grafana dashboards
2. Test MinIO storage
3. Practice your demo script
4. Take more screenshots for your portfolio

**For now, focus on the checklist above!** 🎯
