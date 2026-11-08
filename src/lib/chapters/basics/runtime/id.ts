import type { RuntimeText } from './types';

export const id: RuntimeText = {
	title: 'Runtime dan library',
	intro: [
		'Kodenya sudah ditulis, dan kamu tahu kode itu diterjemahkan. Tapi kebanyakan program nggak pernah jalan sendirian. Mereka butuh program pembantu yang jalan di bawahnya sepanjang waktu, namanya <b>runtime</b>.',
		'JavaScript di server butuh <b>Node.js</b>. Java butuh <b>JVM</b>. JavaScript di halaman web pakai runtime yang sudah tertanam di <b>browser</b> kamu. Tanpa runtime, komputer cuma bengong lihat file kamu.',
		'Terus ada <b>library</b>, kode siap pakai yang ditulis dan dibagikan orang lain, sering gratis. Login, pembayaran, grafik, tanggal, semuanya sudah ada yang bikin dan sudah dites jutaan pengguna.',
		'Kamu dapat library lewat [[package manager|linux/packages]], alat yang mengunduhkan library buat kamu. JavaScript punya npm, Python punya pip. Satu perintah pendek, ribuan baris kode jadi milikmu.',
		'[fyi] Kata yang sama, dunia yang beda. Perpustakaan (library) meminjamkan buku supaya kamu nggak perlu nulis sendiri, library kode meminjamkan kode. Dan "runtime" juga berarti saat program sedang jalan, jadi crash waktu program jalan disebut runtime error, beda dengan salah ketik yang ditangkap [[compiler|basics/compiler]] sebelum apa pun jalan.',
		'Tapi minjam itu ada risikonya. Kalau library berubah, aplikasimu ikut berubah, siap atau nggak.',
		'[ingat] Runtime menyediakan lingkungan untuk menjalankan kode. Library menyediakan kode yang dapat dipakai oleh programmu.',
		'Yuk bangun toko nimbus.com. Kasih runtime, tambahkan fiturnya, lalu lihat apa yang terjadi kalau semua library di update sekaligus.'
	],
	reactions: {
		noRuntime:
			'Komputernya nggak tahu harus ngapain sama app.js. Itu JavaScript, dan belum ada apa pun di mesin ini yang bisa baca JavaScript. Pasang runtimenya dulu.',
		runtime:
			'Sekarang jalan! Node.js duduk di antara kode kamu dan [[sistem operasi|basics/os]], membaca JavaScript kamu lalu memintakan file, memori, dan jaringan ke sistem.',
		scratch:
			'Nulis sendiri memang bisa, tapi lihat hari dan barisnya numpuk. Dan tiap bug di baris baris itu jadi urusanmu, selamanya.',
		library:
			'Satu perintah dan langsung masuk. Ribuan baris itu ditulis dan dites orang lain, kamu tinggal pasang.',
		built:
			'Tokonya sudah punya semua fitur. Bandingkan berhari hari nulis sendiri dengan beberapa detik pakai library. Makanya hampir semua aplikasi beneran isinya kebanyakan library.',
		broke:
			'Aduh, tokonya crash. Versi terbaru library itu mengubah cara kerjanya, sementara kodemu masih memakainya dengan cara lama. Kamu nggak mengubah satu baris pun, tapi aplikasinya rusak.',
		pinned:
			'Balik ke versi lama, tokonya jalan lagi. Tim beneran mengunci versi persisnya di lock file (kayak package-lock.json), lalu update satu library per satu, hati hati, sambil dites.'
	},
	steps: ['Runtime', 'Library', 'Update'],
	layers: {
		code: 'Kode kamu',
		libs: 'Library',
		runtime: 'Runtime',
		os: 'Sistem operasi',
		hw: 'Hardware'
	},
	osNote: 'Linux, macOS, atau Windows',
	hwNote: 'CPU, RAM, dan storage',
	appName: 'Toko nimbus.com',
	appUp: 'jalan',
	appDown: 'crash',
	appOff: 'belum jalan',
	notInstalled: 'belum terpasang',
	noLibs: 'belum ada',
	runBtn: 'Jalankan app.js',
	installBtn: 'Pasang Node.js',
	installing: 'Memasang Node.js',
	installed: 'Node.js sudah terpasang',
	features: {
		login: { name: 'Login', days: 14, lines: 1800 },
		payments: { name: 'Pembayaran', days: 30, lines: 4200 },
		charts: { name: 'Grafik penjualan', days: 10, lines: 1500 }
	},
	scratchBtn: 'Tulis sendiri, {n} hari',
	libBtn: 'npm install {lib}',
	wroteChip: 'ditulis sendiri',
	linesLabel: '{n} baris kamu tulis sendiri',
	daysLabel: '{n} hari kerja',
	secondsLabel: 'beberapa detik',
	toUpdate: 'Lanjut, update library',
	needLib: 'Pakai minimal satu library buat lanjut ke bagian berikutnya',
	updateBtn: 'Update semua library ke versi terbaru',
	pinBtn: 'Balik ke {lib} {v}',
	runningAgain: 'Tokonya jalan lagi',
	fixedNote: 'Dikunci ke versi yang jalan'
};
