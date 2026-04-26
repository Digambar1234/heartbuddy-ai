EMOTION_KEYWORDS: dict[str, list[str]] = {
    "heartbroken": ["breakup", "miss her", "miss him", "heartbreak", "relationship ended"],
    "lonely": ["lonely", "alone", "no one", "nobody cares", "ignored"],
    "anxious": ["anxious", "anxiety", "nervous", "worried", "scared"],
    "angry": ["angry", "mad", "furious", "annoyed", "rage"],
    "demotivated": ["useless", "failure", "failed", "no motivation", "can't focus", "compare myself"],
    "happy": ["happy", "joy", "excited", "good day"],
    "proud": ["proud", "achieved", "completed", "won"],
    "confused": ["confused", "don't understand", "not sure", "lost"],
    "stressed": ["stressed", "pressure", "overwhelmed", "burned out", "burnt out"],
    "sad": ["sad", "crying", "cried", "upset", "low", "broken"],
}


def detect_emotion(message: str) -> str:
    normalized = message.lower()
    for emotion, keywords in EMOTION_KEYWORDS.items():
        if any(keyword in normalized for keyword in keywords):
            return emotion
    return "neutral"
