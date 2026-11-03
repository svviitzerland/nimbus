import type { VlanText } from './types';

export const id: VlanText = {
	title: 'Apa itu VLAN',
	intro: [
		'Kantor nimbus.com punya satu <b>switch</b> di pojok, kotak yang nyambungin banyak kabel supaya perangkat dalam satu gedung bisa ngobrol. Laptop tim keuangan, server gaji, dan pojok tamu semuanya nyolok ke situ. Artinya laptop tamu juga bisa ngelihat server gaji.',
		'Kamu bisa aja beli switch kedua khusus tamu. Terus yang ketiga buat ruang rapat, keempat buat CCTV, lama lama lemarinya penuh kotak dan kabel.',
		'<b>VLAN</b> (virtual LAN) membagi satu switch fisik jadi beberapa jaringan terpisah, lewat software. Tiap port dikasih nomor VLAN. Port dengan nomor sama bebas ngobrol, port dengan nomor beda bersikap seolah ada di gedung yang berbeda.',
		'Kalau tim keuangan memang perlu ngehubungin tamu, trafiknya harus keluar lewat router, tempat [[firewall|networking/firewall]] bisa ngecek dulu. Tapi biasanya sih memang nggak diizinin.',
		'[fyi] Kata sama, dunia beda. Di cloud kamu nggak pernah megang switch, jadi temboknya datang dari [[VPC|networking/vpc]], satu jaringan privat utuh yang digambar lewat software. VLAN membagi switch fisik di kantor, VPC memotong jaringan dari data center milik provider. Tujuannya sama, misahin tetangga.',
		'Ini switchnya, dan semua port mulai di VLAN 1. Tes dulu apakah tamu bisa nyampe ke server gaji, terus warnai port portnya dan tes lagi.'
	],
	reactions: {
		leak: 'Waduh, tembus. Semuanya masih di VLAN yang sama, jadi buat switch, tamu dan server gaji itu satu ruangan. Warnai port portnya biar kepisah.',
		reach:
			'VLAN sama, tim sama, mereka saling nyampe dengan lancar. VLAN nggak pernah ngehalangin kerjaan, dia cuma bikin tembok.',
		split:
			'Keuangan dan tamu sekarang ada di VLAN yang beda. Switch sama, kabel sama, tapi dua dunia terpisah. Yuk dites.',
		blocked:
			'Ketahan. Switch nggak mau nerusin apa pun antar port yang beda VLAN. Buat si tamu, server gaji itu seolah nggak pernah ada.',
		oops: 'Eh bentar, dua ini satu tim tapi kamu taruh di VLAN yang beda, jadi sekarang mereka nggak bisa saling nyampe. Kasih port mereka warna yang sama.',
		done: 'Mantap! Tamu internetan di pojoknya sendiri, keuangan kerja di pojoknya sendiri, dan satu switch ngerjain dua tugas sekaligus. Kantor, kampus, sampai hotel misahin jaringannya persis begini tiap hari.'
	},
	switchLabel: 'Switch kantor',
	goalTitle: 'Target',
	goal: 'Tamu nggak bisa nyampe ke keuangan, dan keuangan tetap bisa ke servernya',
	portHint: 'Ketuk port di switch buat ganti VLAN port itu',
	pingHint: 'Ketuk dua perangkat buat ngetes apakah mereka saling nyampe',
	pickTarget: 'Sekarang ketuk siapa yang mau dicoba dihubungi {name}',
	vlans: ['VLAN 1, bawaan', 'VLAN 10, keuangan', 'VLAN 20, tamu'],
	portAria: 'Port {n}, sekarang di {vlan}, ketuk buat ganti',
	devices: ['Rina', 'Budi', 'Server gaji', 'Tamu 1', 'Tamu 2', 'Tamu 3'],
	financeTag: 'Keuangan',
	guestTag: 'Pojok tamu',
	reachOk: '{a} berhasil nyampe ke {b}',
	reachNo: '{a} nggak bisa nyampe ke {b}',
	resetBtn: 'Reset port',
	solvedNote: 'Dua jaringan dalam satu switch'
};
