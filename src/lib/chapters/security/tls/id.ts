import type { TlsText } from './types';

export const id: TlsText = {
	title: 'SSL, TLS, dan sertifikat',
	intro: [
		'Coba lihat address bar waktu kamu buka nimbus.com. Gembok kecil itu artinya sambunganmu terlindungi. Tapi gimana caranya browser dan server yang belum pernah ketemu bisa sepakat soal satu rahasia, padahal seluruh internet bisa ikut nguping?',
		'Ceritanya mulai pertengahan 1990an di <b>Netscape</b>, perusahaan pembuat browser paling populer waktu itu. Orang mulai pengin belanja online, tapi nomor kartu kredit lewat begitu saja tanpa pelindung. Netscape lalu membuat <b>SSL</b> (Secure Sockets Layer) dan merilis SSL 2.0 tahun 1995, disusul SSL 3.0 setahun kemudian.',
		'SSL ternyata masih bolong di sana sini. Tahun 1999, kelompok penyusun standar internet (IETF) mengambil alih, memperbaikinya, lalu memberinya nama baru, <b>TLS</b> (Transport Layer Security). Sekarang yang dipakai TLS 1.2 dan TLS 1.3 (dari 2018), sedangkan semua versi SSL sudah dipensiunkan karena nggak aman.',
		'[fyi] Orang masih suka bilang "sertifikat SSL" karena kebiasaan, padahal mesin yang bekerja sekarang adalah TLS. Dan <b>HTTPS</b> itu sebenarnya HTTP, bahasanya web, yang lewat di dalam terowongan TLS.',
		'TLS memakai lagi hal yang sudah kamu kenal. [[Kunci asimetris|security/keys]] dipakai supaya kedua pihak bisa kenalan dengan aman, lalu satu kunci simetris bersama mengerjakan [[enkripsi|networking/encryption]] datanya yang cepat.',
		'Tapi ada masalah. Gimana kamu tahu servernya benar benar nimbus.com, bukan penipu? Itu tugas <b>sertifikat</b>, semacam KTP digital yang bilang "kunci publik ini milik nimbus.com", lalu dicap oleh <b>Certificate Authority</b> (CA) yang sudah dipercaya browsermu.',
		"Dulu sertifikat itu berbayar dan ribet dipasang, jadi banyak situs kecil malas pakai HTTPS. Tahun 2015 sebuah lembaga nirlaba meluncurkan <b>Let's Encrypt</b>, yang membagikan sertifikat gratis dan memperpanjangnya otomatis. Sejak itu halaman terenkripsi naik dari kurang dari separuh web jadi hampir semuanya.",
		'Yuk lihat langsung. Pertama, jalankan jabat tangan (handshake) antara HP kamu dan nimbus.com langkah demi langkah. Habis itu buka nimbus.com lewat WiFi kafe yang mencurigakan, dan lihat apa yang dilakukan browsermu.'
	],
	reactions: {
		hello:
			'Browsermu membuka dengan salam. Dia menyebutkan cara mengunci yang dia ngerti, plus separuh resep kunci (key share). Semua orang boleh lihat bagian ini, nggak masalah.',
		cert: 'nimbus.com membalas dengan key share miliknya dan sertifikatnya. Anggap sertifikat itu KTP, ada nama, tanggal kedaluwarsa, kunci publik, dan cap dari pihak yang menerbitkannya.',
		check:
			'Browsermu memeriksa KTP itu dengan teliti. Namanya benar, belum kedaluwarsa, dicap CA yang dipercaya, dan server membuktikan dia pegang kunci privat pasangannya dengan menandatangani handshake. Keempatnya lolos.',
		key: 'Ini bagian cerdasnya. Tiap pihak mencampur rahasianya sendiri dengan key share dari pihak lain, dan keduanya dapat session key yang persis sama. Kuncinya sendiri nggak pernah lewat kabel, jadi penguping nggak punya apa apa buat disalin.',
		secure:
			'Handshake selesai, gemboknya menyala. Mulai sekarang tiap byte diacak pakai session key itu. Semua tarian tadi cuma butuh beberapa puluh milidetik, lebih cepat dari kedipan mata.',
		warn: 'Browsermu menghentikanmu. Situs ini mengaku nimbus.com, tapi sertifikatnya dicap sendiri, bukan oleh CA yang dipercaya browser. Siapa pun bisa mencetak KTP sendiri, dan itu nggak membuktikan apa apa.',
		back: 'Pintar. Memang itu gunanya peringatan ini. Di WiFi kafe, orang di tengah jalan bisa pura pura jadi situs apa saja, tapi dia nggak bisa membujuk CA terpercaya menandatangani sertifikat untuk nama yang bukan miliknya.',
		proceed:
			'Aduh. Kamu nekat lewat, jadi password kamu langsung terkirim ke si penipu. Dia bisa meneruskannya ke nimbus.com yang asli sambil membaca semua yang lewat. Hampir semua peringatan seperti ini layak dituruti.'
	},
	acts: ['Handshake', 'Situs palsu'],
	actLabel: 'Babak {n}',
	nextAct: 'Lanjut ke babak berikutnya',
	youLabel: 'HP kamu',
	serverLabel: 'nimbus.com',
	stepBtn: 'Langkah handshake berikutnya',
	steps: [
		{
			chip: 'hello',
			title: 'Salam',
			body: 'Browsermu menyebut cara yang dia ngerti dan mengirim key share'
		},
		{
			chip: 'sertifikat',
			title: 'Sertifikat',
			body: 'Server mengirim key share dan KTP digitalnya'
		},
		{
			chip: '',
			title: 'Periksa',
			body: 'Browsermu memeriksa sertifikatnya'
		},
		{
			chip: '',
			title: 'Session key',
			body: 'Kedua pihak menghitung kunci yang sama tanpa mengirimnya'
		},
		{
			chip: 'selesai',
			title: 'Aman',
			body: 'Semua setelah ini terenkripsi'
		}
	],
	checks: [
		'Namanya nimbus.com',
		'Belum kedaluwarsa',
		'Dicap CA terpercaya',
		'Server pegang kunci privatnya'
	],
	cert: {
		heading: 'Sertifikat',
		subjectLabel: 'Diterbitkan untuk',
		issuerLabel: 'Diterbitkan oleh',
		validLabel: 'Berlaku sampai',
		keyLabel: 'Kunci publik',
		subject: 'nimbus.com',
		issuer: "Let's Encrypt",
		valid: '30 Januari 2027',
		keyValue: '04 8f 3a c1 9e 27 …'
	},
	sessionKey: 'session key',
	secretMsg: 'k9#Qz!f2…',
	wifiLabel: 'WiFi gratis kafe',
	attackerLabel: 'Penipu di WiFi',
	visitBtn: 'Buka nimbus.com',
	addr: 'nimbus.com',
	warn: {
		title: 'Sambungan kamu tidak privat',
		body: 'Seseorang mungkin sedang mencoba mencuri password atau pesanmu di situs ini. Sertifikatnya tidak dipercaya.',
		back: 'Kembali ke tempat aman',
		proceed: 'Tetap lanjutkan',
		details: 'Yang ditunjukkan situs ini'
	},
	fakeIssuer: 'nimbus.com (dirinya sendiri)',
	fakeValid: '30 Januari 2027',
	fakeChecks: ['cocok', 'aman', 'dicap sendiri', 'cocok dengan KTP palsunya'],
	stolen: 'Password kamu terkirim ke penipu',
	safe: 'Nggak ada yang terkirim, kamu aman',
	again: 'Coba situs palsunya lagi'
};
