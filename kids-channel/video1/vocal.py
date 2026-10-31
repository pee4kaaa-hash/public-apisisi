"""Sing the lyrics: Piper TTS per word -> WORLD vocoder -> stretch vowels to note lengths,
set pitch to the melody, raise formants for a child-like voice."""
import sys, wave
import numpy as np
import pyworld as pw
from piper import PiperVoice
from song import LINES, BEAT, BAR, TOTAL, midi, hz

FP = 5.0            # WORLD frame period, ms
FORMANT = float(__import__("os").environ.get("FORMANT", "1.12"))  # >1 raises formants (smaller, younger vocal tract)
GAP = 0.9           # fraction of note length that is sung (small breath gap)

SAY = {'ptoo': 'ptoo!', 'da': 'dah'}

def tts(voice, word):
    x = np.concatenate([c.audio_float_array for c in voice.synthesize(SAY.get(word, word))]).astype(np.float64)
    a = np.abs(x); thr = a.max() * 0.008
    nz = np.where(a > thr)[0]
    return x[max(0, nz[0] - 300): nz[-1] + 600], voice.config.sample_rate

def warp(m, a):
    k = np.arange(m.shape[1]); src = np.clip(k / a, 0, m.shape[1] - 1)
    return np.stack([np.interp(src, k, row) for row in m])

def nuclei(E, voiced, k, sep=8):
    """Pick k vowel nuclei: the k highest voiced energy peaks at least `sep` frames apart."""
    cand = [i for i in range(1, len(E) - 1) if voiced[i] and E[i] >= E[i - 1] and E[i] >= E[i + 1]]
    cand.sort(key=lambda i: -E[i]); picked = []
    for i in cand:
        if all(abs(i - j) >= sep for j in picked): picked.append(i)
        if len(picked) == k: break
    return sorted(picked) if len(picked) == k else None

def sing(x, fs, notes, dur):
    """notes: [(note, beats)], one per syllable. dur: sung length of the whole word in seconds."""
    f0, tt = pw.harvest(x, fs, f0_floor=70, f0_ceil=600, frame_period=FP)
    sp = pw.cheaptrick(x, f0, tt, fs); ap = pw.d4c(x, f0, tt, fs)
    n = len(f0); voiced = f0 > 0
    E = 10 * np.log10(sp.sum(1) + 1e-12); E = np.convolve(np.pad(E, 2, mode='edge'), np.ones(5) / 5, 'same')[2:-2]
    k = len(notes); tot = sum(d for _, d in notes)
    peaks = nuclei(E, voiced, k)
    if peaks is None:  # fall back: split the voiced span evenly
        v = np.where(voiced)[0]
        if len(v) == 0: v = np.arange(n)
        peaks = [int(v[0] + (v[-1] - v[0]) * (i + .5) / k) for i in range(k)]
    bounds = [0] + [p + int(np.argmin(E[p:q + 1])) for p, q in zip(peaks[:-1], peaks[1:])] + [n]
    idx, f = [], []
    for i, ((note, d), pk) in enumerate(zip(notes, peaks)):
        s0, s1 = bounds[i], bounds[i + 1]
        thr = E[pk] - 8
        vs = pk
        while vs > s0 and voiced[vs - 1] and E[vs - 1] >= thr: vs -= 1
        ve = pk
        while ve < s1 - 1 and voiced[ve + 1] and E[ve + 1] >= thr: ve += 1
        T = int(dur * d / tot * 1000 / FP)
        pre, post = np.arange(s0, vs), np.arange(ve + 1, s1)
        M = max(T - len(pre) - len(post), 3)
        vow = np.linspace(vs, ve, M)
        seg = np.concatenate([pre, vow, post])
        target = hz(midi(note))
        fseg = np.where(np.concatenate([voiced[pre], np.ones(M, bool), voiced[post]]), target, 0.0)
        idx.append(seg); f.append(fseg)
    idx = np.concatenate(idx); f = np.concatenate(f)
    lo = np.floor(idx).astype(int); hi = np.minimum(lo + 1, n - 1); w = (idx - lo)[:, None]
    sp2 = np.exp(np.log(sp[lo] + 1e-12) * (1 - w) + np.log(sp[hi] + 1e-12) * w)
    ap2 = ap[lo] * (1 - w) + ap[hi] * w
    # portamento between notes (only where voiced) + gentle vibrato
    on = f > 0; fl = np.log(np.where(on, f, np.nan))
    fill = np.interp(np.arange(len(f)), np.where(on)[0], fl[on]) if on.any() else np.zeros(len(f))
    kk = 7; sm = np.convolve(np.pad(fill, kk, mode='edge'), np.ones(kk) / kk, 'same')[kk:-kk]
    tsec = np.arange(len(f)) * FP / 1000
    vib = 1 + 0.007 * np.sin(2 * np.pi * 5.5 * tsec) * np.clip((tsec - 0.25) * 3, 0, 1)
    f0n = np.where(on, np.exp(sm) * vib, 0.0)
    sp2 = warp(sp2, FORMANT); ap2 = np.clip(warp(ap2, FORMANT), 0, 1)
    y = pw.synthesize(np.ascontiguousarray(f0n), np.ascontiguousarray(sp2), np.ascontiguousarray(ap2), fs, FP)
    y /= (np.sqrt(np.mean(y ** 2)) + 1e-9)
    n = len(y); e = np.ones(n); r = min(n // 4, int(.004 * fs)); e[:r] = np.linspace(0, 1, r); r = min(n // 4, int(.03 * fs)); e[-r:] = np.linspace(1, 0, r)
    return y * e

def main(model, out):
    voice = PiperVoice.load(model)
    fs = voice.config.sample_rate
    track = np.zeros(int((TOTAL + 1) * fs))
    t = 0.0
    for sec, text, syl, _ in LINES:
        b = 0.0; words = []
        for w, n, d in syl:
            if w is None: b += d; continue
            if w == '-': words[-1][2].append((n, d))
            else: words.append([w, t + b * BEAT, [(n, d)]])
            b += d
        split = []
        for w, start, notes in words:
            parts = w.split('-')
            if len(parts) > 1 and len(parts) == len(notes):  # hyphenated: sing each part on its own note
                for p, nd in zip(parts, notes):
                    split.append([p, start, [nd]]); start += nd[1] * BEAT
            else:
                split.append([w, start, notes])
        for w, start, notes in split:
            x, _ = tts(voice, w)
            dur = sum(d for _, d in notes) * BEAT * GAP
            y = sing(x, fs, notes, dur) * 0.12
            i = int(start * fs); track[i:i + len(y)] += y[:len(track) - i]
        t += 2 * BAR
    track /= np.abs(track).max() / 0.9
    with wave.open(out, 'wb') as wv:
        wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(fs)
        wv.writeframes((track * 32767).astype('<i2').tobytes())

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'vocals.wav')
