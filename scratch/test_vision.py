import cv2
import numpy as np
import os
import torch
import torchvision

print("Testing OpenCV and PyTorch capabilities...")

# Check haar cascades
face_cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
print("Cascade path exists:", os.path.exists(face_cascade_path))

face_cascade = cv2.CascadeClassifier(face_cascade_path)
print("Face cascade loaded:", not face_cascade.empty())

# Create a test synthetic image with face-like dimensions
test_img = np.zeros((300, 300, 3), dtype=np.uint8)
gray = cv2.cvtColor(test_img, cv2.COLOR_BGR2GRAY)
faces = face_cascade.detectMultiScale(gray, 1.1, 4)
print("Synthetic image test faces detected:", len(faces))
