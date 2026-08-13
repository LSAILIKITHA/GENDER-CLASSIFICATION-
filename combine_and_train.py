import sys
import os

# Ensure UTF-8 stdout encoding for Windows
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import joblib
import pandas as pd
import numpy as np
from collections import defaultdict
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score

NAMES_DS_PATH   = "Names_dataset.csv"
FORENAMES_PATH  = "forenames.csv"
SURNAMES_PATH   = "surnames.csv"
CACHE_PATH      = "gender_lookup_cache.pkl"
MODEL_PATH      = "naivebayes.pkl"
VECTORIZER_PATH = "gender_vectorizer.pkl"

import sys
import os
import time

# Ensure UTF-8 stdout encoding for Windows
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
from sklearn.metrics import accuracy_score

NAMES_DS_PATH   = "Names_dataset.csv"
FORENAMES_PATH  = "forenames.csv"
SURNAMES_PATH   = "surnames.csv"
CACHE_PATH      = "gender_lookup_cache.pkl"
MODEL_PATH      = "naivebayes.pkl"
VECTORIZER_PATH = "gender_vectorizer.pkl"

def process_df(df, name_col, gender_col, count_col=None, weight=1):
    df = df.dropna(subset=[name_col, gender_col])
    df['name'] = df[name_col].astype(str).str.strip().str.lower()
    df['gender'] = df[gender_col].astype(str).str.strip().str.lower()
    
    # Map female/male variations
    df['gender'] = df['gender'].replace({'female': 'f', 'male': 'm'})
    df = df[df['gender'].isin(['m', 'f'])]
    
    if count_col and count_col in df.columns:
        df['cnt'] = pd.to_numeric(df[count_col], errors='coerce').fillna(1).astype(int)
    else:
        df['cnt'] = weight
    
    # Clean empty strings
    df = df[df['name'].str.len() > 0]
    
    # Fast pandas groupby per chunk
    return df.groupby(['name', 'gender'])['cnt'].sum().reset_index()

