"""Brush Brush, Shiny Teeth — song data + instrumental synth (120 bpm, C major)."""
import json, wave
import numpy as np

BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
SR = 44100
N = {'C4':60,'D4':62,'E4':64,'F4':65,'G4':67,'A4':69,'B4':71,'C5':72,'D5':74,'E5':76,'R':None}
CH = {'C':['C3','E3','G3','C4'],'F':['F3','A3','C4','F4'],'G':['G3','B3','D4','G4'],'Am':['A3','C4','E4','A4']}
def midi(n):
    names={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
    return 12*(int(n[-1])+1)+names[n[0]]
def hz(m): return 440*2**((m-69)/12)

VA = [('C4',1),('C4',1),('E4',1),('E4',1),('G4',1),('G4',1),('E4',2)]
VB = [('F4',1),('F4',1),('E4',1),('E4',1),('D4',1),('D4',1),('C4',2)]
C1 = [('G4',1),('G4',1),('A4',1),('G4',1),('E4',1),('E4',1),('E4',1),('R',1)]
C2 = [('F4',1),('F4',1),('G4',1),('F4',1),('D4',1),('D4',1),('D4',1),('R',1)]
C3 = [('E4',.5),('E4',.5),('G4',1),('C5',1),('B4',1),('A4',1),('A4',1),('G4',2)]
C4 = [('G4',1),('E4',1),('D4',2),('C4',4)]
INTRO = [('G4',1),('E4',1),('G4',1),('E4',1),('C5',2),('R',2)]
OUTRO = [('E4',1),('E4',1),('G4',1),('G4',1),('C5',1),('B4',.5),('C5',2.5)]

# section, lyric, melody, chords (one per bar)
LINES = [
 ('intro',  '(bzz bzz) Good morning, Sprout!',          INTRO, ['C','G']),
 ('verse1', 'Wake up, Sprout, the sun is high,',        VA, ['C','C']),
 ('verse1', 'Grab your brush and say hi-hi!',           VB, ['F','G']),
 ('verse1', 'A little dot of minty paste,',             VA, ['C','C']),
 ('verse1', "Let's make our smile a shiny place!",      VB, ['F','G']),
 ('chorus', 'Brush brush, top teeth, swish swish swish,', C1, ['C','C']),
 ('chorus', 'Brush brush, bottom teeth, make a wish!',  C2, ['F','G']),
 ('chorus', 'Round and round and side to side,',        C3, ['C','F']),
 ('chorus', 'Shiny teeth, open wide!',                  C4, ['G','C']),
 ('verse2', 'Brush the front and brush the back,',      VA, ['C','C']),
 ('verse2', 'Little circles, clickety-clack,',          VB, ['F','G']),
 ('verse2', "Don't forget your tongue — ha ha!",        VA, ['C','C']),
 ('verse2', 'Now we spit it out — ptoo! Ta-da!',        VB, ['F','G']),
 ('chorus2','Brush brush, top teeth, swish swish swish,', C1, ['C','C']),
 ('chorus2','Brush brush, bottom teeth, make a wish!',  C2, ['F','G']),
 ('chorus2','Round and round and side to side,',        C3, ['Am','F']),
 ('chorus2','Shiny teeth, open wide!',                  C4, ['G','C']),
 ('outro',  'All done, Sprout! Big shiny smile!',       OUTRO, ['F','C']),
]
TAIL = 3.0
TOTAL = len(LINES) * 2 * BAR + TAIL

def timeline():
    out, t = [], 0.0
    for sec, lyr, mel, ch in LINES:
        notes, b = [], 0.0
        for n, d in mel:
            if n != 'R': notes.append(t + b * BEAT)
            b += d
        words = lyr.split()
        sung_end = t + sum(d for n, d in mel if True) * BEAT
        # spread words across note onsets
        k = len(notes)
        wt = [notes[min(int(i * k / len(words)), k - 1)] for i in range(len(words))]
        out.append(dict(section=sec, text=lyr, start=t, end=t + 2 * BAR, words=words, wordTimes=wt))
        t += 2 * BAR
    return out

# ---------- synth ----------
def env(n, a, d):
    e = np.exp(-np.arange(n) / (d * SR))
    at = int(a * SR)
    if at: e[:at] *= np.linspace(0, 1, at)
    return e

def pluck(f, dur, amp, rng):
    n = int(dur * SR); p = int(SR / f)
    buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.497 * (buf[i % p] + buf[(i + 1) % p])
    return out * amp

def glock(f, dur, amp):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2*np.pi*f*t) + .35*np.sin(2*np.pi*2.76*f*t)*np.exp(-t*9) + .15*np.sin(2*np.pi*5.4*f*t)*np.exp(-t*18)
    return s * env(n, .002, .45) * amp

