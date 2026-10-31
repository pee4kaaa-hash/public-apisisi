"""Generate the song with real-sounding vocals using ACE-Step 1.5 (MIT license) via its Hugging Face Space.
Usage: python3 ace_generate.py en|ru OUT_DIR [seed]"""
import shutil, sys
from gradio_client import Client

STYLE = ("children's song, nursery rhyme, preschool, cheerful, ukulele, glockenspiel, hand claps, soft drums, "
         "sweet young female vocal, clear diction, happy, warm, sing-along")
LYRICS = {
'en': """[Intro]
Good morning, Sprout!

[Verse 1]
Wake up, Sprout, the sun is high,
Grab your brush and say hi, hi!
A little dot of minty paste,
Let's make our smile a shiny place!

[Chorus]
Brush brush, top teeth, swish swish swish,
Brush brush, bottom teeth, make a wish!
Round and round and side to side,
Shiny teeth, open wide!

[Verse 2]
Brush the front and brush the back,
Little circles, clickety clack,
Don't forget your tongue, hee hee!
Now we spit it out, ptoo! Ta-da!

[Chorus]
Brush brush, top teeth, swish swish swish,
Brush brush, bottom teeth, make a wish!
Round and round and side to side,
Shiny teeth, open wide!

[Outro]
All done, Sprout! Big shiny smile!""",
'ru': """[Intro]
Доброе утро, Росток!

[Verse 1]
Просыпайся, наш Росток,
Солнце светит на порог!
Щётку, пасту, капельку,
Улыбнёмся солнышку!

[Chorus]
Чистим, чистим верхний ряд,
Чистим, чистим нижний ряд!
Вправо, влево, по кругу,
Зубки белые, как снег!

[Verse 2]
Чистим спереди и сзади,
Маленькими кружками,
Язычок почистим, хи-хи!
Сплюнем, тьфу! И всё, ура!

[Chorus]
Чистим, чистим верхний ряд,
Чистим, чистим нижний ряд!
Вправо, влево, по кругу,
Зубки белые, как снег!

[Outro]
Всё, Росток! Улыбка — блеск!""",
}

def generate(lang, out_dir, seed='-1', duration=75):
    c = Client('ACE-Step/Ace-Step-v1.5', verbose=False)
    res = c.predict(
        'acestep-v15-xl-turbo', 'custom', '', lang,
        STYLE, LYRICS[lang], 120, 'C major', '4', lang,
        8, 7.0, seed == '-1', seed, None, duration, 2, None, '', 0.0, -1,
        'Fill the audio semantic mask based on the given conditions:', 1.0, 'text2music',
        False, 0.0, 1.0, 3.0, 'ode', '', 'mp3', 0.85, True, 2.0, 0, 0.9, 'NO USER INPUT',
        True, True, True, False, True, False, False, 0.5, 8, 'vocals', [], False,
        api_name='/generation_wrapper')
    outs = []
    for i, p in enumerate(res[:8]):
        if p:
            dst = f'{out_dir}/ace_{lang}_{i + 1}.mp3'; shutil.copy(p, dst); outs.append(dst)
    print('status:', res[10]); print('details:', str(res[9])[:600])
    return outs

if __name__ == '__main__':
    print(generate(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else '-1'))
