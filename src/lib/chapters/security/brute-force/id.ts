import type { BruteForceText } from './types';

export const id: BruteForceText = {
	title: 'Brute force',
	intro: [
		'Kenalan sama mesin penebak. Dia berdiri di depan halaman login dan ngetik password satu per satu, aaaa, aaab, aaac, tanpa pernah capek. Menang dengan cara mencoba semua kemungkinan itu namanya serangan <b>brute force</b>.',
		'Komputer itu cepat. Mesin yang kuat bisa mencoba sekitar <b>10 miliar</b> tebakan tiap detik. Password pendek kayak <b>kopi</b> kemungkinannya nggak sampai setengah juta, jadi langsung jebol sebelum kamu sempat kedip.',
		'Ini rahasianya. Tiap tambahan satu huruf <b>mengalikan</b> kerjanya 26 kali, karena tiap tempat baru bisa diisi huruf apa aja. Lihat password kedua makin panjang, dan lihat waktunya melonjak.',
		'Sekarang balapan. Mesin yang sama nyerang dua duanya sekaligus. kopi langsung kebuka, sementara <b>kopisusupagihari</b> (enam belas huruf biasa, tanpa trik) bakal bikin dia sibuk lebih dari seratus ribu tahun.',
		'Terus gimana dengan password pintar kayak <b>P@ssw0rd</b>, yang hurufnya ditukar sama simbol? Tiap tahun daftar besar berisi password asli bocor dari situs yang dibobol, dan mesinnya nyoba favorit favorit itu duluan. Trik pintar juga ada di daftarnya. Memakai password bocor di situs lain itu namanya <b>credential stuffing</b>.',
		'[ingat] <b>Panjang ngalahin pintar.</b> Pilih password panjang dari beberapa kata acak, bukan kalimat terkenal. Panjangnya yang kerja keras.',
		'Situs juga bisa melawan, pakai <b>lockout</b>. Setelah beberapa kali salah, login nyuruh kamu nunggu, jadi mesinnya melambat dari miliaran tebakan jadi cuma segelintir per menit. Bahkan kopi sekarang butuh berbulan bulan.',
		'[fyi] Kalau penyerang mencuri file passwordnya langsung, nggak ada lockout, mereka nebak di mesin sendiri dengan kecepatan penuh. Makanya situs yang baik nyimpen password pakai [[hashing|security/hashing]] yang lambat, dan [[MFA|security/mfa]] itu penting, password yang ketebak aja nggak cukup. Password manager bisa ngingetin yang panjang panjang buat kamu.',
		'Mau ngerasain? Geser slidernya buat ngubah panjang password kedua dan lihat waktunya. Atau tonton aja mesinnya keringetan, itu juga boleh.'
	],
	reactions: {
		weak: 'Cukup pendek sampai mesinnya bisa beres dalam hitungan jam atau kurang. Tambah beberapa huruf lagi dan lihat yang terjadi.',
		okay: 'Udah mendingan. Berhari hari atau bertahun tahun udah bikin penyerang kesal, dan tiap huruf tambahan mengalikannya 26 kali.',
		strong:
			'Nah, itu baru panjang. Ribuan tahun atau lebih, bahkan dengan 10 miliar tebakan per detik. Panjang ngalahin pintar, selalu.'
	},
	steps: [
		{
			tag: 'Penyerang',
			title: 'Brute force',
			body: 'Mencoba <b>semua</b> kemungkinan password, satu demi satu, sampai ada yang cocok.'
		},
		{
			tag: 'Kecepatan',
			title: 'Yang pendek cepat jebol',
			body: 'Empat huruf berarti 26 × 26 × 26 × 26, nggak sampai setengah juta tebakan. Buat mesin itu <b>bukan apa apa</b>.'
		},
		{
			tag: 'Panjang',
			title: 'Tiap huruf mengalikan',
			body: 'Satu huruf lagi, kerjanya <b>26 kali</b> lebih banyak. Beberapa huruf tambahan mengubah detik jadi berabad abad.'
		},
		{
			tag: 'Balapan',
			title: 'Pendek lawan panjang',
			body: 'Mesin sama, kecepatan sama. Bedanya cuma <b>panjangnya</b>.'
		},
		{
			tag: 'Daftar bocor',
			title: 'Favorit dicoba duluan',
			body: 'Password populer dan trik umum ada di <b>daftar yang bocor</b>. Mesinnya nyoba itu sebelum yang lain.'
		},
		{
			tag: 'Cara ingat',
			title: 'Panjang ngalahin pintar',
			body: 'Beberapa <b>kata acak</b> berderet ngalahin password pendek penuh simbol mana pun.'
		},
		{
			tag: 'Pertahanan',
			title: 'Lockout',
			body: 'Beberapa kali salah, terus <b>nunggu</b>. Miliaran tebakan per detik turun jadi segelintir per menit.'
		},
		{
			tag: 'Sekilas',
			title: 'File yang dicuri',
			body: 'File password yang dicuri nggak punya lockout. <b>Hashing</b> yang lambat dan <b>MFA</b> yang melindungimu di situ.'
		},
		{
			tag: 'Opsional',
			title: 'Coba satu panjang',
			body: 'Geser slidernya dan lihat berapa lama mesinnya butuh.'
		}
	],
	machineLabel: 'Mesin penebak',
	speedFast: '10 miliar tebakan per detik',
	speedLock: 'Kena lockout, 5 tebakan per menit',
	listLabel: 'daftar bocor',
	waitLabel: 'harap tunggu',
	letters: '{n} huruf',
	cracked: 'Jebol',
	holding: 'Bertahan',
	onList: 'ada di daftar',
	units: {
		instant: 'seketika',
		seconds: 'sekitar {n} detik',
		minutes: 'sekitar {n} menit',
		hours: 'sekitar {n} jam',
		days: 'sekitar {n} hari',
		years: 'sekitar {n} tahun',
		million: 'sekitar {n} juta tahun',
		billion: 'sekitar {n} miliar tahun'
	},
	numberLocale: 'id-ID',
	rule: 'Panjang ngalahin pintar',
	sliderLabel: 'Panjang password kedua'
};
