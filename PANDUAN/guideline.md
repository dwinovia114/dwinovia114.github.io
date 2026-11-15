# Guideline Produksi — Seri "Belajar Makharijul Huruf"

Al Kindi Islamic School · @alkindi.islamicschool

Dokumen ini merangkum semua keputusan yang sudah disepakati selama membuat Episode 01 (Mengenal Makharijul Huruf) dan Episode 02 (Al-Jauf). Setiap video baru di seri ini **wajib** mengikutinya.

- Kalau permintaan di chat bertentangan dengan guideline, **ikuti permintaan chat**, lalu tanyakan apakah guideline perlu diperbarui.
- Kalau ada revisi bersifat gaya umum yang disetujui, tawarkan untuk ditambahkan ke file ini.

Proyek acuan (salin, jangan desain ulang dari nol):
- `video/makharijul-huruf-ep02/` adalah template terbaru, dengan scene yang panjangnya otomatis mengikuti voice-over.
- `video/makharijul-huruf-ep01/` adalah contoh episode pengantar (anatomi lengkap, 5 → 17 → 29).

---

## 1. Persona dan rasa

- **Siapa yang bicara:** guru tajwid yang hangat dan sabar, mengajak murid belajar bersama ("kita", "Yuk", "Coba ucapkan bersama"). Tidak menggurui, tidak lucu-lucuan.
- **Penonton:** umum (anak sampai dewasa) yang menonton di ponsel lewat Reels, TikTok, atau Shorts.
- **Rasa visual:** tenang, bersih, dan islami modern. Latar navy gelap, aksen emas, dan motif geometris islami yang samar. Profesional, bukan kartun ramai.
- **Bahasa:** Bahasa Indonesia baku yang ringan. Istilah Arab ditulis dengan tanda hubung dan huruf besar, misalnya **Al-Jauf**, **Asy-Syafatain**, **Makharijul Huruf**.
- **Ketepatan materi di atas segalanya:**
  - Tulisan Arab selalu berharakat lengkap, memakai font yang benar, dan tidak boleh terbalik atau terputus.
  - Setiap episode diakhiri catatan materi yang perlu diperiksa guru tajwid.
  - Jangan menambah klaim materi yang tidak ada di storyboard atau yang tidak umum diajarkan.
- **Satu ide per scene.** Jangan memadatkan layar.
- **Pesan serial:** *Kenali Hurufnya. Benarkan Bacaannya.*

## 2. Warna

| Peran | Kode | Penggunaan |
|---|---|---|
| Navy | `#182338` | Latar utama (gradasi `#1B2843` → `#182338` → `#111A2C`) |
| Blue | `#3659D9` | Cahaya latar, plat huruf, elemen pendukung |
| Gold | `#D5A94E` | Aksen, pill judul, garis bawah judul, kata kunci, angka penting |
| White | `#FFFFFF` | Teks utama |
| Soft white | `rgba(255,255,255,0.72)` | Teks keterangan |
| Kartu | `rgba(15,23,38,0.86)` + garis `rgba(255,255,255,0.14)` | Semua kartu dan panel |

**Warna lima makhraj** (wajib konsisten di semua episode):

| Makhraj | Warna |
|---|---|
| Al-Jauf (rongga mulut) | `#2EC4B6` teal |
| Al-Halq (tenggorokan) | `#FF6B6B` coral |
| Al-Lisan (lidah) | `#F78FB3` pink |
| Asy-Syafatain (dua bibir) | `#FFA94D` oranye |
| Al-Khaisyum (rongga hidung) | `#9D8DF1` ungu |

Aturan warna:
- Makhraj yang sedang dibahas menyala (tint, glow, dan garis putih berdenyut). Makhraj lain diredupkan sekitar 70%.
- Warna aksen sebuah episode mengikuti warna makhraj-nya. Contoh: Episode 02 memakai teal (Al-Jauf), Episode 03 memakai coral (Al-Halq).

**Latar:**
- Pola bintang delapan islami, garis `rgba(120,150,255,0.075)`, ukuran sel 120 px, bergeser pelan ke atas.
- Tiga bercak cahaya biru yang bergerak lambat.
- Sekitar 46 butir debu emas yang berkelip.
- Finishing: vignette 0,28 dan grain 0,025.

## 3. Tipografi

