# Видео №1: Brush Brush, Shiny Teeth! / Чистим зубки! 🦷

| | English | Русский |
|---|---|---|
| Видео (Short 1080×1920, ~77 с) | `Brush_Brush_Shiny_Teeth.mp4` | `Chistim_Zubki_RU.mp4` |
| Песня | `song_with_vocals.mp3` | `song_with_vocals_ru.mp3` |
| Обложка | `../brand/video1-thumbnail.png` | `../brand/video1-thumbnail_ru.png` |

## Песня: ACE-Step 1.5 (бесплатно, локально, лицензия MIT)
Песни с живым вокалом сгенерированы открытой нейросетью [ACE-Step 1.5](https://ace-step.github.io/ace-step-v1.5.github.io)
через [acestep.cpp](https://github.com/ServeurpersoCom/acestep.cpp) на процессоре, без видеокарты (около 15 минут на песню).
Запросы с текстом и стилем лежат в `ace_request_en.json` и `ace_request_ru.json`.

```bash
git clone --recurse-submodules https://github.com/ServeurpersoCom/acestep.cpp && cd acestep.cpp
mkdir build && cd build && cmake .. -DCMAKE_BUILD_TYPE=Release && cmake --build . -j && cd ..
mkdir models && for f in Qwen3-Embedding-0.6B-Q8_0.gguf acestep-5Hz-lm-1.7B-Q8_0.gguf acestep-v15-turbo-Q8_0.gguf vae-BF16.gguf; do
  curl -L -o models/$f https://huggingface.co/Serveurperso/ACE-Step-1.5-GGUF/resolve/main/$f; done
cp ace_request_ru.json ru.json
./build/ace-lm --models models --request ru.json      # → ru0.json
./build/ace-synth --models models --request ru0.json  # → ru00.mp3
```
Чтобы получить другой вариант песни, поменяйте `seed` в запросе. Есть и онлайн-демо, для него нужен бесплатный токен Hugging Face: `ace_generate.py`.

## Синхронизация и видео
- `align.py`: Whisper находит, когда спето каждое слово, и сопоставляет его с текстом → `timeline_<lang>.json`
  (`python3 align.py ru song.wav small`). Непропетые строки помечаются и не показываются в караоке.
- `anim.js` + `capture.js`: анимация привязана к реальным строкам песни.
  ```bash
  ffmpeg -i song.wav -af "loudnorm=I=-14:TP=-1.5,apad=pad_dur=3" mix_ru.wav
  SONG_LANG=ru node capture.js
  ```

## Старый вариант (синтезатор)
`song.py` + `vocal.py`: собственная музыка и «поющий» синтезированный голос (Piper + вокодер WORLD).
Звучит роботизированно, оставлен как запасной вариант. `song.py` также хранит тексты, роли строк и события для анимации.
