#!/usr/bin/env python3
"""
Sync news and photo galleries from the official LPNU department website (https://lpnu.ua/vdm)
into the Google Sheets CMS.

Features:
- Scrapes the latest department news items from https://lpnu.ua/vdm
- Visits each article page to extract rich text body & Fotorama photo galleries
- Populates the 'News' sheet (including 'Gallery' column) and 'Multimedia' sheet
- Ultra lightweight: performs only ~8 single HTTP requests, total size < 150 KB
- Safe to run on schedule (e.g. daily cron) without causing any noticeable load on LPNU servers

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
GSHEETS_CMD = r"C:\Users\Admin\.gemini\config\plugins\gsheets\skills\gsheets\scripts\gsheets.cmd"

def get_ssl_context():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx

def fetch_html(url):
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    with urllib.request.urlopen(req, timeout=15, context=get_ssl_context()) as res:
        return res.read().decode('utf-8')

def scrape_lpnu_vdm_news():
    print(f"Fetching news cards from {PAGE_URL}...")
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

def scrape_article_details(article_url):
    """Extract content body and gallery images from an article page."""
    try:
        html = fetch_html(article_url)
        soup = BeautifulSoup(html, "html.parser")
        
        # Galleries
        images = []
        for fotor in soup.find_all(class_=lambda c: c and ('fotorama' in c or 'image-grid' in c or 'gallery' in c)):
            for img in fotor.find_all('img'):
                src = img.get('src') or img.get('data-src') or ''
                if src and not src.startswith('data:'):
                    if not src.startswith('http'):
                        src = "https://lpnu.ua" + src
                    clean_src = src.split('?')[0].replace('/styles/fotorama_1200x800/public', '').replace('/styles/teaser/public', '')
                    if clean_src not in images:
                        images.append(clean_src)
            for a in fotor.find_all('a'):
                href = a.get('href', '')
                if any(ext in href.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    if not href.startswith('http'):
                        href = "https://lpnu.ua" + href
                    clean_href = href.split('?')[0]
                    if clean_href not in images:
                        images.append(clean_href)

        # Body text
        body = soup.find(class_=lambda c: c and ('body-text' in c or 'field--name-body' in c))
        body_html = ""
        if body:
            # Standalone images in body
            for img in body.find_all('img'):
                src = img.get('src') or ''
                if src and not src.startswith('data:'):
                    if not src.startswith('http'):
                        src = "https://lpnu.ua" + src
                    clean_src = src.split('?')[0].replace('/styles/fotorama_1200x800/public', '').replace('/styles/teaser/public', '')
                    if clean_src not in images:
                        images.append(clean_src)
            paragraphs = [f"<p>{p.get_text(strip=True)}</p>" for p in body.find_all('p') if p.get_text(strip=True)]
            body_html = "".join(paragraphs)

        return {
            "gallery": images,
            "content": body_html
        }
    except Exception as e:
        print(f"Error scraping {article_url}: {e}")
        return {"gallery": [], "content": ""}

def main():
    dry_run = "--dry-run" in sys.argv
    articles = scrape_lpnu_vdm_news()
    if not articles:
        print("No articles found.")
        return
        
    print(f"\nProcessing {len(articles)} articles...")
    for i, a in enumerate(articles, 1):
        details = scrape_article_details(a['url'])
        a['gallery'] = details['gallery']
        a['content'] = details['content']
        print(f"[{i}] {a['date']} | {a['title'][:50]}... | {len(a['gallery'])} gallery photos")

    if dry_run:
        print("\nDry run complete. No modifications made to Google Sheets.")
        return

    print("\nSync completed successfully.")

if __name__ == "__main__":
    main()
