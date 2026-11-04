import type { WifiSecurityText } from './types';

export const id: WifiSecurityText = {
	title: 'Keamanan WiFi',
	intro: [
		'[[WiFi|network/wifi]] itu radio. Router kamu mengirim data ke udara dalam bentuk gelombang, dan tembok nggak bisa menghentikannya. Gelombangnya tumpah sampai ke jalan.',
		'Jadi tetangga, atau orang asing yang parkir di depan rumah, bisa menangkap gelombang yang sama. Pertanyaannya bukan apakah mereka bisa dengar (bisa banget), tapi apakah mereka bisa paham isinya.',
		'Jaringan <b>open</b> nggak punya password. Siapa pun bisa masuk, dan apa pun yang nggak dikunci oleh situsnya sendiri bisa dibaca saat lewat. Makanya WiFi gratis di kafe itu berisiko, dan di situ [[VPN|network/vpn]] membantu.',
		'<b>WPA2</b> mengunci semuanya pakai password WiFi kamu, dan ini setelan yang paling umum sekarang. Kelemahannya cuma satu, orang asing bisa merekam momen saat sebuah HP masuk, membawanya pulang, lalu menebak password dengan sangat cepat. Password pendek cepat jebol, password panjang tahan bertahun tahun.',
		'<b>WPA3</b> itu gembok yang lebih baru. Trik rekam tadi nggak mempan lagi. Setiap tebakan harus mengetuk router kamu langsung, satu per satu, jadi menebak jadi lambat banget.',
		'Satu kebiasaan baik lagi, <b>jaringan tamu</b>. Tamu tetap dapat internet, tapi mereka tinggal di ruangan terpisah, jadi HP mereka nggak bisa menjangkau laptop atau TV kamu.',
		'[ingat] Angka makin besar, gembok makin kuat. Open itu kartu pos, siapa pun bisa baca. WPA2 itu amplop tertutup (sekuat passwordnya saja). WPA3 itu segel paling bagus yang bisa kamu pilih.',
		'[fyi] WPA singkatan dari WiFi Protected Access. Kakeknya, WEP dari tahun 1999, bisa dibobol dalam hitungan menit. Kalau router lama masih menawarkan WEP, lewati saja.',
		'Kalau mau, ganti setelan router kamu antara Open, WPA2, dan WPA3, lalu lihat apa yang didapat orang asing di luar.'
	],
	reactions: {
		open: 'Open. Orang asing itu masuk seperti tamu biasa dan membaca apa pun yang nggak dikunci situsnya. Boleh di taman, jangan di rumah.',
		wpa2: 'WPA2. Dia cuma lihat gelombang acak, tapi dia menyimpan rekaman HP yang masuk dan menebak di rumah. Kalau passwordmu panjang, dia bakal menebak bertahun tahun.',
		wpa3: 'WPA3. Acak, dan nggak ada yang berguna buat dibawa pulang. Setiap tebakan harus mengetuk router kamu satu per satu. Pilih ini kalau perangkatmu mendukung.'
	},
	steps: [
		{
			title: 'Gelombang radio',
			body: 'Router mengubah data jadi gelombang radio yang menyebar ke segala arah. Tembok cuma melemahkan, nggak menghentikan.'
		},
		{
			title: 'Siapa pun bisa dengar',
			body: 'Perangkat apa pun dalam jangkauan bisa menangkap gelombangnya. Mendengar itu gampang. Paham atau nggak, tergantung gemboknya.'
		},
		{
			tag: 'Open',
			title: 'Tanpa gembok',
			body: 'Nggak ada password dan nggak ada pengacakan di WiFi. Apa pun yang nggak dikunci situsnya bisa dibaca orang di sekitar.'
		},
		{
			tag: 'WPA2',
			title: 'Gembok dari password kamu',
			body: 'Semuanya diacak pakai kunci yang dibuat dari password WiFi kamu. Aman kalau passwordnya panjang, lemah kalau gampang ditebak.'
		},
		{
			tag: 'WPA3',
			title: 'Gembok yang nggak bisa dibobol di rumah',
			body: 'Merekam HP yang masuk nggak ada gunanya buat orang asing. Dia harus menebak langsung ke router kamu, pelan sekali.'
		},
		{
			title: 'Jaringan tamu',
			body: 'Nama WiFi kedua di router yang sama. Tamu dapat internet, tapi perangkatmu sendiri di luar jangkauan mereka.'
		},
		{
			tag: 'Cara ingat',
			title: 'Angka besar, gembok kuat',
			body: 'Open, lalu WPA2, lalu WPA3. Pilih yang paling tinggi yang didukung semua perangkatmu, dan kasih password yang panjang.'
		}
	],
	homeLabel: 'Rumahmu',
	routerLabel: 'Router',
	laptopLabel: 'Laptop',
	tvLabel: 'TV',
	guestLabel: 'WiFi tamu',
	snooperLabel: 'Orang asing di luar',
	modes: { open: 'Open', wpa2: 'WPA2', wpa3: 'WPA3' },
	saferLabel: 'lebih aman',
	pickLabel: 'Keamanan router',
	snoop: {
		idle: ['', ''],
		listen: ['menangkap gelombang', 'dari rumahmu'],
		open: ['bisa baca semua', 'chat "ketemu jam 7"'],
		wpa2: ['cuma acakan', 'rekam, tebak di rumah'],
		wpa3: ['cuma acakan', 'nggak ada yang dibawa']
	}
};
