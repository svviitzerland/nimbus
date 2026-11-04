import type { NatText } from './types';

export const id: NatText = {
	title: 'Apa itu NAT',
	intro: [
		'Di rumahmu ada tiga HP yang online bersamaan. Padahal provider internet cuma kasih <b>satu</b> [[alamat IP|network/ip-address]] publik untuk serumah, yaitu alamat router. Gimana caranya mereka berbagi?',
		'Di dalam rumah, tiap HP punya alamat <b>privat</b> seperti 192.168.1.10, dipinjamkan oleh [[DHCP|network/dhcp]]. Alamat privat cuma berlaku di dalam. Jutaan rumah memakai alamat yang persis sama, jadi internet nggak mau mengantar ke sana.',
		'HP A membuka nimbus.com. Suratnya keluar dengan alamat pengirim yang privat. Di pintu, router mencoretnya dan menulis alamat publiknya sendiri, plus satu nomor miliknya. Trik ini namanya <b>NAT</b> (Network Address Translation).',
		'Biar nggak lupa, router menulis satu baris di <b>tabel translasi</b>, "nomor 40001 punya HP A." Nomor itu namanya [[port|foundations/port]], semacam nomor kamar di alamat publik.',
		'Balasan dari nimbus.com datang ke alamat publik, nomor 40001. Router mengecek tabelnya, menulis lagi HP A di suratnya, lalu menyerahkannya. HP A dapat halamannya.',
		'Sekarang ketiga HP sekaligus. Tiap perjalanan dapat nomor sendiri, jadi tiap balasan cocok dengan tepat satu baris. Beginilah dunia bertahan waktu [[IPv4 mulai habis|network/ipv6]].',
		'[ingat] NAT itu meja resepsionis kantor yang meneruskan surat. Dunia luar cuma tahu alamat kantornya. Resepsionis punya catatan siapa mengirim apa, jadi tiap balasan sampai ke meja yang benar di dalam.',
		'[fyi] Efek sampingnya enak, orang asing nggak bisa memulai obrolan dengan HP di dalam, karena nggak ada baris di tabel yang menunjuk ke sana. Di cloud idenya sama, namanya <b>NAT gateway</b>, supaya server di [[subnet|networking/vpc]] privat bisa keluar tanpa bisa didatangi. Di lab MikroTik kamu menyalakannya lewat [[masquerade|netlab/router-nat]].',
		'Satu alamat publik, satu rumah di belakangnya. Kalau penasaran, biarkan orang asing mengetuk dari luar dan lihat apa yang dilakukan resepsionisnya.'
	],
	reactions: {
		stranger:
			'Dibuang. Nggak ada HP di dalam yang minta ini, jadi nggak ada barisnya di tabel, dan router nggak tahu ini untuk siapa. NAT diam diam menjaga orang asing tetap di luar.'
	},
	steps: [
		{
			title: 'Satu alamat publik',
			body: 'Provider memberi router satu alamat yang bisa dijangkau seluruh internet. Di sini <b>203.0.113.5</b>.'
		},
		{
			title: 'Alamat privat',
			body: 'Alamat seperti <b>192.168.x.x</b> cuma berlaku di dalam rumah atau kantor. Alamat yang sama dipakai ulang di mana mana.'
		},
		{
			title: 'Ditulis ulang saat keluar',
			body: 'Router mengganti pengirim privat dengan alamat publiknya dan nomor port baru.'
		},
		{
			title: 'Tabel translasi',
			body: 'Satu baris tiap perjalanan, menghubungkan nomor port di luar dengan HP di dalam.'
		},
		{
			title: 'Ditulis ulang saat pulang',
			body: 'Balasan tiba di alamat dan port publik. Router mencarinya di tabel lalu meneruskannya ke HP yang benar.'
		},
		{
			title: 'Banyak HP, satu alamat',
			body: 'Nomor port yang berbeda menjaga tiap obrolan tetap terpisah.'
		},
		{
			title: 'Meja resepsionis',
			tag: 'biar nempel',
			body: 'Dari luar cuma kelihatan satu alamat kantor. Resepsionis tahu siapa di dalam yang menunggu tiap balasan.'
		},
		{
			title: 'Orang asing tetap di luar',
			tag: 'info',
			body: 'Nggak ada baris di tabel berarti nggak ada tujuan. NAT gateway di cloud bekerja dengan cara yang sama.'
		},
		{
			title: 'Ketukan dari luar',
			tag: 'giliranmu',
			body: 'Opsional. Biarkan orang asing mencoba menghubungi HP di dalam.'
		}
	],
	homeLabel: 'Rumah',
	phoneLabel: 'HP {n}',
	routerLabel: 'Router',
	frontDesk: 'resepsionis',
	publicLabel: 'publik',
	privateLabel: 'privat',
	serverLabel: 'nimbus.com',
	strangerLabel: 'Orang asing',
	from: 'dari {ip}',
	to: 'ke {ip}',
	port: 'port {n}',
	loaded: 'halaman tiba',
	dropped: 'dibuang',
	tableTitle: 'Tabel translasi',
	insideHead: 'Di dalam',
	outsideHead: 'Di luar',
	strangerBtn: 'Biarkan orang asing mengetuk'
};
