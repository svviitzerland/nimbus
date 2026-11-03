import type { RouterNatText } from './types';

export const id: RouterNatText = {
	title: 'NAT dan masquerade',
	intro: [
		'Laptopnya udah punya alamat, 192.168.88.sekian. Tapi itu <b>alamat privat</b>, nomor rumah yang cuma berarti di dalam kantor ini. Ribuan kantor lain juga pakai 192.168.88.x yang persis sama.',
		'Internet cuma mau ngantar ke <b>alamat publik</b>, dan ISP cuma ngasih kantor ini satu, nempel di ether1. Tiga laptop, satu alamat publik. Hmm.',
		'Makanya router pakai trik namanya <b>NAT</b>. Waktu laptop ngirim sesuatu keluar, router nyoret alamat laptopnya dan nulis alamatnya sendiri, mirip bagian surat di kantor yang ngecap alamat perusahaan di tiap amplop. Konsepnya ada di [[Apa itu NAT|network/nat]].',
		'Bagian surat juga nyatet siapa ngirim apa. Begitu balasan datang ke alamat perusahaan, dia tau harus dibawa ke meja siapa. Catatan itu namanya <b>connection table</b>.',
		'Di MikroTik caranya biasanya pakai aturan <b>masquerade</b>. Masquerade artinya cap pakai alamat apa pun yang lagi dipegang ether1, praktis karena banyak ISP suka ganti alamatnya sesekali.',
		'[fyi] Yang jeli mungkin sadar 10.20.30.2 juga termasuk alamat privat. Banyak ISP ngelakuin NAT lagi di sisi mereka (namanya CGNAT), jadi kantormu juga berbagi alamat sama tetangga. Di cloud, tugas yang sama dikerjain NAT gateway buat sebuah [[VPC|networking/vpc]].',
		'Giliran kamu. Buka nimbus.com dulu dan lihat paketnya nyasar, lalu tambahin aturan masquerade dan coba lagi.'
	],
	reactions: {
		noNet:
			'Paketnya berangkat dengan pengirim <b>192.168.88.254</b>, alamat privat. ISP langsung buang, dan kalaupun lolos, balasannya nggak mungkin nemu jalan pulang ke nomor rumah yang dipakai ribuan kantor.',
		noNetAgain:
			'Ceritanya sama, pengirimnya masih alamat privat. Router butuh aturan srcnat buat nukerin alamat itu jadi alamat publiknya.',
		masq: 'Aturannya masuk. Tiap paket yang keluar lewat ether1 sekarang dicap pakai alamat publik router. Buka nimbus.com lagi dan perhatiin label di paketnya.',
		srcnat:
			'Itu juga bisa, src-nat pakai alamat tetap. Masquerade hasilnya sama tapi milih alamatnya sendiri, jadi aman kalau ISP ganti alamat. Sekarang buka nimbus.com lagi.',
		wrongChain:
			'Dikit lagi, tapi <b>dstnat</b> itu buat lalu lintas yang masuk (misalnya bukain pintu ke server di dalam). Keluar ke internet itu <b>srcnat</b>, karena yang diganti alamat pengirimnya.',
		wrongOut:
			'Aturan itu jagain pintu yang salah. Internet ada di balik <b>ether1</b>, jadi pakai out-interface=ether1 ya.',
		wrongAction:
			'Aturannya butuh tugas. Buat berbagi satu alamat publik, tugasnya <b>action=masquerade</b>.',
		loaded:
			'Kebuka! Di router pengirimnya berubah dari 192.168.88.254 jadi 10.20.30.2, situsnya bales ke alamat itu, dan pas balik router nuker lagi lalu ngasih balasannya ke laptop yang benar.',
		shared:
			'Laptop lain, tapi dari luar alamatnya tetap sama. Begitulah satu koneksi ISP bisa dipakai sekantor.',
		conntrack:
			'Ini buku catatan bagian surat. Huruf kecil <b>s</b> artinya srcnat, router udah nuker pengirimnya. Tiap laptop dapat nomor port sendiri di luar, jadi balasannya nggak pernah ketuker.',
		noConn:
			'Tabelnya masih kosong, belum ada paket yang keluar lewat NAT. Tambahin aturannya dan buka nimbus.com dulu.',
		error:
			'Yang itu RouterOS nggak ngerti. Cek lagi ejaannya, atau ketik <b>?</b> buat lihat yang ada. Tombol Bantu juga bisa ngetikin buat kamu.',
		done: 'Sekantor sekarang berbagi satu alamat publik. Satu aturan masquerade itu ada di hampir semua MikroTik di dunia. Berikutnya, kantor butuh aturan soal apa aja yang boleh lewat.'
	},
	missionsLabel: 'Misi',
	missions: [
		'Coba buka nimbus.com',
		'Tambahin aturan masquerade',
		'Buka nimbus.com lagi',
		'Intip connection table'
	],
	hintBtn: 'Bantu',
	doneNote: 'Kantor online lewat satu alamat publik',
	ispLabel: 'ISP',
	inputLabel: 'perintah',
	termHint: '# ketik perintah RouterOS lalu tekan Enter',
	hintUnknown: '# perintah itu nggak ada, ketik ? buat lihat menunya',
	didYouMean: '# mungkin maksudnya {word}',
	openBtn: 'Buka nimbus.com di laptop {name}',
	busy: 'Paket lagi di jalan',
	serverLabel: 'nimbus.com',
	tagFrom: 'dari {ip}',
	tagTo: 'ke {ip}',
	tagDropped: 'privat, dibuang',
	capIdle: 'Tiga laptop beralamat privat, satu alamat publik di ether1',
	capFail: 'Laptop {name} gagal buka nimbus.com',
	capOk: 'nimbus.com kebuka di laptop {name}',
	hintChain: '# keluar ke internet artinya chain=srcnat',
	hintOut: '# internet ada di balik ether1, pakai out-interface=ether1',
	hintAction: '# buat berbagi alamat publik pakai action=masquerade',
	hintNeeds: '# perintah ini masih butuh {keys}',
	hintSrcnat: '# s artinya srcnat, dari luar semuanya kelihatan sebagai {ip}',
	hintNoConn: '# belum ada yang keluar lewat NAT',
	hintTryAgain: '# aturan masuk, sekarang buka nimbus.com lagi'
};
