import type { ExperimentText } from '../../types';
export const id: ExperimentText = {
	labLabel: 'Percobaanmu',
	hintLabel: 'Petunjuk',
	scope:
		'Model URL dan redirect lokal, tanpa pengambilan jaringan. Pengujian produksi juga perlu menangani DNS, IPv6, alamat khusus, batas ukuran, dan waktu tunggu.',
	title: 'SSRF',
	intro: [
		'Nimbus punya fitur pratinjau gambar. Pengunjung memberikan URL, lalu <b>server</b> mengambil gambarnya. Praktis, tetapi server dapat menjangkau tempat yang tidak bisa kamu buka dari internet.',
		'<b>SSRF</b>, server side request forgery, terjadi ketika masukan pengguna membuat server mengirim request yang tidak semestinya. Target bisa berupa layanan internal atau alamat lokal server itu sendiri.',
		'Coba target 127.0.0.1 pada lab. Itu <b>loopback</b>, artinya mesin yang sedang mengirim request. Karena pengirimnya server Nimbus, alamat itu menunjuk server Nimbus, bukan laptop pengunjung.',
		'Batasi tujuan yang boleh diambil. Namun, memeriksa URL pertama saja belum cukup. Pada contoh redirect, alamat awal yang diizinkan mengarahkan server ke layanan internal.',
		'Pilih pemeriksaan setiap tujuan, lalu coba redirect lagi. Dalam aplikasi nyata, periksa skema, host, hasil resolusi IP, dan setiap perpindahan tujuan, serta batasi akses keluar dari server.',
		'[ingat] <b>CSRF menyuruh browser, SSRF menyuruh server.</b> Batas kepercayaan berubah ketika masukan pengunjung dipakai untuk tindakan di belakang layar.'
	],
	reactions: {
		internal:
			'Server mengambil halaman admin lokal dan mengembalikannya lewat fitur pratinjau. Masukan pengunjung menyeberang ke jaringan yang seharusnya dibatasi.',
		redirect:
			'URL pertama lolos, tetapi arah berikutnya menuju loopback. Pemeriksaan sekali di pintu awal kehilangan tujuan akhirnya.',
		blocked:
			'Tujuan internal ditolak sebelum diambil. Sekarang coba gambar publik untuk memastikan fungsi pratinjau masih berjalan.',
		image:
			'Gambar publik berhasil diambil. Perlindungan yang baik membatasi tujuan tanpa mematikan kebutuhan yang sah.'
	},
	goal: 'Batasi perjalanan pengambil gambar',
	tasks: [
		'Lihat akses internal',
		'Coba celah redirect',
		'Periksa setiap tujuan',
		'Uji gambar publik'
	],
	hint: 'Ambil target internal tanpa pembatas. Pilih redirect dengan cek URL pertama. Ganti ke cek setiap tujuan dan ulangi, lalu coba gambar publik.',
	labels: {
		fetch: 'Ambil pratinjau',
		target: 'URL yang diberikan pengunjung',
		guard: 'Pemeriksaan tujuan',
		image: 'Gambar publik Nimbus',
		internal: 'Layanan internal loopback',
		redirect: 'URL Nimbus dengan redirect internal',
		none: 'Tanpa pembatas',
		first: 'Periksa URL pertama saja',
		every: 'Periksa setiap tujuan',
		server: 'Pengambil gambar di server',
		access: 'Server membuat request atas masukan pengunjung.',
		trace: 'Jejak request server',
		waiting: 'Belum ada pengambilan',
		blocked: '403, tujuan internal ditolak sebelum diakses',
		leaked: '200, halaman admin internal bocor lewat pratinjau',
		rendered: '200, gambar publik berhasil ditampilkan'
	}
};
