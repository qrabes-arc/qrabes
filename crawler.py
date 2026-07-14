import feedparser
import requests
from bs4 import BeautifulSoup
import json

RSS_FEEDS = [
    "https://www.vogue.com/feed/rss",
    "https://www.architecturaldigest.com/feed/rss",
    "https://robbreport.com/feed/",
    "https://www.luxuo.com/feed/"
]

articles = []

for feed_url in RSS_FEEDS:
    print(f"Crawling: {feed_url}")

    feed = feedparser.parse(feed_url)

    for entry in feed.entries:

        article = {
            "title": entry.get("title", ""),
            "url": entry.get("link", ""),
            "published": entry.get("published", ""),
            "summary": "",
            "image": "",
            "source": feed.feed.get("title", "")
        }

        try:
            response = requests.get(article["url"], timeout=10)

            soup = BeautifulSoup(response.text, "html.parser")

            description = soup.find("meta", attrs={"name": "description"})
            if description:
                article["summary"] = description.get("content", "")

            image = soup.find("meta", attrs={"property": "og:image"})
            if image:
                article["image"] = image.get("content", "")

        except Exception as e:
            print(e)

        articles.append(article)

print(f"Total Articles: {len(articles)}")

with open("articles.json", "w", encoding="utf-8") as f:
    json.dump(articles, f, ensure_ascii=False, indent=2)

print("articles.json created successfully ✅")
