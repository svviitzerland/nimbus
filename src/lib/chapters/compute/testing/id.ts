import type { TestingText } from './types';

export const id: TestingText = {
	title: 'Testing otomatis',
	intro: [
		'Tiap kali kamu mengubah kode nimbus.com, ada kemungkinan sesuatu yang dulu jalan ikut rusak. Mengecek semua halaman pakai tangan tiap kali itu lama, dan pasti suatu hari ada yang kelupaan. Untungnya, komputer bisa mengecek kodenya sendiri.',
		'Caranya pakai <b>test</b>, kode kecil yang tugasnya memeriksa kodemu. Misalnya ada fungsi <b>total</b> yang menghitung harga belanja. Test memanggilnya dengan angka yang sudah kamu tahu jawabannya, 3 barang seharga 10000 harus jadi 30000.',
		'Saat test dijalankan, komputer membandingkan jawaban fungsi dengan jawaban yang diharapkan. Kalau sama, testnya <b>hijau</b> (lolos). Kalau beda, testnya <b>merah</b> (gagal) dan kamu langsung tahu ada yang salah.',
		'Test yang memeriksa satu bagian kecil sendirian, seperti satu fungsi, namanya <b>unit test</b>. Jalannya cepat sekali, jadi satu proyek bisa punya ratusan.',
		'Ada juga <b>integration test</b>, yang memeriksa beberapa bagian bekerja barengan. Misalnya form daftar mengirim data ke server, lalu server menyimpannya di database. Lebih lambat, tapi menangkap masalah di sambungan antar bagian.',
		'Suatu hari ada yang menambah fitur diskon, tapi salah ketik, hasilnya malah dibagi sepuluh. Testnya langsung merah, harusnya 30000 tapi dapat 3000. Kesalahan seperti ini namanya <b>bug</b>, dan yang ini ketahuan sebelum satu pun pengguna melihatnya.',
		'Kodenya dibetulkan, testnya hijau lagi. Yang paling penting, test jalan otomatis di <b>tiap perubahan</b>, bukan cuma kalau kamu ingat. Jadi kode lama tetap terjaga walau kamu sibuk menulis yang baru.',
		'[ingat] Test itu seperti alarm asap di dapur. Kecil, diam saja tiap hari, tapi langsung berbunyi begitu ada asap, sebelum apinya membesar. Merah itu bunyi alarmnya, dan kamu masih sempat memadamkannya.',
		'[fyi] Tiap bahasa punya alat testnya sendiri, misalnya <b>Vitest</b> atau <b>Jest</b> untuk JavaScript dan <b>pytest</b> untuk Python. Nama test biasanya ditulis seperti kalimat, jadi kalau gagal kamu langsung tahu apa yang rusak.',
		'Giliranmu kalau mau. Selipkan bug ke fungsinya, lalu lihat testnya menangkap. Betulkan lagi, dan hijau kembali.'
	],
	reactions: {
		broke:
			'Merah. Test menangkap bugnya dalam sekejap, dan nimbus.com tetap aman karena perubahan ini belum sampai ke pengguna.',
		fixed: 'Hijau lagi. Kodenya kembali benar, dan test terus berjaga di tiap perubahan berikutnya.'
	},
	steps: [
		{
			tag: 'Masalahnya',
			title: 'Cek pakai tangan',
			body: 'Membuka tiap halaman satu per satu setelah tiap perubahan itu lama, membosankan, dan gampang terlewat.'
		},
		{
			tag: 'Test',
			title: 'Kode yang memeriksa kode',
			body: 'Sebuah <b>test</b> memanggil kodemu dengan masukan yang jelas, lalu memeriksa jawabannya.'
		},
		{
			tag: 'Hasil',
			title: 'Hijau atau merah',
			body: 'Jawaban sama dengan yang diharapkan berarti <b>lolos</b>. Beda sedikit saja berarti <b>gagal</b>.'
		},
		{
			tag: 'Unit test',
			title: 'Satu bagian kecil',
			body: 'Memeriksa satu fungsi sendirian, tanpa server atau database. Cepat dan banyak.'
		},
		{
			tag: 'Integration test',
			title: 'Bagian yang bekerja barengan',
			body: 'Memeriksa form, server, dan database sekaligus. Lebih lambat, tapi menguji sambungannya.'
		},
		{
			tag: 'Bug',
			title: 'Merah menghentikan bug',
			body: 'Test gagal sebelum perubahan dikirim, jadi pengguna nggak pernah melihat harga yang salah.'
		},
		{
			tag: 'Tiap perubahan',
			title: 'Jalan sendiri, selalu',
			body: 'Test dijalankan otomatis tiap ada perubahan, jadi nggak ada yang bergantung pada ingatan.'
		},
		{
			tag: 'Cara ingat',
			title: 'Tes mendeteksi perubahan yang salah',
			body: 'Diam kalau aman, berbunyi begitu ada masalah, dan selalu lebih awal dari apinya.'
		},
		{
			tag: 'Alatnya',
			title: 'Nama test seperti kalimat',
			body: 'Vitest, Jest, dan pytest menjalankan test dan menunjukkan mana yang hijau dan mana yang merah.'
		},
		{
			tag: 'Coba',
			title: 'Rusak lalu betulkan',
			body: 'Selipkan bug, lihat testnya merah. Betulkan, lihat hijau lagi.'
		}
	],
	handLabel: 'Cek pakai tangan',
	pages: ['Beranda', 'Daftar', 'Keranjang', 'Bayar'],
	forgotTag: 'kelupaan',
	testName: '3 barang jadi 30000',
	idle: 'belum dijalankan',
	running: 'menjalankan test',
	passed: '1 test lolos',
	failed: 'harusnya {exp}, dapat {got}',
	parts: ['Form', 'Server', 'Database'],
	unitLabel: 'unit test',
	integrationLabel: 'integration test',
	usersSafe: 'pengguna belum kena',
	everyChange: 'tiap perubahan dites',
	toolsLabel: 'Alat test populer',
	breakBtn: 'Selipkan bug',
	fixBtn: 'Betulkan'
};