def flute(f, dur, amp):
    n = int(dur * SR); t = np.arange(n) / SR
    vib = 1 + .004 * np.sin(2*np.pi*5.5*t) * np.clip(t*3, 0, 1)
    ph = 2*np.pi*f*np.cumsum(vib)/SR
    s = np.sin(ph) + .25*np.sin(2*ph) + .1*np.sin(3*ph)
    e = np.minimum(1, t/.04) * np.minimum(1, (dur - t)/.06).clip(0)
    return s * e * amp

def kick(amp):
    n = int(.25*SR); t = np.arange(n)/SR
    return np.sin(2*np.pi*(50 + 90*np.exp(-t*30))*t) * np.exp(-t*14) * amp

def clap(amp, rng):
    n = int(.15*SR); t = np.arange(n)/SR
    x = rng.uniform(-1, 1, n); x = np.convolve(x, np.ones(6)/6, 'same')
    return x * np.exp(-t*30) * amp

def bzz(dur, amp):
    n = int(dur*SR); t = np.arange(n)/SR
    f = 230 + 25*np.sin(2*np.pi*7*t)
    ph = 2*np.pi*np.cumsum(f)/SR
    s = 2*(ph/(2*np.pi) % 1) - 1
    s = np.convolve(s, np.ones(12)/12, 'same')
    return s * np.sin(np.pi*t/dur) * amp

def render(path):
    rng = np.random.default_rng(7)
    mix = np.zeros(int(TOTAL * SR) + SR)
    def add(sig, t):
        i = int(t * SR); mix[i:i+len(sig)] += sig[:len(mix)-i]
    cache = {}
    t = 0.0
    for li, (sec, lyr, mel, chords) in enumerate(LINES):
        for bi, c in enumerate(chords):
            bt = t + bi * BAR
            for beat in range(4):
                x = bt + beat * BEAT
                # strum: down on beats, light up on offbeats
                for j, nn in enumerate(CH[c]):
                    key = (nn, beat % 2)
                    if key not in cache: cache[key] = pluck(hz(midi(nn)), 1.2, .13 if beat % 2 == 0 else .09, rng)
                    add(cache[key], x + j * .012)
                for j, nn in enumerate(CH[c][1:]):
                    key = (nn, 'up')
                    if key not in cache: cache[key] = pluck(hz(midi(nn)), .6, .05, rng)
                    add(cache[key], x + BEAT/2 + (2 - j) * .01)
                if sec != 'intro' or bi == 1:
                    if beat in (0, 2): add(kick(.35), x)
                    if beat in (1, 3): add(clap(.09, rng), x)
            # soft bass
            root = hz(midi(CH[c][0]) - 12)
            for beat in (0, 2):
                n = int(BEAT*1.8*SR); tt = np.arange(n)/SR
                add(np.sin(2*np.pi*root*tt) * env(n, .01, .5) * .22, bt + beat*BEAT)
        b = 0.0
        for nn, d in mel:
            if nn != 'R':
                f = hz(midi(nn))
                add(glock(f*2, 1.0, .10), t + b*BEAT)
                add(flute(f, d*BEAT*.92, .16), t + b*BEAT)
            b += d
        if sec == 'intro': add(bzz(1.0, .05), t)
        if sec == 'outro': add(bzz(1.0, .05), t + 3*BAR/2)
        t += 2 * BAR
    # final chord ring
    for j, nn in enumerate(CH['C']): add(pluck(hz(midi(nn)), 2.5, .15, rng), t + j*.02)
    add(glock(hz(midi('C5')), 2.5, .12), t)
    mix = mix[:int(TOTAL*SR)]
    fade = int(1.5*SR); mix[-fade:] *= np.linspace(1, 0, fade)
    mix = np.tanh(mix * 1.2) ; mix /= np.abs(mix).max() / 0.89
    st = np.stack([mix, np.roll(mix, 300)*0.97], 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype('<i2').tobytes())

if __name__ == '__main__':
    json.dump(dict(bpm=BPM, total=TOTAL, lines=timeline()), open('timeline.json', 'w'), indent=1)
    render('music.wav')
    print('total', TOTAL)
