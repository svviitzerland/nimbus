import type { ApiStyleText } from '../../types';

export const id: ApiStyleText = {
	title: 'REST API',
	intro: [
		'REST itu gaya API paling umum. Tiap kelompok data punya alamatnya sendiri, dan kamu minta lewat sebuah method. Pas buat kebanyakan aplikasi biasa.',
		'Mulai dari <b>GET</b>, buat mengambil data. Frontend minta daftar produk ke backend, backend mengirimnya balik, dan daftarnya muncul di layar.',
		'Lalu <b>POST</b>, buat membuat data baru. Frontend mengirim produk baru ke backend, backend menyimpannya, dan produk itu ikut muncul di daftar.',
		'Lalu <b>PUT</b>, buat mengubah data yang sudah ada. Frontend mengirim data baru buat produk nomor 2, backend menggantinya, dan harganya berubah di layar.',
		'Terakhir <b>DELETE</b>, buat menghapus data. Frontend minta backend menghapus produk nomor 2, dan produk itu hilang dari daftar.',
		'[fyi] REST itu sebenarnya cuma sekumpulan kesepakatan di atas HTTP biasa, namanya dipopulerkan Roy Fielding tahun 2000. Karena sederhana dan jalan di mana saja, dia jadi gaya paling banyak dipakai.',
		'[ingat] REST menamai sumber daya. Method menjelaskan tindakan terhadap sumber daya itu.'
	],
	reactions: {},
	style: 'rest',
	clientLabel: 'Frontend',
	serverLabel: 'Backend',
	replayBtn: 'Putar ulang'
};
