import type { DnsText } from '../types';

export const id: DnsText = {
	title: 'IP dan DNS',
	intro: [
		'Setiap server di internet punya <b>alamat IP</b>, deretan angka yang menunjukkan lokasinya, mirip nomor rumah. Browser butuh angka ini untuk menyambung.',
		'Masalahnya, manusia susah menghafal angka. Jadi kita pakai nama yang gampang diingat seperti nimbus.com. Tapi komputer tetap butuh angkanya.',
		'Di sinilah <b>DNS</b> bekerja. Dia buku telepon internet. Kamu sebut sebuah nama, dia balas dengan alamat IP-nya, dan barulah browser bisa menyambung ke server yang benar.',
		'Buku teleponnya sudah terbuka. Sebut sebuah nama dan ikuti DNS menemukan angkanya sampai HP-mu tersambung.',
		'[ingat] DNS membantu menemukan alamat dari nama. Nama situs dan alamat IP bukan benda yang sama.'
	],
	reactions: {
		resolved:
			'Secepat itu. Kamu cuma menyebut nama, DNS membalas dengan alamat IP-nya, dan HP-mu langsung tahu harus menyambung ke mana. Ini terjadi diam diam tiap kali kamu buka situs apa pun.'
	},
	youLabel: 'HP kamu',
	bookTitle: 'DNS',
	bookSub: 'Mencari IP berdasarkan nama domain',
	serverLabel: 'Server',
	domains: [
		{ host: 'nimbus.com', ip: '76.76.21.21' },
		{ host: 'kopi.com', ip: '104.18.36.92' },
		{ host: 'warta.com', ip: '151.101.1.67' }
	],
	idleNote: 'Pilih nama situs di bawah',
	lookupNote: 'DNS mencari alamat IP untuk nama ini',
	connectNote: 'Ketemu, {ip}. HP-mu menyambung ke sana'
};