def process_all_datasets():
    print("=" * 60)
    print(" NameLens AI - Full Dataset Consolidation & Retraining Pipeline")
    print(" Processing ALL names from surnames.csv, forenames.csv & Names_dataset.csv")
    print("=" * 60)

    start_pipeline_time = time.time()
    grouped_parts = []

    # 1. Process Names_dataset.csv (High Priority weight = 100)
    if os.path.exists(NAMES_DS_PATH):
        print(f"\n[1/3] Processing {NAMES_DS_PATH} (Curated priority dataset)...")
        t0 = time.time()
        df1 = pd.read_csv(NAMES_DS_PATH, dtype=str)
        g1 = process_df(df1, 'name', 'gender', weight=100)
        grouped_parts.append(g1)
        print(f" -> Loaded {len(df1):,} rows from {NAMES_DS_PATH} into {len(g1):,} grouped entries ({time.time() - t0:.2f}s)")

    # 2. Process forenames.csv (streaming chunk vectorization)
    if os.path.exists(FORENAMES_PATH):
        print(f"\n[2/3] Processing {FORENAMES_PATH} (streaming 3M chunk size)...")
        t0 = time.time()
        fn_chunks_processed = 0
        total_fn_rows = 0
        for chunk in pd.read_csv(FORENAMES_PATH, usecols=['forename', 'gender', 'count'], 
                                chunksize=3_000_000, dtype={'forename': str, 'gender': str}, low_memory=False):
            total_fn_rows += len(chunk)
            g_fn = process_df(chunk, 'forename', 'gender', 'count')
            grouped_parts.append(g_fn)
            fn_chunks_processed += 1
            print(f"   Processed {total_fn_rows:,} forename rows...", end='\r')
        print(f"\n -> Total forenames rows processed: {total_fn_rows:,} in {time.time() - t0:.2f}s")

    # 3. Process surnames.csv (streaming chunk vectorization)
    if os.path.exists(SURNAMES_PATH):
        print(f"\n[3/3] Processing {SURNAMES_PATH} (streaming 3M chunk size)...")
        t0 = time.time()
        total_sn_rows = 0
        for chunk in pd.read_csv(SURNAMES_PATH, usecols=['surname', 'gender', 'count'], 
                                chunksize=3_000_000, dtype={'surname': str, 'gender': str}, low_memory=False):
            total_sn_rows += len(chunk)
            g_sn = process_df(chunk, 'surname', 'gender', 'count')
            grouped_parts.append(g_sn)
            print(f"   Processed {total_sn_rows:,} surname rows...", end='\r')
        print(f"\n -> Total surnames rows processed: {total_sn_rows:,} in {time.time() - t0:.2f}s")

    print("\n" + "=" * 60)
    print(" Final Aggregation & Gender Frequency Resolution")
    print("=" * 60)

    t0 = time.time()
    all_grouped = pd.concat(grouped_parts, ignore_index=True)
    pivot_counts = all_grouped.groupby(['name', 'gender'])['cnt'].sum().unstack(fill_value=0)
    if 'm' not in pivot_counts.columns: pivot_counts['m'] = 0
    if 'f' not in pivot_counts.columns: pivot_counts['f'] = 0

    total_unique = len(pivot_counts)
    print(f"✓ Aggregated into {total_unique:,} total unique clean names ({time.time() - t0:.2f}s)")

    # Build Ground Truth Lookup
    resolved_lookup = {}
    names_list = []
    genders_list = []

    m_total = 0
    f_total = 0

    # Determine majority gender per name without skipping any name
    m_mask = pivot_counts['m'] > pivot_counts['f']
    f_mask = pivot_counts['f'] > pivot_counts['m']
    tie_mask = ~(m_mask | f_mask)

    # Names with male majority
    for name in pivot_counts.index[m_mask]:
        resolved_lookup[name] = 'm'
        names_list.append(name)
        genders_list.append('m')
        m_total += 1

    # Names with female majority
    for name in pivot_counts.index[f_mask]:
        resolved_lookup[name] = 'f'
        names_list.append(name)
        genders_list.append('f')
        f_total += 1

    # Tied names (default to 'm' or 'f' to avoid skipping)
    for name in pivot_counts.index[tie_mask]:
        # Default tie-breaker based on overall index balance
        g = 'm' if m_total < f_total else 'f'
        resolved_lookup[name] = g
        names_list.append(name)
        genders_list.append(g)
        if g == 'm': m_total += 1
        else: f_total += 1

    print(f"\nConsolidated Unique Names Summary:")
    print(f"  - Total Unique Clean Names : {total_unique:,}")
    print(f"  - Male Majority Names      : {m_total:,} ({m_total/total_unique*100:.2f}%)")
    print(f"  - Female Majority Names    : {f_total:,} ({f_total/total_unique*100:.2f}%)")

    # Save Ground Truth Lookup Cache
    print(f"\nSaving ground truth lookup cache to {CACHE_PATH}...")
    joblib.dump(resolved_lookup, CACHE_PATH, compress=3)
    cache_mb = os.path.getsize(CACHE_PATH) / (1024 * 1024)
    print(f"✓ Ground truth cache saved ({cache_mb:.2f} MB)")

    # 4. Retrain Naïve Bayes Model on all unique clean names
    print("\n" + "=" * 60)
    print(" Retraining Character N-Gram Naïve Bayes Classifier")
    print("=" * 60)

    df_clean = pd.DataFrame({'name': names_list, 'gender': genders_list})
    
    # Train / Test split
    X = df_clean['name']
    y = df_clean['gender'].map({'f': 0, 'm': 1})

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.10, random_state=42, stratify=y
    )

    print(f"Training on {len(X_train):,} names, testing on {len(X_test):,} names...")
    print("Extracting Character N-Gram features (2 to 5)...")
    cv_vectorizer = CountVectorizer(analyzer='char_wb', ngram_range=(2, 5), min_df=2)
    X_train_vec = cv_vectorizer.fit_transform(X_train)
    X_test_vec = cv_vectorizer.transform(X_test)
    print(f"✓ Extracted {X_train_vec.shape[1]:,} character n-gram features.")

    print("Fitting Multinomial Naïve Bayes model...")
    clf_model = MultinomialNB(alpha=0.1)
    clf_model.fit(X_train_vec, y_train)

    # Evaluate
    y_pred = clf_model.predict(X_test_vec)
    accuracy = accuracy_score(y_test, y_pred)
    acc_pct = round(accuracy * 100, 2)

    print(f"\n************************************************************")
    print(f" RETRAINED MODEL ACCURACY SCORE: {acc_pct}%")
    print(f" Total pipeline time: {time.time() - start_pipeline_time:.2f} seconds")
    print(f"************************************************************\n")

    # Save Vectorizer and Model
    print(f"Saving model artifacts to {MODEL_PATH} and {VECTORIZER_PATH}...")
    joblib.dump(cv_vectorizer, VECTORIZER_PATH)
    joblib.dump(clf_model, MODEL_PATH)
    print("✓ Model artifacts saved successfully!")

    return {
        "success": True,
        "total_unique": total_unique,
        "male_count": m_total,
        "female_count": f_total,
        "accuracy": acc_pct
    }

if __name__ == '__main__':
    process_all_datasets()

