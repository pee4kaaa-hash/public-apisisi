"""Brush Brush, Shiny Teeth — song data + instrumental synth (120 bpm, C major)."""
import json, os, wave
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

# Each line: (section, on-screen text, syllables, chords per bar).
# Syllable = (word to sing | '-' continues previous word | None for rest, note, beats). 8 beats per line.
def S(*a): return [tuple(x) for x in a]
L_VA = lambda w: S((w[0],'C4',1),(w[1],'C4',1),(w[2],'E4',1),(w[3],'E4',1),(w[4],'G4',1),(w[5],'G4',1),(w[6],'E4',2))
CH1 = S(('brush','G4',1),('brush','G4',1),('top','A4',1),('teeth','G4',1),('swish','E4',1),('swish','E4',1),('swish','E4',1),(None,'R',1))
CH2 = S(('brush','F4',1),('brush','F4',1),('bottom','G4',.5),('-','G4',.5),('teeth','F4',1),('make','D4',1),('a','D4',1),('wish','D4',1),(None,'R',1))
CH3 = S(('round','E4',1),('and','E4',.5),('round','G4',1.5),('and','C5',1),('side','B4',1),('to','A4',1),('side','G4',2))
CH4 = S(('shiny','G4',.5),('-','G4',.5),('teeth','E4',1),('open','D4',1),('-','D4',1),('wide','C4',4))

LINES = [
 ('intro',  'Good morning, Sprout!', S((None,'R',2),('good','G4',1),('morning','E4',1),('-','G4',1),('sprout','C5',2),(None,'R',1)), ['C','G']),
 ('verse1', 'Wake up, Sprout, the sun is high,', L_VA(['wake','up','sprout','the','sun','is','high']), ['C','C']),
 ('verse1', 'Grab your brush and say hi, hi!', S(('grab','F4',1),('your','F4',1),('brush','E4',1),('and','E4',1),('say','D4',1),('hi','D4',1),('hi','C4',2)), ['F','G']),
 ('verse1', 'A little dot of minty paste,', S(('a','C4',.5),('little','C4',.5),('-','C4',1),('dot','E4',1),('of','E4',1),('minty','G4',1),('-','G4',1),('paste','E4',2)), ['C','C']),
 ('verse1', "Let's make our smile a shiny place!", S(("let's",'F4',.5),('make','F4',.5),('our','F4',1),('smile','E4',1),('a','E4',1),('shiny','D4',1),('-','D4',1),('place','C4',2)), ['F','G']),
 ('chorus', 'Brush brush, top teeth, swish swish swish,', CH1, ['C','C']),
 ('chorus', 'Brush brush, bottom teeth, make a wish!', CH2, ['F','G']),
 ('chorus', 'Round and round and side to side,', CH3, ['C','F']),
 ('chorus', 'Shiny teeth, open wide!', CH4, ['G','C']),
 ('verse2', 'Brush the front and brush the back,', L_VA(['brush','the','front','and','brush','the','back']), ['C','C']),
 ('verse2', 'Little circles, clickety clack,', S(('little','F4',.5),('-','F4',.5),('circles','E4',1),('-','E4',1),('clickety','D4',.5),('-','D4',.5),('-','D4',1),('clack','C4',3)), ['F','G']),
 ('verse2', "Don't forget your tongue, hee hee!", S(("don't",'C4',1),('forget','C4',1),('-','E4',1),('your','E4',1),('tongue','G4',1),('hee','G4',1),('hee','E4',2)), ['C','C']),
 ('verse2', 'Now we spit it out, ptoo! Ta-da!', S(('now','F4',.5),('we','F4',.5),('spit','F4',1),('it','E4',1),('out','E4',1),('ptoo','D4',1),('ta-da','D4',1),('-','C4',2)), ['F','G']),
 ('chorus2','Brush brush, top teeth, swish swish swish,', CH1, ['C','C']),
 ('chorus2','Brush brush, bottom teeth, make a wish!', CH2, ['F','G']),
 ('chorus2','Round and round and side to side,', CH3, ['Am','F']),
 ('chorus2','Shiny teeth, open wide!', CH4, ['G','C']),
 ('outro',  'All done, Sprout! Big shiny smile!', S(('all','E4',1),('done','E4',1),('sprout','G4',1),(None,'R',1),('big','C5',1),('shiny','B4',.5),('-','B4',.5),('smile','C5',2)), ['F','C']),
]

