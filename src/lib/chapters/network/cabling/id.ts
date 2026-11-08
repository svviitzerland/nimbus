import type { CablingText } from './types';

export const id: CablingText = {
	title: 'Kabel jaringan',
	intro: [
		'Data berpindah antar perangkat sebagai deretan angka satu dan nol. Di dalam kabel, satu dan nol itu berubah jadi denyut <b>listrik</b> atau denyut <b>cahaya</b>, tergantung kabelnya terbuat dari apa.',
		'Kabel yang kamu colokkan ke laptop atau router namanya <b>kabel LAN</b>. Isinya delapan kawat tembaga tipis yang dipilin berpasangan, dengan colokan plastik bening di kedua ujungnya. Tembaga mengalirkan listrik, murah, kuat, dan gampang dipasang.',
		'Tapi listrik punya kelemahan. Makin jauh jalannya, makin lemah sinyalnya, dan dia gampang kena gangguan dari kabel lain di sekitarnya. Makanya kabel LAN resminya cuma sampai sekitar 100 meter.',
		'<b>Fiber optik</b> membawa data dengan cahaya melalui serat kaca. Sinyalnya tetap melemah sepanjang jarak, tetapi tidak terkena gangguan elektromagnetik seperti kabel tembaga. Jangkauan ditentukan jenis fiber dan perangkat optiknya.',
		'[fyi] Pilinan di kabel LAN bukan buat gaya. Kawat yang dipilin berpasangan membuat gangguan dari luar mengenai keduanya sama rata, jadi saling meniadakan. Pilinan yang lebih rapat dan pelindung yang lebih baik bikin kabel lebih cepat, itulah arti tulisan Cat5e, Cat6, dan Cat6a di kabelnya.',
		'[ingat] <b>Periksa media, kecepatan, dan jarak.</b> Ethernet tembaga umum dirancang untuk kanal hingga 100 meter. Fiber digunakan untuk banyak sambungan jarak jauh, dengan batas sesuai standar serta perangkatnya.',
		'Kirim file yang sama lewat tembaga dan lewat fiber, lalu terus tambah jaraknya. Cari di mana tembaga menyerah, lalu lihat seberapa jauh fiber sanggup.'
	],
	reactions: {
		copperOk:
			'Sampai dengan utuh. Untuk jarak pendek, kabel LAN tembaga itu murah, gampang, dan cukup kencang, makanya hampir di belakang setiap meja ada satu.',
		copperFail:
			'Filenya rusak di jalan. Listriknya melemah dan tenggelam dalam gangguan, sampai ujung sana nggak bisa membedakan mana satu mana nol. Lewat dari sekitar 100 meter, tembaga butuh switch di tengah buat menguatkan sinyal, atau ganti kabel.',
		fibreOk:
			'Fiber juga santai buat jarak pendek, malah sepuluh kali lebih cepat di sini. Tapi harganya lebih mahal dan kacanya harus diperlakukan lebih hati hati, jadi sambungan pendek di dalam ruangan biasanya tetap tembaga.',
		fibreFar:
			'Fiber pada simulasi ini masih mengirim data pada jarak tersebut. Di jaringan nyata, kekuatan sinyal dan kemampuan transceiver menentukan batasnya. Fiber juga dipakai pada [[kabel bawah laut|cloud/cable]].'
	},
	copper: { name: 'Tembaga', sub: 'kabel LAN, listrik' },
	fibre: { name: 'Fiber optik', sub: 'kaca, cahaya' },
	distLabel: 'Seberapa jauh',
	places: [
		'satu ruangan',
		'satu lantai kantor',
		'ujung lorong panjang',
		'gedung sebelah',
		'ujung kota',
		'kota sebelah'
	],
	sendBtn: 'Kirim filenya',
	fileLabel: 'nimbus.zip (1 GB)',
	youLabel: 'Laptopmu',
	farLabel: 'Server',
	signalLabel: 'Sinyal yang tersisa di ujung sana',
	limitLabel: 'terbaca',
	okNote: 'Sampai dengan selamat dalam {t}',
	failNote: 'Sinyalnya terlalu lemah, filenya sampai dalam keadaan rusak',
	times: { copper: 'sekitar 8 detik', fibre: 'kurang dari sedetik' },
	idleNote: 'Pilih kabel dan jaraknya, lalu kirim'
};
