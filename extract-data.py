import pdfplumber
import json
import re

PLATE_TO_NAME = {
    "01": "Adana", "02": "Adıyaman", "03": "Afyonkarahisar", "04": "Ağrı",
    "05": "Amasya", "06": "Ankara", "07": "Antalya", "08": "Artvin",
    "09": "Aydın", "10": "Balıkesir", "11": "Bilecik", "12": "Bingöl",
    "13": "Bitlis", "14": "Bolu", "15": "Burdur", "16": "Bursa",
    "17": "Çanakkale", "18": "Çankırı", "19": "Çorum", "20": "Denizli",
    "21": "Diyarbakır", "22": "Edirne", "23": "Elazığ", "24": "Erzincan",
    "25": "Erzurum", "26": "Eskişehir", "27": "Gaziantep", "28": "Giresun",
    "29": "Gümüşhane", "30": "Hakkari", "31": "Hatay", "32": "Isparta",
    "33": "Mersin", "34": "İstanbul", "35": "İzmir", "36": "Kars",
    "37": "Kastamonu", "38": "Kayseri", "39": "Kırklareli", "40": "Kırşehir",
    "41": "Kocaeli", "42": "Konya", "43": "Kütahya", "44": "Malatya",
    "45": "Manisa", "46": "Kahramanmaraş", "47": "Mardin", "48": "Muğla",
    "49": "Muş", "50": "Nevşehir", "51": "Niğde", "52": "Ordu",
    "53": "Rize", "54": "Sakarya", "55": "Samsun", "56": "Siirt",
    "57": "Sinop", "58": "Sivas", "59": "Tekirdağ", "60": "Tokat",
    "61": "Trabzon", "62": "Tunceli", "63": "Şanlıurfa", "64": "Uşak",
    "65": "Van", "66": "Yozgat", "67": "Zonguldak", "68": "Aksaray",
    "69": "Bayburt", "70": "Karaman", "71": "Kırıkkale", "72": "Batman",
    "73": "Şırnak", "74": "Bartın", "75": "Ardahan", "76": "Iğdır",
    "77": "Yalova", "78": "Karabük", "79": "Kilis", "80": "Osmaniye",
    "81": "Düzce"
}
ALL_PROVINCES = set(PLATE_TO_NAME.values())

BIOTECH_KEYWORDS = [
    "biyoteknoloji", "biyolojik", "biyokimya", "biyopolimer", "biyoplastik",
    "biyokömür", "biyogübre", "biyogaz",
    "enzim", "enzimatik", "fermentasyon",
    "probiyotik", "prebiyotik",
    "mikroalg", "mikroorganizma",
    "fitokimyasal",
    "bitkisel ekstrakt",
    "tıbbi ve aromatik bitkilerden",
    "tarımsal ürünlerden katma değerli",
    "tarımsal ürünlerden ve/veya atıklarından katma değerli",
    "gıda takviyeleri",
    "fonksiyonel gıda",
    "protein izolat", "protein konsantre",
    "kazein", "pektin",
    "doğal renklendirici",
    "nişasta tabanlı kimyasal",
    "polilaktik asit", "askorbik asit",
    "glukonik asit",
    "mannitol", "sorbitol",
    "kolajen", "tohum priming",
    "antimikrobiyal", "spirulina", "klorella",
    "omega-3", "fitosterol",
    "meyve/sebze ve atıklarından katma değerli",
    "meyve ve sebzeden katma değerli",
]

def is_biotech(text):
    t = text.lower()
    return any(kw in t for kw in BIOTECH_KEYWORDS)

def extract_clean_lines():
    with pdfplumber.open('ek-1-yerel-yatirim-konulari-listesi.pdf') as pdf:
        raw_lines = []
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                raw_lines.extend(text.split('\n'))

    skip = {'Ek-1: Yerel Yatırım Konuları Listesi', 'İl Adı Yatırım Konusu'}
    result = []
    for line in raw_lines:
        line = line.strip()
        if not line or line in skip or re.match(r'^\d+$', line):
            continue
        result.append(line)
    return result

