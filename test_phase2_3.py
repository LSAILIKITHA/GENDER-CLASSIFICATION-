"""
test_phase2_3.py — Unit & Integration Tests for Phase 2 & Phase 3 Services
"""

import unittest
from backend.services.name_parser import parse_structured_name
from backend.services.similarity_engine import compare_names, find_name_variants, levenshtein_similarity, jaro_winkler_similarity
from backend.services.transliteration import normalize_multilingual_name, detect_script
from backend.services.model_registry import get_registered_models

class TestPhase2And3(unittest.TestCase):

    def test_structured_name_parser(self):
        parsed = parse_structured_name("Dr. M. Adithya Dev Kumar")
        self.assertEqual(parsed["title"], "Dr.")
        self.assertEqual(parsed["initials"], "M.")
        self.assertEqual(parsed["given_name"], "Adithya")
        self.assertEqual(parsed["middle_name"], "Dev")
        self.assertEqual(parsed["surname"], "Kumar")

    def test_similarity_metrics(self):
        lev = levenshtein_similarity("Aditya", "Adithya")
        jw = jaro_winkler_similarity("Aditya", "Adithya")
        self.assertGreater(lev, 0.70)
        self.assertGreater(jw, 0.85)

    def test_name_comparison(self):
        comp = compare_names("Aditya", "Arjun")
        self.assertIn("composite_similarity", comp)
        self.assertIn("classification", comp)

    def test_variant_generator(self):
        vars_list = find_name_variants("Aditya")
        self.assertTrue(len(vars_list) > 0)
        self.assertIn(vars_list[0]["variant_name"].lower(), ["adithya", "aaditya"])

    def test_transliteration_and_script(self):
        s_dev = detect_script("कृष्ण")
        self.assertIn("Devanagari", s_dev)
        
        multi = normalize_multilingual_name("அதித்யா")
        self.assertTrue(multi["is_transliterated"])
        self.assertEqual(multi["normalized_latin"], "Adithya")

    def test_model_registry(self):
        models = get_registered_models()
        self.assertTrue(len(models) >= 2)

if __name__ == '__main__':
    unittest.main()
