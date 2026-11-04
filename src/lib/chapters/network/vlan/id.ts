import type { VlanText } from './types';

export const id: VlanText = {
	title: 'Apa itu VLAN',
	intro: [
		'Kantor nimbus.com punya satu <b>switch</b> di lemari, kotak dengan banyak colokan (namanya port) yang nyambungin semua kabel di gedung. Laptop tim keuangan, server gaji, dan pojok tamu semuanya nyolok ke situ.',
		'Nah ini masalahnya. Lihat laptop tamu ngirim sesuatu. Naik lewat kabelnya, lewat switch, terus langsung turun ke server gaji. Gawat kan.',
		'Bisa aja beli switch kedua khusus tamu. Tapi ada cara lain, <b>VLAN</b> (virtual LAN) ngasih warna ke tiap port, lewat software. Port keuangan jadi biru, port tamu jadi oranye.',
		'Port yang warnanya sama bebas ngobrol. Laptop keuangan tetap bisa nyampe ke server gaji, persis kayak sebelumnya.',
		'Tapi paket dari tamu sekarang berhenti di switch. Switch nolak nerusin apa pun antar dua warna yang beda. Buat si tamu, server gaji itu seolah nggak ada.',
		'[ingat] Warna sama, satu ruangan. Warna beda, beda gedung. Satu switch, banyak ruangan.',
		'Terus kalau tim keuangan memang harus nyampe ke tamu? Paketnya wajib keluar lewat <b>router</b>, tempat [[firewall|networking/firewall]] bisa ngecek dulu. Tapi biasanya sih memang nggak diizinin.',
		'[fyi] Kata sama, dunia beda. Di cloud kamu nggak pernah megang switch, jadi temboknya datang dari [[VPC|networking/vpc]], satu jaringan privat utuh yang digambar lewat software. Tujuannya sama, misahin tetangga.',
		'Itulah VLAN, kelompok berwarna di satu kotak. Kalau mau, cat port tamu pertama jadi biru dan lihat dia bisa nyampe ke mana.'
	],
	reactions: {
		joined:
			'Sekarang port itu biru, jadi buat switch, si tamu itu orang keuangan. Dia langsung jalan ke server gaji. Satu warna salah aja udah cukup.',
		left: 'Oranye lagi, balik ke ruang tamu, dan switch nahan dia di pintu. Jauh lebih aman.'
	},
	steps: [
		{
			title: 'Satu switch',
			body: '<b>Switch</b> nyambungin kabel kabel di satu gedung. Tiap perangkat nyolok ke salah satu portnya.'
		},
		{
			title: 'Semua bisa lihat semua',
			body: 'Dari pabriknya, semua port ada di jaringan yang sama, jadi tamu bisa nyampe ke server gaji.'
		},
		{
			title: 'Warnai portnya',
			body: '<b>VLAN</b> itu nomor yang dikasih ke port. Di sini keuangan <b>VLAN 10</b> dan tamu <b>VLAN 20</b>.'
		},
		{
			title: 'Warna sama, nyambung',
			body: 'Port di VLAN yang sama bebas saling kirim paket, jadi kerjaan jalan kayak biasa.'
		},
		{
			title: 'Warna beda, berhenti',
			body: 'Switch nggak pernah nerusin paket antar dua VLAN. Kotaknya sama, kabelnya sama, jaringannya dua.'
		},
		{
			tag: 'Pegangan',
			title: 'Satu switch, banyak ruangan',
			body: 'Warna sama, satu ruangan. Warna beda, beda gedung.'
		},
		{
			title: 'Nyeberang',
			body: 'Lalu lintas antar VLAN harus lewat <b>router</b>, tempat aturan nentuin apa yang boleh lewat.'
		},
		{
			title: 'Ada juga di cloud',
			body: 'Provider cloud misahin jaringan pakai <b>VPC</b>, bukan VLAN. Idenya sama, cuma nggak ada switch yang dipegang.'
		},
		{
			title: 'Satu warna salah',
			body: 'Port di VLAN yang salah masuk ke ruangan yang salah. Makanya orang jaringan ngelabelin port mereka dengan teliti.'
		}
	],
	switchLabel: 'Switch kantor',
	routerLabel: 'Router',
	payrollLabel: 'Server gaji',
	financeTag: 'Keuangan, VLAN 10',
	guestTag: 'Tamu, VLAN 20',
	blockedTag: 'ditahan',
	checkedTag: 'dicek',
	paintBtn: 'Cat port tamu jadi biru',
	unpaintBtn: 'Balikin jadi oranye'
};
