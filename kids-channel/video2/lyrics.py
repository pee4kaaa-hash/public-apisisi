"""Video #2 'Wash Your Hands!' / 'Моем ручки!' — lyrics, line roles (drive the animation) and ACE-Step requests."""
import json, os, sys

BPM = 120
ROLES = ['intro', 'mud', 'look', 'water', 'soap', 'rub', 'backs', 'fingers', 'clean',
         'count', 'thumbs', 'rinse', 'dry', 'rub', 'backs', 'fingers', 'clean', 'outro']
SECTIONS = ['intro'] + ['verse1'] * 4 + ['chorus'] * 4 + ['verse2'] * 4 + ['chorus2'] * 4 + ['outro']
TEXT = {
 'en': ["Splish splash, hello, Sprout!",
        "Sprout played out in the muddy rain,", "Look at those hands, a muddy stain!",
        "Turn on the water, nice and warm,", "Squeeze the soap and make it foam!",
        "Rub rub, palms together,", "Scrub the backs, now that's much better!",
        "Wiggle fingers in between,", "Bubbles, bubbles, squeaky clean!",
        "Sing along and count with me,", "Thumbs and nails, one, two, three!",
        "Rinse the bubbles down the drain,", "Dry your hands, they're clean again!",
        "Rub rub, palms together,", "Scrub the backs, now that's much better!",
        "Wiggle fingers in between,", "Bubbles, bubbles, squeaky clean!",
        "Clean hands, happy Sprout! Yay!"],
 'ru': ["Плюх-плюх, привет, Росток!",
        "Наш Росток гулял в саду,", "Ручки в грязи, ну и ну!",
        "Открываем кран с водой,", "Мыло пенится горой!",
        "Трём, трём ладошки,", "Трём и спинки понемножку,",
        "Пальчики и между ними,", "Пузыри, и ручки чистые!",
        "Посчитаем: раз, два, три,", "Ноготочки ты потри!",
        "Смоем пену мы водой,", "Вытрем, чистый наш герой!",
        "Трём, трём ладошки,", "Трём и спинки понемножку,",
        "Пальчики и между ними,", "Пузыри, и ручки чистые!",
        "Чистые ручки! Ура, Росток!"],
}
LINES_EN = [(s, t) for s, t in zip(SECTIONS, TEXT['en'])]
LINES_RU = [(s, t) for s, t in zip(SECTIONS, TEXT['ru'])]
EVENTS = {'en': {}, 'ru': {}}

STYLE = ("children's song, nursery rhyme, preschool, cheerful, bouncy, ukulele, xylophone, hand claps, soft drums, "
         "sweet young female vocal, clear diction, happy, playful, sing-along")
TAGS = {'intro': '[Intro]', 'verse1': '[Verse 1]', 'chorus': '[Chorus]', 'verse2': '[Verse 2]', 'chorus2': '[Chorus]', 'outro': '[Outro]'}

def lyrics(lang):
    out, prev = [], None
    for s, t in zip(SECTIONS, TEXT[lang]):
        if s != prev: out.append(('\n' if out else '') + TAGS[s]); prev = s
        out.append(t)
    return '\n'.join(out)

if __name__ == '__main__':
    d = sys.argv[1]
    for lang in ('en', 'ru'):
        req = dict(lm_model='acestep-5Hz-lm-1.7B-Q8_0.gguf', synth_model='acestep-v15-turbo-Q8_0.gguf',
                   caption=STYLE, lyrics=lyrics(lang), duration=75, bpm=BPM, vocal_language=lang,
                   keyscale='G major', timesignature='4', inference_steps=8, guidance_scale=1.0, shift=3.0, seed=7)
        json.dump(req, open(f'ace_request_{lang}.json', 'w'), ensure_ascii=False, indent=1)
        json.dump(req, open(os.path.join(d, f'v2_{lang}.json'), 'w'), ensure_ascii=False, indent=1)
    print(lyrics('ru'))
