import cv2

print("cv2 dir attributes count:", len(dir(cv2)))
face_related = [a for a in dir(cv2) if 'face' in a.lower() or 'cascade' in a.lower() or 'dnn' in a.lower()]
print("face/dnn related cv2 attrs:", face_related)
