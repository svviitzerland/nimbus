import type { MobileAppsText } from './types';

export const id: MobileAppsText = {
	title: 'Native dan cross platform',
	intro: [
		'nimbus.com makin populer, dan orang terus menanyakan hal yang sama. Ada aplikasinya nggak? <b>Aplikasi</b> itu program yang kamu pasang di HP dari Play Store atau App Store, dengan ikonnya sendiri di layar utama.',
		'Masalahnya begini. HP itu bicara dengan bahasa yang berbeda. Aplikasi Android kebanyakan ditulis dengan <b>Kotlin</b>, aplikasi iPhone dengan <b>Swift</b>. Aplikasi yang ditulis dengan bahasa asli HP itu disebut <b>native</b>, kayak penutur asli yang besar di sana. Lihat aplikasinya ditulis.',
		'Aplikasi native paling cepat dan bisa memakai semua isi HP, kamera, sensor, notifikasi. Harganya, kamu menulis seluruh aplikasinya dua kali, sering kali oleh dua tim yang berbeda.',
		'Di ujung yang lain ada situs biasa, seperti yang kamu buat di [[HTML|web/html]]. Satu kode jalan di browser semua HP dan laptop, tanpa perlu dipasang. Rasanya sedikit kurang mulus dan nggak bisa menjangkau semua bagian HP.',
		'Di tengahnya ada <b>cross platform</b>. Kamu menulis sekali dengan <b>Flutter</b> (buatan Google, pakai bahasa Dart) atau <b>React Native</b> (buatan Meta, pakai JavaScript), dan jadilah aplikasi Android sekaligus aplikasi iPhone. Hampir secepat native, cukup satu tim.',
		'Jadi mana yang menang? Nggak ada yang menang di semua hal. Game balap 3D yang harus mulus pakai native. Startup berdua yang ingin masuk dua toko aplikasi pakai cross platform. Menu kafe di balik kode QR cukup jadi situs.',
		'[ingat] Native nulis dua kali, cross sekali jadi dua, web sekali buat semua. Hitung saja kodenya, makin sedikit kode makin ringan kerjanya.',
		'[fyi] Sebagian Instagram dibuat dengan React Native, dan aplikasi My BMW dibuat dengan Flutter. Perusahaan besar pun mencampur, memilih cara yang paling cocok untuk tiap layar.',
		'Penasaran gimana kerjaannya bertambah? Tambahkan fitur baru dan lihat siapa yang harus menulisnya dua kali. Ini opsional kok.'
	],
	reactions: {
		feature:
			'Lihat kan? Native menulis fitur barunya dua kali, sekali di Kotlin dan sekali di Swift. Cross platform dan web cukup sekali. Itulah harga asli native, tiap perubahan jadi kerja dobel.'
	},
	panels: [
		{
			tag: 'Aplikasi',
			title: 'Ikon di layar utama',
			body: '<b>Aplikasi</b> dipasang dari toko aplikasi dan dibuka lewat ikonnya sendiri. Android dan iPhone punya tokonya masing masing.'
		},
		{
			tag: 'Cara 1',
			title: 'Native',
			body: 'Ditulis dengan bahasa asli tiap HP, <b>Kotlin</b> untuk Android dan <b>Swift</b> untuk iPhone. Satu aplikasi, ditulis dua kali.'
		},
		{
			tag: 'Native',
			title: 'Paling cepat, tapi kerja dobel',
			body: 'Kecepatan penuh dan akses penuh ke kamera dan sensor. Tiap fitur tinggal di dua <b>codebase</b> (codebase itu seluruh kode dari satu aplikasi).'
		},
		{
			tag: 'Cara 2',
			title: 'Web',
			body: 'Satu <b>situs</b> yang terbuka di browser mana pun. Menjangkau semua orang tanpa dipasang, tapi tetap tinggal di dalam browser.'
		},
		{
			tag: 'Cara 3',
			title: 'Cross platform',
			body: 'Satu codebase di <b>Flutter</b> atau <b>React Native</b> berubah jadi dua aplikasi asli, satu untuk tiap toko.'
		},
		{
			tag: 'Memilih',
			title: 'Tiap cara menang di tugasnya',
			body: 'Butuh kecepatan penuh, pilih native. Butuh dua toko dengan tim kecil, pilih cross platform. Butuh semua orang bisa buka seketika, pilih web.'
		},
		{
			tag: 'Biar nempel',
			title: 'Hitung kodenya',
			body: 'Native ditulis dua kali, cross platform sekali jadi dua aplikasi, web sekali buat semua. Makin sedikit kode makin ringan kerjanya, tapi tenaga dari HP juga sedikit berkurang.'
		},
		{
			tag: 'Coba',
			title: 'Satu fitur baru',
			body: 'Fitur baru berarti kode baru. Native menulisnya di dua bahasa, dua cara lainnya cukup sekali.'
		}
	],
	picture:
		'Aplikasi nimbus dibuat dengan tiga cara berdampingan. Native punya dua lembar kode untuk dua HP, cross platform satu lembar untuk dua HP, dan web satu lembar untuk HP dan laptop.',
	ways: { native: 'Native', cross: 'Cross platform', web: 'Web' },
	sheets: { kotlin: 'Kotlin', swift: 'Swift', dart: 'Dart', html: 'HTML' },
	devices: { android: 'Android', iphone: 'iPhone', phone: 'HP', laptop: 'Laptop' },
	counts: {
		native: '2 codebase',
		cross: '1 codebase, 2 aplikasi',
		web: '1 codebase, di mana saja'
	},
	examples: { native: 'Game balap 3D', cross: 'Startup berdua', web: 'Menu kafe' },
	rule: 'Native dua kali, cross sekali, web sekali buat semua',
	featureBtn: 'Tambah fitur baru',
	featureDone: 'Dua fitur sudah ditambah'
};
