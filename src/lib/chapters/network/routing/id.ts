import type { RoutingText } from './types';

export const id: RoutingText = {
	title: 'Router dan routing',
	intro: [
		'Waktu kamu buka nimbus.com, laptopmu ngebungkus permintaannya jadi amplop kecil yang namanya <b>paket</b> (udah ketemu di [[Lapisan dan paket|networking/layers]]). Tuh, paketnya lagi nangkring di laptop, siap berangkat.',
		'Paketnya nggak pernah terbang langsung ke server. Pertama dia lompat ke kotak di rumah, namanya <b>router</b>. Router ada di tiap titik kabel ketemu, kayak persimpangan jalan.',
		'Sekarang dia nyampe di router milik provider internetmu. Router baca alamat di labelnya, cuma labelnya aja. Amplopnya nggak pernah dibuka.',
		'Di samping tiap router ada papan penunjuk jalan, namanya <b>tabel routing</b>. Tiap panahnya bilang "buat alamat ini, lewat jalan itu". Panah buat nimbus.com nunjuk ke router berikutnya.',
		'Jadi router ngoper paketnya, terus langsung lupa. Router berikutnya baca label, cek papannya sendiri, dan ngelakuin hal yang sama. Lompat demi lompat, paketnya nyampe.',
		'[ingat] Router itu kayak kantor pos yang nyortir surat. Baca alamatnya, taruh di jalur yang bener, selesai. Nggak ada satu kantor pos pun yang nganterin surat itu sampai tujuan sendirian.',
		'Terus kalau nggak ada panah yang cocok? Router nggak pernah nebak, paketnya dibuang. Makanya hampir semua router punya satu panah bertulisan "selain itu", namanya <b>default route</b>. Router di rumahmu hampir cuma pakai panah itu, semuanya dioper ke provider.',
		'[fyi] Kata sama, dunia beda. Jaringan di cloud (sebuah [[VPC|networking/vpc]]) juga punya route table. Barisnya diisi dari halaman web, bukan dari kotak fisik, tapi idenya persis sama.',
		'Itulah routing, deretan papan penunjuk jalan. Kalau penasaran, robohin papan di router provider dan lihat nasib paket berikutnya.'
	],
	reactions: {
		knocked:
			'Hilang. Router provider baca labelnya, nggak nemu panah buat nimbus.com, dan paketnya dibuang di situ juga. Satu baris yang hilang bisa bikin satu website nggak kebuka.',
		fixed:
			'Papannya berdiri lagi, paketnya ngalir lagi. Makanya orang jaringan ngejaga tabel routing mereka baik baik.'
	},
	steps: [
		{
			title: 'Paket',
			body: 'Amplop kecil berisi data. Labelnya bawa alamat tujuan, di sini server nimbus.com di <b>203.0.113.10</b>.'
		},
		{
			title: 'Router',
			body: 'Kotak yang duduk di tempat jaringan ketemu. Tugasnya cuma satu, mindahin tiap paket selangkah lebih dekat ke tujuannya.'
		},
		{
			title: 'Baca label',
			body: 'Router cuma ngelihat alamat tujuan. Isi paketnya nggak penting buat dia.'
		},
		{
			title: 'Tabel routing',
			body: 'Daftar pendek di dalam router. Tiap baris masangin satu tujuan dengan tetangga yang harus dioperin, namanya <b>next hop</b>.'
		},
		{
			title: 'Lompat demi lompat',
			body: 'Nggak ada router yang tahu seluruh jalan. Masing masing cuma tahu langkah berikutnya, dan barengan itu udah cukup.'
		},
		{
			tag: 'Pegangan',
			title: 'Baca, pilih, oper',
			body: 'Baca alamatnya, pilih panah yang cocok, oper ke next hop. Semua router cuma ngerjain ini.'
		},
		{
			title: 'Default route',
			body: 'Baris "sisanya". Apa pun yang nggak dikenal tabel dikirim ke provider, yang tahu jauh lebih banyak jalan.'
		},
		{
			title: 'Ada juga di cloud',
			body: 'Jaringan cloud punya <b>route table</b> yang kerjanya sama. Bedanya kamu ngeditnya dari halaman web.'
		},
		{
			title: 'Satu panah hilang',
			body: 'Tanpa baris yang cocok, paketnya dibuang saat itu juga. Router nggak pernah nebak.'
		}
	],
	laptopLabel: 'Laptopmu',
	homeRouter: 'Router rumah',
	ispRouter: 'Router provider',
	nextRouter: 'Router berikutnya',
	otherLabel: 'Jaringan lain',
	serverLabel: 'nimbus.com',
	serverSub: '203.0.113.10',
	packetTo: 'ke 203.0.113.10',
	signNimbus: 'nimbus.com',
	signOther: 'lainnya',
	signDefault: 'selain itu',
	droppedTag: 'dibuang',
	knockBtn: 'Robohin papannya',
	fixBtn: 'Berdiriin lagi'
};
