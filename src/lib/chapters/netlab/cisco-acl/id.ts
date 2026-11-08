import type { CiscoAclText } from './types';

export const id: CiscoAclText = {
	title: 'Access control list',
	intro: [
		'Ada dua kebutuhan jaringan. Blokir akses situs game dan izinkan hanya laptop admin Budi untuk login ke router. Saat ini kedua akses itu belum dibatasi.',
		'Cisco ngurus permintaan kayak gini pakai <b>access control list</b>, singkatnya ACL. Isinya daftar baris bernomor, tiap baris bilang <b>permit</b> atau <b>deny</b>. IOS bacanya dari atas dan berhenti di baris pertama yang cocok.',
		'[ingat] ACL memakai aturan pertama yang cocok. Jika tidak ada aturan yang cocok, implicit deny di akhir ACL menolak paket.',
		'Ada dua jenis. List <b>standard</b> (nomor 1 sampai 99) cuma lihat siapa pengirimnya. List <b>extended</b> (100 sampai 199) juga lihat tujuannya ke mana dan port berapa. Buat blokir satu website butuh yang extended, jadi list 100 nolak tcp ke server game di port 443.',
		'Daftar nggak ngapa ngapain sebelum digantung di port. <b>ip access-group 100 in</b> di Gi0/1 ngecek tiap paket yang masuk dari kantor. Perhatiin baik baik, ada yang salah.',
		'Semuanya keblokir, bahkan nimbus.com dan Budi! Deny nggak kelihatan di dasar daftar yang nangkep mereka. Solusinya satu baris lagi di bawah deny, <b>permit ip any any</b>, biar sisanya boleh lewat.',
		'Sekarang soal login jarak jauh. List standard kecil nomor 10 cuma ngizinin alamat Budi, terus <b>access-class 10 in</b> ngegantungnya di <b>vty lines</b>, pintu virtual buat login lewat jaringan.',
		'<b>show access-lists</b> nampilin tiap baris plus hitungan berapa paket yang cocok. Pas banget buat ngecek aturannya beneran kerja.',
		'[fyi] Konsepnya sama, istilahnya beda. Di [[MikroTik|netlab/router-firewall]] namanya firewall filter, di cloud namanya security group, lihat [[firewall|networking/firewall]]. Selalu dari atas, selalu yang cocok pertama.',
		'Giliran kamu. Dewi sekarang juga jadi admin. Ketik <b>conf t</b>, lalu <b>access-list 10 permit host 192.168.88.13</b>, dan lihat tes dia.'
	],
	reactions: {
		task: 'Aturan baru mengizinkan Dewi pada ACL 10. Sari masih ditolak oleh implicit deny karena tidak ada aturan yang mengizinkannya.',
		tooOpen:
			'Dewi bisa masuk, tapi Sari juga. Baris itu kebanyakan ngelolosin orang. Pakai <b>host 192.168.88.13</b> biar cuma cocok buat Dewi.',
		needEnable:
			'Perintah ini memerlukan mode privileged EXEC. Jalankan <b>enable</b>, lalu coba kembali.',
		needConfig:
			'Access list itu ngubah router, jadi ketik <b>conf t</b> dulu, baru baris access listnya.',
		needDo: 'Di mode config, kasih <b>do</b> di depan, misalnya <b>do sh access-lists</b>.',
		needSub:
			'Perintah itu tempatnya di dalam interface atau line. Masuk dulu, misalnya <b>line vty 0 4</b>.',
		error:
			'Yang itu IOS nggak ngerti. Tanda ^ nunjuk kata yang bikin bingung, dan <b>?</b> nampilin yang cocok.'
	},
	steps: [
		{
			title: 'Membatasi layanan tertentu',
			body: 'Tiap kartu itu satu paket tes. Tanpa daftar apa pun, router ngelolosin semuanya, termasuk dua yang harusnya dihentiin.'
		},
		{
			title: 'Urutan aturan ACL',
			body: 'Tiap baris itu <b>permit</b> atau <b>deny</b>. Router ngecek baris 10, lalu 20, dan seterusnya, terus bertindak di yang cocok <b>pertama</b>.'
		},
		{
			title: 'Aturan pertama yang cocok',
			tag: 'Cara ingat',
			body: 'Dari atas, yang cocok duluan menang, dan nggak ada di daftar artinya <b>nggak boleh masuk</b>. Aturan terakhir itu si deny nggak kelihatan.'
		},
		{
			title: 'Extended list 100',
			body: '<code>access-list 100 deny tcp any host 45.76.10.20 eq 443</code> kebaca kayak kalimat. Tolak tcp dari siapa aja ke server game di port 443.'
		},
		{
			title: 'Menerapkan ACL pada interface',
			body: '<code>ip access-group 100 in</code> ngecek paket waktu <b>masuk</b> lewat Gi0/1. Satu list per port per arah.'
		},
		{
			title: 'Mengizinkan trafik lainnya',
			body: 'Baris baru selalu masuk paling bawah, jadi baris 20. Urutan itu penting, permit any di atas deny bakal ngelolosin gamenya.'
		},
		{
			title: 'Membatasi akses login',
			body: '<code>line vty 0 4</code> milih lima pintu login jarak jauh. <code>access-class 10 in</code> cuma ngizinin list 10 ngetok pintunya.'
		},
		{
			title: 'Jumlah paket yang cocok',
			body: 'Tiap baris nunjukin berapa paket yang dia tangkep. Aturan dengan nol tangkapan berarti nggak kepakai atau salah tempat.'
		},
		{
			title: 'ACL di perangkat lain',
			body: 'Urutan aturan penting pada ACL Cisco dan banyak firewall. AWS security group menggabungkan aturan izin, bukan memproses daftar deny dan permit berurutan. Periksa model aturan perangkat yang dipakai.'
		},
		{
			title: 'Buat dan terapkan ACL',
			tag: 'Coba',
			body: 'Ketik <code>conf t</code>, tekan Enter, lalu <code>access-list 10 permit host 192.168.88.13</code>.'
		}
	],
	targets: { game: 'situs game', web: 'nimbus.com', router: 'login router' },
	allowed: 'lolos',
	blocked: 'diblokir',
	waiting: 'nunggu',
	wantAllow: 'harusnya lolos',
	wantBlock: 'harusnya diblokir',
	implicitNote: 'nggak kelihatan, selalu terakhir',
	on100: 'di Gi0/1, arah masuk',
	on10: 'di pintu login',
	ispLabel: 'ISP',
	inputLabel: 'perintah',
	doneNote: 'Beres',
	termHint: '! Nim ngetik duluan di sini, giliranmu nanti di akhir',
	hintInvalid: '! IOS bingung di tanda ^, cek kata itu atau ketik ? buat lihat yang cocok',
	hintIncomplete:
		'! dikit lagi, perintahnya kurang kata, kasih spasi lalu ? buat lihat lanjutannya',
	hintAmbiguous:
		'! kependekan, ada lebih dari satu perintah yang awalnya begitu, tambah satu dua huruf',
	hintUnknown: '! perintah itu nggak ada di sini, ketik ? buat lihat daftarnya',
	didYouMean: '! mungkin maksudnya {word}',
	hintNeedEnable: '! gunakan enable untuk masuk ke privileged EXEC',
	hintNeedConfig: '! itu ngubah router, ketik conf t dulu',
	hintDo: '! kamu lagi di mode config, kasih do di depan, contohnya do sh run',
	hintSub: '! perintah itu tempatnya di dalam interface, pool, atau line, masuk dulu ke sana',
	hintMask: '! tulis subnet mask lengkap, misalnya 255.255.255.0',
	hintWild: '! hati hati, wildcard itu kebalikan mask, 255.255.255.0 jadi 0.0.0.255'
};
