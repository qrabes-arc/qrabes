import json
import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen3:latest"      # ya llama3


def generate_image_prompt(title, summary):

    prompt = f"""
You are a professional AI prompt engineer.

Create one original image prompt.

Rules:

- Ultra realistic
- Editorial photography
- Luxury style
- Cinematic lighting
- High detail
- Premium quality
- No logo
- No watermark
- Unique composition
- Don't copy any existing image

Title:
{title}

Summary:
{summary}

Return only the prompt.
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False
        }
    )

    result = response.json()["response"]

    return result.strip()
