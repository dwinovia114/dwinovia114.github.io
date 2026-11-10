# Belajar Makharijul Huruf — Episode 01: Mengenal Makharijul Huruf

Video edukasi 2D motion graphic (9:16, 1080×1920, 30 fps, ±2:39) untuk @alkindi.islamicschool.
Hasil akhir: `makharijul-huruf-ep01.mp4`.

Semua gambar digambar dengan kode (canvas) dan musik disintesis dengan kode; voice-over memakai TTS Piper (suara Bahasa Indonesia `id_ID-news_tts-medium`).

| file | isi |
|---|---|
| `score.js` | timeline tunggal: adegan, penempatan voice-over, subtitle, event animasi & SFX |
| `film.js` | seluruh visual (cover, header logo/judul, 7 adegan, subtitle, username) |
| `song.js` | voice-over + musik latar lembut + SFX, ducking otomatis di bawah narasi |
| `tools-vo.py` | membuat ulang file voice-over (`assets/vo/*.wav`) dan `vo-data.js` |

Render ulang:

```bash
python3 tools-vo.py <path>/id_ID-news_tts-medium.onnx   # bila narasi diubah
node song.js && node engine/render.js video && node engine/render.js mux
```
