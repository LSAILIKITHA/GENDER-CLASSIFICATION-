"""
build_lookup.py — Pre-computes a consolidated gender lookup from all available datasets (surnames, forenames, Names_dataset).
"""
import os
import sys
import joblib

CACHE_PATH = "gender_lookup_cache.pkl"

def build_cache():
    from combine_and_train import process_all_datasets
    results = process_all_datasets()
    if os.path.exists(CACHE_PATH):
        lookup = joblib.load(CACHE_PATH)
        return lookup
    return {}

if __name__ == '__main__':
    build_cache()

