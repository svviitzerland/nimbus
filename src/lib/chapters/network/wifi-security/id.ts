import type { WifiSecurityText } from './types';

export const id: WifiSecurityText = {
	title: 'Keamanan WiFi',
	intro: [
		'[[WiFi|network/wifi]] itu gelombang radio. Router kamu meneriakkan data ke udara, dan tembok rumah nggak menghentikannya. Tetangga, atau orang yang parkir di depan rumah, bisa menangkap gelombang yang sama persis.',
		'Jadi pertanyaannya bukan apakah mereka bisa dengar, mereka pasti bisa. Pertanyaannya, apakah yang mereka dengar itu bisa dimengerti. Itu tergantung setelan keamanan di router kamu.',
		'Jaringan <b>open</b> sama sekali nggak pakai password. Siapa pun bisa masuk, dan lalu lintas yang nggak dikunci oleh situsnya sendiri bisa langsung dibaca. Makanya WiFi gratisan di kafe itu berisiko, dan di situlah [[VPN|network/vpn]] membantu.',
		'<b>WPA2</b> mengunci semuanya pakai password WiFi kamu. Bagus, tapi ada satu celah. Penyadap bisa merekam momen saat sebuah HP masuk ke jaringan, lalu dibawa pulang dan ditebak passwordnya secepat komputernya mampu. Password yang gampang jebol dalam hitungan detik.',
		'<b>WPA3</b> versi yang lebih baru. Trik rekam itu nggak mempan lagi, tiap tebakan harus dicoba langsung ke router satu per satu, dan router bisa memperlambatnya. Rekaman lama pun nggak bisa dibuka belakangan.',
		'Satu kebiasaan lagi. Kasih tamu <b>jaringan tamu</b> (guest network). HP mereka tetap dapat internet, tapi nggak bisa melihat laptopmu atau perangkat lain di jaringan rumah.',
		'[fyi] WPA singkatan dari WiFi Protected Access. Kakeknya, WEP dari tahun 1999, lemahnya kebangetan sampai bisa dibobol dalam hitungan menit, jadi kalau router lama masih menawarkan WEP, lewati saja.',
		'Kamu pemilik router ini. Coba tiap setelan, open, WPA2, dan WPA3, lalu lihat apa yang didapat penyadap di luar. Utak atik passwordnya juga.'
	],
	reactions: {
		open: 'Nggak ada password, nggak ada kunci. Penyadap tinggal masuk kayak tamu biasa dan membaca lalu lintasmu yang lewat. Boleh buat taman kota, jangan buat rumah.',
		wpa2weak:
			'WPA2 sudah nyala, tapi penyadap tetap masuk. Dia merekam momen HP masuk, menebak pakai daftar password umum di rumahnya, dan passwordmu ada di daftar itu. Bikin lebih panjang lalu coba lagi.',
		wpa2: 'Jauh lebih baik. Dengan password panjang, menebak dari rekaman itu butuh waktu bertahun tahun. WPA2 aman selama passwordnya nggak gampang.',
		wpa3: 'WPA3 mematikan triknya. Nggak ada yang berguna buat dibawa pulang, tiap tebakan harus mengetuk routermu langsung, dan router memperlambatnya. Pilih ini kalau perangkatmu sudah mendukung.',
		guest:
			'Jaringan tamu nyala. Temanmu tetap dapat internet, tapi sekarang tinggal di jaringan terpisah, jadi laptop dan TV kamu nggak terjangkau dari HP mereka.'
	},
	routerTitle: 'Setelan router kamu',
	securityLabel: 'Keamanan',
	modes: { open: 'Open', wpa2: 'WPA2', wpa3: 'WPA3' },
	modeHints: {
		open: 'Tanpa password, siapa pun bisa masuk',
		wpa2: 'Dikunci pakai password, pilihan yang umum',
		wpa3: 'Dikunci pakai password, lebih baru dan lebih aman'
	},
	passwordLabel: 'Password WiFi',
	weakTag: 'gampang ditebak',
	strongTag: 'kuat',
	guestLabel: 'Jaringan tamu untuk pengunjung',
	applyBtn: 'Simpan, biar penyadap mencoba',
	snooperLabel: 'Penyadap di luar rumah',
	snooperIdle: 'Menunggu routermu menyala',
	snoop: {
		joinOpen: '> berhasil masuk, nggak ditanya password',
		readPlain: '> membaca lalu lintasmu, GET nimbus.com/login user=nim',
		captured: '> merekam sebuah HP yang masuk jaringan',
		guessing: '> menebak password pakai daftar di rumah',
		cracked: '> ketemu, passwordnya {pw}',
		noLuck: '> sudah 10 juta tebakan, tetap nihil',
		noise: '> yang kebaca cuma acakan',
		wpa3Live: '> nggak ada yang berguna buat direkam, tiap tebakan harus ke router',
		wpa3Slow: '> routernya terus memperlambat tebakanku, menyerah'
	},
	homeNet: 'jaringan rumah',
	guestNet: 'jaringan tamu',
	devices: { laptop: 'Laptopmu', tv: 'Smart TV', friend: 'HP temanmu' },
	noteGuestOff: 'HP temanmu satu jaringan dengan laptopmu',
	noteGuestOn: 'HP temanmu dapat internet, tapi nggak bisa melihat laptopmu'
};
