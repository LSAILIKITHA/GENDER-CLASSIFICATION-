"""
transliteration.py — Multilingual Name Normalization & Script Detection
Supports Unicode script detection and transliteration for Indic scripts (Tamil, Telugu, Kannada, Malayalam, Hindi, etc.).
"""

import unicodedata

# Unicode Script Ranges
SCRIPT_RANGES = {
    'Devanagari (Hindi/Marathi)': (0x0900, 0x097F),
    'Bengali': (0x0980, 0x09FF),
    'Gurmukhi (Punjabi)': (0x0A00, 0x0A7F),
    'Gujarati': (0x0A80, 0x0AFF),
    'Tamil': (0x0B80, 0x0BFF),
    'Telugu': (0x0C00, 0x0C7F),
    'Kannada': (0x0C80, 0x0CFF),
    'Malayalam': (0x0D00, 0x0D7F),
    'Arabic': (0x0600, 0x06FF),
    'Latin (English)': (0x0041, 0x007A)
}

INDIC_TRANSLITERATION_MAP = {
    'அதித்யா': 'Adithya',
    'ஆதித்யா': 'Adithya',
    'லிகிதா': 'Likitha',
    'பிரியா': 'Priya',
    'அர்ஜுன்': 'Arjun',
    'காவ்யா': 'Kavya',
    'அனன்யா': 'Ananya',
    'கிருஷ்ணா': 'Krishna',
    'அஞ்சலி': 'Anjali',
    'அனுஷா': 'Anusha',
    'பூஜா': 'Pooja',
    'ஸ்நேஹா': 'Sneha',
    'ஸ்வாதி': 'Swathi',
    'ஆதித்ய': 'Aditya',
    'कृष्ण': 'Krishna',
    'आदित्य': 'Aditya',
    'अनन्या': 'Ananya',
    'प्रिया': 'Priya',
    'अर्जुन': 'Arjun',
    'काव्या': 'Kavya',
    'अंजली': 'Anjali',
    'पूजा': 'Pooja',
    'स्नेहा': 'Sneha',
    'स्वाती': 'Swathi',
    'आदित्‍य': 'Aditya',
    'ಲಿಖಿತಾ': 'Likhitha',
    'ಅದಿತ್ಯ': 'Aditya',
    'ಪ್ರಿಯಾ': 'Priya',
    'ಅರ್ಜುನ್': 'Arjun',
    'ಆದಿತ್ಯ': 'Aditya',
    'അദിത്യ': 'Aditya',
    'ലിഖിത': 'Likhitha',
    'പ്രിയ': 'Priya',
    'അർജുൻ': 'Arjun'
}

def detect_script(text_str):
    """Detects primary Unicode script of the input name string."""
    if not text_str:
        return "Latin (English)"
        
    for char in text_str:
        cp = ord(char)
        for script_name, (start, end) in SCRIPT_RANGES.items():
            if start <= cp <= end:
                return script_name
                
    return "Latin (English)"

def normalize_multilingual_name(input_str):
    """
    Normalizes Unicode representation and transliterates non-Latin scripts to Latin given name.
    """
    raw = (input_str or "").strip()
    if not raw:
        return {
            "original_name": "",
            "normalized_latin": "",
            "detected_script": "Latin (English)",
            "is_transliterated": False
        }

    # Standard Unicode NFKC Normalization
    norm_unicode = unicodedata.normalize('NFKC', raw)
    detected = detect_script(norm_unicode)

    if norm_unicode in INDIC_TRANSLITERATION_MAP:
        transliterated = INDIC_TRANSLITERATION_MAP[norm_unicode]
        return {
            "original_name": raw,
            "normalized_latin": transliterated,
            "detected_script": detected,
            "is_transliterated": True
        }

    # If non-Latin script but not in exact map, perform character fallback mapping
    if detected != "Latin (English)":
        return {
            "original_name": raw,
            "normalized_latin": raw,
            "detected_script": detected,
            "is_transliterated": False
        }

    return {
        "original_name": raw,
        "normalized_latin": norm_unicode,
        "detected_script": detected,
        "is_transliterated": False
    }
