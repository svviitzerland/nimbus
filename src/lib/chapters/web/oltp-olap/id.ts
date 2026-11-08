import type { OltpOlapText } from './types';

export const id: OltpOlapText = {
	title: 'OLTP dan OLAP',
	intro: [
		'Toko di nimbus.com lagi ramai. Tiap beberapa detik ada yang tekan beli, dan satu pesanan baru masuk ke <b>database aplikasi</b>, database yang diajak ngobrol sama website. Lihat pesanannya berdatangan.',
		'Tiap pesanan itu kerjaan kecil. Tulis satu baris, mungkin baca satu baris lagi, selesai dalam beberapa milidetik. Banyak penulisan kecil dan cepat sepanjang hari begini namanya <b>OLTP</b> (Online Transaction Processing).',
		'Lalu bos datang dengan pertanyaan besar. Berapa penjualan kita tiap bulan tahun ini? Itu artinya membaca jutaan baris sekaligus. Kalau dijalankan di database aplikasi, checkout jadi lambat buat semua pembeli.',
		'Jadi pertanyaan besar dikasih tempat sendiri. Database kedua, yang dibuat khusus untuk membaca data dalam jumlah raksasa, menjawabnya sementara toko tetap jualan. Sisi ini namanya <b>OLAP</b> (Online Analytical Processing).',
		'Kenapa OLAP bisa baca secepat itu? Rahasianya di cara data disimpan di disk. Database aplikasi pakai <b>row storage</b>, tiap pesanan disimpan utuh dalam satu blok. Ambil satu pesanan cukup sekali baca, tapi menjumlah semua total berarti membuka semua blok.',
		'OLAP pakai <b>column storage</b>. Semua id dikumpulkan jadi satu, semua item jadi satu, semua total jadi satu. Menjumlah semua total sekarang cukup buka satu blok, tapi ambil satu pesanan utuh jadi lambat. Masing masing jago di tugasnya sendiri.',
		'Database analitik ini punya nama, <b>data warehouse</b>. Dia mengumpulkan data dari banyak tempat (pesanan, user, bahkan iklan) supaya semua pertanyaan besar bisa dijawab di satu tempat.',
		'Gimana datanya bisa sampai ke sana? Tiap malam ada pekerjaan bernama <b>ETL</b> yang menyalinnya. <b>Extract</b> mengambil baris baru, <b>Transform</b> merapikannya, dan <b>Load</b> memasukkannya ke warehouse. Paginya grafiknya sudah segar.',
		'[ingat] OLTP itu <b>kasir</b>, cepat melayani satu pembeli sekali jalan. OLAP itu <b>akuntan</b> di akhir bulan, pelan pelan membaca semua struk. T untuk transaksi, A untuk analitik.',
		'[fyi] Nama nama ini bakal sering kamu temui. PostgreSQL dan MySQL biasanya menjalankan sisi aplikasi, sedangkan BigQuery, Snowflake, dan ClickHouse populer sebagai warehouse. SQL yang sama yang sudah kamu kenal, cuma dibuat untuk tugas yang beda.'
	],
	reactions: {},
	panels: [
		{
			tag: 'Database aplikasi',
			title: 'Pesanan berdatangan',
			body: 'Website menyimpan tiap pesanan ke database aplikasi saat itu juga. Pembeli maunya semua terasa instan.'
		},
		{
			tag: 'OLTP',
			title: 'Banyak kerjaan kecil dan cepat',
			body: 'Tiap pesanan cuma menyentuh <b>satu baris</b>. Ribuan per menit, masing masing selesai dalam milidetik.'
		},
		{
			tag: 'Masalahnya',
			title: 'Pertanyaan besar',
			body: 'Penjualan per bulan berarti membaca <b>semua pesanan setahun</b>. Selama database sibuk dengan itu, pembeli harus menunggu.'
		},
		{
			tag: 'OLAP',
			title: 'Tempat untuk pertanyaan besar',
			body: 'Analitik punya database sendiri. Dia bisa mengunyah jutaan baris dan toko nggak merasakan apa apa.'
		},
		{
			tag: 'Row storage',
			title: 'Satu pesanan per blok',
			body: 'Tiap pesanan disimpan utuh. Pas banget untuk membaca atau menulis <b>satu pesanan</b>, tapi lambat untuk menjumlah satu kolom dari semuanya.'
		},
		{
			tag: 'Column storage',
			title: 'Satu kolom per blok',
			body: 'Tiap kolom disimpan bareng. Pas banget untuk menjumlah <b>satu kolom</b> dari jutaan baris, tapi lambat untuk mengambil satu pesanan utuh.'
		},
		{
			tag: 'Warehouse',
			title: 'Semua di satu tempat',
			body: '<b>Data warehouse</b> mengumpulkan data dari banyak sistem, sudah dirapikan dan siap untuk pertanyaan, grafik, dan laporan.'
		},
		{
			tag: 'ETL',
			title: 'Shift malam',
			body: '<b>E</b>xtract baris baru, <b>T</b>ransform (rapikan format, buang pesanan uji coba), <b>L</b>oad ke warehouse. Biasanya saat semua orang tidur.'
		},
		{
			tag: 'Cara ingat',
			title: 'Kasir dan akuntan',
			body: 'OLTP menulis kecil dan cepat, sepanjang hari. OLAP membaca besar dan dalam, beberapa kali sehari.'
		},
		{
			tag: 'Nama asli',
			title: 'Siapa mengerjakan apa',
			body: 'Database aplikasi seperti PostgreSQL dan MySQL untuk OLTP. Warehouse seperti BigQuery, Snowflake, dan ClickHouse untuk OLAP.'
		}
	],
	shoppers: 'Pembeli',
	appDb: 'Database aplikasi',
	analytics: 'Analitik',
	warehouse: 'Data warehouse',
	etl: 'ETL',
	clock: 'jam 2 pagi',
	busy: 'sibuk',
	ordersTable: 'orders',
	columns: { id: 'id', item: 'item', total: 'total' },
	orders: [
		{ id: 5012, item: 'Nimbus Tee', total: 89 },
		{ id: 5013, item: 'Nimbus Mug', total: 45 },
		{ id: 5014, item: 'Cloud Cap', total: 65 },
		{ id: 5015, item: 'Tote Bag', total: 39 }
	],
	ordersToday: 'Pesanan hari ini',
	locale: 'id-ID',
	writeTag: '1 baris, 2 ms',
	question: 'Berapa penjualan kita tiap bulan tahun ini?',
	questionLabel: 'Pertanyaan besar',
	reading: 'Membaca {n} baris',
	slowNote: 'Pembeli tertahan di checkout',
	months: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
	answerNote: 'Dijawab analitik, toko tetap lancar',
	rowStore: 'Row storage',
	colStore: 'Column storage',
	blockLabel: 'blok',
	readOne: 'Baca pesanan 5013',
	readSum: 'Jumlahkan semua total',
	opened: 'Membuka {n} blok',
	sources: ['orders', 'users', 'ads'],
	warehouseNote: 'Satu tempat untuk semua pertanyaan besar',
	etlSteps: [
		{ key: 'E', name: 'Extract', say: 'Salin pesanan baru kemarin' },
		{ key: 'T', name: 'Transform', say: 'Rapikan, buang pesanan uji coba' },
		{ key: 'L', name: 'Load', say: 'Masukkan ke warehouse' }
	],
	oltp: {
		name: 'OLTP',
		full: 'sisi aplikasi',
		like: 'si kasir',
		points: ['Banyak tulisan kecil', 'Satu baris sekali jalan', 'Selesai dalam milidetik'],
		examples: ['PostgreSQL', 'MySQL']
	},
	olap: {
		name: 'OLAP',
		full: 'sisi analitik',
		like: 'si akuntan',
		points: ['Sedikit bacaan raksasa', 'Jutaan baris', 'Beberapa detik nggak apa apa'],
		examples: ['BigQuery', 'Snowflake', 'ClickHouse']
	},
	examplesLabel: 'Pilihan populer'
};
