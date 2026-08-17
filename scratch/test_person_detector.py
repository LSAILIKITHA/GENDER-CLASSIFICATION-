import torchvision.models.detection as detection
import torch
import cv2
import numpy as np

print("Testing Torchvision FasterRCNN MobileNetV3 Person Detector...")
try:
    weights = detection.FasterRCNN_MobileNet_V3_Large_320_FPN_Weights.DEFAULT
    model = detection.fasterrcnn_mobilenet_v3_large_320_fpn(weights=weights)
    model.eval()
    print("✓ Model initialized successfully!")
except Exception as e:
    print("Error initializing FasterRCNN:", e)
