import type { RuntimeText } from './types';

export const id: RuntimeText = {
	title: 'Runtime dan library',
	intro: [
		'Kodenya sudah ditulis, dan kamu tahu kode itu harus diterjemahkan. Tapi ada kejutan. Kebanyakan program nggak bisa jalan sendirian, mereka cuma melayang tanpa pijakan.',
		'Program butuh <b>runtime</b>, program pembantu yang menjalankan programmu. Anggap aja panggung. Aktornya (kode kamu) baru bisa tampil kalau ada panggung di bawah kakinya.',
		'Kode yang beda butuh panggung yang beda. JavaScript di server jalan di atas <b>Node.js</b>, JavaScript di halaman web jalan di dalam <b>browser</b> kamu, dan Java jalan di atas <b>JVM</b>.',
		'[fyi] Kata yang sama, dunia yang beda. "Runtime" juga berarti saat program sedang jalan. Crash waktu program jalan disebut runtime error, beda dengan salah ketik yang ditangkap [[compiler|basics/compiler]] sebelum apa pun jalan.',
		'Berikutnya ada <b>library</b>, komponen siap pakai yang ditulis dan dibagikan orang lain, sering gratis. Daripada bikin fitur login atau pengolahan tanggal dari nol, kamu pinjam komponen yang sudah jalan.',
		'Library didapat lewat <b>package manager</b>, alat yang mengunduhkannya buat kamu. JavaScript punya npm, Python punya pip. Satu perintah pendek, komponen baru langsung terpasang. Lebih lengkapnya di [[Memasang software|linux/packages]].',
		'Sekarang lihat tumpukannya secara utuh. Bagian yang kamu tulis itu kecil dan ada di paling atas. Sebagian besar yang jalan itu pinjaman, runtime, library, dan sistem operasi di bawahnya.',
		'[ingat] Runtime itu panggungnya, library itu properti siap pakai, kodemu aktornya. Nggak ada panggung, nggak ada pertunjukan.',
		'[fyi] Minjam itu ada risikonya. Kalau library merilis versi baru, aplikasimu bisa rusak padahal kamu nggak mengubah satu baris pun. Tim beneran mengunci versi yang sudah jalan (di file kayak package-lock.json) lalu update dengan hati hati.',
		'Mau lihat sepenting apa panggungnya? Cabut runtimenya dan lihat tokonya, lalu pasang lagi.'
	],
	reactions: {
		noRuntime:
			'Tokonya berhenti. Kode dan library kamu masih ada, tapi nggak ada apa pun di komputer ini yang bisa baca JavaScript tanpa Node.js.',
		runtime: 'Panggungnya balik, tokonya jalan lagi. Kodenya sama, cuma butuh tempat berpijak.'
	},
	steps: [
		{
			title: 'Kode sendirian',
			body: 'File kayak <b>app.js</b> itu cuma teks. Sistem operasi nggak tahu cara menjalankannya sendiri.'
		},
		{
			title: 'Runtime',
			body: 'Program yang <b>menjalankan programmu</b>. Dia membaca kodemu lalu memintakan memori, file, dan jaringan ke sistem operasi.'
		},
		{
			title: 'Banyak runtime',
			body: '<b>Node.js</b> untuk JavaScript di server, <b>browser</b> untuk JavaScript di halaman web, <b>JVM</b> untuk Java.'
		},
		{
			title: 'Runtime error',
			tag: 'Info',
			body: 'Kata yang sama juga berarti <b>saat program sedang jalan</b>. Runtime error terjadi di saat itu, bukan sebelumnya.'
		},
		{
			title: 'Library',
			body: '<b>Komponen siap pakai</b> yang ditulis dan dites orang lain. Kamu tinggal pinjam, nggak perlu bikin semuanya dari nol.'
		},
		{
			title: 'Package manager',
			body: 'Alat yang mengunduhkan library buat kamu. <b>npm</b> untuk JavaScript, <b>pip</b> untuk Python.'
		},
		{
			title: 'Kebanyakan pinjaman',
			body: 'Kode buatanmu sering cuma beberapa ratus baris. Library dan runtime di bawahnya bisa sampai <b>jutaan</b>.'
		},
		{
			title: 'Cara ingat',
			tag: 'Cara ingat',
			body: 'Runtime itu <b>panggung</b>, library itu <b>properti siap pakai</b>, kodemu <b>aktornya</b>.'
		},
		{
			title: 'Kunci versinya',
			body: 'Versi library yang baru bisa bikin aplikasimu rusak. Tim <b>mengunci</b> versi yang jalan dan update satu per satu.'
		},
		{
			title: 'Tanpa panggung',
			body: 'Tanpa runtime, kodenya masih ada tapi nggak ada yang bisa menjalankannya.'
		}
	],
	layers: {
		code: 'app.js',
		runtime: 'Runtime',
		os: 'Sistem operasi',
		hw: 'Hardware'
	},
	osNote: 'Linux, macOS, Windows',
	hwNote: 'CPU, RAM, storage',
	runtimes: [
		{ name: 'Node.js', note: 'JavaScript di server' },
		{ name: 'Browser', note: 'JavaScript di halaman web' },
		{ name: 'JVM', note: 'Java' }
	],
	libs: ['Login', 'Tanggal', 'Grafik'],
	installCmd: 'npm install chart.js',
	installDone: 'added 1 package',
	appName: 'Toko nimbus.com',
	appUp: 'jalan',
	appDown: 'crash',
	appOff: 'belum jalan',
	newVersion: 'v3',
	oldVersion: 'v2',
	removeBtn: 'Cabut runtimenya',
	returnBtn: 'Pasang lagi runtimenya'
};