def tag_lines(lines):
    """Tag each line as ('province', name, remainder) or ('text', '', content)."""
    tagged = []
    for line in lines:
        if line in ALL_PROVINCES:
            tagged.append(('province', line, ''))
            continue
        matched = False
        for prov in ALL_PROVINCES:
            if line.startswith(prov + ' ') and len(line) > len(prov) + 2:
                tagged.append(('province', prov, line[len(prov):].strip()))
                matched = True
                break
        if not matched:
            tagged.append(('text', '', line))
    return tagged

def build_province_texts(tagged):
    """
    PDF table structure: province name appears in middle of its topic block.

    Correct assignment:
    - Text BEFORE province[0]'s name  → province[0] (pre-name topics)
    - Text AFTER province[i]'s name, BEFORE province[i+1]'s name → province[i] (post-name topics)

    So province[i]'s full text = (its pre-name block) only if i==0,
    plus its post-name block (text after its name until next province name).
    """
    prov_positions = [(i, prov, rem)
                      for i, (typ, prov, rem) in enumerate(tagged)
                      if typ == 'province']

    def get_text_range(start, end):
        return [tagged[i][2] for i in range(start, end) if tagged[i][0] == 'text']

    province_texts = {}

    for idx, (pos, prov_name, remainder) in enumerate(prov_positions):
        lines = []

        # Only first province in PDF gets the pre-name text
        if idx == 0:
            lines.extend(get_text_range(0, pos))

        # Add remainder from province name line (e.g., "Ardahan Entegre Kaz...")
        if remainder:
            lines.append(remainder)

        # Add all text after this province until the next province name
        next_pos = prov_positions[idx + 1][0] if idx + 1 < len(prov_positions) else len(tagged)
        lines.extend(get_text_range(pos + 1, next_pos))

        if prov_name not in province_texts:
            province_texts[prov_name] = []
        province_texts[prov_name].extend(lines)

    return province_texts

def split_topics(raw_lines):
    """Group continuation lines into single topic strings."""
    topics = []
    current = []

    def flush():
        if current:
            topics.append(' '.join(current))
            current.clear()

    for line in raw_lines:
        if not line:
            continue
        if not current:
            current.append(line)
            continue

        prev = current[-1]
        # New topic if previous line ended a complete thought
        # and current line starts with uppercase
        prev_ended = (
            prev.endswith('vb.)') or
            prev.endswith('.)') or
            prev.endswith('.')
        )
        starts_upper = bool(re.match(r'^[A-ZÇĞİÖŞÜ0-9]', line))
        is_continuation = (
            prev.endswith(',') or prev.endswith('(') or
            prev.endswith('ve') or prev.endswith('veya') or
            prev.endswith('ile') or prev.endswith('ve/veya')
        )

        if prev_ended and starts_upper and not is_continuation:
            flush()
            current.append(line)
        elif starts_upper and len(prev) > 50 and not is_continuation and not prev.endswith('vb.'):
            # Long line ended, next starts fresh → probably new topic
            flush()
            current.append(line)
        else:
            current.append(line)

    flush()
    return [t.strip() for t in topics if t.strip()]

def main():
    lines = extract_clean_lines()
    tagged = tag_lines(lines)
    province_texts = build_province_texts(tagged)

    result = {}
    for plate, prov_name in sorted(PLATE_TO_NAME.items()):
        raw = province_texts.get(prov_name, [])
        topics = split_topics(raw)
        flags = [is_biotech(t) for t in topics]
        result[plate] = {
            'name': prov_name,
            'topics': topics,
            'biotech_flags': flags,
            'has_biotech': any(flags)
        }

    with open('province-topics.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    biotech_count = sum(1 for v in result.values() if v['has_biotech'])
    topic_count = sum(len(v['topics']) for v in result.values())
    print(f"Toplam il: 81 | Biotech il: {biotech_count} | Toplam topic: {topic_count}")
    print("\n=== BIOTECH İLLER ===")
    for plate, data in sorted(result.items()):
        if data['has_biotech']:
            print(f"  {plate} - {data['name']}")

    print("\n=== ÖRNEK: Adana topics ===")
    for t, f in zip(result['01']['topics'], result['01']['biotech_flags']):
        print(f"  {'[B]' if f else '   '} {t[:100]}")

    print("\n=== ÖRNEK: Adıyaman topics ===")
    for t, f in zip(result['02']['topics'], result['02']['biotech_flags']):
        print(f"  {'[B]' if f else '   '} {t[:100]}")

main()
