# -*- coding: utf-8 -*-
"""Собирает docs/data.json для сайта из MED_STUDY_RU.md.

Markdown остаётся единственным источником правды: чтобы добавить API,
достаточно дописать строку в таблицу и запустить

    python scripts/med_site/build.py

С флагом --check скрипт ничего не пишет, а только проверяет,
что docs/data.json совпадает с MED_STUDY_RU.md (для CI).
"""

import json
import re
import sys
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'MED_STUDY_RU.md'
TARGET = ROOT / 'docs' / 'data.json'

ROW_RE = re.compile(r'^\|\s*\[(?P<name>[^\]]+)\]\((?P<url>[^)]+)\)\s*\|\s*(?P<desc>.*?)\s*\|\s*(?P<key>.*?)\s*\|\s*$')
STEP_RE = re.compile(r'^\d+\.\s+(?P<task>.+?)\s+—\s+\*\*(?P<name>[^*]+)\*\*')

# Пробные запросы для режима «Попробовать». cors=True означает, что сервер
# разрешает запросы из браузера и ответ можно показать прямо на сайте;
# иначе сайт предлагает открыть ссылку в новой вкладке.
EXAMPLES: Dict[str, dict] = {
    'RxNorm': {
        'label': 'Найти препараты с аспирином',
        'url': 'https://rxnav.nlm.nih.gov/REST/drugs.json?name=aspirin',
        'cors': True,
    },
    'openFDA': {
        'label': 'Инструкция к эпинефрину (без ключа, лимит 1000 запросов в день)',
        'url': 'https://api.fda.gov/drug/label.json?search=openfda.generic_name:epinephrine&limit=1',
        'cors': True,
    },
    'MedlinePlus Genetics': {
        'label': 'Муковисцидоз: описание и гены',
        'url': 'https://medlineplus.gov/download/genetics/condition/cystic-fibrosis.json',
        'cors': False,
    },
    'KEGG': {
        'label': 'Найти соединение «глюкоза»',
        'url': 'https://rest.kegg.jp/find/compound/glucose',
        'cors': False,
    },
    'MyGene.info': {
        'label': 'Ген TP53 у человека',
        'url': 'https://mygene.info/v3/query?q=symbol:TP53&species=human',
        'cors': True,
    },
    'RCSB PDB': {
        'label': 'Гемоглобин (структура 4HHB)',
        'url': 'https://data.rcsb.org/rest/v1/core/entry/4HHB',
        'cors': True,
    },
    'ENA': {
        'label': 'Сборки генома человека',
        'url': 'https://www.ebi.ac.uk/ena/portal/api/search?result=assembly&query=tax_eq(9606)&limit=3&format=json',
        'cors': True,
    },
    'NCBI E-utilities': {
        'label': 'Статьи PubMed про бронхиальную астму',
        'url': 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=asthma&retmode=json&retmax=5',
        'cors': True,
    },
    'Europe PMC': {
        'label': 'Статьи про артериальную гипертензию',
        'url': 'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=hypertension&format=json&pageSize=3',
        'cors': True,
    },
    'Semantic Scholar': {
        'label': 'Статьи про сепсис',
        'url': 'https://api.semanticscholar.org/graph/v1/paper/search?query=sepsis&limit=3',
        'cors': False,
    },
    'OpenAlex': {
        'label': 'Работы про сахарный диабет',
        'url': 'https://api.openalex.org/works?search=diabetes&per-page=3',
        'cors': True,
    },
    'Crossref Metadata Search': {
        'label': 'Публикации про сестринский уход',
        'url': 'https://api.crossref.org/works?query=nursing+care&rows=3',
        'cors': True,
    },
    'Wikipedia': {
        'label': 'Краткая статья «Адреналин» из русской Википедии',
        'url': 'https://ru.wikipedia.org/api/rest_v1/page/summary/%D0%90%D0%B4%D1%80%D0%B5%D0%BD%D0%B0%D0%BB%D0%B8%D0%BD',
        'cors': True,
    },
    'arXiv': {
        'label': 'Препринты по эпидемиологии',
        'url': 'https://export.arxiv.org/api/query?search_query=all:epidemiology&max_results=3',
        'cors': False,
    },
    'Open Library': {
        'label': 'Книги по анатомии',
        'url': 'https://openlibrary.org/search.json?q=anatomy&limit=3',
        'cors': True,
    },
    'Open Disease': {
        'label': 'Статистика COVID-19 по России',
        'url': 'https://disease.sh/v3/covid-19/countries/Russia',
        'cors': True,
    },
    'Free Dictionary': {
        'label': 'Слово tachycardia',
        'url': 'https://api.dictionaryapi.dev/api/v2/entries/en/tachycardia',
        'cors': True,
    },
    'Wiktionary': {
        'label': 'Статья cardiology',
        'url': 'https://en.wiktionary.org/w/api.php?action=parse&page=cardiology&prop=wikitext&format=json&origin=*',
        'cors': True,
    },
}


