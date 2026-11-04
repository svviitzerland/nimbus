import type { HistoryText } from './types';

export const id: HistoryText = {
	title: 'Sejarah komputer',
	intro: [
		'Jauh sebelum ada mesin, orang berhitung pakai jari. Lalu pakai kerikil, lalu muncul <b>sempoa</b> (abakus), manik manik yang digeser di batang. Cukup beberapa sentilan, pedagang bisa menjumlah penjualan seharian.',
		'Ini fakta yang seru. Selama ratusan tahun, <b>komputer</b> itu bukan mesin, tapi orang. Komputer adalah sebutan untuk orang yang pekerjaannya menghitung panjang panjang pakai tangan, halaman demi halaman.',
		'Tahun 1830an, penemu dari Inggris bernama <b>Charles Babbage</b> merancang Analytical Engine, mesin dari roda gigi kuningan yang bisa mengikuti instruksi dari kartu berlubang. Temannya, <b>Ada Lovelace</b>, menulis rencana supaya mesin itu menghitung deret angka yang rumit, dan rencana itu sering disebut program komputer pertama di dunia.',
		'Tahun 1936, matematikawan muda bernama <b>Alan Turing</b> membayangkan mesin sederhana yang membaca dan menulis simbol di pita kertas panjang, mengikuti daftar aturan. Ide besarnya, satu mesin bisa menjalankan daftar aturan <i>apa saja</i> yang kamu berikan. Itulah yang dilakukan semua komputer sekarang.',
		'Lalu Perang Dunia II datang. Di Bletchley Park, Inggris, Turing dan timnya merancang mesin yang membantu memecahkan Enigma, kode rahasia pasukan Jerman. Karya ini, ditambah idenya tahun 1936, yang bikin dia sering disebut salah satu bapak ilmu komputer.',
		'Tahun 1945, <b>ENIAC</b> selesai dibangun di Amerika Serikat. Besarnya satu ruangan penuh, beratnya sekitar 27 ton, dan pakai kira kira 18.000 tabung vakum yang menyala sebagai saklarnya. Memprogramnya berarti mencolok kabel satu per satu, dan beberapa programmer pertamanya adalah perempuan seperti Betty Snyder.',
		'Tabung vakum itu besar, panas, dan sering putus. Tahun 1947, ilmuwan di Bell Labs menemukan <b>transistor</b>, saklar mungil tanpa kaca dan tanpa nyala. Tugasnya sama, ukurannya jauh lebih kecil.',
		'Komputer di masa itu cuma paham angka, jadi manusia yang repot. <b>Grace Hopper</b> yakin komputer harusnya bisa paham kata kata yang mirip bahasa Inggris. Tahun 1952 dia membuat salah satu <b>compiler</b> pertama (program yang mengubah kata jadi angka mesin), dan idenya kemudian tumbuh jadi bahasa bernama COBOL. Timnya pernah menemukan ngengat sungguhan nyangkut di dalam komputer, lalu menempelkannya di buku catatan, bug yang benar benar serangga.',
		'Tahun 1958 dan 1959, Jack Kilby dan Robert Noyce masing masing menemukan cara menaruh banyak transistor di satu kepingan kecil, yaitu <b>microchip</b>. Sekarang, chip seukuran kuku jarimu berisi miliaran transistor.',
		'Berkat chip, komputer jadi cukup kecil dan murah untuk ditaruh di meja. Tahun 1977 muncul Apple II, lalu IBM PC tahun 1981, dan <b>komputer pribadi</b> mulai masuk ke rumah dan sekolah.',
		'Komputer sudah saling ngobrol lewat internet, lalu tahun 1991 Tim Berners-Lee di CERN (laboratorium sains besar di Eropa) membuka website pertama untuk dunia. <b>World Wide Web</b> mengubah jaringan itu jadi halaman yang bisa dikunjungi siapa saja dengan sekali klik.',
		'Lalu tahun 2007, iPhone menunjukkan ke dunia seperti apa <b>smartphone</b> itu. HP di sakumu jutaan kali lebih cepat dari ENIAC, dan muat di satu genggaman.',
		'[ingat] <b>Makin kecil, makin sakti.</b> Ruangan, meja, saku. ENIAC sebesar ruangan, PC muat di meja, dan sekarang komputer ada di sakumu.',
		'Mesinnya berubah banyak, tapi di dalamnya, bagian bagiannya masih mengerjakan tugas yang sama. Berikutnya, kita [[bongkar satu|basics/hardware]] dan lihat isinya. Kalau mau mampir lagi ke satu zaman, ketuk titik di garis waktunya.'
	],
	reactions: {
		peek: 'Ide bagus, lihat sekali lagi bikin makin nempel. Jalan jalan sepuasnya, lalu kita lanjut membongkar sebuah laptop.'
	},
	eras: [
		{
			mark: 'Dulu sekali',
			title: 'Sempoa',
			body: 'Manik manik di batang, tiap batang mewakili satuan, puluhan, ratusan. Menggeser manik itu seperti menghitung pakai jari, cuma lebih cepat. Sudah dipakai ribuan tahun.'
		},
		{
			mark: '1613',
			title: 'Komputer manusia',
			body: 'Kata <b>computer</b> pertama kali tercatat tahun 1613, artinya orang yang menghitung. Mereka bekerja beramai ramai di satu ruangan, menghitung tabel untuk kapal, sains, dan belakangan penerbangan luar angkasa, cuma pakai kertas dan pensil.'
		},
		{
			mark: '1843',
			title: 'Analytical Engine',
			body: 'Rancangan mesin roda gigi yang membaca instruksi dari kartu berlubang, ide yang dipinjam dari mesin tenun. Mesinnya nggak pernah selesai dibangun, tapi Ada Lovelace sadar mesin ini bisa lebih dari sekadar menjumlah.'
		},
		{
			mark: '1936',
			title: 'Mesin untuk aturan apa saja',
			body: 'Turing menggambarkan mesin dengan pita panjang dan kepala yang membaca, menulis, lalu bergeser, satu aturan sekali jalan. Mesin <b>universal</b> bisa menjalankan aturan mesin lain mana pun. Itulah ide dasar software.'
		},
		{
			mark: '1940an',
			title: 'Bletchley Park',
			body: 'Selama perang, para pemecah kode di sana memakai mesin bernama <b>Bombe</b> untuk mencoba ribuan kemungkinan setelan Enigma dengan cepat, melanjutkan karya para matematikawan Polandia sebelumnya.'
		},
		{
			mark: '1945',
			title: 'ENIAC',
			body: 'Salah satu komputer elektronik serba guna pertama. Dia bisa sekitar 5.000 penjumlahan per detik, luar biasa di zamannya. Saklarnya berupa <b>tabung vakum</b>, bohlam kaca yang panas dan gampang putus.'
		},
		{
			mark: '1947',
			title: 'Transistor',
			body: 'Saklar mungil dari bahan padat, bukan bohlam kaca. Dia bisa nyala dan mati dengan panas yang jauh lebih sedikit, jadi mesin bisa lebih kecil, lebih adem, dan jauh lebih awet.'
		},
		{
			mark: '1952',
			title: 'Bicara pakai kata',
			body: '<b>Compiler</b> adalah program yang mengubah kata kata yang bisa dibaca manusia jadi angka yang dijalankan mesin. Grace Hopper termasuk yang pertama membuatnya, dan ikut membentuk bahasa COBOL.'
		},
		{
			mark: '1958',
			title: 'Microchip',
			body: 'Banyak transistor beserta kabelnya dibuat sekaligus di satu kepingan kecil. Satu chip menggantikan sekotak penuh komponen terpisah, makanya komputer terus mengecil.'
		},
		{
			mark: '1977',
			title: 'Komputer pribadi',
			body: 'Komputer untuk satu orang, lengkap dengan keyboard dan layar, di atas meja biasa. Di tahun 1970an dan 1980an, keluarga dan sekolah mulai punya sendiri.'
		},
		{
			mark: '1991',
			title: 'World Wide Web',
			body: 'Halaman halaman yang saling terhubung lewat link, bisa dibuka siapa saja di browser. <b>Internet</b> itu jalan antar komputer, <b>web</b> itu halaman yang lewat di jalan itu.'
		},
		{
			mark: '2007',
			title: 'Smartphone',
			body: 'Komputer lengkap dengan layar sentuh, kamera, dan internet, cukup kecil untuk masuk saku. Di dalam chipnya ada miliaran transistor.'
		},
		{
			mark: 'Kini',
			title: 'Makin kecil, makin sakti',
			body: 'Patokannya gampang, <b>ruangan, meja, saku</b>. Tiap saklar baru lebih kecil dari sebelumnya, jadi makin banyak yang muat, dan makin banyak saklar artinya makin kuat.'
		}
	],
	photos: {
		babbage: { alt: 'Foto potret Charles Babbage', caption: 'Charles Babbage, 1860' },
		lovelace: { alt: 'Lukisan potret Ada Lovelace', caption: 'Ada Lovelace, sekitar 1840' },
		turing: { alt: 'Foto Alan Turing saat remaja', caption: 'Alan Turing, sekitar 1928' },
		eniac: {
			alt: 'Glen Beck dan Betty Snyder memprogram ENIAC, dinding lemari dan kabel',
			caption: 'Glen Beck dan Betty Snyder di ENIAC, sekitar 1947'
		},
		hopper: { alt: 'Foto potret Grace Hopper berseragam', caption: 'Grace Hopper, 1984' }
	},
	timeline: 'Garis waktu komputer'
};
