import type { ExperimentText } from '../../types';

export const id: ExperimentText = {
	title: 'Form dan validasi',
	intro: [
		'<b>Form</b> mengumpulkan input, seperti alamat email. <b>Label</b> memberi tahu isi kotaknya. Atribut HTML <b>required</b> dan <b>type="email"</b> membantu browser memeriksa isinya.',
		'Coba kirim kata <b>nim</b>. Browser menolak sebelum request berangkat. Ini <b>validasi di client</b>, berguna agar orang bisa memperbaiki kesalahan dengan cepat.',
		'Sekarang kirim langsung ke server melalui tombol lab. Browser bukan satu satunya pembuat request, jadi pemeriksaannya bisa dilewati. Server yang belum memeriksa ikut menerima data salah.',
		'Aktifkan validasi server dan kirim nilai yang sama. Sesudah itu coba <b>nim@nimbus.com</b>. Bentuk email yang benar belum membuktikan alamatnya ada atau dimiliki orang tersebut.',
		'[ingat] <b>Browser membantu mengisi, server memutuskan menerima.</b> Keduanya dibutuhkan.'
	],
	reactions: {
		client: 'Browser menghentikannya. Pesan validasi berasal dari fitur email bawaan browser.',
		bypassed:
			'201, padahal isinya belum berbentuk email. Pemeriksaan browser tidak melindungi server sendirian.',
		server:
			'422. Kali ini server sendiri menolak data yang tidak sesuai, walaupun request melewati form.',
		valid:
			'Bentuk email diterima. Aplikasi nyata masih perlu memverifikasi kepemilikan, misalnya lewat tautan verifikasi.'
	},
	labLabel: 'Percobaanmu',
	goal: 'Jaga input sampai ke server',
	tasks: ['Lihat browser menolak', 'Lewati pemeriksaan browser', 'Periksa juga di server'],
	hintLabel: 'Petunjuk',
	hint: 'Biarkan nim di kotak. Kirim dari form, kirim langsung, aktifkan validasi server, lalu kirim langsung lagi.',
	scope: 'Simulasi lokal. Semua contoh berjalan di halaman ini tanpa menghubungi nimbus.com.',
	labels: {
		email: 'Email percobaan',
		sample: 'Gunakan nim atau nim@nimbus.com. Tidak ada email yang dikirim.',
		submit: 'Kirim dari form',
		direct: 'Kirim langsung ke server',
		validate: 'Validasi server aktif',
		waiting: 'Server belum menerima request'
	}
};
