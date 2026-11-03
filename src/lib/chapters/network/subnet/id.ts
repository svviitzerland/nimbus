import type { SubnetText } from './types';

export const id: SubnetText = {
	title: 'Subnet dan CIDR',
	intro: [
		'Kantor nimbus.com punya satu jaringan, 192.168.1.0, dengan tempat untuk 256 [[alamat IP|network/ip-address]] (192.168.1.0 sampai 192.168.1.255). Laptop karyawan, HP tamu, kamera, dan printer semuanya berbagi satu aula besar.',
		'Satu aula besar itu gampang berantakan. Tiap [[teriakan ARP|network/mac]] sampai ke semua perangkat, dan HP tamu duduk persis di sebelah laptop bagian keuangan. Jadi aulanya kita sekat jadi ruangan yang lebih kecil, dan tiap ruangan itu namanya <b>subnet</b>.',
		'Untuk menyebut seberapa besar ruangannya, kita tambahkan garis miring dan angka di belakang alamat, misalnya 192.168.1.0/24. Cara menulis ini namanya <b>CIDR</b> (Classless Inter Domain Routing, nama panjang untuk ide yang sederhana).',
		'Alamat IPv4 itu 32 bit, 32 sakelar kecil. Angka di belakang garis miring bilang berapa bit yang dikunci jadi nama ruangan. Sisanya bebas untuk perangkat di dalamnya. /24 mengunci 24 bit dan menyisakan 8, dan 8 bit bebas itu pas 256 alamat.',
		'Aturannya cuma satu. Tiap angkanya naik satu, setiap ruangan dibelah dua dan jumlah ruangannya jadi dua kali lipat. /25 jadi dua ruangan isi 128, /26 jadi empat ruangan isi 64, dan seterusnya.',
		'Di tiap ruangan ada dua alamat yang sudah dipesan. Yang pertama nama ruangannya (<b>network address</b>), yang terakhir untuk teriak ke semua orang di dalamnya (<b>broadcast address</b>). Jadi ruangan /24 muat 254 perangkat, bukan 256.',
		'[fyi] Katanya sama, dunianya beda. Ruangan publik dan privat di [[VPC|networking/vpc]] cloud kamu juga subnet, ditulis dengan garis miring yang persis sama. Bedanya cuma satu, AWS menyimpan 5 alamat di tiap subnet, bukan 2, untuk router dan DNS miliknya.',
		'Geser angkanya dan lihat aulanya terbelah jadi ruangan ruangan. Lalu rencanakan ruangan yang dibutuhkan nimbus.com.'
	],
	reactions: {
		split:
			'Lihat terbelah, kan? Satu bit lagi dikunci, ukuran ruangan jadi setengah, jumlahnya dua kali lipat. Layar lama menampilkan hal yang sama sebagai <b>subnet mask</b>, deretan angka di bawah slider. Idenya sama, cuma cara tulisnya beda.',
		tiny: 'Ruangan /30 isinya 4 alamat, dan setelah dipotong nama dan broadcast tinggal 2 untuk perangkat. Pas banget untuk satu kabel yang menyambung dua router, nggak lebih.',
		small:
			'Kesempitan. Bandingkan jumlah perangkat dengan ukuran ruangan, bakal ada yang nggak kebagian kursi. Turunkan angkanya biar ruangannya lebih besar.',
		waste:
			'Muat sih, tapi ruangannya kebesaran. Naikkan angkanya, ruangannya jadi lebih banyak dan semua tetap kebagian tempat.',
		m1: 'Pas. /26 kasih empat ruangan isi 62 perangkat, masing masing untuk karyawan, tamu, kamera, dan satu cadangan.',
		m2: 'Mantap. Ruangan /28 muat 14 perangkat, dan kamu dapat enam belas ruangan, cukup untuk semua tim kecil.',
		done: 'Kembali ke satu ruangan besar isi 254, muat untuk 200 perangkat dan masih bisa tumbuh. Sekarang kamu bisa membaca garis miring mana pun, angka makin besar, ruangan makin kecil.'
	},
	missions: [
		'Buat ruangan yang muat 50 perangkat, dengan jumlah ruangan sebanyak mungkin',
		'Tiap tim kecil punya 12 perangkat. Buat ruangannya sekecil mungkin tapi semua tetap muat',
		'Aula acara butuh satu ruangan untuk 200 perangkat'
	],
	missionLabel: 'Rencana {n} dari {total}',
	allDone: 'Semua ruangan sudah direncanakan',
	checkBtn: 'Pakai ukuran ini',
	smaller: 'Angka lebih kecil, ruangan lebih besar',
	bigger: 'Angka lebih besar, ruangan lebih kecil',
	status: {
		ok: 'Pas banget',
		small: '{need} perangkat nggak muat, satu ruangan di sini cuma muat {fit}',
		waste: 'Muat, tapi ruangan yang lebih kecil juga masih muat dan jumlahnya lebih banyak'
	},
	roomsLabel: 'Ruangan',
	sizeLabel: 'Alamat per ruangan',
	usableLabel: 'Perangkat per ruangan',
	locked: '{n} bit mengunci nama ruangan',
	free: '{n} bit bebas untuk perangkat',
	maskLabel: 'Subnet mask',
	hallLabel: 'Semua 256 alamat di 192.168.1.0',
	tapHint: 'Ketuk ruangan mana pun untuk melihat isinya',
	roomTitle: 'Ruangan {n} dari {total}',
	rangeLabel: 'Alamat',
	range: '{a} sampai {b}',
	nameLabel: 'Nama ruangan',
	shoutLabel: 'Broadcast',
	devicesLabel: 'Untuk perangkat',
	legendUse: 'kursi perangkat',
	legendRes: 'dipesan'
};
