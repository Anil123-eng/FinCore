@echo off
set PYTHONPATH=D:\FinCore\analytics
python -c "
import sys
sys.path.insert(0, r'D:\FinCore\analytics')
from src.main import app
import uvicorn
import threading
import time
import http.client
import json

# Start server in background thread
t = threading.Thread(target=uvicorn.run, args=(app, {'host': '127.0.0.1', 'port': 8888}), daemon=True)
t.start()
time.sleep(2)

results = []

# Test 1: GET /health
try:
    conn = http.client.HTTPConnection('127.0.0.1', 8888)
    conn.request('GET', '/health')
    resp = conn.getresponse()
    data = json.loads(resp.read().decode())
    results.append(('GET /health', resp.status, data.get('status'), data.get('service')))
    conn.close()
    print(f'GET /health: {resp.status} - status={data.get(\"status\")}, service={data.get(\"service\")}')
except Exception as e:
    results.append(('GET /health', 'ERROR', str(e)))
    print(f'GET /health: ERROR - {e}')

# Test 2: POST /calculate-interest with valid data
try:
    conn = http.client.HTTPConnection('127.0.0.1', 8888)
    body = json.dumps({'principal': 1000, 'rate': 5, 'years': 1})
    conn.request('POST', '/calculate-interest', body, {'Content-Type': 'application/json'})
    resp = conn.getresponse()
    data = json.loads(resp.read().decode())
    results.append(('POST /calculate-interest valid', resp.status, data.get('principal'), data.get('interest')))
    conn.close()
    print(f'POST /calculate-interest valid: {resp.status} - principal={data.get(\"principal\")}, interest={data.get(\"interest\")}')
except Exception as e:
    results.append(('POST /calculate-interest valid', 'ERROR', str(e)))
    print(f'POST /calculate-interest valid: ERROR - {e}')

# Test 3: POST /calculate-interest with invalid rate (>25%)
try:
    conn = http.client.HTTPConnection('127.0.0.1', 8888)
    body = json.dumps({'principal': 1000, 'rate': 30, 'years': 1})
    conn.request('POST', '/calculate-interest', body, {'Content-Type': 'application/json'})
    resp = conn.getresponse()
    data = json.loads(resp.read().decode())
    results.append(('POST /calculate-interest invalid rate', resp.status, resp.status == 422))
    conn.close()
    print(f'POST /calculate-interest invalid rate: {resp.status} - 422={resp.status == 422}')
except Exception as e:
    results.append(('POST /calculate-interest invalid rate', 'ERROR', str(e)))
    print(f'POST /calculate-interest invalid rate: ERROR - {e}')

# Test 4: POST /validate-transaction with valid data
try:
    conn = http.client.HTTPConnection('127.0.0.1', 8888)
    body = json.dumps({'account_id': 'A1', 'amount': 100, 'currency': 'USD'})
    conn.request('POST', '/validate-transaction', body, {'Content-Type': 'application/json'})
    resp = conn.getresponse()
    data = json.loads(resp.read().decode())
    results.append(('POST /validate-transaction valid', resp.status, data.get('valid')))
    conn.close()
    print(f'POST /validate-transaction valid: {resp.status} - valid={data.get(\"valid\")}')
except Exception as e:
    results.append(('POST /validate-transaction valid', 'ERROR', str(e)))
    print(f'POST /validate-transaction valid: ERROR - {e}')

# Test 5: POST /validate-transaction with invalid currency
try:
    conn = http.client.HTTPConnection('127.0.0.1', 8888)
    body = json.dumps({'account_id': 'A1', 'amount': 100, 'currency': 'JPY'})
    conn.request('POST', '/validate-transaction', body, {'Content-Type': 'application/json'})
    resp = conn.getresponse()
    data = json.loads(resp.read().decode())
    results.append(('POST /validate-transaction invalid currency', resp.status, resp.status == 422))
    conn.close()
    print(f'POST /validate-transaction invalid currency: {resp.status} - 422={resp.status == 422}')
except Exception as e:
    results.append(('POST /validate-transaction invalid currency', 'ERROR', str(e)))
    print(f'POST /validate-transaction invalid currency: ERROR - {e}')

print()
print('=' * 50)
print('SUMMARY')
print('=' * 50)
for name, status, *args in results:
    if isinstance(args[0], bool):
        print(f'  {name}: status={status}, 422={args[0]}')
    else:
        print(f'  {name}: status={status}, {args[0]} {args[1] if len(args) > 1 else \"\"}')

# Kill the server
import os
os._exit(0)
"