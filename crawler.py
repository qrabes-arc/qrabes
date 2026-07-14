import feedparser
import requests
from bs4 import BeautifulSoup
import json

RSS_FEEDS = [
    "https://www.vogue.com/feed/rss",
    "https://www.architecturaldigest.com/feed/rss",
    "https://www.robbreport.com/feed/",
    "https://www.luxuo.com/feed"
]

articles = []

for feed in RSS_FEEDS:
    data = feedparser.parse(feed)

    for item in data.entries[:10]:

        article = {
            "title": item.title,
            "url": item.link,
            "published": item.get("published", ""),
            "summary": "",
            "image": "",
            "source": feed
        }

        try:
            html = requests.get(item.link, timeout=10).text
            soup = BeautifulSoup(html, "html.parser")

            desc = soup.find("meta", attrs={"name": "description"})
            img = soup.find("meta", attrs={"property": "og:image"})

            if desc:
                article["summary"] = desc.get("content", "")

            if img:
                article["image"] = img.get("content", "")

        except:
            pass

        articles.append(article)

with open("articles.json", "w", encoding="utf-8") as f:
    json.dump(articles, f, ensure_ascii=False, indent=2)

print("Saved", len(articles), "articles.")
