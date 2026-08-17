"""
test_phase4_5.py — Unit & Integration Tests for API Keys, Async Batch Jobs, and Webhooks
"""

import unittest
import time
import database
from backend.services.async_batch import create_batch_job, get_batch_job_status
from backend.services.webhooks import sign_webhook_payload

from backend.services.ensemble_engine import load_ensemble_artifacts

class TestPhase4And5(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        load_ensemble_artifacts()

    def test_api_key_hashing_and_verification(self):
        email = "researcher@namelens.ai"
        key_data = database.create_user_api_key(email, key_name="Test Key")
        raw_secret = key_data["raw_secret"]
        
        self.assertTrue(raw_secret.startswith("nl_prod_"))
        
        # Verify valid key
        valid, info = database.verify_api_key_header(raw_secret)
        self.assertTrue(valid)
        self.assertEqual(info["user_email"], email)

        # Verify invalid key
        invalid, _ = database.verify_api_key_header("nl_prod_invalid123")
        self.assertFalse(invalid)

    def test_async_batch_processing(self):
        names = ["Aditya", "Likitha", "Arjun", "Ananya"]
        job = create_batch_job(names)
        job_id = job["job_id"]
        self.assertIn(job["status"], ["QUEUED", "PROCESSING", "COMPLETED"])

        # Poll background worker thread until completed
        for _ in range(40):
            status_rec = get_batch_job_status(job_id)
            if status_rec["status"] == "COMPLETED":
                break
            time.sleep(0.1)

        self.assertEqual(status_rec["status"], "COMPLETED")
        self.assertEqual(status_rec["total_records"], 4)
        self.assertEqual(len(status_rec["results"]), 4)

    def test_webhook_signature(self):
        sig = sign_webhook_payload(b'{"event": "test"}', secret="test_secret")
        self.assertTrue(sig.startswith("sha256="))

if __name__ == '__main__':
    unittest.main()
