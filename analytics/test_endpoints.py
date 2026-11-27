import http.client
import json

def test_health():
    """Test GET /health endpoint."""
    conn = http.client.HTTPConnection("localhost", 8000)
    conn.request("GET", "/health")
    resp = conn.getresponse()
    body = resp.read().decode()
    print(f"GET /health: Status {resp.status}")
    print(f"Response: {body}")
    try:
        data = json.loads(body)
        assert data["status"] == "ok", f"Expected status 'ok', got '{data['status']}'"
        assert data["service"] == "fincore-analytics", f"Expected service 'fincore-analytics', got '{data['service']}'"
        print("  ✅ PASS")
        return True
    except (AssertionError, json.JSONDecodeError) as e:
        print(f"  ❌ FAIL: {e}")
        return False
    finally:
        conn.close()

def test_calculate_interest_valid():
    """Test POST /calculate-interest with valid input."""
    conn = http.client.HTTPConnection("localhost", 8000)
    body = json.dumps({"principal": 1000, "rate": 5, "years": 1})
    conn.request("POST", "/calculate-interest", body, {"Content-Type": "application/json"})
    resp = conn.getresponse()
    data = json.loads(resp.read().decode())
    print(f"POST /calculate-interest (valid): Status {resp.status}")
    print(f"Response: {json.dumps(data)}")
    try:
        assert data["principal"] == 1000, f"Expected principal 1000, got {data.get('principal')}"
        assert data["rate_percent"] == 5, f"Expected rate 5, got {data.get('rate_percent')}"
        assert "interest" in data, f"Expected 'interest' key"
        assert "total" in data, f"Expected 'total' key"
        print("  ✅ PASS")
        return True
    except (AssertionError, KeyError) as e:
        print(f"  ❌ FAIL: {e}")
        return False
    finally:
        conn.close()

def test_calculate_interest_invalid_rate():
    """Test POST /calculate-interest with rate > 25% (should get 422)."""
    conn = http.client.HTTPConnection("localhost", 8000)
    body = json.dumps({"principal": 1000, "rate": 30, "years": 1})
    conn.request("POST", "/calculate-interest", body, {"Content-Type": "application/json"})
    resp = conn.getresponse()
    data = json.loads(resp.read().decode())
    print(f"POST /calculate-interest (invalid rate): Status {resp.status}")
    print(f"Response: {json.dumps(data)}")
    try:
        assert resp.status == 422, f"Expected 422, got {resp.status}"
        print("  ✅ PASS (validation rejected rate > 25%)")
        return True
    except (AssertionError, json.JSONDecodeError) as e:
        print(f"  ❌ FAIL: {e}")
        return False
    finally:
        conn.close()

def test_validate_transaction_valid():
    """Test POST /validate-transaction with valid data."""
    conn = http.client.HTTPConnection("localhost", 8000)
    body = json.dumps({"account_id": "A1", "amount": 100, "currency": "USD"})
    conn.request("POST", "/validate-transaction", body, {"Content-Type": "application/json"})
    resp = conn.getresponse()
    data = json.loads(resp.read().decode())
    print(f"POST /validate-transaction (valid): Status {resp.status}")
    print(f"Response: {json.dumps(data)}")
    try:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        assert data["valid"] == True, f"Expected valid=True, got {data.get('valid')}"
        print("  ✅ PASS")
        return True
    except (AssertionError, json.JSONDecodeError, KeyError) as e:
        print(f"  ❌ FAIL: {e}")
        return False
    finally:
        conn.close()

def test_validate_transaction_invalid():
    """Test POST /validate-transaction with invalid currency (should get 422)."""
    conn = http.client.HTTPConnection("localhost", 8000)
    body = json.dumps({"account_id": "A1", "amount": 100, "currency": "JPY"})
    conn.request("POST", "/validate-transaction", body, {"Content-Type": "application/json"})
    resp = conn.getresponse()
    data = json.loads(resp.read().decode())
    print(f"POST /validate-transaction (invalid currency): Status {resp.status}")
    print(f"Response: {json.dumps(data)}")
    try:
        assert resp.status == 422, f"Expected 422, got {resp.status}"
        print("  ✅ PASS (validation rejected invalid currency)")
        return True
    except (AssertionError, json.JSONDecodeError) as e:
        print(f"  ❌ FAIL: {e}")
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 50)
    print("FinCore Analytics Service - Endpoint Verification")
    print("=" * 50)
    
    results = []
    results.append(("GET /health", test_health()))
    results.append(("POST /calculate-interest (valid)", test_calculate_interest_valid()))
    results.append(("POST /calculate-interest (invalid rate)", test_calculate_interest_invalid_rate()))
    results.append(("POST /validate-transaction (valid)", test_validate_transaction_valid()))
    results.append(("POST /validate-transaction (invalid currency)", test_validate_transaction_invalid()))
    
    print("=" * 50)
    print("SUMMARY")
    print("=" * 50)
    passed = sum(1 for _, r in results if r)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status}: {name}")
    
    if passed == total:
        print("\nAll tests passed!")
    else:
        print("\nSome tests failed - check the output above for details.")