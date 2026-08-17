import urllib.request
import os
import cv2
import numpy as np

# URLs for standard OpenCV Caffe DNN face detector and gender classification models
FACE_PROTO = "https://raw.githubusercontent.com/opencv/opencv/master/samples/dnn/face_detector/deploy.prototxt"
FACE_MODEL = "https://raw.githubusercontent.com/opencv/opencv_3rdparty/dnn_samples_face_detector_20170830/res10_300x300_ssd_iter_140000.caffemodel"

GENDER_PROTO = "https://raw.githubusercontent.com/spmallick/learnopencv/master/AgeGender/gender_deploy.prototxt"
GENDER_MODEL = "https://raw.githubusercontent.com/spmallick/learnopencv/master/AgeGender/gender_net.caffemodel"

models_dir = os.path.join(os.path.dirname(__file__), "..", "backend", "models")
os.makedirs(models_dir, exist_ok=True)

f_proto_path = os.path.join(models_dir, "face_deploy.prototxt")
f_model_path = os.path.join(models_dir, "res10_300x300_ssd.caffemodel")
g_proto_path = os.path.join(models_dir, "gender_deploy.prototxt")
g_model_path = os.path.join(models_dir, "gender_net.caffemodel")

def download_file(url, target_path):
    if not os.path.exists(target_path):
        print(f"Downloading {os.path.basename(target_path)}...")
        urllib.request.urlretrieve(url, target_path)
        print("✓ Downloaded!")
    else:
        print(f"✓ Already exists: {os.path.basename(target_path)}")

try:
    download_file(FACE_PROTO, f_proto_path)
    download_file(FACE_MODEL, f_model_path)
    download_file(GENDER_PROTO, g_proto_path)
    download_file(GENDER_MODEL, g_model_path)

    # Test loading with OpenCV DNN
    face_net = cv2.dnn.readNet(f_model_path, f_proto_path)
    gender_net = cv2.dnn.readNet(g_model_path, g_proto_path)
    print("✓ Successfully loaded OpenCV DNN Face & Gender models!")
except Exception as e:
    print(f"Error testing model download/load: {e}")
