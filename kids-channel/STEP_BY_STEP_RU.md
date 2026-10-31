# Sprout & Drizzle: пошаговый запуск канала

Готовые файлы лежат в папке `kids-channel/brand/`:
- `avatar.png`: аватарка 800×800
- `banner.png`: баннер 2560×1440 (всё важное помещается в безопасную зону для телефона)
- `video1-thumbnail.png`: первый кадр и обложка первого видео, 1080×1920
- `*.svg`: исходники, их можно править в Figma или Inkscape

---

## ШАГ 0. Что понадобится

| Что | Зачем | Цена |
|---|---|---|
| Отдельный Gmail | Аккаунт канала, не смешивайте его с личным | бесплатно |
| **Suno** (Pro) | Музыка и вокал. Коммерческие права есть **только на платном тарифе** | ~$10/мес |
| **CapCut** (ПК или телефон) | Монтаж, субтитры, анимация «покачивания» персонажей | бесплатно / Pro ~$8 |
| **ChatGPT Images / Midjourney / Ideogram** | Дополнительные сцены по образцу наших персонажей | ~$10–20/мес (необязательно) |
| **Runway / Kling** | Оживить отдельные кадры (необязательно, для начала хватит CapCut) | от $10/мес |
| AdSense | Подключается позже, когда вступите в партнёрскую программу (YPP) | бесплатно |

**Минимальный бюджет на старт: Suno Pro + CapCut, это примерно $10–20 в месяц.**

> Если живёте не в США: монетизация работает в РФ и СНГ с ограничениями. Нужны страна, в которой доступна YPP, и способ получать выплаты через AdSense. Проверьте это **до** того, как вкладываться.

---

## ШАГ 1. Создать аккаунт (≈15 минут)

1. Зарегистрируйте новый Gmail, например `sproutanddrizzle.songs@gmail.com`. Включите двухфакторную аутентификацию.
2. Откройте youtube.com → аватар → **Создать канал**.
3. **Название:** `Sprout & Drizzle - Songs for Kids`
4. **Ник (handle):** `@SproutAndDrizzle`. Если занят, подойдут `@SproutAndDrizzleSongs` или `@SproutDrizzleKids`.
5. YouTube Studio → **Настройки → Канал → Основная информация:**
   - Страна: та, где вы будете получать выплаты.
   - Ключевые слова: `kids songs, nursery rhymes, toddler songs, preschool learning, songs for kids, bedtime songs, sing along`
6. **Настройки → Канал → Расширенные → Аудитория:** выберите **«Да, это канал для детей»**. Это обязательно по закону COPPA, за нарушение FTC штрафует.
7. Подтвердите номер телефона (youtube.com/verify). Без этого нельзя загружать свои обложки и ролики длиннее 15 минут.

## ШАГ 2. Оформление

**Студия → Настройка канала → Брендинг:**
- Фото профиля: `avatar.png`
- Баннер: `banner.png`
- Водяной знак: `avatar.png` (показывать в конце видео)

**Описание канала (вставить как есть):**
```
Welcome to Puddle Park! 🌱☁️

Sing, dance and learn with Sprout the little seedling and Drizzle the friendly cloud!
Our gentle, original songs help toddlers and preschoolers (ages 2–5) learn everyday
routines, colors, numbers, animals and big feelings — at a calm, kid-friendly pace.

🦷 Routine songs: brushing teeth, potty, bath, bedtime
🌈 Learning songs: colors, numbers, ABCs, shapes
💚 Feelings songs: calm down, sharing, being brave
🌙 Lullabies with Mrs. Pebble

New songs every day!

All songs, lyrics and characters are original to Sprout & Drizzle.
Created by our small team with the help of AI tools.
```

**Ссылки:** пока не нужны.

**Вкладка «Главная»:** после первых 5 роликов создайте плейлисты `Routine Songs 🦷`, `Learning Songs 🌈`, `Feelings Songs 💚` и добавьте их на главную.

---

