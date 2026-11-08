import type { IacText } from './types';

export const id: IacText = {
	title: 'Infrastructure as Code',
	intro: [
		'Untuk menjalankan nimbus.com kamu butuh server. Langkah pertama yang biasa, buka situs penyedia cloud, klik "buat server", pilih ukuran, pilih region, lalu klik buat. Ulangi untuk setiap server.',
		'Untuk satu dua server sih oke. Tapi bulan depan siapa yang ingat persis ukuran dan region yang kamu pilih? Dan kalau suatu hari semuanya hilang, kamu harus mengulang semua klik itu dari ingatan.',
		'<b>Infrastructure as Code</b> (IaC) membalik caranya. Kamu menuliskan server yang kamu mau di sebuah file teks, lalu ada alat yang membangunnya untukmu. File yang sama selalu menghasilkan hasil yang sama.',
		'Alat yang paling terkenal namanya <b>Terraform</b>. Kamu tulis apa yang kamu mau ("tiga server kecil di Jakarta"), lalu jalankan <b>terraform apply</b>. Terraform membandingkan file dengan yang sudah ada, lalu cuma membuat, mengubah, atau menghapus bagian yang beda.',
		'[fyi] Karena cuma file teks, dia bisa disimpan di [[Git|compute/version-control]] seperti kodemu. Setiap perubahan server bisa direview, punya riwayat, dan bisa dibatalkan. Terraform juga nggak terbatas satu cloud, dia bisa ngobrol dengan AWS, Google Cloud, Azure, bahkan server milikmu sendiri di kantor (on premise).',
		'[ingat] IaC mencatat konfigurasi infrastruktur dalam kode. Periksa rencana perubahan dan kondisi sebenarnya sebelum menerapkannya.',
		'Bangun tiga server pakai tangan dulu, lalu biarkan bencana datang. Habis itu, tulis mereka sebagai kode dan bangun ulang semuanya sekaligus.'
	],
	reactions: {
		hand: 'Tiga server, lumayan banyak klik. Sekarang cek, apa semuanya sama persis? Kalau pakai tangan, gampang banget salah pilih tanpa sadar.',
		handLost:
			'Hilang. Data center lagi apes dan ketiga server lenyap. Kamu masih ingat persis apa yang kamu pilih untuk masing masing? Yuk coba cara kode.',
		applied:
			'Terraform membaca file, melihat belum ada apa apa, lalu membuat semua yang tertulis. Satu perintah, semua server sama persis.',
		diff: 'Lihat rencananya? Terraform cuma mengubah selisih antara file dan yang sedang jalan. Yang kamu ubah filenya, bukan servernya.',
		rebuilt:
			'Bencana lagi, tapi kali ini santai. File yang sama, perintah yang sama, dan semuanya kembali persis seperti semula. Itulah Infrastructure as Code.'
	},
	acts: ['Pakai tangan', 'Pakai kode'],
	consoleTitle: 'Buat server',
	sizeLabel: 'Ukuran',
	regionLabel: 'Region',
	sizes: ['small', 'medium', 'large'],
	regions: ['jakarta', 'singapore'],
	createBtn: 'Buat',
	clicksTag: '{n} klik',
	serverLabel: 'server {n}',
	sameTag: 'sama semua',
	driftTag: 'nggak sama',
	disasterBtn: 'Bencana datang',
	applyBtn: 'terraform apply',
	countHint: 'Ubah jumlahnya, lalu apply lagi',
	nextAct: 'Coba cara kode',
	noteHand: 'Pilih ukuran dan region, lalu buat. Tinggal {n} lagi.',
	noteHandDone: 'Tiga server, dibangun satu klik demi satu klik',
	noteHandLost: 'Semuanya hilang. Sekarang bangun ulang dari ingatan',
	noteCode: 'Filenya menjelaskan servernya. Jalankan apply.',
	noteCodeLive: 'Yang jalan sekarang sama persis dengan isi file',
	noteCodeLost: 'Hilang lagi, tapi filenya masih ingat semuanya',
	noteRebuilt: 'Dibangun ulang sekaligus, persis seperti yang tertulis'
};
