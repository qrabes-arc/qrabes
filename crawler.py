import feedparser
import requests
from bs4 import BeautifulSoup

RSS_FEEDS = [
    "https://www.vogue.com/feed/rss",
    "https://www.architecturaldigest.com/feed/rss"
]

articles = []

for feed in RSS_FEEDS:
    data = feedparser.parse(feed)

    for item in data.entries:
        article = {
            "title": item.title,
            "url": item.link,
            "published": item.get("published", "")
        }

        try:
            html = requests.get(item.link, timeout=10).text
            soup = BeautifulSoup(html, "html.parser")

            description = soup.find("meta", attrs={"name": "description"})
            image = soup.find("meta", attrs={"property": "og:image"})

            article["summary"] = (
                description["content"] if description else ""
            )

            article["image"] = (
                image["content"] if image else ""
            )

        except Exception:
            article["summary"] = ""
            article["image"] = ""

        articles.append(article)

for a in articles:
    print(a)
