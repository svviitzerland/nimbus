import type { SubnetText } from './types';

export const id: SubnetText = {
	title: 'Subnet dan CIDR',
	intro: [
		'Jaringan nimbus.com memakai blok <b>192.168.1.0/24</b>, yaitu 256 alamat total dari 192.168.1.0 sampai 192.168.1.255. Kita akan membagi blok ini menjadi subnet yang lebih kecil.',
		'<b>Subnet</b> membagi ruang alamat IP menjadi beberapa bagian. Pemisahan broadcast di jaringan Ethernet juga memerlukan konfigurasi seperti [[VLAN|network/vlan]]. Mengganti alamat saja tidak membuat batas keamanan.',
		'Untuk menyebut seberapa besar ruangannya, kita tambahkan garis miring dan angka di belakang alamat, misalnya 192.168.1.0/24. Cara menulis ini namanya <b>CIDR</b> (Classless Inter Domain Routing, nama panjang untuk ide yang sederhana).',
		'IPv4 memiliki 32 bit. Angka setelah garis miring adalah panjang prefix jaringan. <b>/24</b> memakai 24 bit untuk prefix dan menyisakan 8 bit, sehingga terdapat 256 alamat total.',
		'Batas yang sama bisa ditulis sebagai <b>subnet mask</b>. /24 setara dengan 255.255.255.0, yaitu 24 bit bernilai 1 diikuti 8 bit bernilai 0. Bit 1 menandai bagian jaringan. Geser prefix ke /25 dan mask berubah menjadi 255.255.255.128.',
		'Menambah satu bit prefix membagi kapasitas alamat menjadi setengah. Dari /24, kita mendapat dua subnet /25 dengan 128 alamat atau empat subnet /26 dengan 64 alamat.',
		'Pada subnet IPv4 biasa dalam latihan ini, alamat pertama adalah <b>network address</b> dan terakhir adalah <b>broadcast address</b>. Jadi /24 menyediakan 254 alamat host. Aturan ini memiliki pengecualian, misalnya sambungan /31.',
		'[fyi] Subnet pada [[VPC|networking/vpc]] juga memakai prefix IP. Penyedia cloud dapat menyisihkan alamat tambahan. AWS menyisihkan lima alamat pada subnet IPv4 biasa, sehingga kapasitas host berbeda dari contoh ini.',
		'[ingat] Pada IPv4, prefix lebih panjang berarti jumlah alamat lebih sedikit. /24 memiliki 256 alamat total. Tambah satu bit prefix, jumlah alamat menjadi setengah.',
		'Geser panjang prefix dan perhatikan jumlah serta kapasitas subnet. Lalu pilih ukuran yang memenuhi kebutuhan perangkat nimbus.com.'
	],
	reactions: {
		split:
			'Prefix bertambah satu bit. Tiap subnet memiliki setengah jumlah alamat, dan jumlah subnet menjadi dua kali lipat. Subnet mask di bawah slider menuliskan batas yang sama dalam bentuk lain.',
		tiny: '/30 memiliki empat alamat total dan dua alamat host pada model ini. Ukuran ini bisa dipakai untuk sambungan dua router.',
		small:
			'Kapasitas host belum cukup. Kurangi panjang prefix agar tiap subnet memiliki lebih banyak alamat.',
		waste:
			'Muat sih, tapi ruangannya kebesaran. Naikkan angkanya, ruangannya jadi lebih banyak dan semua tetap kebagian tempat.',
		m1: '/26 membagi /24 menjadi empat subnet, masing masing dengan 62 alamat host. Cukup untuk kelompok 50 perangkat.',
		m2: 'Subnet /28 menyediakan 14 alamat host biasa. Membagi jaringan /24 menjadi /28 menghasilkan 16 subnet, cukup untuk tim pada contoh ini.',
		done: '/24 menyediakan 254 alamat host pada contoh ini, cukup untuk 200 perangkat. Prefix lebih panjang berarti lebih sedikit alamat per subnet.'
	},
	missions: [
		'Buat sebanyak mungkin subnet yang masing masing muat 50 perangkat',
		'Tiap tim kecil punya 12 perangkat. Buat ruangannya sekecil mungkin tapi semua tetap muat',
		'Sediakan satu subnet untuk 200 perangkat acara'
	],
	missionLabel: 'Rencana {n} dari {total}',
	allDone: 'Semua kebutuhan subnet terpenuhi',
	checkBtn: 'Pakai ukuran ini',
	smaller: 'Prefix lebih pendek, lebih banyak alamat',
	bigger: 'Prefix lebih panjang, lebih sedikit alamat',
	status: {
		ok: 'Pas banget',
		small: 'Butuh {need} alamat host, kapasitas subnet ini {fit}',
		waste: 'Cukup, tetapi subnet yang lebih kecil juga memenuhi kebutuhan'
	},
	roomsLabel: 'Subnet',
	sizeLabel: 'Alamat per subnet',
	usableLabel: 'Alamat host per subnet',
	locked: '{n} bit untuk prefix jaringan',
	free: '{n} bit bebas untuk perangkat',
	maskLabel: 'Subnet mask',
	hallLabel: 'Semua 256 alamat di 192.168.1.0',
	tapHint: 'Ketuk subnet untuk melihat rentang alamatnya',
	roomTitle: 'Subnet {n} dari {total}',
	rangeLabel: 'Alamat',
	range: '{a} sampai {b}',
	nameLabel: 'Alamat jaringan',
	shoutLabel: 'Broadcast',
	devicesLabel: 'Untuk perangkat',
	legendUse: 'kursi perangkat',
	legendRes: 'dipesan'
};
