# Belajar Makharijul Huruf — Episode 01: Mengenal Makharijul Huruf

Video edukasi 2D motion graphic (9:16, 1080×1920, 30 fps, ±2:46) untuk @alkindi.islamicschool.
Hasil akhir: `makharijul-huruf-ep01.mp4`.

Semua gambar digambar dengan kode (canvas) dan efek suara disintesis dengan kode (tanpa musik latar); voice-over dari ElevenLabs (suara "Abu Aisyah", model eleven_v4), dipotong per kalimat dengan `tools-el-split.py`.

| file | isi |
|---|---|
| `score.js` | timeline tunggal: adegan, penempatan voice-over, subtitle, event animasi & SFX |
| `film.js` | seluruh visual (cover, header logo/judul, 7 adegan, subtitle, username) |
| `song.js` | voice-over + musik latar lembut + SFX, ducking otomatis di bawah narasi |
| `tools-el-split.py` | memotong rekaman per scene (`assets/el/s1..s7.mp3`) menjadi `assets/vo/<id>.wav` dan memperbarui `vo-data.js` |
| `tools-vo.py` | alternatif: voice-over TTS lokal (Piper) |
| `NASKAH-VOICEOVER.md` | naskah rekaman per baris |

Render ulang:

```bash
python3 tools-el-split.py   # setelah mengganti rekaman di assets/el/
node song.js && node engine/render.js video && node engine/render.js mux
```