## ШАГ 3. Первое видео: «Brush Brush, Shiny Teeth!»

Почему именно этот ролик: родители в США ищут «toothbrushing song» каждый день, это вечнозелёная тема. Ролик полезен, и его включают ребёнку каждое утро, то есть смотрят повторно.

**Формат:** вертикальный Short 1080×1920, 45–55 секунд.

### 3.1 Музыка в Suno

**Create → Custom** →

**Style of Music:**
```
cheerful preschool children's song, ukulele, glockenspiel, light hand claps, soft kick drum,
warm friendly female vocal, clear slow diction, 110 bpm, major key, simple sing-along melody,
nursery rhyme, playful
```

**Title:** `Brush Brush, Shiny Teeth`

**Lyrics:**
```
[Intro]
(bzz bzz) Good morning, Sprout!

[Verse]
Wake up, Sprout, the sun is high,
Grab your brush and say hi-hi!
A little dot of minty paste,
Let's make our smile a shiny place!

[Chorus]
Brush brush, top teeth, swish swish swish,
Brush brush, bottom teeth, make a wish!
Round and round and side to side,
Shiny teeth, open wide!

[Verse 2]
Brush the front and brush the back,
Little circles, clickety-clack,
Don't forget your tongue — ha ha!
Now we spit it out — ptoo! Ta-da!

[Chorus]
Brush brush, top teeth, swish swish swish,
Brush brush, bottom teeth, make a wish!
Round and round and side to side,
Shiny teeth, open wide!

[Outro]
All done, Sprout! Big shiny smile! (bzz bzz)
```

Сгенерируйте 4–6 вариантов и выберите тот, где **слова слышны чётче всего**. Нужен трек длиной около 50–60 секунд. Если получился длиннее, в Suno есть функция **Crop**, или обрежьте лишнее в CapCut.

### 3.2 Картинки (сцены)

Основа — наши персонажи из `brand/*.svg`. Дополнительные сцены можно получить в ChatGPT или Midjourney: загрузите туда `avatar.png` как образец и используйте промпт:

```
Flat 2D children's illustration, soft pastel colors, thick rounded outlines, no text.
Character: "Sprout" — a round light-green seed with a cute face (two black oval eyes,
pink cheeks, small smile) and two green leaves sprouting from the top on a short stem.
Keep the character EXACTLY like the reference image.
Scene: {СЦЕНА}. Vertical 9:16, simple clean background, calm and friendly, for toddlers.
```

Что подставить вместо `{СЦЕНА}`:
1. `Sprout waking up in a tiny bed made from a walnut shell, sunrise through window`
2. `Sprout standing at a small bathroom sink holding a blue toothbrush with a dot of toothpaste`
3. `Sprout brushing teeth with lots of white foam bubbles, eyes happily closed`
4. `three cute bees flying around Sprout holding tiny music notes`
5. `Sprout spitting into the sink, playful splash, sparkles`
6. `Sprout smiling wide with sparkling shiny teeth, a friendly cloud with a face smiling in the window`

⚠️ Проверяйте каждый кадр: лишние конечности, «плывущее» лицо или жуткие детали сразу в мусор. Персонаж должен выглядеть одинаково во всех сценах.

### 3.3 Раскадровка и монтаж в CapCut

| Время | Строка песни | Кадр | Анимация в CapCut |
|---|---|---|---|
| 0:00–0:03 | (bzz) Good morning, Sprout! | `video1-thumbnail.png` | Зум 100→110%, пчёлки влетают (наклейка) |
| 0:03–0:10 | Verse 1 | Сцены 1 → 2 | «Покачивание» (Animation → Combo → Rock), плавный переход |
| 0:10–0:20 | Chorus | Сцена 3 | Ритмичный «прыжок» персонажа на каждое «brush», пузыри-стикеры |
| 0:20–0:30 | Verse 2 | Сцены 3 → 5 | На «ptoo» сплэш и сверкание |
| 0:30–0:42 | Chorus | Сцена 4 + 3 | Пчёлки-ноты, лёгкий зум |
| 0:42–0:50 | Outro | Сцена 6 | Блёстки, в конце аватар канала и «Subscribe!» без звука |

