import urllib.request
import json
import base64
import cv2
import numpy as np

print("Testing Flask video prediction endpoints on http://127.0.0.1:5000...")

# 1. Test /api/v1/predict-frame
test_img = np.full((300, 300, 3), 180, dtype=np.uint8)
cv2.ellipse(test_img, (150, 150), (60, 85), 0, 0, 360, (140, 170, 210), -1)
_, buf = cv2.imencode('.jpg', test_img)
b64_img = base64.b64encode(buf).decode('utf-8')

payload = json.dumps({"image": f"data:image/jpeg;base64,{b64_img}"}).encode('utf-8')

req = urllib.request.Request('http://127.0.0.1:5000/api/v1/predict-frame', data=payload, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print("[SUCCESS] /api/v1/predict-frame status:", data.get("success"))
        print("  Frame gender:", data.get("frame_gender"))
        print("  Faces detected:", data.get("faces_count"))
except Exception as e:
    print("Error calling /api/v1/predict-frame:", e)
