import type { HatColorsText } from './types';

export const id: HatColorsText = {
	title: 'Jenis hacker',
	intro: [
		'Di film koboi zaman dulu, jagoannya gampang dikenali dari topi putihnya dan penjahatnya dari topi hitam. Dunia komputer meminjam ide itu buat mengelompokkan hacker.',
		'<b>Hacker</b> sebenarnya cuma orang yang paham sebuah sistem begitu dalam sampai bisa membuatnya melakukan hal yang nggak pernah direncanakan. Keahliannya sendiri netral, mirip tukang kunci yang bisa membuka pintu apa saja.',
		'<b>White hat</b> (topi putih) bekerja dengan izin, menguji sistem supaya bisa diperbaiki. <b>Black hat</b> (topi hitam) membobol tanpa izin untuk mencuri, memata matai, atau memeras. <b>Gray hat</b> (topi abu abu) ada di tengah, nggak punya izin tapi juga nggak berniat jahat, dan hukum tetap menganggapnya membobol.',
		'Cerita nyata nih. Di tahun 80 dan 90an, Kevin Mitnick adalah hacker paling dicari di Amerika. Dia tertangkap tahun 1995 dan dipenjara sekitar lima tahun. Belakangan dia punya perusahaan keamanan dan dibayar untuk membobol, kali ini dengan izin. Keahliannya sama, sisi garisnya yang beda.',
		'Garis itu namanya <b>izin</b>. Kebanyakan negara menuliskannya jadi hukum. Di Indonesia ada UU ITE, di Amerika ada Computer Fraud and Abuse Act. Masuk ke sistem orang tanpa izin pemiliknya itu tindak pidana, walaupun kamu nggak mengambil apa pun.',
		'[fyi] Kabar baiknya, sekarang perusahaan malah mengundang hacker. Tahun 1995 Netscape sudah membayar orang yang menemukan bug di browsernya, dan sekarang program <b>bug bounty</b> seperti ini membayar uang sungguhan untuk laporan yang rapi. Lebih lengkapnya di [[pentest dan bug bounty|security/pentest]].',
		'Ada enam cerita pendek. Untuk tiap cerita, tebak legal atau nggak, lalu lihat topi warna apa yang dipakainya.'
	],
	reactions: {
		lab: 'Legal, dan cara belajar yang keren. Laptop sendiri, aturan sendiri. Banyak ahli keamanan mulai persis begini, membongkar barang sendiri di rumah.',
		wifi: 'Nggak legal, walaupun Raka cuma penasaran bisa atau nggak. WiFi itu milik tetangga, dan nggak ada yang bilang boleh. Rasa penasaran itu bagus, arahkan saja ke barang milikmu sendiri.',
		pentest:
			'Legal. Kontrak yang ditandatangani itulah bedanya. Isinya apa yang boleh diuji Sari, kapan, dan bagaimana. Pekerjaan ini namanya <b>pentest</b> (penetration test).',
		extort:
			'Nggak legal, dan ini jelas black hat. Menemukan celahnya saja sudah tanpa diundang, ditambah minta uang jadinya pemerasan.',
		warn: 'Ini yang menjebak. Niat Tono baik, tapi dia tetap masuk tanpa izin dulu, jadi nggak legal. Gray hat kadang tetap berurusan dengan hukum walau niatnya baik. Cara amannya, laporkan tanpa membobol.',
		bounty:
			'Legal, dan dibayar. Halaman bug bounty itu izin tertulis lengkap dengan aturannya. Bima tetap di dalam aturan, melapor diam diam, dan nimbus.com menambal celahnya sebelum ada yang dirugikan.'
	},
	askLabel: 'Ini legal nggak?',
	legalBtn: 'Legal',
	illegalBtn: 'Nggak legal',
	scenarios: {
		lab: {
			who: 'Dina, 16 tahun',
			story:
				'Dina mencoba membobol laptop lama miliknya sendiri di rumah, buat belajar cara kerjanya.',
			why: 'Perangkatnya sendiri, jadi nggak perlu izin orang lain.'
		},
		wifi: {
			who: 'Raka',
			story: 'Raka menebak nebak password WiFi tetangganya, cuma buat lihat bisa atau nggak.',
			why: 'Nggak ada izin dari pemiliknya, walau tanpa niat jahat.'
		},
		pentest: {
			who: 'Sari, konsultan keamanan',
			story:
				'Sebuah bank menandatangani kontrak dengan Sari dan memintanya mencoba membobol aplikasi mereka.',
			why: 'Ada izin tertulis dari pemilik, dengan batasan yang jelas.'
		},
		extort: {
			who: 'Email tanpa nama',
			story: 'Seseorang membobol sebuah toko, lalu minta uang atau data pelanggannya akan disebar.',
			why: 'Tanpa izin, dan berubah jadi pemerasan.'
		},
		warn: {
			who: 'Tono',
			story:
				'Tono menyelinap ke situs sekolahnya tanpa izin, lalu mengirim email ke admin untuk memberi tahu celahnya.',
			why: 'Niatnya baik, tapi tetap nggak ada izin sebelum dia masuk.'
		},
		bounty: {
			who: 'Bima',
			story:
				'Bima membaca aturan bug bounty nimbus.com, menemukan bug sesuai aturan itu, lalu melaporkannya diam diam.',
			why: 'Program bug bounty itu izin tertulis, dan dia mengikuti aturannya.'
		}
	},
	hats: { white: 'White hat', gray: 'Gray hat', black: 'Black hat' },
	legalTag: 'legal',
	illegalTag: 'nggak legal',
	rightTag: 'tebakanmu benar',
	wrongTag: 'belum tepat',
	nextBtn: 'Cerita berikutnya',
	progress: 'Cerita {n} dari {total}',
	scoreLine: 'Kamu menebak benar {n} dari {total}',
	doneLine: 'Keahliannya selalu sama. Yang berubah cuma satu, izin.',
	again: 'Dengar ceritanya lagi'
};
