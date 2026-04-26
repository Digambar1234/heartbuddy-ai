from dataclasses import dataclass


@dataclass(frozen=True)
class ExtractedMemory:
    memory_text: str
    memory_type: str
    emotion: str | None
    importance_score: int


GENERIC_SHORT_MESSAGES = {
    "hello",
    "hi",
    "okay",
    "ok",
    "yes",
    "no",
    "thanks",
    "thank you",
    "hmm",
    "what should i do",
}


def extract_memories_from_message(message: str, emotion: str) -> list[ExtractedMemory]:
    normalized = message.lower().strip()
    words = normalized.split()
    emotionally_strong = emotion not in {"neutral", "confused"}
    if normalized in GENERIC_SHORT_MESSAGES or (len(words) < 6 and not emotionally_strong):
        return []

    memory_type = _classify_memory_type(normalized)
    if not memory_type:
        return []

    importance = 7 if emotionally_strong else 6
    if memory_type in {"goal", "relationship_context", "negative_pattern", "trigger"}:
        importance += 1

    return [
        ExtractedMemory(
            memory_text=_normalize_memory_text(message),
            memory_type=memory_type,
            emotion=emotion if emotion != "neutral" else None,
            importance_score=min(10, importance),
        )
    ]


def extract_memories_with_llm(message: str, emotion: str) -> list[ExtractedMemory]:
    return extract_memories_from_message(message, emotion)


def _classify_memory_type(normalized: str) -> str | None:
    if any(phrase in normalized for phrase in ["goal", "want to become", "preparing for"]):
        return "goal"
    if any(phrase in normalized for phrase in ["motivate me", "support me", "talk softly"]):
        return "preference"
    if any(phrase in normalized for phrase in ["hate", "trigger", "ignore", "ignored", "compare"]):
        return "negative_pattern" if "compare" in normalized else "trigger"
    if any(phrase in normalized for phrase in ["happy", "proud", "completed", "achieved"]):
        return "achievement" if any(phrase in normalized for phrase in ["completed", "achieved"]) else "positive_pattern"
    if any(phrase in normalized for phrase in ["cry", "cried", "sad", "lonely", "rejected", "fight", "pressure"]):
        return "emotional_event"
    if any(phrase in normalized for phrase in ["family", "friend", "girlfriend", "boyfriend", "ex"]):
        return "relationship_context"
    if any(phrase in normalized for phrase in ["i feel", "i am", "i'm", "my "]):
        return "personal_fact"
    return None


def _normalize_memory_text(message: str) -> str:
    cleaned = " ".join(message.strip().split())
    if cleaned.lower().startswith("i "):
        return f"User {cleaned[2:]}"
    if cleaned.lower().startswith("i'm "):
        return f"User is {cleaned[4:]}"
    if cleaned.lower().startswith("i am "):
        return f"User is {cleaned[5:]}"
    return f"User said: {cleaned}"
