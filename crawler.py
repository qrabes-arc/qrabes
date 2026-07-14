import feedparser
import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime


RSS_FEEDS = [

    "https://www.vogue.com/feed/rss",
    "https://www.architecturaldigest.com/feed/rss",
    "https://robbreport.com/feed/",
    "https://www.luxuo.com/feed/"

]


FILE = "articles.json"


articles = []



# =========================
# Old Data Load
# =========================

if os.path.exists(FILE):

    with open(FILE,"r",encoding="utf-8") as f:

        articles = json.load(f)



existing_urls = {

article["url"]

for article in articles

}




# =========================
# Crawl
# =========================


for feed_url in RSS_FEEDS:


    print("Crawling:",feed_url)


    feed = feedparser.parse(feed_url)



    for entry in feed.entries:


        url = entry.get("link","")



        # Duplicate Check

        if url in existing_urls:

            continue



        article = {


            "title":
            entry.get("title",""),


            "url":
            url,


            "published":
            entry.get("published",""),


            "description":"",


            "image":"",


            "category":"Luxury",


            "source":
            feed.feed.get("title",""),


            "created_at":
            str(datetime.now())

        }





        try:


            response=requests.get(

            url,

            timeout=10,

            headers={
            "User-Agent":"Mozilla/5.0"
            }

            )


            soup=BeautifulSoup(
            response.text,
            "html.parser"
            )



            desc=soup.find(
            "meta",
            attrs={
            "name":"description"
            }
            )


            if desc:

                article["description"]=desc.get(
                "content",
                ""
                )




            image=soup.find(
            "meta",
            attrs={
            "property":"og:image"
            }
            )


            if image:

                article["image"]=image.get(
                "content",
                ""
                )



        except Exception as e:

            print(e)




        articles.append(article)

        existing_urls.add(url)



# =========================
# Save
# =========================


with open(
FILE,
"w",
encoding="utf-8"
) as f:


    json.dump(

    articles,

    f,

    ensure_ascii=False,

    indent=2

    )



print(
"Total Articles:",
len(articles)
)


print(
"Updated Successfully ✅"
)
