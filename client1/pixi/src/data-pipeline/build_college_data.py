import re
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
RAW_TEXT = BASE_DIR / "raw_text.txt"
OUTPUT = BASE_DIR / "college_data.json"

college_pattern = re.compile(r"^(\d{4,5})\s+(.*?)\s+\((.*?)\)$")
branch_pattern = re.compile(
    r"Choice Code\s*:\s*(\d+)\s*Course Name\s*:\s*(.*)"
)
category_pattern = re.compile(r"^[A-Z\- ]+$")
percent_pattern = re.compile(r"\((\d+\.\d+)%\)")

colleges = {}
current_college = None
current_branch = None
current_categories = []

with open(RAW_TEXT, "r", encoding="utf-8") as f:
    for raw_line in f:
        line = raw_line.strip()

        # 1️⃣ College line
        c_match = college_pattern.match(line)
        if c_match:
            cid, cname, ctype = c_match.groups()
            current_college = colleges.setdefault(cid, {
                "id": cid,
                "name": cname,
                "type": ctype,
                "region": None,
                "branches": {}
            })
            current_branch = None
            continue

        # 2️⃣ Branch line
        b_match = branch_pattern.search(line)
        if b_match and current_college:
            bcode, bname = b_match.groups()
            current_branch = current_college["branches"].setdefault(bcode, {
                "name": bname.strip(),
                "code": bcode,
                "cutoffs": {}
            })
            current_categories = []
            continue

        # 3️⃣ Category line (GOPEN GOBC EWS ...)
        if category_pattern.match(line) and current_branch:
            current_categories = line.split()
            continue

        # 4️⃣ Percentage lines
        if current_branch and current_categories:
            percents = percent_pattern.findall(line)
            if percents:
                for cat, pct in zip(current_categories, percents):
                    current_branch["cutoffs"][cat] = float(pct)
                current_categories = []

# Normalize structure
final_data = []
for college in colleges.values():
    college["branches"] = list(college["branches"].values())
    final_data.append(college)

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(final_data, f, indent=2, ensure_ascii=False)

print("✅ college_data.json generated")
