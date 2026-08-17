"""
test_phase6.py — Unit Tests for Dataset Catalogue Explorer API & Paginated Search
"""

import unittest
from backend.services.explorer_service import get_explorer_catalog

class TestCatalogExplorer(unittest.TestCase):

    def test_explorer_catalog_pagination(self):
        res = get_explorer_catalog(page=1, limit=10)
        self.assertIn("catalog", res)
        self.assertIn("total_records", res)
        self.assertGreater(res["total_records"], 0)
        self.assertEqual(len(res["catalog"]), 10)

    def test_explorer_gender_filter(self):
        res_m = get_explorer_catalog(page=1, limit=10, gender_filter="MALE")
        for item in res_m["catalog"]:
            self.assertEqual(item["prediction"], "MALE")

        res_f = get_explorer_catalog(page=1, limit=10, gender_filter="FEMALE")
        for item in res_f["catalog"]:
            self.assertEqual(item["prediction"], "FEMALE")

    def test_explorer_search_query(self):
        res = get_explorer_catalog(page=1, limit=10, search_query="Aditya")
        self.assertTrue(len(res["catalog"]) > 0)
        self.assertTrue(any("aditya" in item["name"].lower() for item in res["catalog"]))

if __name__ == '__main__':
    unittest.main()
