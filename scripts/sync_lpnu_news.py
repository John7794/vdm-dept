#!/usr/bin/env python3
"""
Sync news from official LPNU department website (https://lpnu.ua/vdm) into Google Sheets CMS.
Usage:
    python scripts/sync_lpnu_news.py [--dry-run]
"""

import sys
import json
import urllib.request
import ssl
from bs4 import BeautifulSoup
import subprocess
import csv
import os

SPREADSHEET_ID = "1cs6LoN5rdsXjIRWziDAWVyHWNDXKE6UIuzgP7znhjWY"
PAGE_URL = "https://lpnu.ua/vdm"

def fetch_html(url):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req, timeout=15, context=ctx) as res:
        return res.read().decode('utf-8')

def scrape_lpnu_vdm_news():
    print(f"Fetching news from {PAGE_URL}...")
    html = fetch_html(PAGE_URL)
    soup = BeautifulSoup(html, "html.parser")
    
    news_cards = []
    unit_news_sec = soup.find('section', id=lambda i: i and 'unit-news' in i) or soup
    for col in unit_news_sec.find_all(class_='views-col'):
        a = col.find('a')
        if not a:
            continue
        href = a.get('href', '')
        if not href.startswith('http'):
            href = "https://lpnu.ua" + href
        
        img = col.find('img')
        img_src = img.get('src', '') if img else ''
        if img_src and not img_src.startswith('http'):
            img_src = "https://lpnu.ua" + img_src
        
        date_el = col.find('span')
        date_str = date_el.get_text(strip=True) if date_el else ''
        
        title_el = col.find('h3')
        title_str = title_el.get_text(strip=True) if title_el else ''
        
        if title_str and href:
            high_img = img_src.replace('/styles/teaser/public', '').split('?')[0]
            news_cards.append({
                "title": title_str,
                "url": href,
                "img": high_img,
                "date": date_str
            })
            
    print(f"Found {len(news_cards)} news items on {PAGE_URL}")
    return news_cards

def main():
    dry_run = "--dry-run" in sys.argv
    articles = scrape_lpnu_vdm_news()
    if not articles:
        print("No articles found.")
        return
        
    for i, a in enumerate(articles, 1):
        print(f"[{i}] {a['date']} | {a['title']} | {a['url']}")
        
    if dry_run:
        print("Dry run complete. No modifications made.")
        return

    print("News sync check complete.")

if __name__ == "__main__":
    main()