# Russian version: same structure, roles and chords; melody adapted to Russian syllables.
LINES_RU = [
 ('intro',  'Доброе утро, Росток!', S((None,'R',1),('доброе','G4',.5),('-','G4',.5),('-','E4',1),('утро','G4',1),('-','E4',1),('росток','G4',1),('-','C5',2)), ['C','G']),
 ('verse1', 'Просыпайся, наш Росток,', S(('просыпайся','C4',1),('-','C4',1),('-','E4',1),('-','E4',1),('наш','G4',1),('росток','G4',1),('-','E4',2)), ['C','C']),
 ('verse1', 'Солнце светит на порог!', S(('солнце','F4',1),('-','F4',1),('светит','E4',1),('-','E4',1),('на','D4',1),('порог','D4',1),('-','C4',2)), ['F','G']),
 ('verse1', 'Щётку, пасту, капельку,', S(('щётку','C4',1),('-','C4',1),('пасту','E4',1),('-','E4',1),('капельку','G4',1),('-','G4',1),('-','E4',2)), ['C','C']),
 ('verse1', 'Улыбнёмся солнышку!', S(('улыбнёмся','F4',1),('-','F4',1),('-','E4',1),('-','E4',1),('солнышку','D4',1),('-','D4',1),('-','C4',2)), ['F','G']),
 ('chorus', 'Чистим, чистим верхний ряд,', S(('чистим','G4',1),('-','G4',1),('чистим','A4',1),('-','G4',1),('верхний','E4',1),('-','E4',1),('ряд','E4',1),(None,'R',1)), ['C','C']),
 ('chorus', 'Чистим, чистим нижний ряд!', S(('чистим','F4',1),('-','F4',1),('чистим','G4',1),('-','F4',1),('нижний','D4',1),('-','D4',1),('ряд','D4',1),(None,'R',1)), ['F','G']),
 ('chorus', 'Вправо, влево, по кругу,', S(('вправо','E4',1),('-','E4',.5),('влево','G4',1.5),('-','C5',1),('по','B4',1),('кругу','A4',1),('-','G4',2)), ['C','F']),
 ('chorus', 'Зубки белые, как снег!', S(('зубки','G4',.5),('-','G4',.5),('белые','E4',1),('-','D4',.5),('-','D4',.5),('как','D4',1),('снег','C4',4)), ['G','C']),
 ('verse2', 'Чистим спереди и сзади,', S(('чистим','C4',.5),('-','C4',.5),('спереди','C4',1),('-','E4',1),('-','E4',1),('и','G4',1),('сзади','G4',1),('-','E4',2)), ['C','C']),
 ('verse2', 'Маленькими кружками,', S(('маленькими','F4',.5),('-','F4',.5),('-','E4',1),('-','E4',1),('кружками','D4',1),('-','D4',1),('-','C4',3)), ['F','G']),
 ('verse2', 'Язычок почистим, хи, хи!', S(('язычок','C4',.5),('-','C4',.5),('-','C4',1),('почистим','E4',1),('-','E4',1),('-','G4',1),('хи','G4',1),('хи','E4',2)), ['C','C']),
 ('verse2', 'Сплюнем, тьфу! И всё, ура!', S(('сплюнем','F4',1),('-','F4',1),('тьфу','E4',1),('и','E4',1),('всё','D4',1),('ура','D4',1),('-','C4',2)), ['F','G']),
]
LINES_RU += [('chorus2',) + l[1:] if l[0] == 'chorus' else l for l in LINES_RU[5:9]]
LINES_RU[-4] = ('chorus2', LINES_RU[-4][1], LINES_RU[-4][2], ['C','C'])
LINES_RU[-2] = ('chorus2', LINES_RU[-2][1], LINES_RU[-2][2], ['Am','F'])
LINES_RU.append(('outro', 'Всё, Росток! Улыбка, блеск!', S(('всё','E4',1),('росток','E4',1),('-','G4',1),(None,'R',1),('улыбка','C5',1),('-','B4',.5),('-','B4',.5),('блеск','C5',2)), ['F','C']))

# what each line shows on screen (same for every language)
ROLES = ['intro','wake','grab','paste','smile','top','bottom','round','shiny',
         'frontback','circles','tongue','spit','top','bottom','round','shiny','outro']
# word index inside the 'tongue' / 'spit' lines where the action happens
EVENTS = {'en': {'tongue': 3, 'spit': 5}, 'ru': {'tongue': 2, 'spit': 1}}
LANG = os.environ.get('SONG_LANG', 'en')
if LANG == 'ru': LINES = LINES_RU
assert len(LINES) == len(ROLES)
TAIL = 3.0
TOTAL = len(LINES) * 2 * BAR + TAIL

def timeline():
    out, t, ev = [], 0.0, {}
    for li, (sec, lyr, syl, ch) in enumerate(LINES):
        wt, b = [], 0.0
        for w, n, d in syl:
            if w and w != '-': wt.append(t + b * BEAT)
            b += d
        words = lyr.split()
        assert len(words) == len(wt), (lyr, len(words), len(wt))
        if ROLES[li] in EVENTS[LANG] and ROLES[li] not in ev: ev[ROLES[li]] = wt[EVENTS[LANG][ROLES[li]]]
        out.append(dict(section=sec, role=ROLES[li], text=lyr, start=t, end=t + 2 * BAR, words=words, wordTimes=wt))
        t += 2 * BAR
    return out, ev

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
    for li, (sec, lyr, syl, chords) in enumerate(LINES):
        mel = [(n, d) for w, n, d in syl]
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
                add(glock(f*2, 1.0, .07), t + b*BEAT)
                add(flute(f, d*BEAT*.92, .06), t + b*BEAT)
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
    lines, ev = timeline()
    json.dump(dict(lang=LANG, bpm=BPM, total=TOTAL, lines=lines, events=ev), open(f'timeline_{LANG}.json', 'w'), indent=1, ensure_ascii=False)
    render(f'music_{LANG}.wav')
    print('total', TOTAL)
