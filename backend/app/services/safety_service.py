from app.schemas.safety import SafetyAnalysis

CRISIS_RESPONSE = (
    "I am really sorry you are feeling this much pain. You should not stay alone with this. "
    "Please contact someone you trust right now or local emergency support immediately. "
    "I can stay here with you while you reach out."
)

CRISIS_INDICATORS = [
    "suicide",
    "kill myself",
    "end my life",
    "i want to die",
    "want to die",
    "no reason to live",
    "hurt myself",
    "self harm",
    "cut myself",
    "i will die",
    "i cannot live",
    "i can't live",
    "ending everything",
]

SENSITIVE_INDICATORS = [
    "depressed",
    "panic attack",
    "abuse",
    "trauma",
    "hopeless",
    "worthless",
    "i hate myself",
    "very lonely",
    "heartbroken",
]


def analyze_safety(message: str) -> SafetyAnalysis:
    normalized = message.lower()
    for phrase in CRISIS_INDICATORS:
        if phrase in normalized:
            return SafetyAnalysis("crisis", f"Matched crisis indicator: {phrase}", True)

    for phrase in SENSITIVE_INDICATORS:
        if phrase in normalized:
            return SafetyAnalysis("sensitive", f"Matched sensitive indicator: {phrase}", False)

    return SafetyAnalysis("normal", "No safety indicator matched", False)


def crisis_response() -> str:
    return CRISIS_RESPONSE
