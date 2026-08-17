import cv2
import torchvision.models as models
import torch

print("Checking FaceDetectorYN and torchvision pretrained models...")
print("FaceDetectorYN:", hasattr(cv2, 'FaceDetectorYN'))

# Check PyTorch torchvision models
print("ResNet18 available:", hasattr(models, 'resnet18'))

# Check image processing functions
print("cv2 resize available:", hasattr(cv2, 'resize'))
print("cv2 VideoCapture available:", hasattr(cv2, 'VideoCapture'))
