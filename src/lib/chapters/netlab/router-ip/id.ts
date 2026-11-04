import type { RouterIpText } from './types';

export const id: RouterIpText = {
	title: 'IP address dan DHCP server',
	intro: [
		'Tiga karyawan baru barusan nyolok laptopnya ke switch kantor. Kabelnya aman, lampunya kedip kedip, tapi coba lihat alamat di bawah tiap laptop. Masih kosong.',
		'Tiap perangkat di jaringan butuh <b>IP address</b> sendiri, kayak nomor rumah, kalau nggak, balasan buat dia nggak bakal nyampe. Di sini belum ada yang bagi alamat, jadi tiap laptop nyerah dan bikin sendiri, <b>169.254.x.x</b>, alamat darurat yang nggak bisa dipakai keluar ke mana mana.',
		'Ngetik alamat satu satu di tiap laptop masih oke buat tiga orang, tapi nggak buat tiga puluh. Makanya jaringan pakai <b>DHCP</b>, layanan yang bagi bagi alamat sendiri, mirip resepsionis yang ngasih badge bernomor ke tiap tamu. Konsepnya ada di [[Apa itu DHCP|network/dhcp]].',
		'DHCP server di MikroTik butuh tiga bagian. Pertama <b>pool</b>, kotak badge yang boleh dibagi. Lihat terminalnya, 192.168.88.10 sampai .254, nomor kecil sengaja dikosongin buat perangkat kayak printer.',
		'Kedua, info <b>network</b>, kertas sambutan yang ikut dikasih bareng badge. Gateway kamu (jalan keluar) itu router di 192.168.88.1, dan tanya ke 8.8.8.8 kalau mau cari alamat sebuah nama.',
		'Ketiga, <b>server</b>nya sendiri, si resepsionis, jaga di ether2 tempat kantor nyambung. Begitu dia mulai, laptop laptop nanya lagi, dan kali ini ada yang jawab.',
		'[ingat] Pool itu kotak badge, network itu kertas sambutan, server itu resepsionisnya. Nggak ada resepsionis, nggak ada yang dapat badge. Terus kalau lihat 169.254, artinya nggak ada yang jawab.',
		'[fyi] Router WiFi di rumahmu juga ngelakuin hal yang sama, makanya HP langsung dapat alamat begitu nyambung. Jaringan di cloud kayak [[VPC|networking/vpc]] juga gitu, cuma servernya nggak kelihatan.',
		'Giliran kamu. Buka buku catatan si resepsionis pakai <b>/ip dhcp-server lease print</b> dan lihat siapa dapat badge yang mana.'
	],
	reactions: {
		leases:
			'Itu buku catatannya. Tiap baris nunjukin alamat mana dikasih ke laptop mana (MAC address itu nama hardware laptopnya), dan <b>bound</b> artinya alamat itu lagi dipakai.',
		pool: 'Itu poolnya, kotak badgenya. Sekarang intip siapa yang beneran dapat pakai <b>/ip dhcp-server lease print</b>.',
		error:
			'Yang itu RouterOS nggak ngerti. Cek lagi ejaannya, atau tekan sarannya dan lihat diketikin.'
	},
	steps: [
		{
			title: 'Nyolok, tapi belum ada alamat',
			body: 'Kabel ngasih laptop jalan. Tapi dia tetap butuh <b>alamat</b> sebelum ada yang bisa ngirim sesuatu ke dia.'
		},
		{
			tag: '169.254.x.x',
			title: 'Nggak ada yang jawab',
			body: 'Kalau laptop minta alamat dan nggak dapat jawaban, dia ambil alamat <b>169.254</b> sendiri. Artinya cuma satu, dia nyerah.'
		},
		{
			tag: 'DHCP',
			title: 'Si resepsionis',
			body: '<b>DHCP server</b> ngasih alamat ke tiap perangkat baru, plus gateway dan DNS yang dipakai, tanpa ada yang ngetik.'
		},
		{
			tag: 'ip pool',
			title: 'Kotak badge',
			body: '<b>Pool</b> itu rentang alamat yang boleh dibagi. Harus ada di dalam jaringan kantor dan nggak kena .1 punya router.'
		},
		{
			tag: 'dhcp-server network',
			title: 'Kertas sambutan',
			body: '<b>gateway</b> itu jalan keluar (si router), <b>dns-server</b> itu tempat nanya alamat nama kayak nimbus.com.'
		},
		{
			tag: 'dhcp-server',
			title: 'Loket dibuka',
			body: 'Servernya dengerin di <b>ether2</b>, bagi alamat dari pool, dan nyatat tiap pembagian sebagai <b>lease</b>.'
		},
		{
			tag: 'Biar nempel',
			title: 'Badge, kertas, resepsionis',
			body: 'Pool, network, server. Lupa resepsionisnya, nggak ada yang dapat badge.'
		},
		{
			title: 'Di mana mana sama',
			body: 'WiFi rumah, hotspot HP, sampai jaringan cloud, semuanya bagi alamat pakai DHCP.'
		},
		{
			title: 'Giliran kamu',
			body: '<b>Lease</b> itu satu kali pembagian, alamat yang dipinjamkan ke satu perangkat untuk sementara.'
		}
	],
	ispLabel: 'ISP',
	inputLabel: 'perintah',
	tryLabel: 'Coba ini',
	termHint: '# giliran kamu, ketik perintahnya lalu tekan Enter',
	hintTry: '# coba {cmd}',
	didYouMean: '# mungkin maksudnya {word}',
	hintBound: '# bound artinya laptopnya lagi pakai alamat itu'
};
