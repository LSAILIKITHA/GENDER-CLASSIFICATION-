import cv2
import torch
import torchvision.models as models
import torchvision.transforms as transforms
import os

print("Testing PyTorch ImageNet pre-trained ResNet18 and MobileNetV3...")

resnet = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
resnet.eval()
print("✓ ResNet18 loaded with ImageNet default weights!")

mobilenet = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
mobilenet.eval()
print("✓ MobileNetV3 loaded with ImageNet default weights!")
