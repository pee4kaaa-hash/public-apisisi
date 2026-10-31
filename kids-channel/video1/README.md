# Видео №1: Brush Brush, Shiny Teeth! / Чистим зубки! 🦷

| | English | Русский |
|---|---|---|
| Видео (Short 1080×1920, 75 с) | `Brush_Brush_Shiny_Teeth.mp4` | `Chistim_Zubki_RU.mp4` |
| Песня с вокалом | `song_with_vocals.mp3` | `song_with_vocals_ru.mp3` |
| Только голос | `vocals_only.mp3` | `vocals_only_ru.mp3` |
| Минусовка | `instrumental.mp3` | `instrumental_ru.mp3` |
| Обложка | `../brand/video1-thumbnail.png` | `../brand/video1-thumbnail_ru.png` |

## Как это сделано
- `song.py`: мелодия по слогам (одна нота на слог), аккорды и синтез инструментала.
  Язык выбирается переменной `SONG_LANG=en|ru` → `music_<lang>.wav` и `timeline_<lang>.json`.
- `vocal.py`: «поющий» голос. Нейросеть Piper произносит каждое слово, слоги находятся по пикам громкости гласных,
  вокодер WORLD растягивает каждую гласную на её ноту, ставит высоту по мелодии, добавляет вибрато и поднимает форманты (детский тембр).
- `anim.js` + `capture.js`: анимация кадр за кадром с караоке-субтитрами (`SONG_LANG=ru node capture.js`).

## Голоса
- EN: `en_US-kristin-medium`, датасет LibriVox (общественное достояние).
- RU: `ru_RU-irina-medium`, голос из проекта RHVoice. Лицензия указана по-разному: CC BY-SA 4.0 в пакетах Arch Linux,
  «Unknown» в карточке модели Piper. **Поэтому в описании ролика укажите: «Голос: RHVoice (Irina)».**
  Голоса с лицензией CC0 (`denis`, `dmitri`) мужские; поднятые до детской высоты, они звучат неразборчиво,
  поэтому выбран irina. Если нужна полная юридическая чистота, замените вокал на Suno Pro.

## Пересобрать (пример для RU)
```bash
pip install piper-tts pyworld numpy
B=https://huggingface.co/rhasspy/piper-voices/resolve/main/ru/ru_RU/irina/medium
curl -LO $B/ru_RU-irina-medium.onnx && curl -LO $B/ru_RU-irina-medium.onnx.json
export SONG_LANG=ru
python3 song.py && python3 vocal.py ru_RU-irina-medium.onnx vocals_ru.wav
ffmpeg -i music_ru.wav -i vocals_ru.wav -filter_complex "[0:a]lowpass=f=7000,equalizer=f=1500:t=q:w=1:g=-5,volume=0.22[m];[1:a]aresample=44100,highpass=f=140,equalizer=f=3000:t=q:w=1:g=3,acompressor=threshold=0.15:ratio=4:attack=3:release=60:makeup=2,aecho=0.8:0.4:45|90:0.15|0.08,pan=stereo|c0=c0|c1=c0[v];[m][v]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5[o]" -map "[o]" -ar 44100 mix_ru.wav
node capture.js
```
Для английского: `SONG_LANG=en`, голос `en/en_US/kristin/medium/en_US-kristin-medium.onnx`, без переменной `FORMANT`.
