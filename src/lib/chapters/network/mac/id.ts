import type { MacText } from './types';

export const id: MacText = {
	title: 'MAC address dan ARP',
	intro: [
		'Bayangkan kantor nimbus.com. Ada laptop, printer, TV, dan HP yang berbagi satu jaringan di dalam ruangan. Jaringan kecil seperti ini namanya <b>LAN</b> (local area network, jaringan lokal).',
		'Masing masing dapat [[alamat IP|network/ip-address]] waktu bergabung, misalnya 192.168.1.20 untuk printer. Anggap saja itu alamat meja tempat dia duduk.',
		'Tapi tiap kartu jaringan juga membawa nomor kedua yang dipasang dari pabrik. Namanya <b>MAC address</b>, enam pasang huruf dan angka, dan nggak boleh ada dua kartu di dunia yang sama.',
		'[ingat] Biar gampang bedainnya, MAC itu label nama yang dijahit di baju, ikut ke mana pun dan nggak pernah ganti. IP itu alamat yang dikasih, jadi ganti kalau kamu pindah. Lihat HP ini pindah dari kantor ke kafe.',
		'Sekarang laptopmu mau mencetak. Dia tahu printer ada di 192.168.1.20, tapi di dalam ruangan kabel mengantar berdasarkan label nama. Jadi dia tanya keras keras ke seluruh ruangan, "siapa yang punya 192.168.1.20?" Pertanyaan itu namanya <b>ARP</b>.',
		'Semua mendengar (pesan ke semua orang namanya <b>broadcast</b>), tapi cuma printer yang menjawab dengan label namanya. Laptop mencatatnya di <b>tabel ARP</b>, biar lain kali nggak perlu nanya lagi.',
		'Sekarang cetakan langsung dikirim ke satu label nama itu. TV dan HP bahkan nggak melihatnya. Keluarlah nimbus.pdf.',
		'[fyi] MAC cuma berlaku di dalam satu ruangan. Begitu paket keluar lewat router, label nama nya diganti di tiap persinggahan, sedangkan IP nya tetap sama sampai tujuan. Itulah batas antara layer 2 dan layer 3 di [[pelajaran lapisan|networking/layers]].',
		'Itu saja triknya, tanya pakai IP, antar pakai MAC. Kalau penasaran, coba tanya ruangan soal alamat yang nggak dimiliki siapa pun.'
	],
	reactions: {
		nobody:
			'Sepi. Nggak ada yang punya 192.168.1.99 di ruangan ini, jadi nggak ada yang menjawab dan laptop menyerah. Kalau perangkat di LAN kayaknya nggak bisa dihubungi, ARP yang sepi begini sering jadi penyebabnya.'
	},
	steps: [
		{
			title: 'Satu ruangan, satu LAN',
			body: 'Perangkat di ruangan yang sama tersambung lewat switch atau WiFi, dan bisa saling bicara langsung.'
		},
		{
			title: 'Alamat IP',
			tag: 'dikasih',
			body: 'Alamat yang diberikan jaringan waktu perangkat bergabung. Isinya <b>di mana</b> perangkat itu sekarang.'
		},
		{
			title: 'MAC address',
			tag: 'bawaan',
			body: 'Label nama dari pabrik, misalnya <b>00:1B:A9:4C:22:10</b>. Isinya <b>siapa</b> perangkat itu.'
		},
		{
			title: 'Label tetap, alamat ganti',
			tag: 'biar nempel',
			body: 'HP yang sama, label nama yang sama. Jaringan baru memberinya IP baru.'
		},
		{
			title: 'ARP, bertanya ke ruangan',
			body: 'Laptop punya IP nya tapi butuh MAC nya, jadi dia kirim satu pertanyaan ke semua perangkat di ruangan.'
		},
		{
			title: 'Cuma pemiliknya yang jawab',
			body: 'Printer membalas dengan MAC nya. Laptop menyimpan pasangan itu (IP dan MAC) di tabel ARP selama beberapa menit.'
		},
		{
			title: 'Diantar pakai label nama',
			body: 'Setelah MAC diketahui, data dikirim ke satu perangkat itu saja. Nggak perlu teriak lagi.'
		},
		{
			title: 'Cuma di dalam satu ruangan',
			tag: 'info',
			body: 'Label MAC cuma berlaku di dalam ruangan. Yang membawa paket menyeberangi internet adalah alamat IP.'
		},
		{
			title: 'Tanya pakai IP, antar pakai MAC',
			tag: 'giliranmu',
			body: 'Opsional. Tanya soal <b>192.168.1.99</b> dan lihat ruangannya tetap sepi.'
		}
	],
	roomLabel: 'LAN di kantor nimbus.com',
	names: { you: 'Laptopmu', printer: 'Printer', tv: 'TV', phone: 'HP' },
	officeLabel: 'WiFi kantor',
	cafeLabel: 'WiFi kafe',
	shout: 'siapa yang punya {ip}?',
	itsMe: 'itu aku',
	silence: 'nggak ada yang jawab',
	printed: 'tercetak',
	tableTitle: 'Tabel ARP laptopmu',
	ipHead: 'IP',
	macHead: 'MAC',
	ghostBtn: 'Tanya siapa yang punya {ip}'
};
