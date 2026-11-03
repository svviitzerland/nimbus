import type { RoutingText } from './types';

export const id: RoutingText = {
	title: 'Router dan routing',
	intro: [
		'Waktu kamu buka nimbus.com, paketmu hampir nggak pernah terbang langsung ke server. Dia lompat lewat deretan kotak di seluruh kota, bahkan mungkin nyeberang laut. Tiap kotak itu namanya <b>router</b>.',
		'Ingat di [[Lapisan dan paket|networking/layers]], tiap paket bawa label berisi alamat tujuannya. Router baca label itu, terus nyocokin ke <b>tabel routing</b>, daftar pendek yang bilang "kalau mau ke jaringan ini, oper ke tetangga itu". Tetangga itu disebut <b>next hop</b>.',
		'Bayangin papan penunjuk jalan di tiap persimpangan. Router nggak tahu seluruh rute ke nimbus.com, dia cuma tahu harus nunjuk ke arah mana berikutnya. Router selanjutnya juga begitu, lompat demi lompat, sampai paketnya tiba.',
		'Terus kalau nggak ada yang cocok di tabel? Paketnya langsung dibuang, router nggak pernah nebak. Makanya hampir semua router punya <b>default route</b>, satu baris yang bilang "selain itu, kirim aja ke ISP". Router di rumahmu pada dasarnya hidup dari satu baris itu.',
		'[fyi] Kata sama, dunia beda. Jaringan di cloud (sebuah [[VPC|networking/vpc]]) juga punya route table. Di sana kamu nggak megang kotak fisik apa pun, barisnya diisi dari konsol web, tapi konsepnya persis sama.',
		'Di sini Router A ada di antara laptop kantormu dan internet, dan tabelnya masih kosong. Kirim paket ke nimbus.com, kasih Router A sebuah rute, lalu coba hapus rutenya.'
	],
	reactions: {
		noRoute:
			'Router A baca labelnya, nggak nemu apa pun buat 203.0.113.0/24 di tabelnya, jadi paketnya langsung dibuang. Router nggak pernah nebak. Kasih dia rute dulu yuk.',
		added:
			'Ada baris baru di tabel. Sekarang Router A tahu paket buat nimbus.com dioper ke tetangga yang mana. Kirim satu dan lihat arahnya bener atau nggak.',
		wrongWay:
			'Router C nerima paketnya, tapi tabelnya sendiri cuma tahu file kantor. Nggak ada apa pun buat nimbus.com, jadi dibuang juga. Satu baris salah aja, paketnya nyasar di jalan. Arahkan rutenya ke Router B.',
		delivered:
			'Sampai! A ngoper ke B, B tahu servernya di mana, dan server nerima paketnya. Tiap router cuma tahu langkah berikutnya, tapi bareng bareng mereka nemu jalannya. Sekarang hapus rute itu dan kirim lagi.',
		deleted:
			'Barisnya hilang, kayak papan penunjuk jalan yang roboh. Kira kira paket berikutnya gimana?',
		lost: 'Hilang, persis di tempat papan penunjuknya dulu berdiri. Satu baris yang hilang bisa bikin satu situs nggak bisa diakses, makanya admin jaringan ngejaga tabel routing mereka baik baik.'
	},
	laptopLabel: 'Laptopmu',
	routerA: 'Router A',
	routerB: 'Router B',
	routerC: 'Router C',
	knowsB: 'tahu nimbus.com',
	knowsC: 'tahu file kantor',
	serverLabel: 'nimbus.com',
	serverSub: '203.0.113.10',
	filesLabel: 'File kantor',
	packetChip: 'ke 203.0.113.10',
	tableTitle: 'Tabel routing {name}',
	destCol: 'Tujuan',
	hopCol: 'Next hop',
	destValue: '203.0.113.0/24',
	emptyRow: 'Belum ada rute',
	pickHop: 'Tambah rute ke nimbus.com lewat',
	viaB: 'Router B',
	viaC: 'Router C',
	deleteBtn: 'Hapus rute',
	sendBtn: 'Kirim paket',
	noteIdle: 'Paketnya dialamatkan ke 203.0.113.10, server nimbus.com',
	noteDelivered: 'Sampai, lompat demi lompat',
	noteNoRoute: '{name} nggak punya rute yang cocok, paket dibuang',
	noteWrong: '{name} juga nggak punya rute ke nimbus.com, paket dibuang',
	lostTag: 'dibuang',
	okTag: 'sampai'
};
