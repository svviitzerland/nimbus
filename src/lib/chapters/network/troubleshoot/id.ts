import type { TroubleshootText } from './types';

export const id: TroubleshootText = {
	title: 'Troubleshooting jaringan',
	intro: [
		'nimbus.com nggak mau kebuka. Gara gara WiFi? Router? Atau situsnya sendiri? Banyak orang langsung panik dan merestart semuanya asal asalan. Kadang berhasil, tapi nggak ada yang tahu kenapa.',
		'Jaringan rumah itu dibangun kayak menara kecil bertingkat, tiap lantai berdiri di atas lantai di bawahnya. <b>Kabel</b> membawa sinyal, <b>WiFi</b> menyambungkanmu ke router, router memberimu <b>alamat IP</b>, <b>gateway</b> (router itu juga) membawamu keluar ke internet, <b>DNS</b> mengubah nama jadi alamat, baru setelah itu <b>website</b> menjawab.',
		'Kalau lantai bawah rusak, semua yang di atasnya ikut rusak. Cabut kabelnya dan lihat, semua lantai di atasnya jadi merah. Jadi "situsnya nggak kebuka" hampir nggak memberi tahu di mana masalah sebenarnya.',
		'Makanya orang mengecek dari <b>bawah ke atas</b>. Lihat menaranya. Kabel, aman. WiFi, aman. Alamat IP, aman. Gateway, nggak menjawab. Berhenti di situ.',
		'Lantai merah pertama itu <b>biang keroknya</b>. DNS dan website di atasnya cuma <b>korban</b>, mereka gagal karena lantai di bawahnya rusak. Mengutak atik mereka cuma buang waktu.',
		'Jadi yang dibenerin cuma gateway. Routernya macet, direstart, dan semua lantai di atasnya jadi hijau dengan sendirinya.',
		'[ingat] Mulai dari kabel, berakhir di website. Merah pertama dari bawah, itu biang keroknya.',
		'[fyi] Tiap pengecekan pakai alat yang mungkin sudah kamu kenal. [[Ping|network/ping]] ke router menguji gateway, nslookup bertanya ke [[DNS|networking/dns]], dan alamat yang diawali 169.254 artinya [[DHCP|network/dhcp]] nggak pernah memberimu alamat.',
		'Mau jadi detektif? Ketuk tombolnya buat jaringan rusak yang baru, lalu cek lantainya dari bawah. Atau lanjut saja, ini opsional.'
	],
	reactions: {
		start: 'Ada kerusakan baru yang sembunyi. Mulai dari kabel di paling bawah ya.',
		ok: 'Hijau, lantai ini aman. Berarti masalahnya lebih ke atas, cek lantai berikutnya.',
		skip: 'Hati hati, kamu melompati lantai. Merah di atas sini bisa jadi cuma korban dari yang di bawah. Cek lantai di bawahnya dulu.',
		solved:
			'Ketemu! Semua lantai di bawahnya hijau, jadi ini biang kerok aslinya. Sudah dibenerin, dan seluruh menara hijau lagi.'
	},
	steps: [
		{
			title: 'Gejalanya',
			body: 'Yang kamu lihat cuma lantai paling atas yang gagal, website nggak mau terbuka. Penyebab aslinya bisa di lantai mana pun di bawahnya.'
		},
		{
			title: 'Enam lantai',
			body: 'Kabel, WiFi, alamat IP, gateway, DNS, website. Tiap lantai butuh semua lantai di bawahnya berfungsi.'
		},
		{
			title: 'Ikut runtuh',
			body: 'Satu lantai rusak bikin semua di atasnya ikut merah. Banyak lampu merah, tapi masalah aslinya cuma satu.'
		},
		{
			tag: 'Bawah ke atas',
			title: 'Menaiki daftar cek',
			body: 'Cek lantai paling bawah dulu, lalu naik satu per satu. Berhenti di lantai pertama yang gagal.'
		},
		{
			title: 'Biang kerok dan korban',
			body: 'Lantai merah pertama itu <b>biang keroknya</b>. Lantai merah di atasnya cuma <b>korban</b>, mereka pulih begitu biang keroknya dibenerin.'
		},
		{
			title: 'Satu perbaikan',
			body: 'Restart router yang macet membereskan gateway, dan DNS serta website kembali tanpa disentuh.'
		},
		{
			tag: 'Cara ingat',
			title: 'Kabel dulu, website terakhir',
			body: 'Mulai dari kabel, berakhir di website. Merah pertama dari bawah, itu biang keroknya.'
		},
		{
			tag: 'Giliranmu',
			title: 'Cari biang keroknya',
			body: 'Ketuk lantainya dari bawah ke atas. Merah yang pertama itulah kerusakannya.'
		}
	],
	pageError: 'Situs ini nggak bisa dijangkau',
	culpritTag: 'biang kerok',
	victimTag: 'korban',
	startHere: 'mulai di sini',
	endHere: 'selesai di sini',
	playBtn: 'Cari kerusakan sendiri',
	newCase: 'Kasus lain',
	checks: {
		cable: {
			name: 'Kabel',
			how: 'lihat lampu router',
			ok: 'Lampu power dan internet menyala',
			fail: 'Lampu internetnya mati'
		},
		wifi: {
			name: 'WiFi',
			how: 'lihat ikon WiFi',
			ok: 'Tersambung ke NimbusHome',
			fail: 'Nggak tersambung, password ditolak'
		},
		ip: {
			name: 'Alamat IP',
			how: 'ipconfig',
			ok: 'IPv4 192.168.1.23',
			fail: 'IPv4 169.254.37.12, dikarang laptopnya sendiri'
		},
		gateway: {
			name: 'Gateway',
			how: 'ping 192.168.1.1',
			ok: 'Router menjawab dalam 2 ms',
			fail: 'Request timed out'
		},
		dns: {
			name: 'DNS',
			how: 'nslookup nimbus.com',
			ok: 'nimbus.com ada di 76.76.21.21',
			fail: 'nimbus.com nggak ketemu'
		},
		site: {
			name: 'Situs',
			how: 'buka nimbus.com',
			ok: 'Halamannya terbuka',
			fail: 'Situs ini nggak bisa dijangkau'
		}
	},
	fixes: {
		cable: 'Kabel internet di belakang router ternyata copot. Kamu colok lagi sampai bunyi klik.',
		wifi: 'Ada yang mengganti password WiFi. Kamu ketik yang baru dan laptopnya tersambung lagi.',
		ip: 'Router berhenti membagikan alamat, jadi laptopnya mengarang sendiri. Restart router membereskannya.',
		gateway: 'Routernya macet. Kamu restart, dan dia menjawab lagi.',
		dns: 'Server DNS yang dipakai laptopmu lagi mati. Kamu ganti ke yang lain, misalnya 1.1.1.1.',
		site: 'Seluruh jalanmu baik baik saja, server nimbus.com sendiri yang mati. Nggak ada yang perlu dibenerin di rumah, jadi kamu kabari tim nimbus.'
	}
};
