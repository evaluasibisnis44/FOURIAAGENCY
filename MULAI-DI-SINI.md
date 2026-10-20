# Fouria Agency Hub — Source lengkap untuk GitHub

Paket: 20 Oktober 2026. Source mencakup update Invoice terbaru yang belum diterbitkan ke situs live.

## Edit melalui browser GitHub

1. Buat repository GitHub, sebaiknya **Private** karena source memuat data internal klien, harga quotation, dan rekening pada PDF.
2. Extract ZIP ini di komputer. Buka folder `fouria-agency-hub`.
3. Upload **isi folder** ke root repository. GitHub tidak otomatis mengekstrak ZIP menjadi source.
4. Pastikan folder tersembunyi `.openai` dan file `.gitignore` ikut terunggah. Jika upload browser tidak menyertakannya, tambahkan lewat editor web atau Git.
5. Klik file lalu ikon pensil untuk edit, atau tekan tombol `.` di halaman repository untuk membuka editor github.dev.
6. Simpan perubahan dengan Commit. Perubahan di GitHub belum otomatis mengubah situs Fouria yang sedang live.

Editor GitHub dapat mengubah source melalui browser. Menjalankan aplikasi dan menerbitkan situs tetap membutuhkan lingkungan server, database, file storage, serta autentikasi yang sesuai.

## Isi paket

- `app/hub.tsx`: dashboard, detail klien, report, form quotation/invoice dan tampilan cetak.
- `app/globals.css`: desain dan warna Fouria, tampilan ponsel, format cetak.
- `app/api/`: penyimpanan records, upload bukti, dan inisialisasi data.
- `lib/model.ts`: rumus keuangan, pembayaran, pembagian profit.
- `lib/invoice.ts`: salin quotation untuk bulan pertama dan referensi quotation.
- `lib/validation.ts`: validasi data termasuk penerima, alamat, dan rekening.
- `lib/seed.ts`: data awal Batavia Whisky dan Minuman Mureh.
- `data/initial-data.json`: salinan data awal dalam JSON, **bukan backup situs live**.
- `db/` dan `drizzle/`: struktur database dan migrasi.
- `public/`: logo, font Sora, dan PDF quotation terakhir.
- `scripts/`, `build/`, `package.json`, `package-lock.json`: kebutuhan menjalankan dan membangun aplikasi.
- `.openai/hosting.json`: identitas situs Fouria dan binding penyimpanan untuk Sites.
- `tests/`: pengujian keuangan, invoice, dan API lokal.

## Fitur Invoice terbaru

- Isian Ditujukan kepada dan alamat lengkap, tampil di dokumen cetak.
- Salin detail quotation untuk bulan pertama atau periode yang dipilih.
- Penambahan rekening: nama bank, nomor rekening, dan nama penerima.
- Simpan rekening untuk digunakan kembali.
- Data rekening pada invoice disalin sebagai snapshot agar invoice lama tidak berubah saat daftar rekening berubah.
- Print / Save as PDF melalui browser.

## Data yang belum ada di ZIP

Transaksi, invoice yang disimpan pengguna, serta bukti upload pada situs live berada di Cloudflare D1 / R2, terpisah dari source aplikasi. Akses Sites ke dashboard lama saat paket dibuat masih mengembalikan `project_not_found`, sehingga data live dan bukti upload **belum diekspor**. Database preview dan transaksi QA lokal sengaja tidak disertakan agar tidak dianggap sebagai data operasional asli.

Data awal yang ada: Batavia November 2026–Januari 2027, fee Rp17.000.000/bulan; Minuman Mureh Rp5.000.000; rencana biaya Batavia November Rp7.900.000. Pembayaran aktual belum dianggap diterima sampai dicatat.

## Cara menjalankan di komputer

Butuh Node.js 22.13+ dan npm. Di folder source:

```sh
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_brown_guardian.sql
npm run dev
```

Buka URL lokal yang dicetak di terminal, lalu buka `/signin-with-chatgpt?return_to=/` pada URL lokal tersebut. Starter mensimulasikan login hanya untuk pengembangan loopback. Database dan upload lokal berbeda dari situs live.

## Hosting

Aplikasi ini **bukan satu file HTML statis**. Ia memakai React/Vinext dan Cloudflare Worker dengan D1 untuk database serta R2 untuk lampiran. GitHub Pages tidak menjalankan API, database, login, atau upload ini.

Untuk memperbarui situs Sites lama: gunakan akun owner/editor yang memiliki akses, sinkronkan source ke repository Sites melalui workflow resmi, lalu simpan versi dan deploy. Upload ke repository GitHub baru tidak otomatis tersambung ke deployment Sites lama. Jangan mengganti ID di `.openai/hosting.json` untuk mencoba mendapatkan akses.

Untuk memindah ke hosting lain: perlu konfigurasi Worker, D1, R2 dan autentikasi produksi sendiri. Paket ini mempertahankan autentikasi dan konfigurasi Sites yang sudah ada; jangan membuka API ke publik tanpa pengaturan otorisasi yang setara.

## Pengujian

```sh
node node_modules/typescript/bin/tsc --noEmit
node --experimental-strip-types tests/math.mjs
node --experimental-strip-types tests/invoice.mjs
```

`tests/integration.mjs` hanya untuk server pengembangan lokal. Ia membuat lalu menghapus data QA. Jangan menjalankannya pada situs live.

## Tidak disertakan

`node_modules`, `.git`, build output, database runtime, token login, file rahasia `.env`, log, dan cache. Instal dependensi dengan `npm ci`.
