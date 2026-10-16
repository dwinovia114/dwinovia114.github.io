DEE Projects — Website utama (starter build)

ISI:
- index.html : struktur halaman
- styles.css : desain responsif, header navy, hero, cards, animasi
- script.js : reveal/fade on scroll, menu mobile, pencarian, active nav
- assets/favicon.svg : favicon awal

CARA MENJALANKAN:
1. Ekstrak ZIP.
2. Buka index.html di browser untuk preview.
3. Untuk publikasi, unggah seluruh isi folder ke root hosting dwinovia.my.id (setelah backup website lama).

CATATAN:
- Tautan DEE Media mengarah ke https://media.dwinovia.my.id/
- Kartu projek di bagian “Projek Terbaru” saat ini berupa contoh visual; ganti dengan URL produk yang benar sebelum publikasi.
- Email hello@dwinovia.my.id adalah placeholder dan perlu diganti jika belum digunakan.
- Navigasi header menggunakan Beranda, Projek, Tentang, dan Kontak. Bagian tiga lini produk menggunakan heading 'WHAT WE CREATE' dengan judul 'Berawal dari Ide, Menjadi Karya.'\n- Animasi menggunakan IntersectionObserver dan menghormati preferensi reduced motion.
- Logo navbar adalah simbol tumpukan/layers mengikuti referensi mockup; bisa diganti dengan aset logo resmi DEE Projects jika sudah final.


Paket deployment GitHub Pages:
- File CNAME berisi dwinovia.my.id untuk custom domain.
- Logo monogram di navbar/footer memakai assets/dee-monogram.png yang diekstrak dari referensi logo pilihan pengguna.
- assets/favicon.png adalah favicon berbasis monogram.
- Unggah seluruh ISI folder ini ke root repository dwinovia114.github.io pada branch main; jangan unggah folder pembungkusnya.
- Sebelum mengganti website live, unduh/backup file lama dari repository.
