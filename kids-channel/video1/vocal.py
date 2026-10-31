"""Sing the lyrics: Piper TTS per word -> WORLD vocoder -> stretch vowels to note lengths,
set pitch to the melody, raise formants for a child-like voice."""
import sys, wave
import numpy as np
import pyworld as pw
from piper import PiperVoice
from song import LINES, BEAT, BAR, TOTAL, midi, hz

FP = 5.0            # WORLD frame period, ms
FORMANT = 1.12      # >1 raises formants (smaller, younger vocal tract)
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

def sing(x, fs, notes, dur):
    f0, tt = pw.harvest(x, fs, f0_floor=120, f0_ceil=600, frame_period=FP)
    sp = pw.cheaptrick(x, f0, tt, fs); ap = pw.d4c(x, f0, tt, fs)
    v = np.where(f0 > 0)[0]
    T = max(int(dur * 1000 / FP), 4)
    if len(v) == 0:
        idx = np.linspace(0, len(f0) - 1, T)
        pre, mid, post = np.array([], int), idx, np.array([], int)
    else:
        a, b = v[0], v[-1]
        pre = np.arange(0, a); post = np.arange(b + 1, len(f0))
        M = max(T - len(pre) - len(post), int((b - a + 1) * 0.6), 2)
        # stretch loud vowel frames much more than voiced consonants (l, m, n, r)
        e = np.log(sp[a:b + 1].sum(1) + 1e-12); e = (e - e.min()) / (np.ptp(e) + 1e-9)
        wgt = 0.05 + e ** 4
        cum = np.concatenate([[0], np.cumsum(wgt)]); cum /= cum[-1]
        orig = b - a + 1
        if M > orig:
            # extra frames distributed by weight; each original frame keeps at least one
            extra = M - orig
            dens = 1 + extra * wgt / wgt.sum()
            pos = np.concatenate([[0], np.cumsum(dens)])
            mid = a + np.interp(np.arange(M) + 0.5, pos, np.arange(orig + 1)) - 0.5
            mid = np.clip(mid, a, b)
        else:
            mid = np.linspace(a, b, M)
    idx = np.concatenate([pre, mid, post])
    lo = np.floor(idx).astype(int); hi = np.minimum(lo + 1, len(f0) - 1); w = (idx - lo)[:, None]
    sp2 = np.exp(np.log(sp[lo] + 1e-12) * (1 - w) + np.log(sp[hi] + 1e-12) * w)
    ap2 = ap[lo] * (1 - w) + ap[hi] * w
    # target pitch across the voiced part, note by note
    f = np.zeros(len(idx))
    nm = len(mid); start = len(pre)
    tot = sum(d for _, d in notes); c = 0.0
    for n, d in notes:
        i0 = start + int(nm * c / tot); i1 = start + int(nm * (c + d) / tot)
        f[i0:i1] = hz(midi(n)); c += d
    f[start + int(nm * c / tot) - 1:start + nm] = hz(midi(notes[-1][0]))
    # portamento + gentle vibrato
    k = 8; fs_ = np.convolve(np.pad(f, k, mode='edge'), np.ones(k) / k, 'same')[k:-k]
    tsec = np.arange(len(f)) * FP / 1000
    vib = 1 + 0.007 * np.sin(2 * np.pi * 5.5 * tsec) * np.clip((tsec - 0.25) * 3, 0, 1)
    f0n = np.where(np.isin(np.arange(len(f)), np.arange(start, start + nm)), fs_ * vib, 0.0)
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
