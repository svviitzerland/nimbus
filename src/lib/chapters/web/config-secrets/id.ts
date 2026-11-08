import type { ConfigSecretsText } from './types';

export const id: ConfigSecretsText = {
	title: 'Konfigurasi dan Secrets',
	intro: [
		'Kode nimbus.com yang sama jalan di dua tempat, di laptopmu selagi kamu bikin dan di server buat semua orang. Tapi ada beberapa setelan yang harus beda. Di laptop, database ada di <b>localhost</b> (komputer ini sendiri), di server ada di db.nimbus.com. Setelan kayak gini namanya <b>config</b>.',
		'Cara cepatnya, ketik langsung di dalam kode, namanya <b>hard coding</b>. Akibatnya kodenya cuma cocok di satu tempat. Begitu diunggah, server nyari localhost, yang buat server artinya dirinya sendiri, dan nggak nemu database di sana.',
		'Hard coding <b>rahasia</b> lebih parah lagi. <b>API key</b> itu semacam password yang bikin kodemu boleh pakai layanan berbayar, misalnya menerima pembayaran. Push ke GitHub, dan siapa pun yang baca repo itu bisa menghabiskan uangmu. Ada bot yang menyisir repo publik nyari key sepanjang hari.',
		'Jadi config pindah keluar dari kode, ke <b>environment variable</b>. Environment itu tempat program berjalan, dan dia bisa menyimpan nilai yang diberi nama. Kodenya nggak tahu lagi nilainya, dia cuma minta pakai nama, misalnya DATABASE_URL.',
		'Di laptopmu, nilai nilai itu tinggal di file teks kecil bernama <b>.env</b>, satu NAMA=nilai per baris. Kodenya tetap sama di mana pun, cuma file kecil ini yang beda.',
		'Dan .env <b>nggak pernah ikut masuk commit</b>. Tulis namanya di <b>.gitignore</b>, daftar file yang pura pura nggak dilihat Git. Sekarang push, app.js berangkat ke GitHub sementara .env tetap di rumah.',
		'Server butuh nilainya sendiri, dan nggak ada file yang disalin. Host kamu punya halaman di <b>dashboard</b> buat environment variable. Ketik nilai server di sana sekali, lalu host memberikannya ke aplikasimu tiap kali aplikasinya nyala.',
		'[ingat] Kode itu kartu resep yang boleh kamu tunjukin ke siapa aja. File .env itu catatan tempel di kulkasmu sendiri, isinya setelan oven dan kunci lemari. Bagikan resepnya, jangan catatan tempelnya.',
		'[fyi] Nggak sengaja push key? Menghapus barisnya nggak cukup, karena riwayat Git masih mengingatnya. <b>Cabut</b> (revoke) key itu di layanannya supaya nggak berlaku lagi, lalu bikin yang baru. Orang menyebutnya <b>rotasi</b> key.'
	],
	reactions: {},
	steps: [
		{
			tag: 'Config',
			title: 'Kode sama, dua tempat',
			body: 'Kodenya persis sama, tapi <b>alamat database</b> dan <b>key</b> berbeda antara laptop dan server.'
		},
		{
			tag: 'Hard coding',
			title: 'Nilai di dalam kode',
			body: 'Nilai yang ditulis di dalam kode mengikatnya ke <b>satu tempat</b>. Mau pindah, kodenya harus diubah lagi.'
		},
		{
			tag: 'Bahaya',
			title: 'Key di tempat umum',
			body: '<b>API key</b> itu kayak password. Di repo publik, dia jadi password yang dipajang di papan reklame.'
		},
		{
			tag: 'Solusinya',
			title: 'Environment variable',
			body: 'Kode minta nilai <b>pakai nama</b>. Yang menjalankan kodenya yang menentukan nilainya.'
		},
		{
			tag: 'Laptop',
			title: 'File .env',
			body: 'Satu <b>NAMA=nilai</b> per baris. Nilai buat laptopmu, disimpan tepat di sebelah kode.'
		},
		{
			tag: 'Git',
			title: '.env masuk .gitignore',
			body: 'Git melewati semua file yang tertulis di <b>.gitignore</b>, jadi .env nggak pernah sampai ke GitHub.'
		},
		{
			tag: 'Server',
			title: 'Dashboard host',
			body: 'Nilai buat server diketik di <b>dashboard host</b>. Rahasianya tetap disembunyikan di layar, bahkan darimu.'
		},
		{
			tag: 'Cara ingat',
			title: 'Pisahkan kode dan konfigurasi',
			body: 'Bagikan <b>resepnya</b> (kodenya). Simpan <b>catatan tempelnya</b> (.env) di kulkasmu sendiri.'
		},
		{
			tag: 'Catatan',
			title: 'Rotasi key yang bocor',
			body: 'Cabut key lama supaya nggak berlaku, lalu taruh key baru di .env dan di dashboard.'
		}
	],
	laptopLabel: 'Laptopmu',
	serverLabel: 'Server',
	repoLabel: 'GitHub',
	publicTag: 'publik',
	noDb: 'nggak ada database di sini',
	botFound: 'bot menemukan key kamu',
	envBox: 'Environment',
	envCaption: 'kode cuma minta pakai nama',
	sent: 'terkirim',
	stayed: 'tetap di rumah',
	dashboard: 'Dashboard host',
	dashTitle: 'Environment variable',
	revoked: 'dicabut',
	fresh: 'baru',
	where: { code: 'boleh dibaca siapa aja', env: 'cuma di laptopmu', dash: 'cuma di server' },
	rule: 'Bagikan resepnya, jangan catatan tempelnya'
};