| Elemen | Font | Ukuran / gaya |
|---|---|---|
| Teks Indonesia (semua) | **Poppins** (400/500/600/700/800) | — |
| Teks Arab | **Noto Naskh Arabic Bold**, berharakat lengkap, `direction: rtl` | — |
| Judul cover "MAKHARIJUL" / "HURUF" | Poppins 800 | 118 px, letter-spacing 2 / 10, bayangan |
| "BELAJAR" di cover | Poppins 600, gold | 58 px, letter-spacing 18 |
| Judul scene | Poppins 800, HURUF BESAR | 50–64 px, letter-spacing 1–4 |
| Label kartu | Poppins 800 | 40–54 px |
| Keterangan | Poppins 500, soft white | 26–34 px |
| Subtitle | Poppins 500 | 37 px |
| Header kanan atas | Poppins 800 33 px + baris episode Poppins 500 25 px gold | — |
| Username | Poppins 600 | 34 px |
| Huruf hijaiyah besar | Noto Naskh Arabic | 150–260 px (hook), 60–110 px (kartu) |

Aturan:
- Teks di layar tidak boleh lebih kecil dari 24 px.
- Transliterasi memakai tanda panjang: **qāla, yaqūlu, qīla, nūḥīhā**.
- Bentuk tulisan Arab tidak boleh dipecah per huruf untuk diberi warna, karena sambungannya bisa rusak. Untuk menyorot satu huruf, tampilkan huruf itu terpisah di kartu atau chip.

## 4. Aturan subtitle

- **Satu subtitle untuk setiap kalimat voice-over.** Tampil 0,1 detik sebelum suara mulai, bertahan 0,5 detik setelah suara selesai, dan tidak boleh menimpa subtitle berikutnya.
- **Posisi:** tengah, pusat di y ≈ 1532 (di atas username). Lebar teks maksimal 900 px, maksimal 3 baris, tinggi baris 52 px.
- **Kotak:** sudut membulat 24 px, isi `rgba(11,17,31,0.78)`, garis tipis putih 10%, padding 34 px. Muncul dan hilang dengan fade 0,15 detik.
- **Isi:** teks tampilan dari `lines.json` (kolom `text`), bukan teks ucapan TTS.
  - Istilah Arab memakai tanda hubung (Al-Jauf).
  - Contoh bacaan memakai transliterasi bertanda panjang (qāla).
  - Angka ditulis sebagai digit (17, 29).
- Subtitle **tidak tampil di cover**.
- Isi subtitle harus sama persis dengan yang diucapkan. Kalau audio diubah (misalnya "alif sukun" menjadi "alif"), ubah juga subtitle, kartu, dan naskah.

## 5. Aturan judul

**Cover (0 – 3,5 detik)**
- Logo sekolah di **tengah atas**: lingkaran r = 250 di (540, 600), dipotong lingkaran, dengan sinar emas berputar di belakangnya.
- Di bawah logo, berurutan:
  1. pill "SERI TAJWID • EPISODE NN";
  2. "BELAJAR" (gold);
  3. "MAKHARIJUL" / "HURUF";
  4. مَخَارِجُ الْحُرُوفِ (gold);
  5. satu baris keterangan (Ep01: tagline, Ep02 dan seterusnya: "Episode N: Judul").
- Username **@alkindi.islamicschool** di tengah bawah.

**Setelah cover (mulai detik 2,9)**
- Logo terbang mengecil ke **sudut kiri atas** (112, 138, r = 58) dengan lintasan melengkung.
- Judul masuk dari kanan ke **sudut kanan atas**, rata kanan di x = 1020:
  - baris 1: "BELAJAR MAKHARIJUL HURUF";
  - garis emas pendek;
  - baris 2: "Episode N: Judul Episode" (gold), misalnya "Episode 2: Al-Jauf (Rongga Mulut)".
- **Username tetap di tengah bawah** (y = 1812) dalam pill bergaris emas sepanjang video.

**Judul scene:** huruf besar Poppins 800 di y ≈ 300 (di bawah header), boleh diberi sub-judul berwarna aksen di y ≈ 355. Pill kecil (gold atau warna makhraj) dipakai untuk penegasan singkat, misalnya "MAKHRAJ PERTAMA" atau "NEXT EPISODE ▶".

