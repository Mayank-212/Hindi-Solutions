import os
import requests
from bs4 import BeautifulSoup
from googlesearch import search

# ---------- SETTINGS ----------
base_query = "Study Ranker Class 9 Hindi"
results_limit = 1

# Kshitij Chapters
kshitij_chapters = [
    "दो बैलों की कथा",
    "ल्हासा की ओर",
    "उपभोक्तावाद की संस्कृति",
    "साँवले सपनों की याद",
    "प्रेमचंद के फटे जूते",
    "मेरे बचपन के दिन",
    "साखियाँ एवं सबद",
    "वाख",
    "सवैये",
    "कैदी और कोकिला",
    "ग्राम श्री",
    "मेघ आए",
    "बच्चे काम पर जा रहे हैं"
]

# Kritika Chapters
kritika_chapters = [
    "इस जल प्रलय में",
    "मेरे संग की औरतें",
    "रीढ़ की हड्डी",
    "माटी वाली",
    "किस तरह आखिरकार मैं हिंदी में आया"
]

# Create output folders
os.makedirs("output/Kshitij", exist_ok=True)
os.makedirs("Kritika", exist_ok=True)

print("Starting full automatic search & save process...")

def scrape_and_save(book_name, chapter_name):
    search_query = f"{base_query} {book_name} {chapter_name} NCERT solutions"
    print(f"\n🔍 Searching: {search_query}")

    try:
        url = next(search(search_query, num_results=results_limit))
        print("🌐 Found:", url)

        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")

        content = []
        for tag in soup.find_all(['p', 'li', 'h2', 'h3']):
            text = tag.get_text(strip=True)
            if len(text) > 25:
                content.append(text)

        # Save file
        safe_name = chapter_name.replace(" ", "_")
        folder = "output/Kshitij" if book_name == "Kshitij" else "output/Kritika"
        file_path = f"{folder}/{safe_name}.txt"

        with open(file_path, "w", encoding="utf-8") as f:
            for line in content:
                f.write(line + "\n")

        print(f"✅ Saved: {file_path}")

    except Exception as e:
        print("❌ Error:", e)


# Loop through all chapters
for ch in kshitij_chapters:
    scrape_and_save("Kshitij", ch)

for ch in kritika_chapters:
    scrape_and_save("Kritika", ch)

print("\n🎉 All chapters processed!")
