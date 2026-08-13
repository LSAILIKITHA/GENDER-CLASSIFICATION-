import sys
import os
import time
import csv
import joblib
import pandas as pd
from collections import defaultdict
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score

# Ensure UTF-8 output encoding for Windows compatibility
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Paths
NAMES_DS_PATH   = "Names_dataset.csv"
FORENAMES_PATH  = "forenames.csv"
SURNAMES_PATH   = "surnames.csv"
CACHE_PATH      = "gender_lookup_cache.pkl"
MODEL_PATH      = "naivebayes.pkl"
VECTORIZER_PATH = "gender_vectorizer.pkl"

def train_10m_unique_names():
    print("=" * 75)
    print(" NameLens AI - Full 10.48M Unique Names Model Training Pipeline")
    print(" Aggregating & Training on: Names_dataset.csv, forenames.csv, surnames.csv")
    print("=" * 75)
    
    t_start = time.time()
    
    # Storage structure: name_counts[name_lower] = {'m': m_count, 'f': f_count}
    # Using lightweight tuple or float packing for maximum speed and lower RAM usage
    male_counts = defaultdict(int)
    female_counts = defaultdict(int)
    total_raw_records = 0

    # ── 1. Process Names_dataset.csv (Curated ground truth - weight = 100) ──────
    if os.path.exists(NAMES_DS_PATH):
        print(f"\n[1/3] Processing {NAMES_DS_PATH} (High-Priority Curated Dataset)...")
        t0 = time.time()
        try:
            df = pd.read_csv(NAMES_DS_PATH, dtype=str, usecols=['name', 'gender'])
            df = df.dropna()
            for name, g in zip(df['name'], df['gender']):
                n = str(name).strip().lower()
                g_str = str(g).strip().lower()
                if n and len(n) > 1:
                    if g_str in ('f', 'female'):
                        female_counts[n] += 100
                    elif g_str in ('m', 'male'):
                        male_counts[n] += 100
            print(f" -> Processed {len(df):,} curated records in {time.time() - t0:.2f}s")
            total_raw_records += len(df)
        except Exception as e:
            print(f" Warning reading {NAMES_DS_PATH}: {e}")

    # ── 2. Process forenames.csv in 2,000,000 row chunks ───────────────────────
    if os.path.exists(FORENAMES_PATH):
        print(f"\n[2/3] Processing {FORENAMES_PATH} (Streaming 2,000,000 row chunks)...")
        t0 = time.time()
        fn_rows = 0
        try:
            for chunk in pd.read_csv(FORENAMES_PATH, usecols=['forename', 'gender', 'count'],
                                    chunksize=2_000_000, dtype=str, low_memory=False):
                chunk = chunk.dropna(subset=['forename', 'gender'])
                fn_rows += len(chunk)
                for n, g, c in zip(chunk['forename'], chunk['gender'], chunk['count']):
                    name = str(n).strip().lower()
                    g_str = str(g).strip().lower()
                    if name and len(name) > 1:
                        try:
                            cnt = int(c)
                        except (ValueError, TypeError):
                            cnt = 1
                        cnt = max(1, cnt)
                        if g_str in ('f', 'female'):
                            female_counts[name] += cnt
                        elif g_str in ('m', 'male'):
                            male_counts[name] += cnt
                print(f"   Processed {fn_rows:,} forename rows...", end='\r')
            print(f"\n -> Total forenames records processed: {fn_rows:,} ({time.time() - t0:.2f}s)")
            total_raw_records += fn_rows
        except Exception as e:
            print(f"\n Warning reading {FORENAMES_PATH}: {e}")

    # ── 3. Process surnames.csv in 2,000,000 row chunks ────────────────────────
    if os.path.exists(SURNAMES_PATH):
        print(f"\n[3/3] Processing {SURNAMES_PATH} (Streaming 2,000,000 row chunks)...")
        t0 = time.time()
        sn_rows = 0
        try:
            for chunk in pd.read_csv(SURNAMES_PATH, usecols=['surname', 'gender', 'count'],
                                    chunksize=2_000_000, dtype=str, low_memory=False):
                chunk = chunk.dropna(subset=['surname', 'gender'])
                sn_rows += len(chunk)
                for n, g, c in zip(chunk['surname'], chunk['gender'], chunk['count']):
                    name = str(n).strip().lower()
                    g_str = str(g).strip().lower()
                    if name and len(name) > 1:
                        try:
                            cnt = int(c)
                        except (ValueError, TypeError):
                            cnt = 1
                        cnt = max(1, cnt)
                        if g_str in ('f', 'female'):
                            female_counts[name] += cnt
                        elif g_str in ('m', 'male'):
                            male_counts[name] += cnt
                print(f"   Processed {sn_rows:,} surname rows...", end='\r')
            print(f"\n -> Total surnames records processed: {sn_rows:,} ({time.time() - t0:.2f}s)")
            total_raw_records += sn_rows
        except Exception as e:
            print(f"\n Warning reading {SURNAMES_PATH}: {e}")

    # ── 4. Combine All Unique Keys & Determine Majority Gender ───────────────
    print("\n" + "=" * 75)
    print(" Consolidated Majority Gender Resolution Across All 10.48M Names")
    print("=" * 75)
    
    t0 = time.time()
    all_unique_names = set(male_counts.keys()).union(set(female_counts.keys()))
    total_unique = len(all_unique_names)
    
    print(f"✓ Total Raw Dataset Records Processed: {total_raw_records:,}")
    print(f"✓ Total Unique Clean Names Indexed   : {total_unique:,}")

    resolved_lookup = {}
    names_list = []
    genders_list = []

    m_total = 0
    f_total = 0

    for name in all_unique_names:
        m_c = male_counts[name]
        f_c = female_counts[name]
        
        if f_c > m_c:
            g = 'f'
            f_total += 1
        elif m_c > f_c:
            g = 'm'
            m_total += 1
        else:
            # Phonetic tie breaker for equal counts
            if name.endswith(('a', 'i', 'ee', 'na', 'ka', 'tha', 'sha', 'ya', 'ie', 'ette', 'ina', 'ita')):
                g = 'f'
                f_total += 1
            else:
                g = 'm'
                m_total += 1

        resolved_lookup[name] = g
        names_list.append(name)
        genders_list.append(g)

    print(f"\nConsolidated 10.48M Dataset Summary:")
    print(f"  - Total Unique Clean Names : {total_unique:,}")
    print(f"  - Male Majority Names      : {m_total:,} ({m_total/total_unique*100:.2f}%)")
    print(f"  - Female Majority Names    : {f_total:,} ({f_total/total_unique*100:.2f}%)")
    print(f"  - Resolution Time          : {time.time() - t0:.2f}s")

    # ── 5. Save Ground-Truth Mega Lookup Cache ────────────────────────────────
    print(f"\nSaving ground truth mega-lookup cache to {CACHE_PATH}...")
    joblib.dump(resolved_lookup, CACHE_PATH, compress=3)
    cache_mb = os.path.getsize(CACHE_PATH) / (1024 * 1024)
    print(f"✓ Ground-truth lookup cache saved ({cache_mb:.2f} MB)")

    # ── 6. Retrain Character N-Gram Naïve Bayes Model on ALL Unique Names ─────
    print("\n" + "=" * 75)
    print(" Retraining Character N-Gram Naïve Bayes Classifier on All Unique Names")
    print("=" * 75)

    df_train_all = pd.DataFrame({'name': names_list, 'gender': genders_list})
    X = df_train_all['name']
    y = df_train_all['gender'].map({'f': 0, 'm': 1})

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.10, random_state=42, stratify=y
    )

    print(f"Training on {len(X_train):,} names, testing on {len(X_test):,} names...")
    print("Extracting Character N-Gram features (2 to 5 grams)...")
    
    cv_vectorizer = CountVectorizer(analyzer='char_wb', ngram_range=(2, 5), min_df=2)
    X_train_vec = cv_vectorizer.fit_transform(X_train)
    X_test_vec = cv_vectorizer.transform(X_test)
    print(f"✓ Extracted {X_train_vec.shape[1]:,} character n-gram features.")

    print("Fitting Multinomial Naïve Bayes classifier...")
    clf_model = MultinomialNB(alpha=0.1)
    clf_model.fit(X_train_vec, y_train)

    y_pred = clf_model.predict(X_test_vec)
    accuracy = accuracy_score(y_test, y_pred)
    acc_pct = round(accuracy * 100, 2)

    print(f"\n" + "*" * 70)
    print(f" RETRAINED MODEL ACCURACY ON FULL DATASET: {acc_pct}%")
    print(f" Total Pipeline Time: {time.time() - t_start:.2f} seconds")
    print("*" * 70 + "\n")

    print(f"Saving model artifacts to {MODEL_PATH} and {VECTORIZER_PATH}...")
    joblib.dump(cv_vectorizer, VECTORIZER_PATH)
    joblib.dump(clf_model, MODEL_PATH)
    print("✓ All 10.48M model artifacts saved successfully!")

if __name__ == '__main__':
    train_10m_unique_names()
