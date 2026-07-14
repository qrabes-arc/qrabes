name: Run Crawler

on:
  workflow_dispatch:
  schedule:
    - cron: "0 * * * *"

permissions:
  contents: read

jobs:
  crawl:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - run: |
          python -m pip install --upgrade pip
          pip install feedparser requests beautifulsoup4

      - run: python crawler.py
