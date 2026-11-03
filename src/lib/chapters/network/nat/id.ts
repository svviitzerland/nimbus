import type { NatText } from './types';

export const id: NatText = {
	title: 'Apa itu NAT',
	intro: [
		'Di rumahmu ada tiga HP, satu laptop, dan TV, semuanya online bersamaan. Padahal provider internet cuma kasih <b>satu</b> [[alamat IP|network/ip-address]] publik untuk serumah. Gimana caranya mereka berbagi?',
		'Di dalam rumah, tiap perangkat punya alamat <b>privat</b> seperti 192.168.1.10, dipinjamkan oleh [[DHCP|network/dhcp]]. Alamat privat cuma berlaku di dalam, internet nggak mau mengantar ke sana, dan jutaan rumah memakai alamat yang persis sama.',
		'Router berdiri di pintu depan dan melakukan trik bernama <b>NAT</b> (Network Address Translation). Untuk tiap paket yang keluar, alamat pengirim yang privat dicoret dan diganti alamat publik milik router.',
		'Lalu balasannya datang ke alamat publik itu. Buat HP yang mana? Router ingat. Tiap perjalanan keluar dicatat di <b>tabel translasi</b>, masing masing dengan nomor [[port|foundations/port]] sendiri, jadi tiap balasan cocok dengan tepat satu baris.',
		'Beginilah dunia bertahan waktu [[IPv4 mulai habis|network/ipv6]]. Satu alamat publik bisa menyembunyikan satu rumah, bahkan satu kantor.',
		'[fyi] Efek sampingnya enak, orang asing di internet nggak bisa memulai obrolan dengan perangkat di dalam, karena nggak ada baris di tabel yang menunjuk ke sana. Di cloud idenya sama, namanya <b>NAT gateway</b>, supaya server di [[subnet|networking/vpc]] privat bisa keluar tanpa bisa didatangi. Di lab MikroTik kamu menyalakannya sendiri lewat [[masquerade|netlab/router-nat]].',
		'Tiga HP membuka nimbus.com di saat yang sama. Kirim permintaannya, lihat router menulis ulang, dan perhatikan tiap balasan pulang ke HP yang benar.'
	],
	reactions: {
		out: 'Lihat labelnya berubah di router. Pengirim privat dicoret, diganti alamat publik dengan nomor port baru. Router mencatat perjalanan itu di tabelnya.',
		back: 'Balasannya datang ke alamat dan port publik. Router mencari barisnya, menulis lagi alamat privatnya, lalu mengirimnya ke HP yang benar.',
		all: 'Ketiga HP dapat halamannya masing masing, padahal HP A dan HP B sama sama pakai port 51000 di dalam. Di luar jadinya 40001 dan 40002, jadi router nggak pernah ketukar.',
		stranger:
			'Dibuang. Nggak ada yang di dalam yang minta ini, jadi nggak ada barisnya di tabel, dan router nggak tahu ini untuk siapa. NAT diam diam menjaga orang asing tetap di luar.'
	},
	openLabel: 'Buka nimbus.com di',
	allBtn: 'Ketiganya sekaligus',
	phoneLabel: 'HP {n}',
	strangerBtn: 'Orang asing mengetuk dari luar',
	routerLabel: 'Router rumah',
	publicLabel: 'publik',
	privateLabel: 'privat',
	serverLabel: 'nimbus.com',
	strangerLabel: 'Orang asing',
	from: 'dari {ip}',
	to: 'ke {ip}',
	port: 'port {n}',
	loaded: 'terbuka',
	dropped: 'dibuang',
	tableTitle: 'Tabel translasi router',
	tableEmpty: 'Kosong, belum ada yang keluar',
	insideHead: 'Dalam',
	outsideHead: 'Luar',
	notes: {
		idle: 'Tiga HP, satu alamat publik',
		rewriteOut: 'Router mengganti pengirim privat dengan alamat publiknya',
		atServer: 'Server cuma pernah melihat alamat publik',
		rewriteBack: 'Tabel memberi tahu balasan ini milik HP yang mana',
		delivered: 'Tiap balasan menemukan HP nya sendiri',
		stranger: 'Nggak ada barisnya di tabel, jadi nggak ke mana mana'
	}
};
