"""
name_parser.py — Structured Name Parser for Name Intelligence Platform
Parses full name strings into Title, Initials, Given Name, Middle Name, Surname, and Suffix.
"""

import re

HONORIFIC_TITLES = {
    'dr', 'dr.', 'prof', 'prof.', 'mr', 'mr.', 'mrs', 'mrs.', 'ms', 'ms.', 
    'sri', 'sri.', 'shri', 'shri.', 'shree', 'smt', 'smt.', 'kumari', 'master', 
    'sir', 'madam', 'lady', 'lord', 'rev', 'rev.'
}

NAME_SUFFIXES = {'jr', 'jr.', 'sr', 'sr.', 'ii', 'iii', 'iv', 'v', 'esq', 'phd'}

def parse_structured_name(full_name_str):
    """
    Parses complex full name strings into structured components:
    Title, Initials, Given Name, Middle Name, Surname, Suffix, and Parser Confidence.
    """
    raw = (full_name_str or "").strip()
    if not raw:
        return {
            "title": "",
            "initials": "",
            "given_name": "",
            "middle_name": "",
            "surname": "",
            "suffix": "",
            "full_name": "",
            "parser_confidence": 0.0
        }

    tokens = raw.split()
    title = ""
    suffix = ""
    initials_list = []
    name_tokens = []

    # 1. Extract Title / Honorific Prefix
    if tokens and tokens[0].lower() in HONORIFIC_TITLES:
        title = tokens[0]
        tokens = tokens[1:]

    # 2. Extract Suffix
    if tokens and tokens[-1].lower() in NAME_SUFFIXES:
        suffix = tokens[-1]
        tokens = tokens[:-1]

    # 3. Categorize remaining tokens into Initials and Name Words
    for t in tokens:
        # Strip digits/roll numbers
        clean_t = re.sub(r'[\d]', '', t).strip()
        if not clean_t:
            continue
            
        t_alpha = re.sub(r'[\.\,]', '', clean_t)
        if len(t_alpha) <= 1:
            initials_list.append(clean_t)
        else:
            name_tokens.append(clean_t)

    initials = " ".join(initials_list)

    # 4. Assign Given Name, Middle Name, Surname
    given_name = ""
    middle_name = ""
    surname = ""

    if len(name_tokens) == 1:
        given_name = name_tokens[0]
    elif len(name_tokens) == 2:
        given_name = name_tokens[0]
        surname = name_tokens[1]
    elif len(name_tokens) >= 3:
        given_name = name_tokens[0]
        middle_name = " ".join(name_tokens[1:-1])
        surname = name_tokens[-1]

    # Compute Parser Confidence Score
    confidence = 0.50
    if given_name:
        confidence += 0.30
    if title:
        confidence += 0.10
    if surname or initials:
        confidence += 0.10

    return {
        "title": title,
        "initials": initials,
        "given_name": given_name or raw,
        "middle_name": middle_name,
        "surname": surname,
        "suffix": suffix,
        "full_name": raw,
        "parser_confidence": round(confidence, 2)
    }
