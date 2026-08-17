"""
explainability.py — Explainable AI (XAI) Engine for Name Intelligence
Provides simple (user-facing) and technical (developer-facing) evidence explaining prediction outcomes.
"""

def generate_explanation(raw_name, given_name, ensemble_result):
    """
    Constructs explainability factors from ensemble output and linguistic heuristics.
    """
    label = ensemble_result.get("label", "UNKNOWN")
    sub_models = ensemble_result.get("sub_models", {})
    agreement = ensemble_result.get("model_agreement", 50.0)
    reliability = ensemble_result.get("reliability_score", 0.5)
    
    simple_factors = []
    technical_factors = []
    
    name_clean = (given_name or raw_name).strip().lower()
    
    # 1. Lookup Database Evidence
    lookup_info = sub_models.get("lookup", {})
    if lookup_info.get("found"):
        simple_factors.append("• Strong database match found in 10.48M ground-truth name records.")
        technical_factors.append(f"[Lookup Engine] O(1) exact hit for '{name_clean}' -> {lookup_info.get('prediction')}")
    else:
        simple_factors.append("• Model relied on character n-grams and phonetic heuristics (no exact database entry).")
        technical_factors.append(f"[Lookup Engine] Miss for '{name_clean}', deferred to ML classifiers.")

    # 2. Suffix / Phonetic Pattern Evidence
    from backend.services.ensemble_engine import FEMALE_PATTERNS, MALE_PATTERNS
    
    if name_clean.endswith(FEMALE_PATTERNS):
        matched_pat = next(p for p in FEMALE_PATTERNS if name_clean.endswith(p))
        simple_factors.append(f"• Character suffix '-{matched_pat}' is strongly associated with female given names.")
        technical_factors.append(f"[Phonetic Rules] Female suffix pattern matched: '-{matched_pat}'")
    elif name_clean.endswith(MALE_PATTERNS):
        matched_pat = next(p for p in MALE_PATTERNS if name_clean.endswith(p))
        simple_factors.append(f"• Character suffix '-{matched_pat}' is strongly associated with male given names.")
        technical_factors.append(f"[Phonetic Rules] Male suffix pattern matched: '-{matched_pat}'")

    # 3. Model Agreement & Classifier Evidence
    if agreement >= 80.0:
        simple_factors.append(f"• High model consensus ({agreement}% agreement across active classifiers).")
    elif agreement >= 60.0:
        simple_factors.append(f"• Moderate model consensus ({agreement}% agreement across active classifiers).")
    else:
        simple_factors.append(f"• Split classifier agreement ({agreement}%) — input exhibits mixed gender-associated patterns.")
        
    technical_factors.append(f"[Consensus] Model agreement score: {agreement}% across sub-models")
    
    # 4. Classifier specific technical factors
    nb_info = sub_models.get("naive_bayes", {})
    if nb_info.get("active"):
        technical_factors.append(f"[Naïve Bayes] Male Prob: {nb_info.get('male_prob'):.3f}, Female Prob: {nb_info.get('female_prob'):.3f}")
        
    dt_info = sub_models.get("decision_tree", {})
    if dt_info.get("active"):
        technical_factors.append(f"[Decision Tree] Male Prob: {dt_info.get('male_prob'):.3f}, Female Prob: {dt_info.get('female_prob'):.3f}")

    char_info = sub_models.get("char_ngram", {})
    if char_info.get("active"):
        technical_factors.append(f"[Char N-Gram] Sub-word token split score: M={char_info.get('male_prob'):.3f}, F={char_info.get('female_prob'):.3f}")

    # 5. Reliability Summary Factor
    technical_factors.append(f"[Reliability Score] Calculated score: {reliability:.3f}")

    if label == "AMBIGUOUS":
        simple_factors.append("⚠️ Ambiguous classification: Equal probability distribution between male and female associations.")
    elif label == "UNKNOWN":
        simple_factors.append("⚠️ Insufficient statistical data or invalid character tokens to generate a confident prediction.")

    return {
        "simple_factors": simple_factors,
        "technical_factors": technical_factors
    }
