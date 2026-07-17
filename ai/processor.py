
import json
from pathlib import Path
from rewrite import rewrite_article

# Folder paths
BASE_DIR = Path(__file__).resolve().parent
RAW_JSON = BASE_DIR.parent / "crawler" / "articles.json"
OUTPUT_JSON = BASE_DIR / "clean_articles.json"


def process_articles():

    # Read raw articles
    with open(RAW_JSON, "r", encoding="utf-8") as f:
        articles = json.load(f)

    clean_articles = []

    for index, article in enumerate(articles):

        print(f"Processing {index + 1}/{len(articles)}")

        rewritten = rewrite_article(article)

        clean_article = {
            "id": index + 1,
            "title": rewritten["title"],
            "summary": rewritten["summary"],
            "url": article.get("url", ""),
            "source": article.get("source", ""),
            "published": article.get("published", ""),
            "image": "",
            "status": "processed"
        }

        clean_articles.append(clean_article)

    # Save output
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(clean_articles, f, ensure_ascii=False, indent=4)

    print("Done!")
    print(f"Saved {len(clean_articles)} articles.")


if __name__ == "__main__":
    process_articles()
