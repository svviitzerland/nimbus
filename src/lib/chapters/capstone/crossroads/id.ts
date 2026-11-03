import type { CrossroadsText } from '../types';

export const id: CrossroadsText = {
	title: 'Persimpangan',
	intro: [
		'Sampai juga di ujung jalur Dari Nol. Komputer, web, jaringan, cloud, keamanan, sampai AI, semuanya sudah kamu cicipi satu per satu.',
		'Sekarang kamu sudah tahu peta besarnya, jadi tinggal pilih mau mendalami yang mana. Tiap cabang punya pelajaran lanjutan yang lebih dalam, dan yang sudah kamu selesaikan tetap tercentang di sana.',
		'Ketuk satu cabang buat lihat isinya, lalu masuk kalau sudah mantap. Nggak usah takut salah pilih, kamu bisa pindah cabang kapan saja dari menu.'
	],
	reactions: {
		network:
			'Cabang <b>Jaringan</b> masuk lebih dalam ke subnet, routing, VLAN, VPN, sampai praktik langsung di router <b>MikroTik</b>. Cocok kalau kamu mau ngurus jaringan kantor atau ISP.',
		web: 'Cabang <b>Web</b> ngajak kamu bikin situs beneran, dari HTML, CSS, dan JavaScript, lanjut ke framework, backend, database, sampai situsmu online.',
		cloud:
			'Cabang <b>Cloud & DevOps</b> lanjut ke Linux, Kubernetes, infrastruktur sebagai kode, dan di ujungnya kamu pilih provider, <b>AWS</b>, <b>Google Cloud</b>, atau <b>Azure</b>.',
		security:
			'Cabang <b>Keamanan</b> membongkar cara penyerang berpikir, kriptografi, jenis jenis serangan, dan cara bertahan, selalu dari sisi yang menjaga.',
		ai: 'Cabang <b>AI & ML</b> mulai dari machine learning, neural network, sampai cara kerja chatbot dan AI agent di balik layar.'
	},
	hint: 'Ketuk satu cabang buat lihat isinya',
	enter: 'Masuk cabang {name}'
};
