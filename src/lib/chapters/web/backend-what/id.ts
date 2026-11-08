import type { BackendWhatText } from './types';

export const id: BackendWhatText = {
	title: 'Apa itu backend',
	intro: [
		'Waktu kamu belanja di <b>nimbus.com</b>, semua yang kamu lihat dan pencet (foto produk, keranjang, tombol Beli yang gede itu) ada di HP kamu. Bagian yang kelihatan itu namanya <b>frontend</b>.',
		'Tapi HP kamu nggak bisa memutuskan sendiri kalau pesananmu itu beneran. Harus ada yang ngecek kamu siapa, topinya masih ada stoknya atau nggak, mencatat pesanannya, terus ngirim struk ke kamu.',
		'Yang ngerjain itu namanya <b>backend</b>, sebuah program yang jalan di server yang jauh. Kamu nggak pernah melihatnya, mirip dapur di restoran. Kamu cuma lihat pelayannya dan piring yang keluar.',
		'Backend juga satu satunya yang boleh menyentuh <b>database</b>, buku catatan besar tempat semua produk, akun, dan pesanan disimpan. HP kamu nggak pernah membukanya langsung, dia selalu minta tolong ke backend.',
		'[fyi] Frontend dan backend ngobrol lewat [[API|foundations/api]], kumpulan pertanyaan yang sudah disepakati dan boleh ditanyakan frontend. Itu kita bahas habis ini.',
		'[ingat] Frontend berjalan di sisi pengguna. Backend memproses request, memeriksa izin, dan mengakses data di server.',
		'Yuk ikuti satu pesanan. Ada Nimbus Cap di keranjang, pesan, lalu jalankan pesanannya lewat backend satu langkah demi satu langkah. Coba juga waktu belum login, lihat siapa yang menghentikanmu.'
	],
	reactions: {
		login:
			'Pos pertama, cek login. Backend melihat siapa yang minta. Siapa pun bisa ngirim request, jadi dia nggak pernah percaya HP begitu saja.',
		rejected:
			'Langsung ditahan di pintu. Tanpa login backend nggak tahu ini pesanan siapa, jadi ditolak. HP kamu boleh punya tombol yang cantik, tapi yang memutuskan tetap backend.',
		stock:
			'Sekarang dia nanya ke database, topinya masih ada atau nggak. HP bisa aja nampilin angka lama, database yang tahu angka aslinya.',
		save: 'Pesanannya dicatat ke database. Mulai detik ini pesanan itu beneran ada, walaupun kamu tutup aplikasinya atau baterai HP kamu habis.',
		email:
			'Terakhir, backend ngirim email struk. Yang ngirim bukan HP kamu, tapi backend, karena cuma backend yang bisa dipercaya buat urusan ini.',
		done: 'Pesanan berhasil! Ada empat pekerjaan yang terjadi di server yang nggak pernah kamu lihat, dan aslinya semua itu selesai dalam waktu kurang dari sedetik. Pekerja tersembunyi itulah backend.'
	},
	frontLabel: 'Frontend (HP kamu)',
	backLabel: 'Backend',
	backSub: 'program di server nimbus.com',
	product: 'Nimbus Cap',
	price: 'Rp90.000',
	loggedIn: 'Login sebagai Nim',
	loggedOut: 'Belum login',
	placeOrder: 'Pesan sekarang',
	nextStep: 'Langkah berikutnya di backend',
	again: 'Pesan lagi',
	steps: {
		login: { title: 'Cek login', detail: 'Siapa yang minta?' },
		stock: { title: 'Cek stok', detail: 'Topinya masih ada?' },
		save: { title: 'Simpan pesanan', detail: 'Catat di database' },
		email: { title: 'Kirim struk', detail: 'Email ke pembeli' }
	},
	loginFail: 'Nggak ada yang login, pesanan ditolak',
	dbLabel: 'Database',
	mailLabel: 'Email',
	phone: {
		idle: 'Siap checkout',
		waiting: 'Pesananmu lagi diproses',
		done: 'Pesanan berhasil',
		rejected: 'Login dulu ya',
		inbox: 'Struk masuk ke inbox'
	}
};
