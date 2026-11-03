import type { RouterIntroText } from './types';

export const id: RouterIntroText = {
	title: 'Apa itu MikroTik',
	intro: [
		'Di rumah, di kantor, atau di RT RW net yang dipakai satu kampung, internet gak nyampe ke tiap HP dan laptop dengan sendirinya. Ada satu kotak kecil di tengah yang membagikannya ke semua orang, namanya <b>router</b>.',
		'Salah satu merek router yang bakal sering kamu temui itu <b>MikroTik</b>, asalnya dari Latvia. Routernya jalan pakai sistem sendiri bernama <b>RouterOS</b>. ISP, kantor, sampai pemilik RT RW net suka banget sama MikroTik karena harganya murah tapi kemampuannya banyak.',
		'Coba lihat bagian depan kotaknya. Lubang lubang itu namanya <b>port fisik</b>, tempat nyolok kabel LAN. Di MikroTik namanya <b>ether1</b>, <b>ether2</b>, dan seterusnya. Biasanya ether1 dipakai buat kabel dari ISP.',
		'Hati hati, ini beda sama [[port|foundations/port]] bernomor kayak 80 atau 443. Yang itu <b>port logis</b>, pintu di dalam sebuah layanan. ether2 itu lubang beneran yang bisa kamu pegang, sedangkan 443 cuma nomor tempat web server nunggu tamu.',
		'Ngatur RouterOS bisa dengan klik klik di aplikasi <b>Winbox</b>, atau ngetik di terminalnya. Persis dua cara di [[CLI vs GUI|foundations/cli-gui]]. Kali ini kita ngetik.',
		'[fyi] Cisco, Juniper, dan merek lain juga sama konsepnya, ada kotak dengan port fisik dan terminal buat ngatur. Cuma perintahnya yang beda, jadi ilmu di sini tetap kepakai.',
		'Giliran kamu. Selesaikan misinya, kasih nama router jadi nimbus, intip port fisiknya, lalu kasih alamat ke ether2. Kalau bingung, tekan tombol Bantu dan perintahnya diketikin buat kamu.'
	],
	reactions: {
		identity:
			'Lihat promptnya, sekarang jadi <b>[admin@nimbus]</b>. Routernya udah punya nama, jadi kalau nanti kamu ngurus banyak router, kamu tau lagi ngetik di yang mana.',
		otherName:
			'Bisa kok, RouterOS terima nama apa aja. Tapi misinya minta namanya <b>nimbus</b>, coba lagi pakai name=nimbus ya.',
		interfaces:
			'Nah itu dia, ether1 sampai ether5. Huruf <b>R</b> artinya running, ada kabel yang nyolok dan nyala. Cuma ether1 (dari ISP) dan ether2 (ke laptop) yang ada R, tiga lubang lainnya masih kosong.',
		address:
			'ether2 sekarang punya alamat sendiri. Itu alamat router dari sisi kantor, nanti laptop bakal ngirim semua paketnya ke alamat ini buat keluar ke internet.',
		wrongPort:
			'Eh, alamatnya nyasar ke port lain. ether1 itu ngadep ke ISP, laptop kantornya nyolok di <b>ether2</b>, jadi pakai interface=ether2 ya.',
		badAddress:
			'Dikit lagi. Alamat itu empat angka dari 0 sampai 255 dipisah titik, terus garis miring buat ukuran jaringannya, contohnya <b>192.168.88.1/24</b>.',
		addrPrint:
			'Alamatmu udah masuk daftar. Yang ada huruf D itu dynamic, alamat yang dikasih ISP ke ether1 secara otomatis.',
		error:
			'Yang itu RouterOS gak ngerti. Cek lagi ejaannya, atau ketik <b>?</b> buat lihat perintah yang ada. Bisa juga tekan Bantu biar diketikin.',
		done: 'Semua misi beres! Kamu barusan ngasih nama router, ngecek port fisiknya, dan masang alamat di ether2, cuma pakai ngetik. Begini cara admin ISP dan kantor ngatur MikroTik tiap hari.'
	},
	missionsLabel: 'Misi',
	missions: [
		'Kasih nama router nimbus',
		'Lihat daftar port fisiknya',
		'Kasih alamat ke ether2',
		'Cek daftar alamatnya'
	],
	hintBtn: 'Bantu',
	doneNote: 'Semua misi beres, router siap dipakai',
	ispLabel: 'ISP',
	laptopLabel: 'Laptop kantor',
	portsCaption: 'ether1 sampai ether5 itu port fisik, lubang buat kabel LAN',
	logicalCaption: 'Port 443 gak ada di sini, dia cuma nomor di dalam layanan',
	inputLabel: 'perintah',
	termHint: '# ketik perintah RouterOS lalu tekan Enter',
	hintUnknown: '# perintah itu gak ada, ketik ? buat lihat menunya',
	didYouMean: '# mungkin maksudnya {word}',
	hintName: '# misinya minta name=nimbus',
	hintAddr: '# contoh alamat yang benar 192.168.88.1/24',
	hintIface: '# port yang ada cuma ether1 sampai ether5',
	hintNeeds: '# perintah ini butuh address= dan interface=',
	hintWrongPort: '# laptop kantornya nyolok di ether2',
	hintAddFirst: '# ether2 belum punya alamat, tambahin dulu',
	hintDynamic: '# D artinya dynamic, alamat dari ISP buat ether1',
	hintRunning: '# R artinya running, ada kabel yang nyolok dan nyala'
};
