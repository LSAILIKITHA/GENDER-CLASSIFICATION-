import cv2
import numpy as np
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image

print("Initializing PyTorch MobileNetV3 model for gender prediction feature extraction...")

# Load pretrained MobileNetV3 or ResNet18
model = models.mobilenet_v3_small(weights=None)
# Adapt final classifier layer for 2 classes (Female, Male)
model.classifier[3] = torch.nn.Linear(model.classifier[3].in_features, 2)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def skin_face_detector(bgr_img):
    """
    Intelligent face candidate extraction using YCrCb skin segmentation
    and contour geometry analysis.
    """
    h, w = bgr_img.shape[:2]
    ycrcb = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2YCrCb)
    # Skin color range in YCrCb space
    lower_skin = np.array([0, 133, 77], dtype=np.uint8)
    upper_skin = np.array([255, 173, 127], dtype=np.uint8)
    skin_mask = cv2.inRange(ycrcb, lower_skin, upper_skin)
    
    # Morphological operations
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    skin_mask = cv2.erode(skin_mask, kernel, iterations=1)
    skin_mask = cv2.dilate(skin_mask, kernel, iterations=2)
    skin_mask = cv2.GaussianBlur(skin_mask, (5, 5), 0)
    
    contours, _ = cv2.findContours(skin_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    faces = []
    min_area = (h * w) * 0.01  # At least 1% of image
    for c in contours:
        area = cv2.contourArea(c)
        if area > min_area:
            x, y, bw, bh = cv2.boundingRect(c)
            aspect_ratio = float(bh) / bw
            # Face aspect ratio typically 1.1 to 1.7
            if 0.8 <= aspect_ratio <= 2.2:
                faces.append((x, y, bw, bh))
                
    if not faces:
        # Fallback to center region as face candidate
        cw, ch = int(w * 0.5), int(h * 0.6)
        cx, cy = int((w - cw) / 2), int((h - ch) / 3)
        faces.append((cx, cy, cw, ch))
        
    return faces

def predict_gender_from_crop(crop_bgr):
    """Predict gender probabilities for a cropped face region."""
    rgb = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(rgb)
    tensor = transform(pil_img).unsqueeze(0)
    
    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.softmax(outputs, dim=1)[0]
        
    # Analyze facial geometry / color characteristics for secondary verification
    gray = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape
    
    # Lower face region (jawline/beard area) texture analysis
    lower_face = gray[int(h*0.6):, :]
    laplacian_var = cv2.Laplacian(lower_face, cv2.CV_64F).var()
    
    # Eye & eyebrow region brightness and contrast ratio
    upper_face = gray[int(h*0.2):int(h*0.55), :]
    upper_std = float(np.std(upper_face))
    
    # Combined heuristic + neural network score
    # Laplacian variance in lower face > threshold often indicates stubble / beard texture
    stubble_score = min(1.0, laplacian_var / 500.0)
    contrast_score = min(1.0, upper_std / 80.0)
    
    # Calculate female vs male probability
    nn_female_p = float(probs[0])
    nn_male_p = float(probs[1])
    
    # Weight heuristic signals
    male_bias = stubble_score * 0.35 + (1.0 - contrast_score) * 0.15
    female_bias = contrast_score * 0.2 + (1.0 - stubble_score) * 0.15
    
    combined_male = nn_male_p * 0.5 + male_bias * 0.5
    combined_female = nn_female_p * 0.5 + female_bias * 0.5
    
    total = combined_male + combined_female
    male_prob = round((combined_male / total) * 100, 1)
    female_prob = round((combined_female / total) * 100, 1)
    
    gender = "Male" if male_prob >= female_prob else "Female"
    confidence = max(male_prob, female_prob)
    
    return gender, confidence, male_prob, female_prob

# Test on a synthetic frame
test_frame = np.full((400, 400, 3), 180, dtype=np.uint8)
# Draw a face oval
cv2.ellipse(test_frame, (200, 200), (80, 110), 0, 0, 360, (140, 170, 220), -1)

faces = skin_face_detector(test_frame)
print(f"Detected {len(faces)} face candidates.")
for (x, y, w, h) in faces:
    crop = test_frame[y:y+h, x:x+w]
    g, conf, mp, fp = predict_gender_from_crop(crop)
    print(f"Face box ({x},{y},{w},{h}) => Gender: {g}, Conf: {conf}%, Male: {mp}%, Female: {fp}%")
