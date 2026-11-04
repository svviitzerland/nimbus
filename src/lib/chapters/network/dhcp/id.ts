import type { DhcpText } from './types';

export const id: DhcpText = {
	title: 'Apa itu DHCP',
	intro: [
		'Masuk ke kafe, sambung ke WiFinya, dan sedetik kemudian HP kamu sudah online. Kamu nggak pernah mengetik [[alamat IP|network/ip-address]]. Jadi siapa yang memberinya?',
		'Di dalam router kafe ada pembantu kecil bernama <b>DHCP</b> (Dynamic Host Configuration Protocol). Bayangkan resepsionis di balik meja, dengan papan kunci di dinding. Tiap kunci itu satu alamat yang masih kosong.',
		'HP kamu masuk tanpa alamat sama sekali, jadi dia memanggil ke seluruh ruangan, "ada yang bagi bagi alamat?" Pesan pertama ini namanya <b>Discover</b>.',
		'Resepsionis mendengarnya, mengambil satu kunci kosong dari papan, lalu menyodorkannya. "Gimana kalau 192.168.1.12?" Itu namanya <b>Offer</b>.',
		'HP menjawab, "oke, aku mau yang itu." Itu namanya <b>Request</b>. (Dia bilang keras keras, siapa tahu ada resepsionis lain yang juga menawarkan.)',
		'Resepsionis mencatatnya di buku dan menyerahkan kuncinya. Itu namanya <b>Ack</b> (singkatan dari acknowledge). Bersama kuncinya ada secarik catatan, jalan keluarnya (<b>gateway</b>) dan server [[DNS|networking/dns]] mana yang ditanya soal nama.',
		'Kuncinya cuma dipinjamkan, bukan diberikan selamanya. Pinjaman ini namanya <b>lease</b> dan ada batas waktunya. Kalau HP pergi dan berhenti memperpanjang, waktunya habis dan kunci kembali ke papan untuk tamu berikutnya.',
		'[ingat] DHCP itu resepsionis yang meminjamkan kunci kamar. Datang, dapat kunci, kembalikan waktu pergi. Empat langkahnya gampang diingat, <b>DORA</b>, kayak Dora si penjelajah. Discover, Offer, Request, Ack.',
		'[fyi] Nanti di lab MikroTik, kamu sendiri yang jadi resepsionisnya dan memilih papan kunci serta lama pinjamannya. Itu ada di [[alamat IP dan server DHCP|netlab/router-ip]].',
		'Cuma itu kerjanya DHCP, diam diam, tiap kali kamu sambung ke jaringan. Kalau mau, biarkan tamu lain masuk dan lihat apa yang terjadi kalau kuncinya habis.'
	],
	reactions: {
		join: 'Tamu lagi, DORA kilat lagi, satu kunci lagi diambil dari papan. Resepsionis mencatat siapa pegang kunci yang mana.',
		empty:
			'Papannya kosong, jadi tamu ini nggak dapat alamat dan nggak bisa online. Jaringan sungguhan menghindarinya dengan papan yang lebih besar atau lease yang lebih pendek, biar kunci cepat kembali.'
	},
	steps: [
		{
			title: 'Belum punya alamat',
			body: 'Perangkat yang baru sambung belum punya alamat IP. Dia belum bisa bicara dengan siapa pun sampai dapat satu.'
		},
		{
			title: 'Server DHCP',
			body: 'Layanan kecil, biasanya ada di dalam router. Dia menyimpan <b>pool</b> alamat kosong, si papan kunci.'
		},
		{
			title: 'Discover',
			tag: 'D',
			body: 'HP mengirim satu pesan ke semua yang ada di jaringan, minta alamat.'
		},
		{
			title: 'Offer',
			tag: 'O',
			body: 'Server memilih satu alamat kosong dan menawarkannya ke HP.'
		},
		{ title: 'Request', tag: 'R', body: 'HP menyebut tawaran mana yang dia terima.' },
		{
			title: 'Ack',
			tag: 'A',
			body: 'Server mengiyakan. HP sekarang punya alamat, gateway, server DNS, dan waktu lease.'
		},
		{
			title: 'Lease',
			body: 'Tiap alamat dipinjamkan sementara. Kalau tetap di sini, HP memperpanjangnya. Kalau pergi, alamatnya kembali ke pool.'
		},
		{
			title: 'Resepsionis yang meminjamkan kunci',
			tag: 'biar nempel',
			body: '<b>D</b>iscover, <b>O</b>ffer, <b>R</b>equest, <b>A</b>ck. Datang, dapat kunci, kembalikan.'
		},
		{
			title: 'Server DHCP milikmu',
			tag: 'info',
			body: 'Di router sungguhan kamu memilih pool nya (kunci yang mana) dan lease nya (berapa lama).'
		},
		{
			title: 'Tamu lain',
			tag: 'giliranmu',
			body: 'Opsional. Ketuk tombolnya untuk membiarkan tamu lain masuk.'
		}
	],
	sceneLabel: 'Kafe dengan router yang jadi resepsionis',
	routerLabel: 'Router',
	routerSub: 'server DHCP',
	boardLabel: 'Alamat kosong',
	noAddress: 'belum ada alamat',
	dora: [
		{ name: 'Discover', say: 'ada yang bagi alamat?' },
		{ name: 'Offer', say: 'gimana kalau .12?' },
		{ name: 'Request', say: 'oke, aku mau .12' },
		{ name: 'Ack', say: 'sekarang punyamu' }
	],
	slipTitle: 'Yang diterima HP',
	slip: {
		address: 'Alamat',
		gateway: 'Gateway',
		dns: 'DNS',
		lease: 'Lease',
		leaseValue: '1 jam'
	},
	leaving: 'lease hampir habis',
	arriveBtn: 'Biarkan tamu lain masuk',
	emptyLabel: 'kunci habis'
};
