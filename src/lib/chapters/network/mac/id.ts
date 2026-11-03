import type { MacText } from './types';

export const id: MacText = {
	title: 'MAC address dan ARP',
	intro: [
		'Bayangkan kantor nimbus.com. Ada laptop, printer, TV, dan beberapa HP yang berbagi satu jaringan di dalam gedung. Jaringan kecil itu namanya <b>LAN</b> (local area network, jaringan lokal).',
		'Masing masing sudah punya [[alamat IP|network/ip-address]], misalnya 192.168.1.20 untuk printer. Tapi di dalam ruangan, IP saja belum cukup.',
		'Tiap kartu jaringan lahir dengan nomor kedua yang ditanam dari pabrik. Namanya <b>MAC address</b>, enam pasang huruf dan angka, dan nggak boleh ada dua kartu di dunia yang sama. Coba balik router WiFi di rumah, biasanya nomornya tercetak di stikernya.',
		'Anggap IP itu nomor meja di denah kantor, dan MAC itu papan nama orang yang duduk di sana. Di dalam ruangan, kabel mengantar berdasarkan papan nama. Jadi tahu nomor meja saja nggak cukup, kamu juga perlu papan namanya.',
		'Laptopmu tahu printer duduk di 192.168.1.20, tapi belum tahu papan namanya. Jadi dia teriak saja ke seluruh ruangan, "siapa yang punya 192.168.1.20?" Pertanyaan itu namanya <b>ARP</b> (Address Resolution Protocol).',
		'Pesan ke semua orang di ruangan disebut <b>broadcast</b>. Semua mendengar, cuma pemiliknya yang menjawab, lalu laptop mencatat jawabannya di <b>tabel ARP</b>, semacam catatan kecil biar lain kali nggak perlu teriak lagi.',
		'[fyi] MAC address cuma berlaku di dalam satu ruangan. Begitu paket keluar lewat router, label MAC nya diganti di tiap persinggahan, sedangkan IP nya tetap sama sampai tujuan. Itulah batas antara layer 2 dan layer 3 di [[pelajaran lapisan|networking/layers]].',
		'Kamu mau mencetak nimbus.pdf. Tanya ke ruangan siapa yang punya alamat printer, lalu kirim cetakannya.'
	],
	reactions: {
		reply:
			'Semua dengar pertanyaannya, tapi cuma printer yang bilang "itu aku" dan mengirim balik MAC nya. Yang lain cuek saja. Laptopmu langsung mencatat jawabannya di tabel ARP.',
		print:
			'Sekarang cetakan langsung dikirim ke papan nama printer, tanpa teriak. TV dan HP bahkan nggak melihatnya. Coba tanya beberapa alamat lain.',
		tv: 'TV pemilik 192.168.1.30, jadi kali ini TV yang menjawab. Satu baris lagi di tabel, satu teriakan lebih sedikit nanti.',
		nobody:
			'Sepi. Nggak ada yang punya 192.168.1.99 di ruangan ini, jadi nggak ada yang menjawab. Kalau komputermu bilang perangkat di LAN nggak bisa dihubungi, ARP yang sepi begini sering jadi penyebabnya.',
		cached:
			'Kali ini nggak teriak. Laptop sudah punya MAC itu di tabel ARP, jadi langsung dikirim ke sana. Komputer sungguhan menyimpan baris ini beberapa menit, lalu lupa dan bertanya lagi.'
	},
	roomLabel: 'LAN di kantor nimbus.com',
	youLabel: 'Laptopmu',
	names: { printer: 'Printer', tv: 'TV', phone: 'HP', laptop: 'Laptop Dina' },
	ipWord: 'IP',
	macWord: 'MAC',
	shout: 'siapa punya {ip}?',
	itsMe: 'itu aku',
	notMe: 'bukan aku',
	printed: 'tercetak',
	askBtn: 'Tanya siapa punya {ip}',
	printBtn: 'Kirim cetakannya',
	moreLabel: 'Tanya alamat lain',
	askTv: 'Siapa punya {ip}',
	askNobody: 'Siapa punya {ip}',
	tableTitle: 'Tabel ARP laptopmu',
	tableEmpty: 'Masih kosong, belum kenal papan nama siapa pun',
	ipHead: 'IP',
	macHead: 'MAC',
	frameLabel: 'ke',
	notes: {
		idle: 'Laptop tahu IP printer, tapi belum tahu MAC nya',
		shouting: 'Broadcast, semua perangkat di ruangan mendengarnya',
		answered: 'Cuma pemilik IP itu yang menjawab',
		printing: 'Kali ini dikirim ke satu MAC saja',
		printed: 'Diantar lewat papan nama, langsung ke printer',
		cached: 'Sudah ada di tabel, nggak perlu tanya ke ruangan',
		nobody: 'Nggak ada perangkat yang punya IP itu, ruangan tetap sepi'
	}
};
