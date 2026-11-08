import type { RouterIpText } from './types';

export const id: RouterIpText = {
	title: 'IP address dan DHCP server',
	intro: [
		'Tiga karyawan baru barusan nyolok laptopnya ke switch kantor. Kabelnya aman, lampunya kedip kedip, tapi coba lihat alamat di bawah tiap laptop. Masih kosong.',
		'Tiap interface membutuhkan alamat IP untuk berkomunikasi melalui IP. Tanpa jawaban DHCP, laptop pada contoh ini memilih alamat link local <b>169.254.x.x</b>. Alamat ini hanya berlaku pada sambungan lokal dan tidak menyediakan akses internet.',
		'<b>DHCP</b> membagikan konfigurasi IP secara otomatis agar tiap laptop tidak perlu diatur satu per satu. Lihat juga [[DHCP|network/dhcp]] untuk alur permintaannya.',
		'MikroTik memakai <b>pool</b> untuk menentukan alamat yang boleh dibagikan. Pada contoh ini rentangnya 192.168.88.10 sampai 192.168.88.254. Alamat di luar rentang disisakan untuk konfigurasi manual.',
		'Pengaturan <b>network</b> menentukan gateway dan DNS yang diterima klien. Di sini gateway adalah 192.168.88.1 dan DNS server adalah 8.8.8.8.',
		'<b>DHCP server</b> diaktifkan pada ether2, interface yang terhubung ke kantor. Saat klien meminta konfigurasi, server memberi alamat dari pool beserta gateway dan DNS.',
		'[ingat] Pool menentukan rentang alamat. Network menentukan gateway dan DNS. DHCP server membagikan konfigurasi kepada klien.',
		'[fyi] Router WiFi di rumahmu juga ngelakuin hal yang sama, makanya HP langsung dapat alamat begitu nyambung. Jaringan di cloud kayak [[VPC|networking/vpc]] juga gitu, cuma servernya nggak kelihatan.',
		'Jalankan <b>/ip dhcp-server lease print</b> untuk melihat alamat yang dipinjamkan kepada tiap perangkat.'
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
			title: 'Terhubung tanpa alamat IP',
			body: 'Kabel ngasih laptop jalan. Tapi dia tetap butuh <b>alamat</b> sebelum ada yang bisa ngirim sesuatu ke dia.'
		},
		{
			tag: '169.254.x.x',
			title: 'DHCP belum menjawab',
			body: 'Kalau laptop minta alamat dan nggak dapat jawaban, dia ambil alamat <b>169.254</b> sendiri. Artinya cuma satu, dia nyerah.'
		},
		{
			tag: 'DHCP',
			title: 'Pembagian alamat otomatis',
			body: '<b>DHCP server</b> ngasih alamat ke tiap perangkat baru, plus gateway dan DNS yang dipakai, tanpa ada yang ngetik.'
		},
		{
			tag: 'ip pool',
			title: 'Rentang alamat IP',
			body: '<b>Pool</b> itu rentang alamat yang boleh dibagi. Harus ada di dalam jaringan kantor dan nggak kena .1 punya router.'
		},
		{
			tag: 'dhcp-server network',
			title: 'Gateway dan DNS untuk klien',
			body: '<b>gateway</b> menentukan router untuk tujuan di luar subnet. <b>dns-server</b> menentukan server pencarian nama domain.'
		},
		{
			tag: 'dhcp-server',
			title: 'Mengaktifkan DHCP server',
			body: 'Servernya dengerin di <b>ether2</b>, bagi alamat dari pool, dan nyatat tiap pembagian sebagai <b>lease</b>.'
		},
		{
			tag: 'Cara ingat',
			title: 'Tiga konfigurasi DHCP',
			body: 'Pool menyediakan alamat, network menyediakan konfigurasi klien, dan DHCP server melayani permintaannya.'
		},
		{
			title: 'DHCP pada jaringan lain',
			body: 'WiFi rumah, hotspot HP, sampai jaringan cloud, semuanya bagi alamat pakai DHCP.'
		},
		{
			title: 'Konfigurasikan DHCP',
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
