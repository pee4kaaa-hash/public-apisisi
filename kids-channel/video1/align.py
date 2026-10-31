"""Build timeline_<lang>.json for an externally generated song (e.g. ACE-Step):
Whisper word timestamps -> aligned to our lyric lines -> line starts and karaoke word times.
Usage: python3 align.py <lang> <song.wav> [model]"""
import json, re, sys, difflib, wave
import numpy as np
from faster_whisper import WhisperModel
import song

def norm(w):
    return re.sub(r'[^\w]', '', w.lower().replace('ё', 'е'))

def main(lang, path, model='medium'):
    lines = song.LINES_RU if lang == 'ru' else song.LINES_EN
    words, owner = [], []
    for li, l in enumerate(lines):
        for w in l[1].split():
            words.append(w); owner.append(li)
    with wave.open(path) as wv:
        fs, nch = wv.getframerate(), wv.getnchannels()
        x = np.frombuffer(wv.readframes(wv.getnframes()), '<i2').astype(np.float32) / 32768
    x = x.reshape(-1, nch).mean(1)
    dur = len(x) / fs
    x16 = np.interp(np.arange(0, len(x), fs / 16000), np.arange(len(x)), x).astype(np.float32)
    m = WhisperModel(model, device='cpu', compute_type='int8')
    prompt = ' '.join(l[1] for l in lines[:9])
    segs, _ = m.transcribe(x16, language=lang, beam_size=5, word_timestamps=True, initial_prompt=prompt,
                           condition_on_previous_text=False, vad_filter=False)
    rec = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
    print('heard:', ' '.join(r[0] for r in rec))
    a = [norm(w) for w in words]; b = [norm(r[0]) for r in rec]
    times = [None] * len(words)
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == 'equal':
            for k in range(i2 - i1): times[i1 + k] = rec[j1 + k][1]
        elif op == 'replace':  # fuzzy: map proportionally when a word sounds close
            for k in range(i2 - i1):
                j = j1 + int(k * (j2 - j1) / (i2 - i1))
                if difflib.SequenceMatcher(None, a[i1 + k], b[j]).ratio() >= 0.5: times[i1 + k] = rec[j][1]
    matched = sum(t is not None for t in times)
    print(f'matched {matched}/{len(words)} words')
    heard = [t is not None for t in times]
    # fill gaps by interpolation; enforce monotonic times
    known = [i for i, t in enumerate(times) if t is not None]
    for i in range(len(times)):
        if times[i] is None:
            prev = max([k for k in known if k < i], default=None); nxt = min([k for k in known if k > i], default=None)
            if prev is not None and nxt is not None:
                times[i] = times[prev] + (times[nxt] - times[prev]) * (i - prev) / (nxt - prev)
            elif prev is not None: times[i] = times[prev] + 0.4 * (i - prev)
            else: times[i] = max(0.5, times[nxt] - 0.4 * (nxt - i))
    for i in range(1, len(times)): times[i] = max(times[i], times[i - 1] + 0.05)
    out = []
    for li, (sec, text, *_r) in enumerate(lines):
        hs = [h for h, o in zip(heard, owner) if o == li]; sung = sum(hs) >= max(1, len(hs) // 2)
        wt = [round(t, 3) for t, o in zip(times, owner) if o == li]
        out.append(dict(section=sec, role=song.ROLES[li], text=text, words=text.split(), wordTimes=wt,
                        start=max(0, wt[0] - 0.25), end=wt[-1] + 1.0, sung=sung))
    for i in range(len(out) - 1): out[i]['end'] = min(out[i]['end'], out[i + 1]['start'])
    ev = {r: out[[l['role'] for l in out].index(r)]['wordTimes'][song.EVENTS[lang][r]] for r in ('tongue', 'spit')}
    tl = dict(lang=lang, bpm=song.BPM, total=dur + 3.0, endCard=dur, lines=out, events=ev)
    json.dump(tl, open(f'timeline_{lang}.json', 'w'), ensure_ascii=False, indent=1)
    for l in out: print(f"{l['start']:6.2f} {l['role']:9s} {l['text']}")

if __name__ == '__main__':
    main(*sys.argv[1:])
