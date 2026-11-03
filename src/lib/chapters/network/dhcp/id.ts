import type { DhcpText } from './types';

export const id: DhcpText = {
	title: 'Apa itu DHCP',
	intro: [
		'Masuk ke kafe, sambung ke WiFi nya, sedetik kemudian HP mu sudah online. Kamu nggak pernah mengetik [[alamat IP|network/ip-address]]. Terus siapa yang kasih?',
		'Router kafe menjalankan layanan kecil bernama <b>DHCP</b> (Dynamic Host Configuration Protocol). Tugasnya cuma satu, membagikan alamat ke siapa pun yang bergabung.',
		'Bayangkan meja resepsionis hotel dengan papan berisi kunci kamar. Kamu datang, minta kunci, dapat satu, lalu mengembalikannya waktu pergi. Alamatnya cuma dipinjamkan, bukan diberikan selamanya.',
		'Pinjaman itu namanya <b>lease</b> (sewa), dan ada batas waktunya, biasanya beberapa jam atau sehari. HP yang tetap di sana terus memperpanjangnya. HP yang pergi berhenti memperpanjang, dan begitu waktunya habis alamatnya kembali ke papan.',
		'Minta alamat butuh empat pesan singkat, gampang diingat sebagai <b>DORA</b>. Discover (ada yang bagi bagi alamat?), Offer (nih, pakai yang ini), Request (oke, aku mau yang itu), dan Acknowledge (sekarang punyamu).',
		'Selain alamat, HP juga diberi tahu jalan keluar dari jaringan (<b>gateway</b>, biasanya router itu sendiri) dan server [[DNS|networking/dns]] mana yang ditanya soal nama. Semua yang dia butuhkan untuk online.',
		'[fyi] Nanti di lab MikroTik, kamu bikin server DHCP sendiri dan memilih pool serta lama lease nya dengan tangan. Itu ada di [[IP address dan DHCP server|netlab/router-ip]].',
		'Kafenya buka. Routernya cuma punya 6 alamat untuk dipinjamkan. Persilakan pelanggan masuk satu per satu, dan lihat apa yang terjadi waktu papannya kosong.'
	],
	reactions: {
		dora: 'Empat pesan singkat dan HP nya sudah punya alamat, gateway, dan server DNS, tanpa ada yang mengetik apa pun. Begitulah DHCP bekerja.',
		empty:
			'Papannya kosong. Pelanggan baru sudah teriak Discover, tapi nggak ada kunci yang bisa ditawarkan. HP nya menampilkan "terhubung, tanpa internet" dan diam diam memberi dirinya alamat 169.254 yang nggak bisa ke mana mana. Kosongkan satu kunci.',
		leave:
			'Pelanggannya sudah pergi, tapi kuncinya nggak langsung kembali. Router menunggu sampai lease nya habis, siapa tahu HP itu balik lagi.',
		rejoin:
			'Lease nya habis, kuncinya kembali ke papan, dan pelanggan yang menunggu langsung dapat. Dipinjamkan, dikembalikan, dipinjamkan lagi, begitulah segelintir alamat bisa melayani pelanggan seharian.'
	},
	routerLabel: 'Router kafe',
	routerSub: 'server DHCP nya',
	boardLabel: 'Pool alamat',
	keyFree: 'kosong',
	keyLent: 'dipinjam',
	keyCooling: 'lease berakhir',
	arriveBtn: 'Pelanggan masuk',
	guestLabel: 'Tamu {n}',
	doorLabel: 'Di pintu',
	noAddress: 'tanpa alamat',
	tapToLeave: 'Ketuk pelanggan untuk menyuruhnya pulang',
	steps: [
		{ name: 'Discover', say: 'Ada yang bagi bagi alamat?' },
		{ name: 'Offer', say: 'Nih, pakai yang ini' },
		{ name: 'Request', say: 'Oke, aku mau yang itu' },
		{ name: 'Ack', say: 'Sekarang punyamu' }
	],
	slipTitle: 'Yang diterima tamu {n}',
	slip: {
		address: 'Alamat',
		gateway: 'Gateway',
		dns: 'DNS',
		lease: 'Lease',
		leaseValue: '1 jam'
	},
	notes: {
		idle: 'Enam kunci di papan, belum ada tamu',
		asking: 'Pendatang baru minta alamat ke seisi ruangan',
		joined: 'Sudah duduk dan online',
		empty: 'Kunci habis, pendatang baru menunggu di pintu',
		cooling: 'Kuncinya kembali setelah lease nya habis',
		rejoin: 'Kunci yang kembali dipinjamkan lagi'
	}
};