**Penutup**
- Judul header memudar.
- Logo bergerak dari pojok ke tengah bawah (540, 1135, r = 120) dengan cincin emas yang "bernapas".
- Tampil:
  - nama makhraj (Arab) atau مَخَارِجُ الْحُرُوفِ;
  - "MAKHARIJUL" / "HURUF";
  - garis emas;
  - "KENALI HURUFNYA." / "BENARKAN BACAANNYA." (gold);
  - pill "EPISODE NN — SELESAI".

**Penulisan nomor episode:** "Episode 2" di header dan judul, "EPISODE 02" di pill.

## 6. Pustaka animasi (bernomor)

Gunakan nomor ini saat merencanakan scene, misalnya "Scene 3: A08 + A16 + A11". Semua animasi digerakkan dari waktu di `score.js`.

| No. | Nama | Deskripsi | Dipakai di |
|---|---|---|---|
| A01 | Cover reveal | Sinar emas berputar di belakang logo, teks muncul berurutan (fade + naik 40 px) | Cover |
| A02 | Header morph | Logo terbang melengkung ke pojok kiri atas, judul slide dari kanan ke pojok kanan atas | Semua episode |
| A03 | Pop huruf | Huruf/kartu muncul dengan `outBack` (overshoot 2–3), 0,35–0,45 detik, plus SFX pop | Ep01 S1, S5; Ep02 S1, S5 |
| A04 | Gelombang suara | Busur konsentris memancar dari huruf saat diucapkan | Ep01 S1; Ep02 S4 |
| A05 | Pita aliran | Gelombang sinus memanjang dari huruf saat vokal dipanjangkan | Ep02 S1 |
| A06 | Demo bibir | Bibir tampak depan; "Ba" = rapat lalu membuka + semburan udara; "Ma" = rapat + getaran dengung | Ep01 S1 |
| A07 | Cincin huruf + tautan | Huruf hijaiyah melingkar; garis putus-putus berjalan dari huruf ke organ (mengikuti kepala) | Ep01 S2 |
| A08 | Kepala anatomi | **Satu** ilustrasi kepala tampak samping (menghadap kiri) untuk seluruh seri; posisi/zoom lewat keyframe dengan easing `inOutCubic` | Semua episode |
| A09 | Sorot makhraj | Area makhraj: tint warna → glow + garis putih berdenyut; area lain redup | Ep01 S4, S6; Ep02 S2, S3, S7 |
| A10 | Label penunjuk | Titik bercahaya di organ + garis + pill label di tepi layar | Ep01 S3; Ep02 S3 |
| A11 | Kartu masuk | Kartu slide 140–160 px + fade, keluar ke arah berlawanan; kartu aktif bergaris warna makhraj, kartu lain redup | Semua |
| A12 | Chip progres 1–5 | Lima lingkaran warna makhraj bernomor; yang aktif membesar dan bercahaya | Ep01 S4; Ep02 S2 |
| A13 | Hitung angka | Angka naik satu per satu dengan "bump" 12%; warna berubah emas saat target tercapai | Ep01 S5 |
| A14 | Titik artikulasi | Titik emas muncul satu per satu di kepala, sinkron dengan hitungan | Ep01 S5 |
| A15 | Grid huruf | 29 huruf hijaiyah, 6 kolom, urutan kanan ke kiri, pop berurutan 0,11 detik; bisa menyatu ke tengah | Ep01 S5 |
| A16 | Aliran udara | Partikel dari pita suara → tenggorokan → mulut → keluar bibir | Ep02 S3 |
| A17 | Target tak menempel | Lingkaran putus-putus yang melayang dan tidak pernah menempel = "tidak ada titik sentuh pasti" | Ep02 S3 |
| A18 | Bar harakat | Bar terisi dengan ketukan bernomor (1, 2) untuk panjang bacaan | Ep02 S5 |
| A19 | Kartu pembanding | Dua kartu dengan lingkaran "≠" emas di tengah, atau kartu "huruf → asal makhraj" | Ep02 S6 |
| A20 | Teaser episode | Pill "NEXT EPISODE ▶" slide dari kiri, kepala zoom ke makhraj berikutnya, kartu bercahaya + sapuan cahaya, huruf-huruf makhraj itu pop | Akhir setiap episode |
| A21 | Penutup logo | Logo ke tengah bawah + cincin emas bernapas | Penutup |
| A22 | Titik menunggu | Tiga titik berdenyut sebelum elemen utama muncul, supaya layar tidak kosong | Ep02 S5 |
| A23 | Transisi scene | Crossfade 0,5–0,8 detik; kepala anatomi berpindah posisi secara mulus (morph), bukan potong | Semua |

