import type { SubnetText } from './types';

export const id: SubnetText = {
	title: 'Subnet',
	intro: [
		'Bayangkan sekumpulan [[alamat IP|network/ip-address]] itu sebuah gedung, dan tiap jendelanya satu alamat. Kantor nimbus.com punya gedung 192.168.1.0 dengan 256 jendela. Sekarang isinya masih satu aula besar, dan semua orang berbagi tempat.',
		'Satu aula besar itu berisik, dan HP tamu jadi duduk persis di sebelah laptop bagian keuangan. Jadi kita pasang sekat dan bikin ruangan. Tiap ruangan namanya <b>subnet</b>. Untuk menyebut seberapa besar ruangannya, kita tulis garis miring dan angka, misalnya 192.168.1.0/24.',
		'Angka di belakang garis miring bilang seberapa besar ruangan yang kamu dapat. Lihat apa yang terjadi kalau angkanya naik. <b>Angka makin besar, ruangan makin kecil.</b> /25 membelah gedung jadi dua ruangan isi 128, /26 jadi empat ruangan isi 64, dan terus dibelah dua.',
		'Sekarang kebalikannya. Tiap angkanya turun satu, ruangannya jadi dua kali lipat, dan sekatnya hilang sendiri. Ruangan /28 isi 16 bergabung jadi 32, lalu 64, lalu 128, sampai /24 jadi satu gedung utuh lagi.',
		'Naik terus sampai /32 dan ruangannya tinggal satu jendela, pas satu alamat. /30 itu ruangan mungil isi 4, pas untuk satu kabel yang menyambung dua router.',
		'Turun di bawah /24 dan ruangannya jadi lebih besar dari gedung ini. /16 itu satu kompleks berisi 256 gedung seperti punya kita, 65.536 alamat. /8 itu satu kota, sekitar 16,7 juta.',
		'Kadang ukurannya ditulis dengan cara lain, <b>255.255.255.0</b>. Itu namanya <b>subnet mask</b>. Tiap 255 menandai bagian alamat yang tetap (gedungnya), dan 0 menandai bagian yang berubah ubah (jendela di dalamnya). Tiga kali 255 itu 24 bit yang tetap, jadi 255.255.255.0 artinya persis sama dengan /24.',
		'[ingat] Cukup ingat satu aturan. Angka besar, ruangan kecil. /32 itu satu alamat, /24 itu 256 (satu rumah atau kantor), dan tiap turun satu angka ruangannya jadi dua kali lipat. Contekan kecil di gambar itu sudah cukup buat hari pertama.',
		'[fyi] Di tiap ruangan ada dua jendela yang sudah dipesan. Yang pertama nama ruangannya (network address), yang terakhir untuk teriak ke semua orang di dalamnya (broadcast address). Jadi ruangan /24 muat 254 perangkat, bukan 256.',
		'[fyi] Katanya sama, dunianya beda. Di cloud, ruangan publik dan privat di [[VPC|networking/vpc]] kamu juga subnet, ditulis dengan garis miring yang persis sama. Bedanya, cloud menyimpan beberapa jendela lagi untuk dirinya sendiri.',
		'Itulah subnetting versi ramah. Kalau mau, geser sendiri angkanya dan lihat ruangannya terbelah dan bergabung.'
	],
	reactions: {
		split:
			'Naik satu angka, dan tiap ruangan dibelah dua. Jumlah ruangan jadi dua kali lipat, ukurannya jadi setengah.',
		merge:
			'Turun satu angka, dan ruangan yang bersebelahan bergabung jadi satu yang dua kali lebih besar.',
		one: '/32 artinya tiap ruangan cuma satu jendela. Kalau kamu lihat /32 di pengaturan, artinya ya satu alamat itu saja.'
	},
	steps: [
		{
			title: 'Blok itu gedung',
			body: 'Sekumpulan alamat berderet seperti jendela di satu gedung. Di sini dari <b>192.168.1.0</b> sampai <b>192.168.1.255</b>.'
		},
		{
			title: 'Ruangan itu subnet',
			body: 'Sekat membagi gedung jadi ruangan. Garis miring dan angka di belakang alamat bilang seberapa besar tiap ruangan.'
		},
		{
			title: 'Angka lebih besar',
			body: 'Tiap naik satu, semua ruangan dibelah dua. Ruangan makin banyak, masing masing makin kecil.'
		},
		{
			title: 'Angka lebih kecil',
			body: 'Tiap turun satu, dua ruangan digabung. Ruangan makin sedikit, masing masing <b>dua kali</b> lebih besar.'
		},
		{
			title: 'Yang mungil',
			body: '<b>/32</b> itu satu alamat. <b>/30</b> itu 4, langganan untuk sambungan antar dua router.'
		},
		{
			title: 'Yang raksasa',
			body: '<b>/16</b> itu 65.536 alamat, satu kompleks. <b>/8</b> sekitar 16,7 juta, satu kota.'
		},
		{
			title: 'Ukuran sama, cara tulis lain',
			tag: 'subnet mask',
			body: '<b>255.255.255.0</b> itu <b>/24</b>. 255.255.255.128 itu /25, dan 255.255.0.0 itu /16.'
		},
		{
			title: 'Angka besar, ruangan kecil',
			tag: 'biar nempel',
			body: '/32 itu 1, /24 itu 256, dan tiap turun satu jadi dua kali lipat. Simpan tabel ini di saku.'
		},
		{
			title: 'Dua jendela dipesan',
			tag: 'info',
			body: 'Alamat pertama jadi nama ruangan, alamat terakhir untuk menjangkau semua orang di dalamnya. Sisanya untuk perangkat.'
		},
		{
			title: 'Subnet di cloud',
			tag: 'info',
			body: 'VPC itu gedungmu sendiri di cloud, dan kamu membaginya jadi subnet publik dan privat dengan cara yang sama.'
		},
		{
			title: 'Geser angkanya',
			tag: 'giliranmu',
			body: 'Opsional. Pakai tombol minus dan plus di atas, lalu lihat sekatnya bergerak.'
		}
	],
	buildingLabel: 'Gedung alamat 192.168.1.0',
	oneRoom: 'Satu ruangan, {size} alamat',
	rooms: '{n} ruangan, masing masing {size} alamat',
	roomsSingle: '{n} ruangan, masing masing satu alamat',
	cheat: [
		{ size: '1', note: 'satu alamat' },
		{ size: '4', note: 'sambungan dua router' },
		{ size: '256', note: 'satu rumah atau kantor' },
		{ size: '65.536', note: 'satu kompleks' },
		{ size: '16,7 juta', note: 'satu kota' }
	],
	cheatTitle: 'Contekan',
	ruleLine: 'Angka besar, ruangan kecil',
	campus16: '/16 itu 256 gedung seperti punya kita, 65.536 alamat',
	campus8: '/8 itu 256 kompleks seperti ini, sekitar 16,7 juta',
	nameLabel: 'nama',
	shoutLabel: 'semua',
	publicLabel: 'subnet publik',
	privateLabel: 'subnet privat',
	smaller: 'Angka lebih kecil, ruangan lebih besar',
	bigger: 'Angka lebih besar, ruangan lebih kecil',
	thousands: '.',
	maskTitle: 'Subnet mask',
	fixedLabel: 'tetap, gedungnya',
	freeLabel: 'jendelanya',
	sameLabel: 'artinya sama dengan'
};
