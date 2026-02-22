import pdfplumber
from pathlib import Path
from tqdm import tqdm

BASE_DIR = Path(__file__).resolve().parent

CAP1_PDF = BASE_DIR / "dse_cap1_cutoff_2025_26.pdf"
CAP2_PDF = BASE_DIR / "dse_cap2_cutoff_2025_26.pdf"

def extract_pages(pdf_path):
    print(f"Opening: {pdf_path}")  # debug
    with pdfplumber.open(str(pdf_path)) as pdf:
        text = []
        for page in tqdm(pdf.pages):
            page_text = page.extract_text()
            if page_text:
                text.append(page_text)
        return "\n".join(text)

cap1_text = extract_pages(CAP1_PDF)
cap2_text = extract_pages(CAP2_PDF)

with open(BASE_DIR / "raw_cap1.txt", "w", encoding="utf-8") as f:
    f.write(cap1_text)

with open(BASE_DIR / "raw_cap2.txt", "w", encoding="utf-8") as f:
    f.write(cap2_text)

print("✅ raw_cap1.txt and raw_cap2.txt generated")

