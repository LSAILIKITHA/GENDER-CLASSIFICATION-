# 🚻 Gender Classification Using Machine Learning

Predicting gender from names using Naive Bayes and Decision Tree classifiers.



## 📌 Overview

This project demonstrates a machine learning system that classifies the gender (male/female) based on names. Using a labeled dataset of over 250,000 names from Kaggle, we built and deployed ML models using both traditional NLP techniques and sklearn classifiers.


## 📊 Dataset

- **Source**: [Kaggle – Names for Gender Prediction](https://www.kaggle.com/datasets/taktakhi/names-for-gender-prediction?select=name_gender_all.csv)
- **Size**:250 462 records
- **Features**: `name`, `gender` (m = male, f = female)

## ⚙️ Workflow

### 🔹 1. Data Preprocessing
- Encoded gender labels: `f` → 0, `m` → 1
- Removed duplicates and cleaned missing values

### 🔹 2. Feature Engineering
- Used `CountVectorizer` for text vectorization
- Extracted features like:
  - First/last letter
  - Prefix and suffix combinations

### 🔹 3. Model Training
- **Naive Bayes Classifier**:
  - Accuracy: 71.05% (Test), 99.13% (Train)
- **Decision Tree Classifier**:
  - Based on custom linguistic features
- Saved models using `pickle` and `joblib`

### 🔹 4. Deployment
- Flask-based web interface
- Users input a name and receive the predicted gender instantly


## 🌐 Web App Interface

The UI was styled using CSS and Bootstrap.


## 🛠️ Technologies Used

- Python (Pandas, NumPy, Scikit-learn)
- NLP: CountVectorizer, DictVectorizer
- Machine Learning: Naive Bayes, Decision Tree
- Web: Flask, HTML, CSS, Bootstrap
- Deployment-ready model files


