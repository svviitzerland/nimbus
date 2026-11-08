import type { MacText } from './types';

export const id: MacText = {
	title: 'MAC address dan ARP',
	intro: [
		'Bayangkan kantor nimbus.com. Ada laptop, printer, TV, dan beberapa HP yang berbagi satu jaringan di dalam gedung. Jaringan kecil itu namanya <b>LAN</b> (local area network, jaringan lokal).',
		'Masing masing sudah punya [[alamat IP|network/ip-address]], misalnya 192.168.1.20 untuk printer. Tapi di dalam ruangan, IP saja belum cukup.',
		'Kartu jaringan juga memakai <b>MAC address</b>, biasanya ditulis sebagai enam pasang angka heksadesimal. Perangkat punya alamat dari pabrik, tetapi sistem bisa memakai alamat lain. HP modern sering mengacak MAC WiFi untuk menjaga privasi.',
		'Pada Ethernet, frame dikirim ke <b>MAC address</b> tujuan pada sambungan lokal. Perangkat perlu mengetahui MAC untuk IP lokal yang ingin dituju.',
		'Laptop mengetahui IP printer 192.168.1.20, tetapi belum mengetahui MAC-nya. Laptop mengirim permintaan <b>ARP</b> untuk mencari perangkat dengan IP tersebut.',
		'Permintaan ARP dikirim sebagai <b>broadcast</b> pada jaringan lokal. Printer membalas dengan MAC-nya. Laptop menyimpan pemetaan itu sementara dalam tabel ARP.',
		'[fyi] Dalam jaringan Ethernet, label MAC mengantar frame ke persinggahan berikutnya. Router membuat frame baru saat meneruskan paket. Alamat IP biasanya tetap, kecuali ada penerjemahan seperti [[NAT|network/nat]]. Ini menghubungkan [[layer 2 dan layer 3|networking/layers]].',
		'[ingat] IP membantu memilih tujuan perjalanan. MAC membantu mengantar ke tetangga di jaringan lokal. ARP mencocokkan IP dengan MAC tetangga itu. MAC bisa berubah, jadi jangan anggap ia identitas permanen seseorang.',
		'Cari MAC printer dengan ARP, lalu kirim nimbus.pdf ke printer itu.'
	],
	reactions: {
		reply:
			'Semua dengar pertanyaannya, tapi cuma printer yang bilang "itu aku" dan mengirim balik MAC nya. Yang lain cuek saja. Laptopmu langsung mencatat jawabannya di tabel ARP.',
		print:
			'Sekarang cetakan langsung dikirim ke papan nama printer, tanpa teriak. TV dan HP bahkan nggak melihatnya. Coba tanya beberapa alamat lain.',
		tv: 'TV pemilik 192.168.1.30, jadi kali ini TV yang menjawab. Satu baris lagi di tabel, satu teriakan lebih sedikit nanti.',
		nobody:
			'Tidak ada perangkat yang menjawab untuk 192.168.1.99. Periksa apakah perangkat aktif dan alamat tujuannya benar.',
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
		shouting: 'Permintaan ARP dikirim ke jaringan lokal',
		answered: 'Cuma pemilik IP itu yang menjawab',
		printing: 'Kali ini dikirim ke satu MAC saja',
		printed: 'Diantar lewat papan nama, langsung ke printer',
		cached: 'Pemetaan masih tersedia di tabel ARP',
		nobody: 'Tidak ada balasan ARP untuk IP ini'
	}
};
