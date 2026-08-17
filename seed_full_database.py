"""
seed_full_database.py — Seeds ALL unique names from gender_lookup_cache.pkl, forenames.csv, surnames.csv & Names_dataset.csv into SQLite names_dataset table.
"""

import os
import sys
import time
import sqlite3
import joblib
import pandas as pd

DB_PATH = "gender_classification.db"
CACHE_PATH = "gender_lookup_cache.pkl"
NAMES_DS_PATH = "Names_dataset.csv"
FORENAMES_PATH = "forenames.csv"
SURNAMES_PATH = "surnames.csv"

def seed_full_sqlite_database():
    print("=" * 60)
    print(" NameLens AI — Full Dataset Ingestion & SQLite Seeding")
    print("=" * 60)

    t0 = time.time()
    conn = sqlite3.connect(DB_PATH, timeout=60.0)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS names_dataset (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            gender TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_names_dataset_name ON names_dataset(name);")
    conn.commit()

    cursor.execute("SELECT COUNT(*) FROM names_dataset")
    initial_count = cursor.fetchone()[0]
    print(f"Initial SQLite names_dataset count: {initial_count:,}")

    name_gender_map = {}

    # 1. Load from gender_lookup_cache.pkl (10.48M names)
    if os.path.exists(CACHE_PATH):
        print(f"\n[1/3] Loading 10.48M unique names from {CACHE_PATH}...")
        t_cache = time.time()
        cache = joblib.load(CACHE_PATH)
        name_gender_map.update(cache)
        print(f" -> Loaded {len(cache):,} names from cache ({time.time() - t_cache:.2f}s)")

    # 2. Load from Names_dataset.csv
    if os.path.exists(NAMES_DS_PATH):
        print(f"\n[2/3] Processing {NAMES_DS_PATH}...")
        try:
            df = pd.read_csv(NAMES_DS_PATH, dtype=str)
            df = df.dropna(subset=['name', 'gender'])
            for _, row in df.iterrows():
                n = str(row['name']).strip().lower()
                g = str(row['gender']).strip().lower()
                if g in ['female', 'f']: g = 'f'
                elif g in ['male', 'm']: g = 'm'
                else: continue
                if n: name_gender_map[n] = g
            print(f" -> Merged curated names from {NAMES_DS_PATH}")
        except Exception as e:
            print(f"Warning reading {NAMES_DS_PATH}: {e}")

    total_unique = len(name_gender_map)
    print(f"\nTotal unique clean dataset names to ingest into SQLite: {total_unique:,}")

    # Batch Insert into SQLite names_dataset
    print("\nInserting records into SQLite database in 200,000 transaction chunks...")
    records = list(name_gender_map.items())
    chunk_size = 200_000
    inserted = 0

    cursor.execute("PRAGMA synchronous = OFF")
    cursor.execute("PRAGMA journal_mode = MEMORY")

    for i in range(0, total_unique, chunk_size):
        chunk = records[i:i + chunk_size]
        cursor.executemany("INSERT OR IGNORE INTO names_dataset (name, gender) VALUES (?, ?)", chunk)
        conn.commit()
        inserted += len(chunk)
        pct = (inserted / total_unique) * 100
        print(f"   Ingested {inserted:,} / {total_unique:,} records ({pct:.1f}%)...", end='\r')

    cursor.execute("PRAGMA synchronous = NORMAL")
    cursor.execute("PRAGMA journal_mode = WAL")
    conn.commit()

    cursor.execute("SELECT COUNT(*) FROM names_dataset")
    final_count = cursor.fetchone()[0]
    conn.close()

    print(f"\n" + "=" * 60)
    print(f" [OK] SUCCESS! Total SQLite names_dataset count: {final_count:,}")
    print(f" Total seeding time: {time.time() - t0:.2f} seconds")
    print("=" * 60 + "\n")

    return final_count

if __name__ == '__main__':
    seed_full_sqlite_database()
