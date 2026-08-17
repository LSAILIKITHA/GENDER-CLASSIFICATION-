import cv2

print("Checking cv2 submodules...")
for sub in ['objdetect', 'dnn', 'face', 'video']:
    if hasattr(cv2, sub):
        mod = getattr(cv2, sub)
        print(f"cv2.{sub}:", [a for a in dir(mod) if 'cascade' in a.lower() or 'face' in a.lower() or 'detector' in a.lower()])

# Check CascadeClassifier in objdetect
if hasattr(cv2, 'objdetect'):
    print("objdetect.CascadeClassifier:", hasattr(cv2.objdetect, 'CascadeClassifier'))
