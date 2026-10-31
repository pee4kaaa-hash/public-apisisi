# Видео №1: Brush Brush, Shiny Teeth! 🦷

- `Brush_Brush_Shiny_Teeth.mp4`: готовый Short, 1080×1920, 75 секунд, инструментальная караоке-версия (мелодия + текст на экране)
- `instrumental.mp3`: отдельно музыкальная дорожка
- `song.py`: ноты, аккорды, текст и синтезатор музыки (`python3 song.py` создаёт `music.wav` и `timeline.json`)
- `anim.js` + `capture.js`: анимация кадр за кадром (`node capture.js`, нужен файл `instrumental.wav`:
  `ffmpeg -i music.wav -af "lowpass=f=8000,loudnorm=I=-14:TP=-1.5" instrumental.wav`)

Как добавить вокал: сгенерируйте песню в Suno с текстом из `../STEP_BY_STEP_RU.md` и стилем «120 bpm, C major»,
затем замените дорожку:
`ffmpeg -i Brush_Brush_Shiny_Teeth.mp4 -i suno.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -shortest out.mp4`
Темп и тональность совпадут не идеально, поэтому вокал лучше подровнять в CapCut.
