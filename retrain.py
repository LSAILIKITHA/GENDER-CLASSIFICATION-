import os
import sys

# Ensure UTF-8 output encoding for Windows console compatibility
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report

DATASET_PATH = "Names_dataset.csv"
MODEL_PATH = "naivebayes.pkl"
VECTORIZER_PATH = "gender_vectorizer.pkl"

def retrain_model():
    """
    Cleans all datasets (Names_dataset.csv, forenames.csv, surnames.csv),
    trains an optimized Character N-gram Naïve Bayes model, builds mega-lookup,
    evaluates performance, and saves vectorizer and model weights.
    """
    if os.path.exists("forenames.csv") or os.path.exists("surnames.csv"):
        from combine_and_train import process_all_datasets
        return process_all_datasets()
    
    print("="*60)
    print(" Starting ML Model Retraining Pipeline...")
    print("="*60)
    
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset file {DATASET_PATH} not found!")

    # 1. Load and clean dataset
    df = pd.read_csv(DATASET_PATH)
    initial_count = len(df)
    
    # Ensure correct columns exist
    if 'name' not in df.columns or 'gender' not in df.columns:
        raise ValueError("Dataset must contain 'name' and 'gender' columns.")

    # Drop missing values and format
    df = df.dropna(subset=['name', 'gender']).copy()
    df['name'] = df['name'].astype(str).str.strip()
    df['gender'] = df['gender'].astype(str).str.strip().str.lower()
    
    # Filter valid genders ('f' or 'm')
    df = df[df['gender'].isin(['f', 'm'])].copy()
    
    # Remove exact duplicate rows
    df = df.drop_duplicates(subset=['name', 'gender']).copy()
    
    total_names = len(df)
    female_count = len(df[df['gender'] == 'f'])
    male_count = len(df[df['gender'] == 'm'])
    
    print(f"✓ Dataset loaded: {total_names} total records ({female_count} Female, {male_count} Male).")
    
    # 2. Prepare X and y
    X = df['name'].str.lower()
    y = df['gender'].map({'f': 0, 'm': 1})
    
    # Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)
    
    # 3. High-precision Character N-gram Feature Extraction
    print("Fitting Character N-Gram Vectorizer (range: 2 to 5)...")
    cv_vectorizer = CountVectorizer(analyzer='char_wb', ngram_range=(2, 5), min_df=2)
    X_train_vec = cv_vectorizer.fit_transform(X_train)
    X_test_vec = cv_vectorizer.transform(X_test)
    
    print(f"✓ Extracted {X_train_vec.shape[1]:,} character n-gram features.")

    # 4. Fit Multinomial Naïve Bayes Classifier
    print("Training Multinomial Naïve Bayes Classifier...")
    clf_model = MultinomialNB(alpha=0.1)
    clf_model.fit(X_train_vec, y_train)

    # 5. Evaluate Performance
    y_pred = clf_model.predict(X_test_vec)
    accuracy = accuracy_score(y_test, y_pred)
    acc_percentage = round(accuracy * 100, 2)
    
    print(f"\n" + "*"*60)
    print(f" ACCURACY SCORE: {acc_percentage}% (Previous baseline: 71.05%)")
    print("*"*60 + "\n")

    # 6. Save Model Artifacts
    print("Saving model weights and vectorizer...")
    joblib.dump(cv_vectorizer, VECTORIZER_PATH)
    joblib.dump(clf_model, MODEL_PATH)
    print("✓ Saved naivebayes.pkl and gender_vectorizer.pkl successfully!")

    summary = {
        "success": True,
        "accuracy": acc_percentage,
        "total_records": total_names,
        "female_count": female_count,
        "male_count": male_count,
        "feature_count": X_train_vec.shape[1]
    }
    return summary

if __name__ == '__main__':
    metrics = retrain_model()
    print(f"Retraining Complete. Accuracy: {metrics['accuracy']}%")
