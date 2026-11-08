import type { HardwareText } from './types';

export const id: HardwareText = {
	title: 'Komponen komputer',
	intro: [
		'Laptop memiliki layar, keyboard, dan touchpad di bagian luar. Di dalamnya ada komponen yang memproses dan menyimpan data. Kita lihat bagian luarnya dahulu.',
		'Buka tampilan laptop untuk melihat komponen di dalamnya. Ada motherboard, CPU, RAM, storage, kipas, dan baterai. Posisi komponen dapat berbeda pada tiap model laptop.',
		'<b>Motherboard</b> adalah papan sirkuit yang menghubungkan komponen. Jalur tembaga pada papan membawa sinyal dan listrik antar bagian.',
		'<b>CPU</b> (central processing unit) menjalankan instruksi program, misalnya menghitung angka atau membandingkan nilai. Instruksi dan data direpresentasikan dalam [[bit|basics/binary]].',
		'<b>RAM</b> (random access memory) menyimpan sementara data dan instruksi yang sedang digunakan. CPU dapat mengaksesnya dengan cepat. Isi RAM hilang ketika listrik terputus.',
		'<b>Storage</b> menyimpan aplikasi dan file yang sudah ditulis. Laptop ini memakai SSD. Berbeda dari RAM, SSD menyimpan data tanpa listrik, tetapi tetap bisa rusak sehingga file penting perlu backup.',
		'Saat aplikasi dibuka, bagian program dan data yang diperlukan dimuat dari storage ke RAM. CPU menjalankan instruksinya. Ini salah satu proses yang terjadi selama loading.',
		'[ingat] <b>RAM menyimpan data sementara. Storage menyimpan data yang sudah ditulis.</b> Simpan pekerjaanmu agar perubahan tidak hanya berada di memori.',
		'<b>GPU</b> (graphics processing unit) memproses pekerjaan grafis, termasuk menghasilkan gambar untuk layar. Pada sebagian perangkat, GPU berada dalam chip yang sama dengan CPU.',
		'<b>Baterai</b> menyediakan energi saat laptop tidak terhubung ke stopkontak. Adaptor menyuplai listrik dan mengisi baterai. Komputer desktop umumnya memakai power supply yang tersambung ke listrik.',
		'<b>Keyboard</b> memasukkan data melalui tombol yang kamu tekan. <b>Layar</b> menampilkan hasil pemrosesan. Perangkat untuk memasukkan data disebut input, sedangkan perangkat yang menampilkan atau mengeluarkan hasil disebut output.',
		'Ketuk komponen untuk melihat fungsi masing masing. [[Server|foundations/server]] juga memakai CPU, RAM, dan storage, dengan susunan sesuai kebutuhan layanannya.'
	],
	reactions: {
		peek: 'Komponen yang kamu pilih disorot. Lihat fungsi dan posisinya pada laptop.'
	},
	steps: [
		{
			tag: 'Laptop',
			title: 'Bagian luar laptop',
			body: '<b>Layar</b> menampilkan gambar dan teks. <b>Keyboard</b> memasukkan data. <b>Touchpad</b> menggerakkan penunjuk dan memilih objek di layar.'
		},
		{
			tag: 'Bagian dalam',
			title: 'Komponen di dalam laptop',
			body: 'Tampilan ini menunjukkan <b>motherboard</b>, chip, RAM, SSD, kipas, dan baterai. Susunan sebenarnya berbeda antar model laptop.'
		},
		{
			tag: 'Motherboard',
			title: 'Menghubungkan komponen',
			body: '<b>Motherboard</b> menghubungkan komponen lewat jalur sirkuit. Jalur tersebut membawa sinyal data dan menyebarkan daya listrik.'
		},
		{
			tag: 'CPU',
			title: 'Menjalankan instruksi',
			body: 'CPU menjalankan instruksi. <b>3 GHz</b> berarti sekitar tiga miliar siklus clock per detik. Siklus bukan jumlah instruksi, pekerjaan per siklus bisa berbeda.'
		},
		{
			tag: 'RAM',
			title: 'Memori sementara',
			body: '<b>RAM</b> menyimpan sementara data dan instruksi yang sedang digunakan. Kapasitas 8 GB menunjukkan banyaknya data yang dapat ditampung. Isinya hilang saat listrik terputus.'
		},
		{
			tag: 'Storage',
			title: 'Penyimpanan data',
			body: 'Menyimpan file meskipun listrik mati. Umumnya lebih besar dan lebih lambat daripada RAM. Storage tetap bisa rusak, jadi file penting perlu backup.'
		},
		{
			tag: 'Loading',
			title: 'Membuka aplikasi',
			body: 'Program dan data yang dibutuhkan dimuat dari storage ke RAM. CPU lalu menjalankan instruksi program.'
		},
		{
			tag: 'Cara ingat',
			title: 'RAM dan storage saat listrik mati',
			body: 'RAM kehilangan isi saat listrik mati. Storage menyimpan data yang sudah ditulis ke sana, termasuk lewat fitur simpan otomatis.'
		},
		{
			tag: 'GPU',
			title: 'Memproses gambar',
			body: '<b>GPU</b> menjalankan banyak perhitungan grafis secara paralel untuk menghasilkan gambar. GPU dapat menjadi chip terpisah atau terintegrasi bersama CPU.'
		},
		{
			tag: 'Listrik',
			title: 'Sumber listrik',
			body: 'Baterai menyediakan energi saat laptop tidak terhubung ke listrik. Adaptor mengisi baterai dan menyuplai daya ke laptop.'
		},
		{
			tag: 'Input dan output',
			title: 'Memasukkan data dan melihat hasil',
			body: '<b>Input</b> memasukkan data, misalnya keyboard dan mikrofon. <b>Output</b> menampilkan atau mengeluarkan hasil, misalnya layar dan speaker.'
		},
		{
			tag: 'Ringkasan',
			title: 'Lihat kembali komponennya',
			body: 'Ketuk CPU, RAM, storage, atau komponen lain untuk melihat fungsi dan posisinya.'
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