def parse_markdown(text: str) -> dict:
    """Разбирает подборку на категории, API и шаги «С чего начать»."""

    title = ''
    categories: List[dict] = []
    apis: List[dict] = []
    start: List[dict] = []
    notes: List[str] = []
    section = None

    for raw in text.splitlines():
        line = raw.strip()

        if line.startswith('# '):
            title = line[2:].strip()
            continue

        if line.startswith('## '):
            section = line[3:].strip()
            if section != 'С чего начать':
                categories.append({'id': f'c{len(categories) + 1}', 'name': section})
            continue

        if section is None:
            continue

        if section == 'С чего начать':
            step = STEP_RE.match(line)
            if step:
                start.append({'task': step.group('task'), 'api': step.group('name')})
            elif line and not line[0].isdigit():
                notes.append(line)
            continue

        row = ROW_RE.match(line)
        if row:
            name = row.group('name').strip()
            api = {
                'name': name,
                'url': row.group('url').strip(),
                'description': row.group('desc'),
                'key': row.group('key').lower() == 'ключ',
                'category': categories[-1]['id'],
            }
            if name in EXAMPLES:
                api['example'] = EXAMPLES[name]
            apis.append(api)

    names = [api['name'] for api in apis]
    for step in start:
        # В тексте можно писать короткое имя: «Crossref» вместо «Crossref Metadata Search».
        full = [n for n in names if n == step['api']] or [n for n in names if n.startswith(step['api'])]
        if len(full) == 1:
            step['api'] = full[0]

    return {
        'title': title,
        'categories': categories,
        'apis': apis,
        'start': start,
        'notes': notes,
    }


def validate(data: dict) -> List[str]:
    """Возвращает список ошибок: дубликаты, битые шаги, лишние примеры."""

    errors = []
    names = [api['name'] for api in data['apis']]

    for name in sorted({n for n in names if names.count(n) > 1}):
        errors.append(f'API «{name}» встречается несколько раз')

    for step in data['start']:
        if step['api'] not in names:
            errors.append(f'В «С чего начать» упомянут неизвестный API «{step["api"]}»')

    for name in EXAMPLES:
        if name not in names:
            errors.append(f'Пример для «{name}», которого нет в подборке')

    for api in data['apis']:
        if not api['url'].startswith('https://'):
            errors.append(f'У «{api["name"]}» ссылка не по HTTPS')

    return errors


def render(data: dict) -> str:
    return json.dumps(data, ensure_ascii=False, indent=2) + '\n'


def main(argv: List[str]) -> int:
    data = parse_markdown(SOURCE.read_text(encoding='utf-8'))
    errors = validate(data)
    if errors:
        for error in errors:
            print(f'Ошибка: {error}', file=sys.stderr)
        return 1

    output = render(data)

    if '--check' in argv:
        current = TARGET.read_text(encoding='utf-8') if TARGET.exists() else ''
        if current != output:
            print('docs/data.json устарел: запустите python scripts/med_site/build.py', file=sys.stderr)
            return 1
        print('docs/data.json актуален')
        return 0

    TARGET.write_text(output, encoding='utf-8')
    print(f'Записано {len(data["apis"])} API в {TARGET.relative_to(ROOT)}')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