## 7. Ritme

- **Durasi episode:** sekitar 2:30–2:50. Cover 3,5 detik.
- **Panjang scene mengikuti voice-over** (lihat `PLAN` di `score.js` Ep02):
  - jeda sebelum kalimat: 0,7–1,8 detik (lebih panjang sebelum poin baru);
  - ekor setelah kalimat terakhir: 2,2–3,0 detik;
  - panjang minimum per scene: sesuai storyboard.
- **Elemen muncul tepat saat kata yang bersangkutan diucapkan.** Contoh: contoh bacaan muncul di sekitar 78% durasi kalimat ("Contohnya, qāla"), dan huruf mad pop saat disebut.
- **Tidak boleh ada layar kosong lebih dari ±2 detik.** Isi dengan judul scene atau A22.
- Setiap teks harus tampil cukup lama untuk dibaca (minimal ±1,5 detik setelah selesai muncul).
- Tempo voice-over sedang; beri jeda setelah pertanyaan sebelum jawabannya.
- Transisi antar scene 0,5–0,8 detik, dengan whoosh di pergantian scene.

## 8. Audio dan sound effect

- **Tanpa musik latar.** Hanya voice-over + sound effect. Musik bisa dinyalakan lagi dengan `MUSIC=1 node song.js` kalau diminta.
- **Voice-over:** ElevenLabs.
  - Suara **"Abu Aisyah"**, `voice_id EOiisOG9mUn5iXbtXJuL`, model **eleven_v4**.
  - Satu generasi per scene. Antar kalimat dipisah `[long pause]` supaya bisa dipotong otomatis.
  - Tag nada: `[warmly]` (bawaan), `[curious]` (pertanyaan), `[serious]` (peringatan).
  - Contoh bacaan ditulis untuk diucapkan panjang: `qaala`, `yaquulu`, `qiila`, `nuuhiihaa`, `Qaa…`.
  - Kalau ElevenLabs sibuk ("free generations are busy"), jangan mengulang di giliran yang sama. Beri tahu Dwi, dan tawarkan dua jalan:
    - coba lagi nanti;
    - Dwi membuatnya sendiri di canvas ElevenLabs lalu mengunggah MP3 per scene (`s1.mp3` …).
  - Rekaman yang diunggah Dwi dipakai apa adanya. Kalau isinya berbeda dari naskah, sesuaikan subtitle, kartu, dan naskah.
  - TTS lokal (Piper) hanya untuk pengganti sementara di preview, **tidak pernah** di hasil final.
- **Sound effect** (disintesis di `song.js`, terikat ke event di `score.js`):

| SFX | Kapan |
|---|---|
| pop | huruf/kartu/chip muncul |
| whoosh | pergantian scene, slide kartu, header masuk |
| chime (music box) | sorotan penting; satu nada naik per makhraj/poin |
| wood tick | hitungan, chip progres, ketukan harakat |
| thud | peringatan ("Hati-hati!") |
| noise sweep lembut | aliran udara/suara |

- **Level:**
  - voice gain 1,7;
  - SFX 13–20 dB di bawah suara;
  - master **−14 LUFS**, true peak ≤ −1,5 dBTP;
  - highpass 30 Hz;
  - audio fade-out 2,2 detik di akhir.
  - Ukur dengan `levels.js` dan `ebur128`.
  - Jangan mengolah suara narator di luar itu (tanpa EQ, kompresor, atau noise reduction).

## 9. Alur kerja (wajib berurutan)

1. **Brief.** Baca storyboard/permintaan. Kalau tidak ada storyboard, susun sendiri materi episode berdasarkan teaser episode sebelumnya dan rencana serial (§11), lalu tandai bahwa materinya perlu diperiksa guru tajwid.
2. **Proyek.** Salin proyek episode terbaru ke `video/makharijul-huruf-epNN/` (tanpa `out/`, `assets/el/`, `assets/vo/`, `*.mp4`, `cover.png`). Perbarui:
   - header ("Episode N: …");
   - pill cover;
   - pill penutup;
   - judul `<title>` di `index.html`.
3. **Naskah.** Tulis `lines.json` (id, scene, `spoken`, `text`) dan `NASKAH-VOICEOVER.md`, berisi:
   - teks ElevenLabs siap tempel per scene (dengan tag);
   - tabel per kalimat;
   - catatan materi untuk guru tajwid.
