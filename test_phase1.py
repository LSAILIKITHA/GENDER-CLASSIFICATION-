"""
test_phase1.py — Unit & Integration Tests for Phase 1 AI Core Prediction Engine
"""

import sys
import unittest
from backend.services.name_intelligence import analyze_name_intelligence
from backend.services.ensemble_engine import run_ensemble_prediction, evaluate_phonetics

class TestPhase1CoreEngine(unittest.TestCase):

    def test_male_name_prediction(self):
        res = analyze_name_intelligence("Aditya")
        self.assertEqual(res["prediction"]["label"], "male")
        self.assertGreater(res["prediction"]["male_probability"], 0.5)
        self.assertGreater(res["confidence_score"], 50)
        self.assertIn("reliability", res)
        self.assertIn("model_agreement", res)

    def test_female_name_prediction(self):
        res = analyze_name_intelligence("Likitha")
        self.assertEqual(res["prediction"]["label"], "female")
        self.assertGreater(res["prediction"]["female_probability"], 0.5)

    def test_ambiguous_name_classification(self):
        res = analyze_name_intelligence("Alex")
        # Alex has balanced male/female probabilities or unisex association
        self.assertIn(res["prediction"]["label"], ["ambiguous", "male", "female"])
        self.assertIn("explanation", res)

    def test_honorific_and_initial_stripping(self):
        res = analyze_name_intelligence("Dr. M. Adithya Dev Kumar")
        self.assertEqual(res["normalized_name"], "adithya")
        self.assertEqual(res["prediction"]["label"], "male")

    def test_unknown_or_empty_input(self):
        res = analyze_name_intelligence("12345")
        self.assertEqual(res["prediction"]["label"], "unknown")
        self.assertEqual(res["status"], "unknown")

    def test_phonetic_heuristics(self):
        m_prob, f_prob = evaluate_phonetics("Likhitha")
        self.assertGreater(f_prob, m_prob)

    def test_explainability_structure(self):
        res = analyze_name_intelligence("Priya")
        explanation = res.get("explanation", {})
        self.assertIn("simple_factors", explanation)
        self.assertIn("technical_factors", explanation)
        self.assertTrue(len(explanation["simple_factors"]) > 0)

if __name__ == '__main__':
    unittest.main()
