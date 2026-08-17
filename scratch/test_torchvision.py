import torchvision.models.detection as detection
import torch

print("Torchvision detection models:")
det_attrs = [a for a in dir(detection) if not a.startswith('_')]
print(det_attrs)
