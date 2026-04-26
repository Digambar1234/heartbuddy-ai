from dataclasses import dataclass

from openai import OpenAI

from app.core.config import settings


@dataclass(frozen=True)
class LLMResponse:
    text: str
    provider: str
    model: str
    used_fallback_response: bool


FALLBACK_TEXT = (
    "I am here with you. I may not have the full AI engine connected right now, "
    "but I can still support you. What you are feeling matters. Tell me what happened today, "
    "and we will take it one step at a time."
)


def generate_response(prompt: str) -> LLMResponse:
    provider = settings.LLM_PROVIDER.lower()
    if provider == "openai":
        return _generate_openai_response(prompt)
    if provider in {"groq", "grok"}:
        return _generate_groq_response(prompt)
    if provider == "gemini":
        return _generate_gemini_response(prompt)
    return _fallback_response(provider=provider, model="fallback")


def _generate_openai_response(prompt: str) -> LLMResponse:
    if not settings.OPENAI_API_KEY:
        return _fallback_response("openai", settings.OPENAI_MODEL)

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.responses.create(
            model=settings.OPENAI_MODEL,
            input=prompt,
            max_output_tokens=450,
        )
        text = (response.output_text or "").strip()
        if not text:
            return _fallback_response("openai", settings.OPENAI_MODEL)
        return LLMResponse(text=text, provider="openai", model=settings.OPENAI_MODEL, used_fallback_response=False)
    except Exception:
        return _fallback_response("openai", settings.OPENAI_MODEL)


def _generate_groq_response(prompt: str) -> LLMResponse:
    if not settings.GROQ_API_KEY:
        return _fallback_response("groq", settings.GROQ_MODEL)

    try:
        client = OpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1",
        )
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are HeartBuddy AI. Follow the safety and companion instructions exactly.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=450,
            temperature=0.7,
        )
        text = (response.choices[0].message.content or "").strip()
        if not text:
            return _fallback_response("groq", settings.GROQ_MODEL)
        return LLMResponse(text=text, provider="groq", model=settings.GROQ_MODEL, used_fallback_response=False)
    except Exception:
        return _fallback_response("groq", settings.GROQ_MODEL)


def _generate_gemini_response(prompt: str) -> LLMResponse:
    if not settings.GEMINI_API_KEY:
        return _fallback_response("gemini", settings.GEMINI_MODEL)
    return _fallback_response("gemini", settings.GEMINI_MODEL)


def _fallback_response(provider: str, model: str) -> LLMResponse:
    return LLMResponse(text=FALLBACK_TEXT, provider=provider, model=model, used_fallback_response=True)
