# Belajar Makharijul Huruf — Episode 02: Al-Jauf (Rongga Mulut)

Video edukasi 2D motion graphic (9:16, 1080×1920, 30 fps) untuk @alkindi.islamicschool.
Kelanjutan Episode 01, dengan gaya, ilustrasi kepala, header, dan subtitle yang sama. Tanpa musik latar, hanya voice-over dan sound effect.

| file | isi |
|---|---|
| `lines.json` | semua kalimat voice-over: id, scene, teks ucapan, teks subtitle |
| `score.js` | timeline: panjang scene menyesuaikan rekaman, event animasi & SFX |
| `film.js` | visual: cover, header, 8 scene, subtitle, username |
| `song.js` | voice-over + SFX |
| `tools-el-split.py` | memotong rekaman per scene (`assets/el/s1..s8.mp3`) menjadi `assets/vo/<id>.wav` |
| `tools-vo.py` | voice-over TTS lokal (Piper), dipakai sebagai pengganti sementara |
| `NASKAH-VOICEOVER.md` | naskah + teks siap tempel untuk ElevenLabs |

Render ulang:

```bash
python3 tools-el-split.py
node song.js && node engine/render.js video && node engine/render.js mux
```
