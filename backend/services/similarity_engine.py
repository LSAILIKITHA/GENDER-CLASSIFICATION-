"""
similarity_engine.py — Name Similarity & Variant Engine for Name Intelligence Platform
Calculates Levenshtein Distance, Jaro-Winkler, N-Gram Jaccard, and Phonetic Similarity metrics.
"""

import math

def levenshtein_distance(str1, str2):
    """Computes exact edit distance between two strings."""
    s1, s2 = str1.lower().strip(), str2.lower().strip()
    if s1 == s2:
        return 0
    if len(s1) == 0:
        return len(s2)
    if len(s2) == 0:
        return len(s1)

    v0 = list(range(len(s2) + 1))
    v1 = [0] * (len(s2) + 1)

    for i in range(len(s1)):
        v1[0] = i + 1
        for j in range(len(s2)):
            cost = 0 if s1[i] == s2[j] else 1
            v1[j + 1] = min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost)
        v0 = list(v1)

    return v1[len(s2)]

def levenshtein_similarity(str1, str2):
    """Normalized Levenshtein similarity score (0.0 to 1.0)."""
    s1, s2 = str1.lower().strip(), str2.lower().strip()
    max_len = max(len(s1), len(s2))
    if max_len == 0:
        return 1.0
    dist = levenshtein_distance(s1, s2)
    return round(1.0 - (dist / max_len), 4)

def jaro_winkler_similarity(str1, str2, p=0.1):
    """Computes Jaro-Winkler similarity score (0.0 to 1.0)."""
    s1, s2 = str1.lower().strip(), str2.lower().strip()
    if s1 == s2:
        return 1.0

    len1, len2 = len(s1), len(s2)
    if len1 == 0 or len2 == 0:
        return 0.0

    match_distance = max(len1, len2) // 2 - 1
    if match_distance < 0:
        match_distance = 0

    s1_matches = [False] * len1
    s2_matches = [False] * len2

    matches = 0
    transpositions = 0

    for i in range(len1):
        start = max(0, i - match_distance)
        end = min(i + match_distance + 1, len2)

        for j in range(start, end):
            if s2_matches[j]:
                continue
            if s1[i] != s2[j]:
                continue
            s1_matches[i] = True
            s2_matches[j] = True
            matches += 1
            break

    if matches == 0:
        return 0.0

    k = 0
    for i in range(len1):
        if not s1_matches[i]:
            continue
        while not s2_matches[k]:
            k += 1
        if s1[i] != s2[k]:
            transpositions += 1
        k += 1

    jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3.0

    # Winkler prefix bonus
    prefix = 0
    for i in range(min(4, min(len1, len2))):
        if s1[i] == s2[i]:
            prefix += 1
        else:
            break

    jw = jaro + prefix * p * (1.0 - jaro)
    return round(min(1.0, jw), 4)

def ngram_jaccard_similarity(str1, str2, n=2):
    """Computes character n-gram Jaccard similarity."""
    s1, s2 = str1.lower().strip(), str2.lower().strip()
    if s1 == s2:
        return 1.0

    ngrams1 = set(s1[i:i+n] for i in range(len(s1) - n + 1))
    ngrams2 = set(s2[i:i+n] for i in range(len(s2) - n + 1))

    if not ngrams1 or not ngrams2:
        return 0.0

    intersection = len(ngrams1 & ngrams2)
    union = len(ngrams1 | ngrams2)
    return round(intersection / union, 4)

def soundex_code(name_str):
    """Generates Soundex phonetic representation code."""
    s = name_str.upper().strip()
    if not s:
        return ""
    code = s[0]
    mapping = {
        'B': '1', 'F': '1', 'P': '1', 'V': '1',
        'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
        'D': '3', 'T': '3',
        'L': '4',
        'M': '5', 'N': '5',
        'R': '6'
    }
    prev = mapping.get(code, '')
    for char in s[1:]:
        digit = mapping.get(char, '')
        if digit and digit != prev:
            code += digit
            prev = digit
        elif not digit:
            prev = ''
        if len(code) == 4:
            break
    return code.ljust(4, '0')

def compare_names(name1, name2):
    """
    Computes complete similarity matrix between two names.
    Returns composite score, Levenshtein, Jaro-Winkler, N-Gram, Phonetic match, and similarity classification.
    """
    s1, s2 = name1.strip(), name2.strip()
    lev_sim = levenshtein_similarity(s1, s2)
    jw_sim = jaro_winkler_similarity(s1, s2)
    ngram_sim = ngram_jaccard_similarity(s1, s2, n=2)
    
    soundex1 = soundex_code(s1)
    soundex2 = soundex_code(s2)
    phonetic_match = (soundex1 == soundex2)
    
    # Composite Similarity Index
    comp_score = round(0.40 * jw_sim + 0.35 * lev_sim + 0.25 * ngram_sim, 4)
    if phonetic_match:
        comp_score = round(min(1.0, comp_score + 0.05), 4)

    if s1.lower() == s2.lower():
        classification = "Exact Match"
    elif comp_score >= 0.85:
        classification = "Very Similar"
    elif phonetic_match:
        classification = "Phonetically Similar"
    elif comp_score >= 0.65:
        classification = "Related Variant"
    else:
        classification = "Distant / Unrelated"

    return {
        "name1": s1,
        "name2": s2,
        "composite_similarity": comp_score,
        "similarity_percentage": round(comp_score * 100, 1),
        "levenshtein_similarity": lev_sim,
        "jaro_winkler_similarity": jw_sim,
        "ngram_jaccard_similarity": ngram_sim,
        "soundex_code1": soundex1,
        "soundex_code2": soundex2,
        "phonetic_match": phonetic_match,
        "classification": classification
    }

def find_name_variants(given_name, candidate_pool=None):
    """
    Discovers spelling, phonetic, and structural variants for a given name.
    """
    clean = given_name.strip()
    if not clean:
        return []

    DEFAULT_VARIANTS_MAP = {
        'aditya': ['Adithya', 'Aaditya', 'Adity', 'Adithya Dev'],
        'adithya': ['Aditya', 'Aaditya', 'Adithya', 'Adithya Dev'],
        'likitha': ['Likhitha', 'Likita', 'Likith', 'Likhita'],
        'likhitha': ['Likitha', 'Likhita', 'Likhith'],
        'priya': ['Preeya', 'Priyanka', 'Priyam'],
        'ananya': ['Ananyaa', 'Ananya', 'Anania'],
        'arjun': ['Arjuna', 'Arjunan', 'Arju'],
        'alex': ['Alexander', 'Alexandra', 'Alexei', 'Aleks'],
        'jordan': ['Jordon', 'Jordyn', 'Jordanne'],
        'taylor': ['Tayler', 'Tailor', 'Tayla'],
        'krishna': ['Krsna', 'Kishore', 'Krishnan'],
    }

    n_lower = clean.lower()
    pool = candidate_pool or DEFAULT_VARIANTS_MAP.get(n_lower, [clean, clean + 'a', clean.replace('i', 'ee'), clean.replace('th', 't')])
    
    variants = []
    for cand in set(pool):
        if cand.lower() == n_lower:
            continue
        comp = compare_names(clean, cand)
        variants.append({
            "variant_name": cand,
            "similarity_score": comp["composite_similarity"],
            "similarity_percentage": comp["similarity_percentage"],
            "classification": comp["classification"],
            "phonetic_match": comp["phonetic_match"]
        })

    variants.sort(key=lambda x: x["similarity_score"], reverse=True)
    return variants
