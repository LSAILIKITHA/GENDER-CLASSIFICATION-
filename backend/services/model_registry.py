"""
model_registry.py — Database-backed Model Registry & MLOps Tracking
Manages model versioning, evaluation metrics (Accuracy, F1, Confusion Matrix), status, and deployment controls.
"""

import sqlite3
import json
import os
import database

def init_model_registry():
    """Initializes tables for Model Registry, Versions, and Evaluation Metrics."""
    conn = database.get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS model_registry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model_id TEXT UNIQUE NOT NULL,
            version TEXT NOT NULL,
            algorithm TEXT NOT NULL,
            accuracy REAL NOT NULL,
            precision_score REAL DEFAULT 0.0,
            recall_score REAL DEFAULT 0.0,
            f1_score REAL NOT NULL,
            dataset_size INTEGER DEFAULT 0,
            confusion_matrix TEXT DEFAULT '{}',
            status TEXT DEFAULT 'Production',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Seed baseline v1.0 and v2.4 production records if empty
    cursor.execute("SELECT COUNT(*) FROM model_registry")
    if cursor.fetchone()[0] == 0:
        cm_v1 = json.dumps({"tp": 4820, "fp": 210, "fn": 190, "tn": 4780})
        cm_v2 = json.dumps({"tp": 5210, "fp": 95, "fn": 85, "tn": 5110})

        cursor.execute("""
            INSERT INTO model_registry (model_id, version, algorithm, accuracy, precision_score, recall_score, f1_score, dataset_size, confusion_matrix, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, ('mod-nb-v10', 'v1.0', 'Multinomial Naïve Bayes', 95.8, 95.8, 96.2, 96.0, 10480000, cm_v1, 'Archived'))

        cursor.execute("""
            INSERT INTO model_registry (model_id, version, algorithm, accuracy, precision_score, recall_score, f1_score, dataset_size, confusion_matrix, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, ('mod-ens-v24', 'v2.4', 'Multi-Model Weighted Ensemble', 98.2, 98.3, 98.1, 98.2, 10485760, cm_v2, 'Production'))

    conn.commit()
    conn.close()

def get_registered_models():
    """Returns list of registered model versions."""
    init_model_registry()
    conn = database.get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM model_registry ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "model_id": r["model_id"],
            "version": r["version"],
            "algorithm": r["algorithm"],
            "accuracy": r["accuracy"],
            "precision": r["precision_score"],
            "recall": r["recall_score"],
            "f1_score": r["f1_score"],
            "dataset_size": r["dataset_size"],
            "confusion_matrix": json.loads(r["confusion_matrix"] or '{}'),
            "status": r["status"],
            "created_at": r["created_at"]
        })
    return result

def register_new_model(version, algorithm, accuracy, f1_score, dataset_size, confusion_matrix_dict, precision=98.0, recall=98.0):
    """Registers a newly trained or evaluated model version."""
    init_model_registry()
    conn = database.get_db_connection()
    cursor = conn.cursor()

    model_id = f"mod-{version.lower().replace('.', '')}"
    cm_json = json.dumps(confusion_matrix_dict or {})

    # Mark old models as Staging/Archived if making this Production
    cursor.execute("UPDATE model_registry SET status = 'Archived' WHERE status = 'Production'")

    cursor.execute("""
        INSERT INTO model_registry (model_id, version, algorithm, accuracy, precision_score, recall_score, f1_score, dataset_size, confusion_matrix, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Production')
    """, (model_id, version, algorithm, accuracy, precision, recall, f1_score, dataset_size, cm_json))

    conn.commit()
    conn.close()
    return True
