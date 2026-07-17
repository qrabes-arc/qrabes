import json
import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen3:latest"   # ya llama3


def rewrite_article(article):

    prompt = f"""
You are a professional luxury magazine editor.

Rewrite the following article.

Rules:

1. Keep facts correct.
2. Never copy original sentences.
3. Create a new unique title.
4. Create a new unique summary.
5. Return ONLY JSON.

Format:

{{
"title":"",
"summary":""
}}

Title:
{article["title"]}

Summary:
{article["summary"]}
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

    try:
        return json.loads(result)
    except:
        return {
            "title": article["title"],
            "summary": article["summary"]
        }
