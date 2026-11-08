import type { ExperimentText } from '../../types';
export const id: ExperimentText = {
	labLabel: 'Percobaanmu',
	hintLabel: 'Petunjuk',
	scope: 'Model lokal dengan data latihan. Tidak ada request ke jaringan sungguhan.',
	title: 'MITM',
	intro: [
		'<b>MITM</b> berarti man in the middle, juga disebut <b>on path attacker</b>. Penyerang berada pada jalur komunikasi. Berada di jalur belum otomatis membuatnya bisa membaca HTTPS.',
		'Coba HTTP dulu. Perantara dapat melihat pesan dan mengganti balasan dalam model ini. Sniffing mengamati lalu lintas, sedangkan perantara aktif juga bisa mengubahnya.',
		'Nyalakan HTTPS. Browser memeriksa identitas server melalui sertifikat dan rantai kepercayaan. Sertifikat dari CA lab belum dipercaya, jadi browser menghentikan sambungan sebelum request aplikasi dikirim.',
		'<b>CA</b>, certificate authority, membantu membuktikan identitas melalui sertifikat. Jika browser sengaja mempercayai CA milik proxy pengujian, proxy itu dapat mengakhiri TLS lalu membuat sambungan TLS lain ke server.',
		'Coba percaya CA lab di simulasi ini. HTTPS tetap dipakai, tetapi sekarang proxy dapat melihat isi pesan. Inilah alasan pemasangan sertifikat proxy [[Burp|security/burp-suite]] dilakukan pada lingkungan pengujian yang kamu kendalikan.',
		'[ingat] <b>Enkripsi menjaga pesan, verifikasi sertifikat menjaga lawan bicara.</b> Jangan mengabaikan peringatan sertifikat pada situs sungguhan.'
	],
	reactions: {
		plain:
			'Pesan terbaca dan halaman berubah di perjalanan. Server mengirim harga 25, perantara menggantinya menjadi 250.',
		blocked:
			'Browser tidak mempercayai penerbit sertifikat ini. Request produk belum dikirim, jadi penyamar tidak mendapatkan isi request itu.',
		trusted:
			'Kamu mengubah batas kepercayaan browser lab. Proxy kini menjadi ujung TLS yang dipercaya dan bisa membaca serta mengubah pesan.',
		safe: 'Pesan sampai langsung ke server. Pada HTTPS, pihak di luar ujung sambungan tidak mendapatkan isi pesannya dari lalu lintas saja.'
	},
	goal: 'Lihat kapan perantara dapat membaca pesan',
	tasks: ['Coba HTTP', 'Periksa sertifikat HTTPS', 'Uji CA proxy di lab'],
	hint: 'Kirim dengan HTTP. Aktifkan HTTPS dan kirim lagi. Setelah melihat penolakan, aktifkan kepercayaan CA lab dan ulangi.',
	labels: {
		send: 'Minta halaman produk',
		onPath: 'Lewat perantara lab',
		trust: 'Percayai CA lab dalam simulasi',
		trustNote: 'Sakelar ini hanya mengubah model, tidak memasang sertifikat pada perangkatmu.',
		noCertificate: 'HTTP tidak memverifikasi sertifikat TLS',
		browser: 'Browser kamu',
		middle: 'Perantara lab',
		readable: 'Isi pesan dapat dibaca',
		locked: 'Isi request belum terlihat',
		wire: 'Yang terlihat oleh perantara',
		page: 'Halaman yang diterima browser',
		waiting: 'Belum ada permintaan',
		handshake: 'TLS dihentikan sebelum HTTP dikirim',
		ciphertext: 'Isi HTTP terlindungi dalam sambungan TLS',
		blocked: 'Browser menolak sertifikat yang tidak dipercaya',
		changed: 'Produk Nimbus, harga 250 koin (diubah perantara)',
		original: 'Produk Nimbus, harga 25 koin (dari server)'
	}
};
