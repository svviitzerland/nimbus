import type { RouterIpText } from './types';

export const id: RouterIpText = {
	title: 'IP address dan DHCP server',
	intro: [
		'Masih ingat router yang kemarin? Namanya nimbus, dan ether2 udah punya alamat <b>192.168.88.1/24</b>. Itu alamat router dilihat dari sisi kantor, pintu yang dilewati semua laptop buat keluar ke internet.',
		'Hari ini ada tiga karyawan baru bawa laptop. Tiap perangkat di jaringan butuh <b>IP address</b> sendiri, kayak nomor rumah, kalau nggak ada, balasan buat dia nggak tau mau dikirim ke mana.',
		'Ngetik alamat satu satu di tiap laptop masih oke buat tiga orang, tapi nggak buat tiga puluh. Makanya jaringan pakai <b>DHCP</b>, layanan yang bagi bagi alamat sendiri, mirip resepsionis yang ngasih badge bernomor ke tiap tamu. Konsepnya ada di [[Apa itu DHCP|network/dhcp]].',
		'DHCP server di MikroTik butuh tiga bagian. <b>Pool</b> (alamat mana aja yang boleh dibagi), info <b>network</b> (gateway dan DNS yang harus dipakai tiap laptop), dan <b>server</b>nya sendiri, dinyalakan di port kantor.',
		'[fyi] Router WiFi di rumahmu juga ngelakuin hal yang sama, makanya HP langsung dapat alamat begitu nyambung. Jaringan di cloud kayak [[VPC|networking/vpc]] juga bagi alamat dengan cara yang sama, cuma DHCP servernya nggak kelihatan.',
		'Giliran kamu. Colok satu laptop dulu dan lihat apa yang terjadi tanpa DHCP, lalu bikin pool, network, dan servernya. Mau sekali jalan? <b>/ip dhcp-server setup</b> bakal nanya semuanya satu per satu.'
	],
	reactions: {
		noIp: 'Laptopnya teriak ke kabel, ada yang punya alamat buat aku nggak? Nggak ada yang jawab, jadi dia bikin sendiri, <b>169.254.x.x</b>. Alamat itu nggak kepakai di mana mana, artinya laptopnya nyerah.',
		gotIp:
			'Lihat, dia nanya dan langsung dapat jawaban. Router ngasih alamat dari pool, plus gateway dan DNS yang harus dipakai. Nggak ada yang ngetik apa apa di laptopnya.',
		pool: 'Poolnya siap. Ini badge yang boleh dibagi resepsionis, 192.168.88.10 sampai .254. Nomor kecil sengaja dikosongin buat perangkat yang diatur manual, kayak printer.',
		poolBad:
			'Hati hati sama rentangnya. Harus ada di dalam 192.168.88.0/24, dan jangan sampai kena <b>192.168.88.1</b>, itu udah punya router.',
		network:
			'Sekarang DHCP tau harus bilang apa ke tiap laptop. Gateway kamu 192.168.88.1 (si router), dan tanya ke 8.8.8.8 kalau mau cari nama kayak nimbus.com.',
		gatewayBad:
			'Gatewaynya harus router itu sendiri, <b>192.168.88.1</b>. Kalau diarahkan ke tempat lain, laptopnya bakal ngetok pintu yang nggak ada.',
		server:
			'DHCP server udah jalan di ether2. Laptop yang tadi nunggu nanya lagi, dan kali ini dapat jawaban. Lihat layarnya jadi hijau.',
		wizard:
			'Wizard setup barusan bikin tiga bagian sekaligus, pool, info network, dan server yang jalan di ether2. Hasilnya sama persis kayak ngetik satu satu.',
		wizardBad:
			'Wizardnya nggak terima jawaban itu. Baca baris petunjuknya, terus coba lagi (nilai bawaannya udah keisi, jadi biasanya tinggal Enter).',
		disabled:
			'Servernya udah ada, tapi lihat huruf <b>X</b>, dia masih mati. RouterOS sengaja nambahinnya dalam keadaan mati biar aman. Nyalakan pakai <b>/ip dhcp-server enable dhcp1</b>.',
		wrongPort:
			'Eh, server itu bakal bagi alamat ke arah ISP di ether1. Laptop kantornya ada di <b>ether2</b>, jadi pakai interface=ether2 ya.',
		noPool:
			'Servernya nggak punya pool buat dibagi. Bikin pool dulu, terus isi address-pool pakai nama pool itu.',
		noLease:
			'Daftarnya masih kosong, belum ada yang dapat alamat. Colok laptop dan pastikan servernya udah jalan.',
		leases:
			'Ini buku catatan si resepsionis. Tiap baris nunjukin alamat mana dikasih ke laptop mana (MAC address itu nama hardware laptopnya), dan bound artinya alamat itu lagi dipakai.',
		error:
			'Yang itu RouterOS nggak ngerti. Cek lagi ejaannya, atau ketik <b>?</b> buat lihat yang ada. Tombol Bantu juga bisa ngetikin buat kamu.',
		done: 'Beres! Laptop kantor sekarang dapat alamat sendiri. Besok colok laptop keempat, langsung jalan. Berikutnya, alamat ini alamat privat, jadi belum bisa ke internet sendirian.'
	},
	missionsLabel: 'Misi',
	missions: [
		'Colok laptop ke switch',
		'Bikin pool alamat',
		'Kasih tau DHCP gateway dan DNS',
		'Nyalakan DHCP server di ether2',
		'Cek siapa aja yang dapat alamat'
	],
	hintBtn: 'Bantu',
	doneNote: 'Tiap laptop dapat alamat sendiri',
	ispLabel: 'ISP',
	inputLabel: 'perintah',
	termHint: '# ketik perintah RouterOS lalu tekan Enter',
	hintUnknown: '# perintah itu nggak ada, ketik ? buat lihat menunya',
	didYouMean: '# mungkin maksudnya {word}',
	plugCaption: 'Tekan laptop buat nyolok kabelnya ke switch',
	gotCaption: 'Laptopnya dapat alamat dari router',
	hintApipa: '# 169.254.x.x artinya laptop nggak dapat jawaban dan bikin alamat sendiri',
	hintPoolRange:
		'# pakai rentang di dalam 192.168.88.0/24 yang nggak kena .1, misalnya 192.168.88.10-192.168.88.254',
	hintGateway: '# gatewaynya router itu sendiri, 192.168.88.1',
	hintIface: '# laptop kantor nyolok di ether2',
	hintDisabled: '# X artinya mati, jalankan /ip dhcp-server enable dhcp1',
	hintNoPool: '# bikin pool dulu pakai /ip pool add, lalu pakai namanya',
	hintNeeds: '# perintah ini masih butuh {keys}',
	hintNoLease: '# belum ada yang dapat alamat',
	hintBound: '# bound artinya laptopnya lagi pakai alamat itu',
	hintWizard: '# wizardnya nanya satu per baris, tekan Enter buat pakai nilai yang tampil'
};
