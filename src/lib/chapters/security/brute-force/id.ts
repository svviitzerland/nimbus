import type { BruteForceText } from './types';

export const id: BruteForceText = {
	title: 'Brute force',
	intro: [
		'Bayangkan ada robot berdiri di halaman login nimbus.com, mengetik password demi password tanpa pernah capek. aaaa, aaab, aaac, terus dan terus. Itulah serangan <b>brute force</b>, menang dengan cara mencoba semua kemungkinan.',
		'Komputer itu cepat. Satu bot, atau segerombolan komputer bajakan yang kerja bareng, bisa mencoba ribuan password tiap detik. Password pendek yang isinya cuma angka punya kemungkinan sedikit sekali, jadi jebolnya hampir seketika.',
		'Ada versi yang lebih malas juga. Tiap tahun daftar raksasa berisi password asli bocor dari situs yang dibobol, dan orang terus memakai favorit yang sama (123456, password, qwerty). Penyerang mencoba itu duluan, atau mengambil email dan password yang bocor dari satu situs lalu mencobanya di situs lain. Namanya <b>credential stuffing</b>.',
		'Pihak yang bertahan punya dua senjata besar. <b>Panjang</b>, karena tiap tambahan satu karakter melipatgandakan kemungkinannya. Dan <b>lockout</b> (atau rate limit), situsnya cuma mengizinkan beberapa kali salah sebelum menyuruh menunggu, jadi robotnya melambat sampai merayap.',
		'[fyi] Kalau penyerang mencuri file passwordnya langsung, nggak ada lockout yang bisa memperlambat, dan dia menebak secara offline dengan kecepatan miliaran per detik. Makanya situs yang baik menyimpan password pakai [[hashing|security/hashing]] yang lambat, dan [[MFA|security/mfa]] jadi penting, password yang berhasil ditebak saja nggak cukup.',
		'Mesin penebak ini cuma menyerang login pura pura, jadi karang saja passwordnya (jangan yang asli). Mulai dari yang pendek, lalu bikin lebih panjang, lalu nyalakan lockout dan lihat jamnya.'
	],
	reactions: {
		leaked:
			'Seketika. Password itu ada di daftar bocoran yang selalu dicoba duluan oleh penyerang, jadi mesinnya bahkan nggak perlu menebak, tinggal cari di daftar. Jangan pernah pakai password yang terkenal.',
		leakedLock:
			'Biarpun lockout menyala, password dari daftar bocoran tetap jebol di beberapa putaran pertama. Lockout memperlambat tebakan, tapi nggak bisa menyelamatkan password yang semua orang sudah tahu.',
		fast: 'Beres sebelum kopimu dingin. Password pendek, atau yang isinya cuma satu jenis karakter, punya kombinasi terlalu sedikit. Tambah panjangnya dan jumlahnya meledak.',
		medium:
			'Lebih baik, mesinnya butuh waktu sekarang. Tapi penyerang yang sabar dengan lebih banyak komputer masih bisa sampai. Beberapa karakter lagi bakal membuatnya nggak terjangkau.',
		strong:
			'Nggak terjangkau. Tiap karakter tambahan melipatgandakan kerjanya, dan sekarang mesinnya harus jalan lebih lama dari yang sanggup ditunggu siapa pun. Panjang adalah kekuatan super paling murah yang dimiliki password.',
		lockOn:
			'Lockout menyala. Setelah lima kali salah, nimbus.com menyuruh siapa pun menunggu 15 menit. Kamu hampir nggak akan merasakannya, tapi robotnya anjlok dari ribuan tebakan per detik jadi segelintir tiap seperempat jam.'
	},
	passLabel: 'Password karanganmu',
	passPlaceholder: 'coba 1234 dulu',
	passHint: 'Karang saja, jangan ketik password asli di sini',
	lockLabel: 'Kunci login 15 menit setelah 5 kali salah',
	runBtn: 'Jalankan mesin penebak',
	emptyPass: 'Ketik password dulu',
	machineLabel: 'Mesin penebak',
	targetLabel: 'Login nimbus.com',
	lockedTag: 'terkunci, tunggu 15 menit',
	kinds: { lower: 'a sampai z', upper: 'A sampai Z', digits: '0 sampai 9', symbols: 'simbol' },
	lengthStat: '{n} karakter',
	combosStat: 'kemungkinan password yang harus dicoba',
	speedFast: '10.000 tebakan per detik',
	speedLock: '5 tebakan tiap 15 menit',
	resultLabel: 'Waktu untuk mencoba semuanya',
	leakedTitle: 'Ada di daftar bocoran',
	leakedSub: 'urutan ke {n}, dicoba paling awal',
	verdicts: { leaked: 'bocor', fast: 'lemah', medium: 'lumayan', strong: 'kuat' },
	units: {
		instant: 'kurang dari sedetik',
		seconds: '{n} detik',
		minutes: '{n} menit',
		hours: '{n} jam',
		days: '{n} hari',
		years: '{n} tahun',
		million: '{n} juta tahun',
		billion: '{n} miliar tahun',
		forever: 'lebih lama dari umur alam semesta'
	},
	historyLabel: 'Percobaanmu',
	lockShort: 'lockout',
	goals: [
		'Temukan password yang nggak sanggup diselesaikan mesinnya',
		'Jalankan mesinnya sekali dengan lockout menyala'
	]
};
