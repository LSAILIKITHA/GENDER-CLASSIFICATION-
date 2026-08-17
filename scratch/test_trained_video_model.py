import os
import sys
import cv2
import glob
import numpy as np

# Ensure UTF-8 stdout encoding for Windows
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Ensure root directory is in sys.path
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)

from backend.services.video_gender_service import classify_face_crop, analyze_frame_image

def read_image_unicode(file_path):
    try:
        data = np.fromfile(file_path, dtype=np.uint8)
        return cv2.imdecode(data, cv2.IMREAD_COLOR)
    except Exception:
        return None

def main():
    print("=" * 60)
    print(" Testing Trained ResNet-18 Facial Gender Classifier")
    print("=" * 60)

    test_female_path = os.path.join(base_dir, "dataset", "test", "female")
    test_male_path = os.path.join(base_dir, "dataset", "test", "male")

    female_imgs = glob.glob(os.path.join(test_female_path, "*.*"))[:20]
    male_imgs = glob.glob(os.path.join(test_male_path, "*.*"))[:20]

    print(f"\nEvaluating on sample test female faces ({len(female_imgs)} images)...")
    female_correct = 0
    for p in female_imgs:
        img = read_image_unicode(p)
        if img is None:
            continue
        gender, conf, m_prob, f_prob = classify_face_crop(img)
        is_correct = (gender == "Female")
        if is_correct:
            female_correct += 1
        status = "[PASS]" if is_correct else "[FAIL]"
        print(f" {status} [{os.path.basename(p)}] -> Predicted: {gender} (Conf: {conf}%, F: {f_prob}%, M: {m_prob}%)")

    print(f"\nEvaluating on sample test male faces ({len(male_imgs)} images)...")
    male_correct = 0
    for p in male_imgs:
        img = read_image_unicode(p)
        if img is None:
            continue
        gender, conf, m_prob, f_prob = classify_face_crop(img)
        is_correct = (gender == "Male")
        if is_correct:
            male_correct += 1
        status = "[PASS]" if is_correct else "[FAIL]"
        print(f" {status} [{os.path.basename(p)}] -> Predicted: {gender} (Conf: {conf}%, F: {f_prob}%, M: {m_prob}%)")

    total_tested = len(female_imgs) + len(male_imgs)
    total_correct = female_correct + male_correct
    accuracy = (total_correct / total_tested) * 100.0 if total_tested > 0 else 0.0

    print("\n" + "=" * 60)
    print(f" Summary: Tested {total_tested} images | Correct: {total_correct} | Sample Accuracy: {accuracy:.2f}%")
    print("=" * 60)

if __name__ == "__main__":
    main()
