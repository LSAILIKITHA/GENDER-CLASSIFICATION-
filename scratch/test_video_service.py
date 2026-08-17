import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.services.video_gender_service import analyze_frame_image, analyze_video_file
import numpy as np

print("Testing video_gender_service import...")
test_bgr = np.full((300, 300, 3), 200, dtype=np.uint8)
res = analyze_frame_image(test_bgr)
print("Frame image test output success:", res["success"])
print("Frame gender:", res["frame_gender"])
print("Faces count:", res["faces_count"])
