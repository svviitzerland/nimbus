import type { HatColorsText } from './types';

export const id: HatColorsText = {
	title: 'Jenis jenis hacker',
	intro: [
		'Di film koboi zaman dulu, jagoannya gampang dikenali dari topi putihnya dan penjahatnya dari topi hitamnya. Dunia komputer meminjam ide itu buat mengelompokkan hacker.',
		'<b>Hacker</b> itu sebenarnya orang yang paham sebuah sistem saking dalamnya sampai bisa bikin sistem itu melakukan hal yang nggak pernah direncanakan. Keahliannya sendiri netral, mirip tukang kunci yang bisa membuka pintu apa saja.',
		'<b>White hat</b> (topi putih) bekerja dengan izin. Sebuah perusahaan memintanya, biasanya dengan kontrak yang ditandatangani, buat membobol lalu melaporkan semua celah biar bisa ditambal.',
		'<b>Black hat</b> (topi hitam) membobol tanpa izin, buat mencuri, memata matai, atau memeras. Keahliannya sama, tapi dipakai melawan pemiliknya.',
		'<b>Gray hat</b> (topi abu abu) ada di tengah. Nggak punya izin, tapi juga nggak berniat jahat, misalnya orang yang menyusup lalu memperingatkan pemiliknya. Mungkin niatnya baik, tapi di mata hukum tetap dianggap membobol.',
		'Cerita nyata. Di tahun 80an dan 90an Kevin Mitnick jadi hacker paling dicari di Amerika. Dia tertangkap tahun 1995 dan dipenjara sekitar lima tahun. Belakangan dia menjalankan perusahaan keamanan dan dibayar buat membobol, kali ini dengan izin. Keahlian yang sama, sisi garis yang berbeda.',
		'Garis itu punya nama, <b>izin</b>. Kebanyakan negara menuliskannya di undang undang. Di Indonesia ada UU ITE, di Amerika ada Computer Fraud and Abuse Act. Masuk ke sistem tanpa izin pemiliknya itu kejahatan, walau kamu nggak mengambil apa apa.',
		'[ingat] <b>Izin yang mewarnai topinya.</b> Ada izin, putih. Nggak ada izin, hitam, dan niat baik cuma bikin jadi abu abu.',
		'[fyi] Kabar baiknya, sekarang perusahaan malah mengundang hacker. Tahun 1995 Netscape sudah membayar orang yang menemukan bug di browsernya, dan sekarang program <b>bug bounty</b> seperti itu membayar uang beneran untuk laporan yang rapi. Lebih lanjut di [[pentesting dan bug bounty|security/pentest]].',
		'Mau dengar satu cerita pendek untuk tiap topi? Pencet salah satunya.'
	],
	reactions: {
		white:
			'Topi putih. Kontrak yang ditandatangani itu pembedanya. Di situ tertulis apa yang boleh dites Sari, kapan, dan caranya. Pekerjaan ini namanya <b>pentest</b> (penetration test).',
		gray: 'Topi abu abu. Niat Tono baik, tapi dia tetap masuk tanpa minta izin duluan, jadi nggak legal. Cara yang aman, laporkan yang kamu lihat tanpa membobol.',
		black:
			'Topi hitam, jelas. Masuknya aja udah tanpa diundang, dan minta uang mengubahnya jadi pemerasan.'
	},
	steps: [
		{
			tag: 'Film koboi',
			title: 'Topi menunjukkan pihak',
			body: 'Putih buat jagoan, hitam buat penjahat. Hacker dikelompokkan dengan <b>cara yang sama</b>.'
		},
		{
			tag: 'Istilahnya',
			title: 'Hacker',
			body: 'Orang yang paham sistem <b>sampai dalam</b>. Keahliannya netral, kayak tukang kunci.'
		},
		{
			tag: 'Topi putih',
			title: 'Dengan izin',
			body: 'Membobol <b>karena diminta pemiliknya</b>, lalu melaporkan celahnya biar ditambal.'
		},
		{
			tag: 'Topi hitam',
			title: 'Tanpa izin',
			body: 'Membobol buat <b>mencuri, memata matai, atau memeras</b>. Keahlian sama, diarahkan ke pemiliknya.'
		},
		{
			tag: 'Topi abu abu',
			title: 'Di tengah',
			body: 'Tanpa izin, tanpa niat jahat. Tetap dianggap <b>membobol</b> di mata hukum.'
		},
		{
			tag: 'Kevin Mitnick',
			title: 'Hitam, lalu putih',
			body: 'Tertangkap <b>1995</b>, sekitar lima tahun dipenjara, lalu dibayar buat menguji perusahaan <b>dengan izin</b>.'
		},
		{
			tag: 'Garisnya',
			title: 'Izin',
			body: 'Di Indonesia <b>UU ITE</b> yang menariknya. Masuk tanpa persetujuan pemilik itu kejahatan, walau nggak ada yang diambil.'
		},
		{
			tag: 'Cara ingat',
			title: 'Izin mewarnai topi',
			body: 'Ada izin pemilik, <b>putih</b>. Nggak ada izin, <b>hitam</b>. Niat baik tanpa izin, <b>abu abu</b>.'
		},
		{
			tag: 'Info',
			title: 'Bug bounty',
			body: 'Aturan tertulis yang <b>mengundang</b> hacker masuk, plus hadiah untuk laporan yang rapi dan rahasia.'
		},
		{
			tag: 'Opsional',
			title: 'Tiga cerita',
			body: 'Pencet satu topi buat dengar ceritanya.'
		}
	],
	hats: { white: 'Topi putih', gray: 'Topi abu abu', black: 'Topi hitam' },
	permission: 'ada izin',
	noPermission: 'tanpa izin',
	news: { tag: 'Kevin Mitnick, 1995', head: 'Hacker paling dicari di Amerika akhirnya tertangkap' },
	timeline: [
		{ year: '1995', label: 'tertangkap' },
		{ year: '2000', label: 'bebas' },
		{ year: 'kemudian', label: 'dibayar menguji' }
	],
	bountyLabel: 'aturan bug bounty',
	stories: {
		white: {
			who: 'Sari, konsultan keamanan',
			story:
				'Sebuah bank menandatangani kontrak dengan Sari dan memintanya mencoba membobol aplikasinya.'
		},
		gray: {
			who: 'Tono',
			story:
				'Tono menyusup ke website sekolahnya tanpa izin, lalu mengirim email ke admin buat memperingatkan soal celahnya.'
		},
		black: {
			who: 'Email tanpa nama',
			story: 'Seseorang membobol sebuah toko, lalu minta uang atau data pelanggannya akan disebar.'
		}
	},
	tapHint: 'Pencet satu topi buat dengar ceritanya'
};
