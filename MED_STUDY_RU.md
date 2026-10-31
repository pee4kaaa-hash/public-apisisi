# Бесплатные API для учёбы в медколледже

> 🌐 **Сайт с поиском, фильтрами, избранным и пробными запросами:** https://pee4kaaa-hash.github.io/public-apisisi/

Подборка из основного списка этого репозитория и открытых баз NIH, EBI и ВОЗ: только то, что пригодится студенту-медику. Все ссылки ведут на официальную документацию. Большинство источников англоязычные, это нормально для медицинских баз.

**Как читать таблицы:** «Ключ» означает, что нужно бесплатно зарегистрироваться и получить API-ключ; «—» означает, что можно пользоваться сразу.

## Лекарственные препараты и фармакология

| API | Чем полезен | Ключ |
|:---|:---|:---|
| [DailyMed](https://dailymed.nlm.nih.gov/dailymed/app-support-web-services.cfm) | Официальные инструкции к препаратам (FDA): показания, дозировки, противопоказания | — |
| [RxNorm](https://lhncbc.nlm.nih.gov/RxNav/APIs/RxNormAPIs.html) | Нормализованные названия лекарств: связь торгового названия с действующим веществом | — |
| [openFDA](https://open.fda.gov) | Данные FDA о препаратах, побочных эффектах и медизделиях | Ключ |
| [NHS Health A-Z](https://digital.nhs.uk/developer/api-catalogue/health-a-to-z) | Справочник NHS по заболеваниям, лекарствам и рекомендациям | Ключ |
| [FDA Recalls](https://rapidapi.com/crisp-point-studio-crisp-point-studio-default/api/live-fda-product-food-recalls) | Свежие отзывы препаратов и продуктов с рынка | Ключ |
| [RxClass](https://lhncbc.nlm.nih.gov/RxNav/APIs/RxClassAPIs.html) | Фармгруппа препарата по АТХ-классификации — удобно для зачётов по фармакологии | — |
| [PubChem](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest) | Химическая формула, молекулярная масса и свойства действующего вещества | — |
| [ChEMBL](https://www.ebi.ac.uk/chembl/api/data/docs) | Механизм действия лекарства и его мишени в организме | — |
| [openFDA: побочные эффекты](https://open.fda.gov/apis/drug/event/) | Самые частые нежелательные реакции на препарат по сообщениям врачей и пациентов | — |

## Генетика, биохимия, молекулярная биология

| API | Чем полезен | Ключ |
|:---|:---|:---|
| [MedlinePlus Genetics](https://medlineplus.gov/about/developers/geneticsdatafilesapi/) | Генетические заболевания, гены, хромосомы — понятным языком | — |
| [KEGG](https://www.kegg.jp/kegg/rest/keggapi.html) | Метаболические пути, ферменты, соединения — для биохимии | — |
| [MyGene.info](https://docs.mygene.info/) | Справка по любому гену: функция, расположение, идентификаторы | — |
| [RCSB PDB](https://data.rcsb.org/) | 3D-структуры белков и нуклеиновых кислот | — |
| [Open Targets](https://platform-docs.opentargets.org/) | Связи «ген — болезнь — лекарство-мишень» | — |
| [Chempirical](https://chempirical.com/api/) | Химические соединения, их свойства и реакции | — |
| [DeepDNA](https://deepdna.ai/docs/) | Гены, варианты и фармакогенетика: как гены влияют на действие лекарств | — |
| [ENA](https://www.ebi.ac.uk/ena/browser/api/swagger-ui/index.html) | Нуклеотидные последовательности и геномы | — |
| [UniProt](https://www.uniprot.org/help/api) | Белки: функция, строение, связанные болезни (например, инсулин) | — |
| [Ensembl](https://rest.ensembl.org/) | Гены человека: где расположены, какие белки кодируют | — |
| [Reactome](https://reactome.org/dev/content-service) | Биохимические процессы в клетке: гликолиз, цикл Кребса, свёртывание крови | — |
| [ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/docs/maintenance_use/) | Мутации и их значение для здоровья — к темам по наследственным болезням | — |

## Научная литература

| API | Чем полезен | Ключ |
|:---|:---|:---|
| [NCBI E-utilities](https://www.ncbi.nlm.nih.gov/books/NBK25501/) | Доступ к PubMed и другим базам NCBI — поиск статей для рефератов и курсовых | — |
| [Europe PMC](https://europepmc.org/RestfulWebService) | Статьи по медицине и биологии с аннотациями и ссылками на полный текст | — |
| [Semantic Scholar](https://api.semanticscholar.org/) | Поиск статей, авторов и цитирований | — |
| [OpenAlex](https://docs.openalex.org/) | Открытый каталог научных работ | — |
| [Crossref Metadata Search](https://github.com/CrossRef/rest-api-doc) | Выходные данные статей и книг — для оформления списка литературы | — |
| [Wikipedia](https://www.mediawiki.org/wiki/API:Main_page) | Быстрая справка по терминам, в том числе в русской Википедии | — |
| [arXiv](https://info.arxiv.org/help/api/user-manual.html) | Препринты научных статей | — |
| [Open Library](https://openlibrary.org/developers/api) | Поиск книг и учебников | — |
| [ClinicalTrials.gov](https://clinicaltrials.gov/data-api/api) | Клинические исследования по всему миру: что и как сейчас испытывают | — |

## Питание и диетология

| API | Чем полезен | Ключ |
|:---|:---|:---|
| [FoodData Central](https://fdc.nal.usda.gov/) | Состав продуктов: белки, жиры, углеводы, витамины, минералы | Ключ |
| [Edamam](https://developer.edamam.com/) | Пищевая ценность блюд и рецептов | Ключ |
| [Nutritionix](https://developer.nutritionix.com/) | Большая база пищевой ценности продуктов | Ключ |

## Эпидемиология и статистика

| API | Чем полезен | Ключ |
|:---|:---|:---|
| [Open Disease](https://disease.sh/) | Статистика по COVID-19 и гриппу по странам | — |
| [Monitly](https://monit.ly/api-docs) | Статистика ВОЗ, Всемирного банка и других организаций по 150+ странам | Ключ |
| [Humanitarian Data Exchange](https://data.humdata.org/) | Открытые данные о здоровье населения в разных странах | — |
| [Open Data NHS Scotland](https://www.opendata.nhs.scot) | Медицинская статистика Шотландии — пример реальных данных здравоохранения | — |
| [World Bank: здоровье](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392) | Продолжительность жизни, младенческая смертность и другие показатели по странам | — |
| [CDC Open Data](https://data.cdc.gov/) | Открытые данные Центров по контролю заболеваний США | — |

## Клиническое мышление и терминология

| API | Чем полезен | Ключ |
|:---|:---|:---|
| [Infermedica](https://developer.infermedica.com/docs/) | Проверка симптомов и сортировка пациентов — можно сверять себя на ситуационных задачах | Ключ |
| [Lexigram](https://docs.lexigram.io/) | Выделение клинических терминов из текста, медицинская онтология | Ключ |
| [МКБ-10 (NLM Clinical Tables)](https://clinicaltables.nlm.nih.gov/apidoc/icd10cm/v3/doc.html) | Поиск кода диагноза по МКБ-10 по названию болезни | — |
| [МКБ-11 (ВОЗ)](https://icd.who.int/icdapi) | Официальный API новой классификации болезней ВОЗ, есть русский язык | Ключ |
| [MeSH](https://id.nlm.nih.gov/mesh/) | Медицинские предметные рубрики — правильные термины для поиска в PubMed | — |
| [Human Phenotype Ontology](https://ontology.jax.org/api/hp/docs) | Симптомы и признаки с точными определениями | — |

## Английский для медика

| API | Чем полезен | Ключ |
|:---|:---|:---|
| [Free Dictionary](https://dictionaryapi.dev/) | Значение, произношение и примеры английских слов, включая медицинские термины | — |
| [Wiktionary](https://en.wiktionary.org/w/api.php) | Словарь с этимологией: удобно разбирать латинские и греческие корни терминов | — |

## Заболевания и памятки для пациентов

| API | Чем полезен | Ключ |
|:---|:---|:---|
| [MedlinePlus Connect](https://medlineplus.gov/medlineplus-connect/web-service/) | Понятные памятки о болезни по коду МКБ-10 — пригодятся для санпросвета и бесед с пациентами | — |
| [Orphadata](https://api.orphadata.com/) | Редкие (орфанные) заболевания: описание, коды, распространённость | — |

## Анатомия и медицинские изображения

| API | Чем полезен | Ключ |
|:---|:---|:---|
| [Open-i](https://openi.nlm.nih.gov/services) | Рентгенограммы, КТ и иллюстрации из научных статей с подписями | — |
| [Wikimedia Commons](https://commons.wikimedia.org/wiki/Commons:API) | Свободные анатомические рисунки и схемы для презентаций | — |
| [Ontology Lookup Service](https://www.ebi.ac.uk/ols4/help) | Анатомические структуры и их связи (онтология Uberon) | — |

## С чего начать

1. Нужна инструкция к препарату — **DailyMed**.
2. Готовите реферат или курсовую — **NCBI E-utilities** (PubMed).
3. Учите биохимию — **KEGG**, генетику — **MedlinePlus Genetics**.
4. Считаете рацион на занятии по диетологии — **FoodData Central**.
5. Оформляете список литературы — **Crossref**.
6. Нужен код диагноза — **МКБ-10 (NLM Clinical Tables)**.
7. Готовите памятку для пациента — **MedlinePlus Connect**.
8. Учите фармгруппы — **RxClass**.

Совет: в англоязычных базах ищите препараты по МНН на латинице, например `epinephrine` вместо «адреналин». Справочники США описывают американский рынок, поэтому для практики сверяйтесь с российскими инструкциями.

Данные из этих источников предназначены для обучения и не заменяют клинические рекомендации Минздрава РФ.
