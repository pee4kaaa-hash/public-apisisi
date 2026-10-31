# Видео №1: Brush Brush, Shiny Teeth! 🦷

- `Brush_Brush_Shiny_Teeth.mp4`: готовый Short, 1080×1920, 75 секунд, с вокалом и словами-караоке на экране
- `song_with_vocals.mp3`: песня целиком
- `vocals_only.mp3`: только голос
- `instrumental.mp3`: только музыка (минусовка)

## Как это сделано
- `song.py`: мелодия по слогам (одна нота на слог), аккорды и синтез инструментала → `music.wav` и `timeline.json`
- `vocal.py`: «поющий» голос. Каждое слово синтезирует нейросеть Piper (голос `en_US-kristin-medium`,
  обучен на записях LibriVox, общественное достояние, поэтому подходит для коммерческого использования), затем вокодер WORLD
  растягивает гласные на длину нот, ставит высоту по мелодии, добавляет вибрато и поднимает форманты,
  чтобы голос звучал по-детски → `vocals.wav`
- `anim.js` + `capture.js`: анимация кадр за кадром, субтитры-караоке синхронизированы со словами

## Пересобрать
```bash
pip install piper-tts pyworld numpy
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/kristin/medium/en_US-kristin-medium.onnx
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/kristin/medium/en_US-kristin-medium.onnx.json
python3 song.py && python3 vocal.py en_US-kristin-medium.onnx vocals.wav
ffmpeg -i music.wav -i vocals.wav -filter_complex "[0:a]lowpass=f=7000,equalizer=f=1500:t=q:w=1:g=-5,volume=0.22[m];[1:a]aresample=44100,highpass=f=140,equalizer=f=3000:t=q:w=1:g=3,acompressor=threshold=0.15:ratio=4:attack=3:release=60:makeup=2,aecho=0.8:0.4:45|90:0.15|0.08,pan=stereo|c0=c0|c1=c0[v];[m][v]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5[o]" -map "[o]" -ar 44100 mix.wav
node capture.js   # → Brush_Brush_Shiny_Teeth.mp4
```

Голос синтетический, звучит как «вокалоид». Для более живого звучания сгенерируйте песню в Suno Pro
по тексту из `../STEP_BY_STEP_RU.md` и замените дорожку в CapCut.
