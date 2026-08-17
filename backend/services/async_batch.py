"""
async_batch.py — Non-blocking Asynchronous Batch Job Queue & Background Processing
Handles large CSV batch jobs with status tracking, progress calculation, and result downloads.
"""

import threading
import uuid
import time
from backend.services.name_intelligence import analyze_name_intelligence

_BATCH_JOBS = {}

def create_batch_job(names_list, country="Global", webhook_url=None):
    """
    Creates an asynchronous batch job and spawns a background worker thread.
    Returns immediately with job_id and QUEUED status.
    """
    job_id = f"job-{uuid.uuid4().hex[:12]}"
    job_record = {
        "job_id": job_id,
        "status": "QUEUED",
        "progress_percentage": 0.0,
        "total_records": len(names_list),
        "processed_records": 0,
        "valid_records": 0,
        "results": [],
        "created_at": time.time(),
        "completed_at": None,
        "webhook_url": webhook_url
    }
    
    _BATCH_JOBS[job_id] = job_record
    
    # Spawn background thread to process job asynchronously
    worker_thread = threading.Thread(
        target=_process_batch_job_async,
        args=(job_id, names_list, country),
        daemon=True
    )
    worker_thread.start()
    
    return job_record

def _process_batch_job_async(job_id, names_list, country):
    """Background worker loop processing names without blocking main Flask threads."""
    job = _BATCH_JOBS.get(job_id)
    if not job:
        return
        
    job["status"] = "PROCESSING"
    total = len(names_list)
    results = []
    valid = 0

    for idx, item in enumerate(names_list):
        name_str = item.get('name', '') if isinstance(item, dict) else str(item)
        country_str = item.get('country', country) if isinstance(item, dict) else country
        
        name_clean = name_str.strip()
        if not name_clean:
            results.append({"name": name_str, "status": "Invalid", "prediction": "N/A", "confidence": 0})
        else:
            try:
                res = analyze_name_intelligence(name_clean, country=country_str)
                results.append({
                    "name": name_clean,
                    "prediction": res.get("associated_gender"),
                    "confidence": res.get("confidence_score"),
                    "reliability": res.get("reliability"),
                    "model_agreement": res.get("model_agreement"),
                    "origin": res.get("origin", {}).get("region"),
                    "meaning": res.get("meaning", {}).get("text")
                })
                valid += 1
            except Exception:
                results.append({"name": name_str, "status": "Error", "prediction": "N/A", "confidence": 0})

        job["processed_records"] = idx + 1
        job["valid_records"] = valid
        job["progress_percentage"] = round(((idx + 1) / total) * 100, 1)

    job["results"] = results
    job["status"] = "COMPLETED"
    job["completed_at"] = time.time()
    
    # Deliver webhook notification if URL provided
    if job.get("webhook_url"):
        from backend.services.webhooks import deliver_webhook_notification
        deliver_webhook_notification(
            webhook_url=job["webhook_url"],
            event_type="batch.completed",
            payload={
                "job_id": job_id,
                "total": total,
                "valid": valid,
                "completed_at": job["completed_at"]
            }
        )

def get_batch_job_status(job_id):
    """Retrieves batch job status and results."""
    return _BATCH_JOBS.get(job_id)
