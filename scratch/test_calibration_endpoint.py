import urllib.request
import json
import base64
import cv2
import numpy as np

print("Testing face calibration endpoint /api/v1/calibrate-face...")

test_img = np.full((300, 300, 3), 160, dtype=np.uint8)
cv2.ellipse(test_img, (150, 150), (60, 85), 0, 0, 360, (140, 170, 210), -1)
_, buf = cv2.imencode('.jpg', test_img)
b64_img = base64.b64encode(buf).decode('utf-8')

payload = json.dumps({"image": f"data:image/jpeg;base64,{b64_img}", "gender": "Male"}).encode('utf-8')

req = urllib.request.Request('http://127.0.0.1:5000/api/v1/calibrate-face', data=payload, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print("[SUCCESS] /api/v1/calibrate-face response:", data)
except Exception as e:
    print("Error calling /api/v1/calibrate-face:", e)
