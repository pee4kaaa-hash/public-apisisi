# -*- coding: utf-8 -*-

import unittest

from med_site.build import parse_markdown
from med_site.build import validate


SAMPLE = """# Заголовок

Вступление.

## Лекарства

| API | Чем полезен | Ключ |
|:---|:---|:---|
| [RxNorm](https://example.com/rx) | Названия лекарств | — |
| [openFDA](https://example.com/fda) | Данные FDA | Ключ |

## Литература

| API | Чем полезен | Ключ |
|:---|:---|:---|
| [Crossref Metadata Search](https://example.com/cr) | Выходные данные | — |

## С чего начать

1. Нужны названия — **RxNorm**.
2. Оформляете список литературы — **Crossref**.

Совет: пишите `epinephrine`.
"""


class TestMedSite(unittest.TestCase):

    def setUp(self):
        self.data = parse_markdown(SAMPLE)

    def test_title_and_categories(self):
        self.assertEqual(self.data['title'], 'Заголовок')
        self.assertEqual([c['name'] for c in self.data['categories']], ['Лекарства', 'Литература'])

    def test_apis(self):
        apis = self.data['apis']
        self.assertEqual([a['name'] for a in apis], ['RxNorm', 'openFDA', 'Crossref Metadata Search'])
        self.assertFalse(apis[0]['key'])
        self.assertTrue(apis[1]['key'])
        self.assertEqual(apis[2]['category'], 'c2')
        self.assertIn('example', apis[0])

    def test_start_resolves_short_names(self):
        self.assertEqual(
            [s['api'] for s in self.data['start']],
            ['RxNorm', 'Crossref Metadata Search'],
        )

    def test_notes(self):
        self.assertEqual(self.data['notes'], ['Совет: пишите `epinephrine`.'])

    def test_validate_reports_duplicates_and_unknown_steps(self):
        self.data['apis'].append(dict(self.data['apis'][0]))
        self.data['start'].append({'task': 'x', 'api': 'Нет такого'})
        errors = validate(self.data)
        self.assertTrue(any('несколько раз' in e for e in errors))
        self.assertTrue(any('Нет такого' in e for e in errors))


if __name__ == '__main__':
    unittest.main()
