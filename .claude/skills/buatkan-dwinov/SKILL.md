---
name: buatkan-dwinov
description: "Membuat video animasi edukasi 9:16 seri \"Belajar Makharijul Huruf\" untuk Al Kindi Islamic School (@alkindi.islamicschool), mengikuti PANDUAN/guideline.md. Pakai setiap kali Dwi bilang \"buatkan\" (misalnya \"buatkan episode 3\", \"buatkan video Al-Halq\", \"buatkan versi baru\") atau meminta video/animasi baru untuk seri ini."
---

# buatkan-dwinov — pembuat video animasi seri Makharijul Huruf

Balas dalam bahasa Indonesia.

## 0. WAJIB: baca guideline dulu
Sebelum melakukan apa pun (naskah, voice-over, desain, render):
1. Baca **seluruh** `PANDUAN/guideline.md` di root repositori `dwinovia114.github.io`.
2. Semua keputusan mengikuti guideline itu: persona, warna, tipografi, subtitle, judul, animasi, ritme, audio, alur kerja, dan spesifikasi teknis.
3. Kalau permintaan Dwi di chat bertentangan dengan guideline, ikuti permintaan Dwi, lalu tanyakan apakah guideline perlu diperbarui.
4. Kalau file guideline tidak ditemukan atau tidak bisa dibaca, berhenti dan beri tahu Dwi. Jangan membuat video dari ingatan.

## 1. Siapkan ruang kerja
- Proyek acuan ada di `video/makharijul-huruf-ep02/` (template terbaru) dan `video/makharijul-huruf-ep01/`. Salin proyek terbaru sebagai titik awal dan ganti isinya. Jangan mendesain ulang dari nol.
- Kalau `engine/` belum ada di salinan, ambil dari proyek sebelumnya. Mesinnya berasal dari skill animation-studio. Untuk perintah render, baca skill itu bila tersedia.
- Butuh: Node 22+, ffmpeg, Chrome/Chromium headless, Python 3. Piper (`pip install piper-tts` + model `id_ID-news_tts-medium` dari rilis GitHub `k2-fsa/sherpa-onnx` tag `tts-models`) hanya untuk suara sementara di preview.
- Voice-over memakai konektor ElevenLabs: suara "Abu Aisyah" (`EOiisOG9mUn5iXbtXJuL`), model `eleven_v4`. Unduhan audio membutuhkan host `elevenlabsusercontent.com`.

## 2. Alur kerja (ikuti §9 guideline, berurutan)
1. **Pahami brief.** Kalau tidak ada storyboard, susun materi sendiri dari rencana serial (§11), tandai poin yang perlu diperiksa guru tajwid, lalu tunjukkan rancangan scene-nya ke Dwi sebelum membangun.
2. **Naskah.** Tulis `lines.json` + `NASKAH-VOICEOVER.md`, termasuk teks ElevenLabs siap tempel per scene.
3. **Voice-over ElevenLabs** per scene.
   - Kalau ElevenLabs menjawab "busy", jangan mengulang di giliran yang sama. Beri tahu Dwi dan tawarkan dua jalan: "lanjut ElevenLabs" nanti, atau Dwi mengunggah MP3 buatannya sendiri.
   - Jalankan `tools-el-split.py`.
4. **Timeline dan visual.** Isi `score.js`, `film.js`, dan cue SFX di `song.js`, memakai pustaka animasi bernomor (§6).
5. **Review still** di setiap marker sampai bersih.
6. **Preview** setengah resolusi kalau voice-over belum lengkap.
7. **Render final** setelah semua voice-over ElevenLabs lengkap. Periksa contact sheet dan loudness (−14 LUFS).
8. **Kirim dan simpan.**
   - Commit + push ke branch kerja.
   - Kirim MP4 + `cover.png` dengan SendUserFile.
   - Laporkan durasi, ukuran, kredit ElevenLabs yang terpakai, dan poin yang perlu diperiksa guru.

## 3. Batasan
- Tanpa musik latar, kecuali Dwi memintanya.
- Hasil final tidak boleh memakai suara TTS sementara.
- Rekaman yang diunggah Dwi dipakai apa adanya. Kalau isinya berbeda dari naskah, sesuaikan subtitle, kartu, dan naskah.
- Tulisan Arab selalu berharakat lengkap dengan Noto Naskh Arabic. Jangan memecah kata Arab untuk diwarnai.
- Jangan mengubah identitas visual (warna, font, posisi logo/judul/username) tanpa persetujuan Dwi.
- Setiap revisi gaya yang disetujui Dwi dan berlaku umum: tawarkan untuk ditambahkan ke `PANDUAN/guideline.md`, lalu perbarui file itu setelah Dwi setuju.
