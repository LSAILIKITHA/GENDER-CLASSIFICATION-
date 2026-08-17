import cv2
import numpy as np

def extract_facial_biometrics(crop_bgr):
    """
    Extract facial biometric indicators:
    1. Eyebrow density & dark pixel ratio
    2. Lower face follicle & stubble texture
    3. Jawline aspect ratio
    """
    h, w = crop_bgr.shape[:2]
    gray = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2GRAY)
    
    # 1. Eyebrow & upper face darkness/density
    eyebrow_region = gray[int(h * 0.15):int(h * 0.38), int(w * 0.1):int(w * 0.9)]
    if eyebrow_region.size > 0:
        eyebrow_mean = float(np.mean(eyebrow_region))
        eyebrow_darkness = max(0.0, (150.0 - eyebrow_mean) / 150.0)
    else:
        eyebrow_darkness = 0.5
        
    # 2. Lower face stubble & follicle texture variance
    lower_face = gray[int(h * 0.55):int(h * 0.95), int(w * 0.15):int(w * 0.85)]
    if lower_face.size > 0:
        laplacian_var = float(cv2.Laplacian(lower_face, cv2.CV_64F).var())
        stubble_score = min(1.0, laplacian_var / 300.0)
    else:
        stubble_score = 0.5
        
    # 3. Jawline squareness aspect ratio
    aspect = float(h) / max(1, w)
    squareness = 1.0 - min(1.0, abs(aspect - 1.1))
    
    male_weight = (eyebrow_darkness * 0.4) + (stubble_score * 0.4) + (squareness * 0.2)
    female_weight = 1.0 - male_weight
    
    return {
        "eyebrow_darkness": round(eyebrow_darkness, 3),
        "stubble_score": round(stubble_score, 3),
        "squareness": round(squareness, 3),
        "male_weight": round(male_weight, 3),
        "female_weight": round(female_weight, 3)
    }

# Test on a synthetic male-like face frame
img = np.full((200, 200, 3), 160, dtype=np.uint8)
# Add dark eyebrow band
img[30:50, 20:180] = 50
# Add lower face texture
img[110:190, 30:170] = np.random.randint(40, 140, (80, 140, 3), dtype=np.uint8)

res = extract_facial_biometrics(img)
print("Biometric extraction test output:", res)
