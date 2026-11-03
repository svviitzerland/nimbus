import type { DynamicRoutingText } from './types';

export const id: DynamicRoutingText = {
	title: 'Routing dinamis',
	intro: [
		'Di [[Router dan routing|network/routing]] kamu nulis rute pakai tangan. Buat tiga router sih aman. Tapi ISP punya ribuan router, dan hampir tiap hari ada kabel yang kepotong ekskavator di suatu tempat.',
		'Kalau semua rute ditulis manual, tiap kali ada kabel putus harus ada orang yang bangun jam tiga pagi buat benerin puluhan tabel. Nggak bakal kekejar.',
		'Jadi router ngobrol satu sama lain. Tiap router cerita ke tetangganya jalan apa aja yang dia punya dan seberapa panjang. Kalau ada jalan putus, kabarnya nyebar, dan tiap router nyari jalan baru sendiri. Itulah <b>routing dinamis</b>.',
		'Di dalam satu perusahaan, bahasa yang umum dipakai namanya <b>OSPF</b> (Open Shortest Path First). Tiap router hafal peta seluruh jaringan perusahaan, tiap link dikasih <b>cost</b> (makin kecil makin cepat), dan jalur yang paling murah yang menang.',
		'Antar jaringan besar di internet (ISP kamu, Google, Facebook, masing masing disebut <b>autonomous system</b> dan punya nomor sendiri) bahasanya <b>BGP</b> (Border Gateway Protocol). Tiap jaringan mengumumkan "alamat alamat ini bisa dicapai lewat aku", dan seluruh internet percaya aja.',
		'Kepercayaan itu kuat sekaligus rapuh. Tanggal 4 Oktober 2021, satu perintah rutin bikin Facebook, Instagram, dan WhatsApp lenyap dari seluruh internet sekitar enam jam. Kamu bakal ngulang kejadiannya.',
		'Babak satu, potong link di jaringan perusahaan dan lihat OSPF nyari jalan baru. Babak dua, zoom out ke internet dan alami lagi tumbangnya Facebook momen demi momen.'
	],
	reactions: {
		rerouted:
			'Kres! Router di sebelah potongan sadar duluan, ngabarin tetangganya, dan kabarnya banjir ke seluruh jaringan dalam sekejap. Semua ngitung ulang, dan trafik sekarang lewat jalan termurah berikutnya. Nggak ada satu tabel pun yang disentuh manusia.',
		sameRoad:
			'Router tetap nyebarin kabarnya, tapi kabel itu bukan bagian dari jalan termurah, jadi trafiknya tetap lewat jalan yang sama. Coba potong salah satu link yang biru.',
		restoredLink:
			'Link itu nyambung lagi, dan router balik ke jalan termurah dengan sendirinya juga.',
		noPath:
			'Udah nggak ada jalan sama sekali. Protokol secanggih apa pun nggak bisa nyiptain kabel, makanya jaringan beneran selalu dibangun dengan link cadangan. Sambungin satu lagi yuk.',
		bgpAct:
			'Sekarang zoom out. Tiap kotak di sini adalah satu jaringan utuh. Sebelum ada yang rusak, buka facebook.com dari HP kamu dan lihat masih jalan.',
		tryOk:
			'Kebuka. Di balik layar HP kamu nanya alamatnya dulu ke server [[DNS|networking/dns]] milik Facebook sendiri, dan ISP kamu tahu jalan ke sana cuma karena Facebook mengumumkannya lewat BGP.',
		backbone:
			'Sebuah perintah yang tujuannya ngukur kapasitas backbone malah ngelakuin hal lain. Semua link antar data center Facebook putus sekaligus. Ada alat pengaman yang harusnya ngeblok perintah itu, tapi alatnya punya bug dan malah meloloskannya.',
		withdraw:
			'Server DNS Facebook nggak bisa ngehubungin data center mana pun, jadi mereka nganggap diri sendiri rusak dan berhenti mengumumkan diri lewat BGP (mereka memang dirancang begitu). Dalam hitungan menit, semua jaringan di bumi lupa jalan ke sana.',
		tryFail:
			'HP kamu nanya facebook.com ada di mana, dan nggak ada yang tahu jalan buat nanya. Bukan lemot, tapi hilang. Facebook, Instagram, WhatsApp, dan Messenger sekaligus, sementara resolver di mana mana kebanjiran percobaan ulang.',
		onsite:
			'Bagian paling nyebelin, alat internal Facebook sendiri jalan di jaringan yang sama yang lagi rusak, jadi nggak ada yang bisa dibenerin dari jauh. Engineer harus masuk ke data center langsung, padahal gedungnya memang dirancang supaya susah banget dimasuki.',
		restored:
			'Sekitar enam jam kemudian backbone pulih, server DNS mengumumkan diri lagi, dan BGP nyebarin kabarnya ke seluruh dunia dalam hitungan menit. Satu perintah, satu pengumuman yang ditarik, dan miliaran orang ngerasain dampaknya.'
	},
	acts: ['OSPF', 'BGP'],
	actLabel: 'Babak {n}',
	nextAct: 'Lanjut ke BGP',
	ospf: {
		routers: ['Jakarta', 'Bandung', 'Semarang', 'Yogyakarta', 'Surabaya'],
		startTag: 'kantor',
		endTag: 'server',
		cutHint: 'Tiap angka itu cost link. Ketuk satu buat motong kabelnya.',
		pathLabel: 'Jalur sekarang',
		costLabel: 'cost {n}',
		noPath: 'Nggak ada jalan ke Surabaya',
		flooding: 'Router lagi saling ngabarin soal perubahannya',
		restoreBtn: 'Benerin semua kabel',
		cutAria: 'Potong atau sambung link antara {a} dan {b}'
	},
	bgp: {
		phoneLabel: 'HP kamu',
		ispLabel: 'ISP kamu',
		netLabel: 'Internet',
		fbLabel: 'Jaringan Facebook',
		dnsLabel: 'Server DNS',
		dcLabel: 'Data center',
		tableTitle: 'Yang dipelajari ISP kamu lewat BGP',
		routeEntry: 'DNS Facebook, lewat AS32934',
		withdrawn: 'ditarik',
		tryBtn: 'Buka facebook.com',
		tryOk: 'facebook.com kebuka',
		tryFail: 'facebook.com nggak ketemu',
		steps: [
			{
				btn: 'Jalankan perintah maintenance',
				time: '4 Oktober 2021, sekitar pukul 15.40 UTC (22.40 WIB)',
				note: 'Backbone antar data center padam'
			},
			{
				btn: 'Server DNS ngecek dirinya',
				time: 'Beberapa menit kemudian',
				note: 'Pengumuman BGP ditarik'
			},
			{
				btn: 'Kirim engineer ke lokasi',
				time: 'Beberapa jam berikutnya',
				note: 'Engineer berangkat ke data center langsung'
			},
			{
				btn: 'Pulihkan backbone',
				time: 'Sekitar enam jam sejak awal',
				note: 'Diumumkan lagi, dunia nemu Facebook lagi'
			}
		],
		startNote: 'Senin biasa, semua diumumkan dan bisa dicapai'
	}
};
