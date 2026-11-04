import type { BackendWhatText } from './types';

export const id: BackendWhatText = {
	title: 'Apa itu backend',
	intro: [
		'Waktu kamu belanja di <b>nimbus.com</b>, semua yang kamu lihat dan pencet (foto topi, harga, tombol Beli yang gede itu) ada di HP kamu. Bagian yang kelihatan itu namanya <b>frontend</b>.',
		'Tapi HP kamu nggak bisa memutuskan sendiri apakah pesananmu sah. Jadi waktu kamu pencet Beli, dia membungkus pesanannya jadi pesan kecil dan mengirimnya jauh jauh.',
		'Pesan itu sampai di <b>backend</b>, sebuah program yang jalan di server. Kamu nggak pernah melihatnya, mirip dapur di restoran. Kamu cuma lihat piring yang keluar.',
		'Pertama, backend ngecek <b>siapa yang minta</b>. Siapa pun di internet bisa ngirim pesan, jadi dia nggak pernah percaya HP begitu saja.',
		'Habis itu dia nanya ke <b>database</b>, buku catatan besar tempat semua produk, akun, dan pesanan disimpan. Topinya masih ada? Cuma backend yang boleh membuka buku itu.',
		'Pesanannya dicatat, lalu backend ngirim struk ke email kamu. Semua itu kejadian dalam waktu kurang dari sedetik.',
		'[ingat] Frontend itu ruang makan, backend itu dapur. Kamu lihat piringnya, nggak pernah lihat kompornya.',
		'[fyi] HP dan backend ngobrol lewat [[API|foundations/api]], daftar pertanyaan yang sudah disepakati dan boleh ditanyakan frontend. Itu kita bahas habis ini.',
		'Lihat pesanannya jalan sendiri. Penasaran siapa yang sebenarnya memutuskan? Coba logout dan biarkan dia mencoba lagi.'
	],
	reactions: {
		loggedOut:
			'Langsung ditahan di pos pertama. Tanpa login backend nggak tahu ini pesanan siapa, jadi ditolak. HP kamu boleh punya tombol yang cantik, tapi yang memutuskan tetap backend.',
		loggedIn: 'Sudah login lagi, dan pesanannya lancar sampai akhir.'
	},
	steps: [
		{
			title: 'Frontend',
			body: 'Semua yang <b>ada di layarmu</b>. Gambar, tombol, dan tulisan yang digambar HP kamu.'
		},
		{
			title: 'Request',
			body: 'Pencet Beli artinya ngirim pesan kecil lewat internet, namanya <b>request</b>. Isinya apa yang kamu mau, satu Nimbus Cap.'
		},
		{
			title: 'Backend',
			body: 'Program di <b>server</b>, komputer yang selalu nyala. Dia mengerjakan semua yang nggak kelihatan.'
		},
		{
			title: 'Siapa yang minta',
			body: 'Sebelum apa pun, backend ngecek <b>login</b> kamu. Nggak login, nggak ada pesanan.'
		},
		{
			title: 'Database',
			body: 'Tempat toko menyimpan datanya untuk selamanya. HP kamu nggak pernah membukanya, dia selalu <b>minta tolong ke backend</b>.'
		},
		{
			title: 'Dicatat dan dikirim',
			body: 'Pesanannya sekarang <b>sudah tercatat</b>, walaupun baterai HP kamu habis. Struknya dikirim backend, bukan HP kamu.'
		},
		{
			title: 'Ruang makan dan dapur',
			tag: 'Biar nempel',
			body: 'Frontend itu <b>ruang makan</b>, backend itu <b>dapur</b>.'
		},
		{
			title: 'API',
			tag: 'Catatan',
			body: '<b>Menu</b> pertanyaan yang boleh ditanyakan frontend ke backend.'
		},
		{
			title: 'Siapa yang memutuskan',
			body: 'Tombolnya ada di HP kamu, tapi <b>backend yang memutuskan</b> pesanan itu sah atau nggak.'
		}
	],
	frontLabel: 'Frontend',
	frontSub: 'yang kamu lihat',
	backLabel: 'Backend',
	backSub: 'tersembunyi di server',
	roomFront: 'ruang makan',
	roomBack: 'dapur',
	stations: { who: 'Siapa ini?', stock: 'Ada stok?', save: 'Catat pesanan', mail: 'Kirim struk' },
	product: 'Nimbus Cap',
	price: 'Rp90.000',
	buy: 'Beli',
	phone: {
		idle: 'Siap dipesan',
		waiting: 'Lagi diproses',
		done: 'Pesanan berhasil',
		rejected: 'Login dulu ya'
	},
	dbLabel: 'Database',
	mailLabel: 'Email',
	apiLabel: 'API',
	logoutBtn: 'Logout lalu pesan',
	loginBtn: 'Login lagi'
};
