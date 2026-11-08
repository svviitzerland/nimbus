import type { TroubleshootText } from './types';

export const id: TroubleshootText = {
	title: 'Troubleshooting jaringan',
	intro: [
		'nimbus.com nggak mau kebuka. Gara gara WiFi? Router? Atau situsnya sendiri? Banyak orang langsung panik dan merestart semuanya asal asalan. Kadang berhasil, tapi nggak ada yang tahu kenapa.',
		'Jaringan itu dibangun bertingkat, tiap tingkat berdiri di atas tingkat di bawahnya. <b>Kabel</b> membawa sinyal, <b>WiFi</b> menyambungkanmu ke router, router memberimu <b>alamat IP</b>, <b>gateway</b> (router itu juga) membawamu keluar ke internet, <b>DNS</b> mengubah nama jadi alamat, baru setelah itu <b>situsnya</b> menjawab.',
		'Kalau tingkat bawah rusak, semua yang di atasnya ikut rusak. Tanpa WiFi nggak dapat alamat, tanpa alamat DNS nggak jalan, dan di paling atas situsnya gagal. Jadi "situsnya nggak kebuka" hampir nggak memberi tahu apa apa soal letak masalahnya.',
		'Makanya orang mengecek dari <b>bawah ke atas</b>. Cek tingkat paling bawah dulu, lalu naik. Tingkat pertama yang gagal itulah biang keroknya, semua yang di atasnya cuma ikut jadi korban.',
		'[fyi] Tiap pengecekan pakai alat yang mungkin sudah kamu kenal. [[Ping|network/ping]] ke router menguji gateway, nslookup bertanya ke [[DNS|networking/dns]], dan alamat yang diawali 169.254 artinya [[DHCP|network/dhcp]] nggak pernah memberimu alamat.',
		'[ingat] Periksa sambungan, konfigurasi IP, gateway, DNS, lalu aplikasi. Gunakan hasil tiap pemeriksaan untuk menentukan langkah berikutnya.',
		'Ada satu kerusakan tersembunyi di jaringan ini. Jalankan pengecekannya, cari tingkat merah paling bawah, lalu tunjuk yang benar.'
	],
	reactions: {
		ok: 'Hijau, tingkat ini aman. Berarti masalahnya ada di atasnya, naik satu tingkat.',
		fail: 'Merah. Tapi hati hati, tingkat bawah yang rusak bikin semua di atasnya ikut gagal. Semua tingkat di bawah ini sudah hijau? Kalau iya, ketemu.',
		skip: 'Kamu loncat ke atas. Hasilnya bisa menipu, karena kalau ada yang rusak di bawah, yang ini juga ikut gagal. Mulai dari bawah lalu naik.',
		wrong:
			'Belum tepat. Yang ini merah cuma karena ada yang rusak lebih ke bawah. Cari tingkat merah yang paling bawah.',
		solved:
			'Ketemu dan beres! Kalau mengecek dari bawah ke atas, tingkat merah pertama yang kamu temui itulah penyebab aslinya. Coba kasus baru, kerusakannya pindah pindah.'
	},
	caseLabel: 'Kasus {n}',
	symptom: 'nimbus.com nggak mau kebuka di laptopmu',
	fixedSymptom: 'nimbus.com bisa dibuka lagi',
	checkBtn: 'Cek',
	blameBtn: 'Ini dia',
	newCase: 'Kasus baru',
	okTag: 'aman',
	failTag: 'rusak',
	bottomLabel: 'mulai di sini',
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
