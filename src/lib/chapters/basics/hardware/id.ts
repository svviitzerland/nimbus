import type { HardwareText } from './types';

export const id: HardwareText = {
	title: 'Komponen komputer',
	intro: [
		'Ingat kan, komputer makin lama makin kecil? Sekarang satu komputer utuh muat di dalam laptop tipis ini. Dari luar cuma kelihatan <b>layar</b>, <b>keyboard</b>, dan touchpad. Terus, otaknya di mana ya?',
		'Yuk kita buka. Sekrupnya dilepas, bagian keyboard diangkat, dan... taraa! Ternyata di dalamnya ramai. Semua bagian ini punya tugas sendiri, dan kita kenalan satu per satu.',
		'Papan besar tempat semuanya menempel itu namanya <b>motherboard</b>. Anggap saja jalanan di sebuah kota kecil. Semua bagian tinggal di situ, dan jalur tembaga yang tipis mengantar pesan dari satu bagian ke bagian lain.',
		'Di tengahnya ada <b>CPU</b> (central processing unit), si otak. Dia membaca instruksi satu per satu lalu menjalankannya, miliaran langkah kecil tiap detik. Jauh di dalam, dia cuma paham nyala dan mati ([[bit|basics/binary]]).',
		'Tepat di sebelahnya ada keping <b>RAM</b> (random access memory). RAM itu meja kerja, tempat semua yang sedang kamu pakai ditaruh supaya gampang dijangkau. Cepat banget, tapi dia lupa semuanya begitu listrik mati.',
		'Keping kecil itu <b>storage</b>, namanya SSD (komputer lama pakai hard disk yang berputar). Storage itu lemari. Foto, aplikasi, dan game kamu tetap aman di sana walaupun komputernya dimatikan.',
		'Lihat apa yang terjadi waktu kamu membuka game. Gamenya diambil dari lemari, ditaruh di atas meja, lalu CPU mengerjakannya dari situ. Jeda sebentar waktu loading itu ya perjalanan ini.',
		'[ingat] <b>RAM itu meja, storage itu lemari.</b> Listrik mati, meja jadi bersih, lemari tetap penuh. Makanya ada tombol simpan, menyimpan artinya mengembalikan kerjaanmu ke lemari.',
		'Chip yang ini namanya <b>GPU</b> (graphics processing unit). Dia yang menggambar semua yang kamu lihat, jutaan titik kecil di layar, berkali kali tiap detik. Game dan video bikin dia sibuk banget.',
		'Yang paling besar, di bawah tempat tangan bersandar, itu <b>baterai</b>. Dia mengalirkan listrik ke semua bagian lewat motherboard. Komputer meja pakai power supply yang dicolok ke dinding, tugasnya sama.',
		'Kita pasang lagi keyboardnya. Nah, begini cara kamu dan komputer ngobrol. <b>Keyboard</b> itu <b>input</b>, dia mengirim tombol yang kamu tekan ke dalam. <b>Layar</b> itu <b>output</b>, dia menunjukkan hasilnya. Tekan tombol, CPU mendengarnya, lalu hurufnya muncul.',
		'Itulah satu tim lengkap. Bahkan [[server|foundations/server]] yang besar juga dibangun dari bagian yang sama. Ketuk bagian mana saja kalau mau lihat lagi, lalu kita cari tahu gimana CPU berpikir cuma pakai 0 dan 1.'
	],
	reactions: {
		peek: 'Nah, muncul lagi. Lihat lihat sepuasnya, gambarnya nggak keberatan kok.'
	},
	steps: [
		{
			tag: 'Laptop',
			title: 'Laptop utuh',
			body: 'Yang kamu lihat sehari hari cuma bagian luarnya, yaitu <b>layar</b>, <b>keyboard</b>, dan <b>touchpad</b>. Bagian yang benar benar bekerja tersembunyi di dalam bodinya.'
		},
		{
			tag: 'Dibuka',
			title: 'Isi sebuah laptop',
			body: 'Di bawah keyboard ada <b>motherboard</b> dengan chip chipnya, <b>kipas</b> pendingin, dan <b>baterai</b> besar di bawah tempat tanganmu bersandar. HP, komputer meja, dan server punya jenis bagian yang sama.'
		},
		{
			tag: 'Motherboard',
			title: 'Jalanan kota',
			body: 'Papan sirkuit besar yang penuh garis tembaga tipis bernama <b>jalur</b> (traces). Jalur ini membawa listrik dan data antar bagian, seperti jalan antar rumah.'
		},
		{
			tag: 'CPU',
			title: 'Si otak',
			body: 'Menjalankan instruksi satu per satu, cepat sekali. Kecepatannya ditulis dalam GHz, dan <b>3 GHz</b> artinya sekitar tiga miliar langkah kecil tiap detik.'
		},
		{
			tag: 'RAM',
			title: 'Si meja',
			body: 'Menampung aplikasi dan file yang sedang dibuka, supaya CPU bisa langsung mengambilnya. Dia butuh listrik untuk ingat. <b>RAM 8 GB</b> di label toko itu ukuran mejanya.'
		},
		{
			tag: 'Storage',
			title: 'Si lemari',
			body: 'Menyimpan file selamanya, walau tanpa listrik. Jauh lebih besar dari RAM, tapi lebih lambat dijangkau. <b>SSD 512 GB</b> di label itu ukuran lemarinya.'
		},
		{
			tag: 'Loading',
			title: 'Storage, lalu RAM, lalu CPU',
			body: 'File disalin dari storage ke RAM, lalu CPU membacanya dari RAM. CPU hampir nggak pernah merogoh storage langsung, kelamaan.'
		},
		{
			tag: 'Cara ingat',
			title: 'Meja dan lemari',
			body: 'Listrik mati, meja (RAM) jadi bersih, lemari (storage) tetap menyimpan semuanya. Patokannya, kalau belum kamu simpan, berarti cuma ada di RAM.'
		},
		{
			tag: 'GPU',
			title: 'Si pelukis',
			body: 'Chip yang dibuat untuk mengerjakan ribuan tugas menggambar kecil sekaligus, mewarnai tiap titik (<b>piksel</b>) di layar. Di banyak laptop, GPU ada di dalam chip yang sama dengan CPU.'
		},
		{
			tag: 'Listrik',
			title: 'Baterai',
			body: 'Menyimpan energi lalu mengirimnya lewat motherboard ke semua bagian. Tanpa listrik, nggak ada yang bekerja, dan RAM jadi kosong.'
		},
		{
			tag: 'Input dan output',
			title: 'Keyboard masuk, layar keluar',
			body: '<b>Input</b> membawa sesuatu masuk (keyboard, mouse, sentuhan, mikrofon). <b>Output</b> mengeluarkan hasil (layar, speaker). CPU ada di tengah tengahnya.'
		},
		{
			tag: 'Satu tim',
			title: 'Semua bagian bersama',
			body: 'Ketuk bagian mana saja di gambar untuk melihatnya lagi. Nggak ada yang wajib, ini cuma buat lihat sekali lagi.'
		}
	],
	labels: {
		screen: 'Layar',
		keyboard: 'Keyboard',
		board: 'Motherboard',
		cpu: 'CPU',
		ram: 'RAM',
		storage: 'SSD',
		gpu: 'GPU',
		battery: 'Baterai'
	},
	powerOff: 'Listrik mati',
	cleared: 'kosong',
	kept: 'masih ada',
	typed: 'halo',
	picture: 'Sebuah laptop yang dibuka, kelihatan motherboard, chip, kipas, dan baterai di dalamnya'
};