**Субтитры:** CapCut → Text → Auto captions (English). Шрифт круглый (например, Fredoka или Baloo), белый с тёмно-зелёной обводкой, крупно, в нижней трети экрана. Слова подсвечиваются в такт песне (karaoke style).

**Правила монтажа для малышей:**
- Один кадр держится не меньше 2–3 секунд, без мигания.
- Громкость −14 LUFS, без резких громких звуков.
- Без текстового призыва «ПОДПИШИСЬ!!!» поверх всего экрана.

Экспорт: 1080×1920, 30 fps, 1080p.

### 3.4 Загрузка

Studio → **Создать → Загрузить видео**

- **Название:** `Brush Brush, Shiny Teeth! 🦷 Toothbrushing Song for Kids #shorts`
- **Описание:**
```
Brushing time is fun time with Sprout! 🌱🦷
Sing along every morning and every night — this little song helps toddlers
brush top teeth, bottom teeth, round and round!

🎵 Lyrics:
Brush brush, top teeth, swish swish swish,
Brush brush, bottom teeth, make a wish!

👩‍🏫 Parent tip: Play the song twice in a row — that's about the 2 minutes
dentists recommend for brushing!

Original song and characters by Sprout & Drizzle. Made with the help of AI tools.

#kidssongs #toothbrushingsong #toddlersongs #nurseryrhymes #shorts
```
- **Плейлист:** Routine Songs 🦷
- **Аудитория:** ✅ «Да, это видео для детей»
- **Дополнительно → Изменённый или синтетический контент:** отметьте «Да», если в ролике есть реалистичные ИИ-элементы (для мультяшного стиля это не обязательно, но честная отметка безопасна).
- **Категория:** Education
- **Язык видео:** English
- **Лицензия:** Standard YouTube License
- Публикация: **сразу**, лучше в 7–9 утра или 6–8 вечера по времени Восточного побережья США (EST). Это время утренних и вечерних ритуалов с детьми.

---

## ШАГ 4. Первые 2 недели

| День | Ролик |
|---|---|
| 1 | Brush Brush, Shiny Teeth! 🦷 |
| 2 | Wash Your Hands Song 🧼 |
| 3 | Rainbow Colors Song 🌈 |
| 4 | It's Okay to Feel Mad 😤 |
| 5 | Count to 10 with the Buzzlings 🐝 |
| 6 | Sleepy Sprout Goodnight Song 🌙 |
| 7 | Where Does Rain Come From? ☁️ |
| 8 | Clean Up, Clean Up! 🧸 |
| 9 | What Does the Frog Say? 🐸 |
| 10 | Deep Breath Song 🌬️ |
| 11 | Potty Time Song 🚽 |
| 12 | Seed to Sunflower 🌻 |
| 13 | Twinkle Twinkle Little Star ⭐ |
| 14 | **Первая длинная сборка для TV:** все 13 песен × 2 = примерно 25 минут, горизонтально 1920×1080 |

Остальные темы есть в `KIDS_CHANNEL_PLAN_RU.md` (там 40 штук).

**Каждое воскресенье** смотрите YouTube Studio → Аналитика: какие ролики набрали больше всего просмотров и как долго их смотрят. По темам-победителям делайте продолжения: «Brush Brush» → «Brushing Teeth at Night 🌙», «Dentist Visit Song 🦷».

---

## ШАГ 5. Чего НЕ делать
- Не загружать по 10 роликов в день: это триггер «inauthentic content».
- Не брать чужих персонажей, чужую музыку и логотипы.
- Не ставить в название «Cocomelon» или «Baby Shark» ради поиска: это нарушение правил о метаданных и товарных знаках.
- Не покупать подписчиков и просмотры.
- Не делать пугающих или «странных» ИИ-кадров, даже ради смеха.
