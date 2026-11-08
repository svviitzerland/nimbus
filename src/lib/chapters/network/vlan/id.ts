import type { VlanText } from './types';

export const id: VlanText = {
	title: 'Apa itu VLAN',
	intro: [
		'Laptop staf, server gaji, dan perangkat tamu terhubung ke switch yang sama. Pada konfigurasi awal, semuanya berada di VLAN 1 dan dapat saling menjangkau dalam simulasi ini.',
		'Kita perlu memisahkan trafik tamu dari staf. Pemisahan dapat dilakukan pada switch yang mendukung VLAN tanpa menyediakan switch fisik untuk setiap kelompok.',
		'<b>VLAN</b> (virtual LAN) membagi satu switch fisik jadi beberapa jaringan terpisah, lewat software. Tiap port dikasih nomor VLAN. Port dengan nomor sama bebas ngobrol, port dengan nomor beda bersikap seolah ada di gedung yang berbeda.',
		'Kalau tim keuangan memang perlu ngehubungin tamu, trafiknya harus keluar lewat router, tempat [[firewall|networking/firewall]] bisa ngecek dulu. Tapi biasanya sih memang nggak diizinin.',
		'[fyi] Kata sama, dunia beda. Di cloud kamu nggak pernah megang switch, jadi temboknya datang dari [[VPC|networking/vpc]], satu jaringan privat utuh yang digambar lewat software. VLAN membagi switch fisik di kantor, VPC memotong jaringan dari data center milik provider. Tujuannya sama, misahin tetangga.',
		'[ingat] VLAN memisahkan broadcast domain pada jaringan switch. Komunikasi antar VLAN memerlukan routing dan tetap perlu aturan akses.',
		'Ini switchnya, dan semua port mulai di VLAN 1. Tes dulu apakah tamu bisa nyampe ke server gaji, terus warnai port portnya dan tes lagi.'
	],
	reactions: {
		leak: 'Request tamu sampai ke server gaji karena keduanya masih berada di VLAN yang sama. Ubah keanggotaan port, lalu uji kembali.',
		reach:
			'VLAN sama, tim sama, mereka saling nyampe dengan lancar. VLAN nggak pernah ngehalangin kerjaan, dia cuma bikin tembok.',
		split:
			'Port staf dan tamu kini berada pada VLAN berbeda. Uji apakah pemisahan sesuai kebutuhan.',
		blocked:
			'Request tidak diteruskan antar VLAN oleh switch pada model ini. Di jaringan nyata, routing antar VLAN perlu diatur dan dibatasi sesuai kebutuhan.',
		oops: 'Eh bentar, dua ini satu tim tapi kamu taruh di VLAN yang beda, jadi sekarang mereka nggak bisa saling nyampe. Kasih port mereka warna yang sama.',
		done: 'Perangkat tamu dan keuangan berada pada VLAN berbeda di switch yang sama. Lalu lintas antar VLAN memerlukan routing dan aturan akses yang sesuai.'
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