4. **Voice-over.** Buat flow ElevenLabs baru ("Makharijul Huruf EpNN - Voice-over"), lalu generate per scene. Unduh MP3 ke `assets/el/sN.mp3` (host `elevenlabsusercontent.com` sudah diizinkan). Jalankan `python3 tools-el-split.py`. Untuk scene yang belum ada, isi sementara dengan `tools-vo.py` (Piper).
5. **Timeline.** Isi `PLAN` dan `ev` di `score.js`. Semua waktu animasi dan SFX berasal dari sini.
6. **Visual.** Tulis scene di `film.js` dari pustaka animasi (§6). Pakai ulang fungsi bersama (latar, kepala, header, subtitle, footer, cover).
7. **Sound effect.** Tulis cue SFX episode di `song.js`.
8. **Review still.** Render frame di setiap marker (`render.js stills @marker`) dan periksa:
   - teks bertumpuk;
   - teks Arab terpotong atau salah posisi;
   - layar kosong;
   - teks di luar area aman;
   - keterbacaan di ponsel;
   - kecocokan subtitle dengan kartu.
9. **Preview.** Kalau voice-over belum lengkap, kirim preview setengah resolusi (`video --draft`) + naskah.
10. **Final.** Setelah semua voice-over ElevenLabs lengkap:
    - `node song.js && node engine/render.js video && node engine/render.js mux`;
    - periksa contact sheet dan loudness;
    - salin MP4 ke folder proyek;
    - buat `cover.png` (frame detik 2,6).
11. **Kirim dan simpan.** Commit + push ke branch kerja. Kirim MP4 + cover dengan SendUserFile. Laporkan:
    - durasi, resolusi, dan ukuran file;
    - kredit ElevenLabs yang terpakai;
    - apa yang perlu diperiksa guru;
    - bahwa audio diperiksa dengan pengukuran, bukan didengar.

## 10. Spesifikasi teknis

| Item | Nilai |
|---|---|
| Format | MP4 (H.264 crf 18, yuv420p, faststart) + AAC 256 kbps |
| Rasio / resolusi | 9:16, **1080 × 1920** |
| Frame rate | 30 fps |
| Loudness | −14 LUFS integrated, true peak ≤ −1,5 dBTP |
| Mesin | animation-studio (canvas, headless Chrome); setiap frame fungsi murni dari waktu `t`; tanpa `Math.random()` |
| Gaya engine | `STYLE = 'flat'`, post: paper 0, grain 0,025, vignette 0,28; video fade-out 1,2 detik |
| Area konten | x 70–1010; header y 80–190; konten y 260–1400; subtitle y ≈ 1440–1620; username y ≈ 1780–1846 |
| Logo | `assets/logo.png` (640 px, dari logo resmi Al Kindi), dipotong lingkaran (badge ≈ 96,5% lebar gambar) dengan bayangan |
| Font | `assets/fonts/poppins-latin-{400..800}-normal.woff2`; Noto Naskh Arabic dari `engine/fonts` |
| Struktur proyek | `lines.json`, `vo-data.js`, `score.js`, `film.js`, `song.js`, `tools-el-split.py`, `tools-vo.py`, `NASKAH-VOICEOVER.md`, `README.md`, `assets/` |
| Nama file hasil | `video/makharijul-huruf-epNN/makharijul-huruf-epNN.mp4` + `cover.png` |
| Render | `video` ±12–15 menit (jalankan di background); `--draft` ±4 menit |

## 11. Rencana serial

| Episode | Judul | Materi | Warna aksen |
|---|---|---|---|
| 01 ✅ | Mengenal Makharijul Huruf | Pengertian, 5 makhraj utama, 17 makhraj khusus, 29 huruf | Gold |
| 02 ✅ | Al-Jauf | Rongga mulut dan 3 huruf mad | Teal |
| 03 | Al-Halq | Tenggorokan dan 6 huruf (ء ه ع ح غ خ) | Coral |
| 04A | Al-Lisan Part 1 | Pangkal dan tengah lidah | Pink |
| 04B | Al-Lisan Part 2 | Sisi dan ujung lidah | Pink |
| 05 | Asy-Syafatain | Dua bibir dan 4 huruf | Oranye |
| 06 | Al-Khaisyum | Rongga hidung dan ghunnah | Ungu |

Setiap episode diakhiri teaser episode berikutnya (A20), lalu penutup (A21).
