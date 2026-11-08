import type { HttpText } from './types';

export const id: HttpText = {
	title: 'Apa itu HTTP',
	intro: [
		'Buka <b>nimbus.com</b>, lalu browser meminta data ke [[server|foundations/server]]. Aturan pertukaran pesan itu bernama <b>HTTP</b>.',
		'Pesan yang dikirim namanya <b>request</b>. <b>GET</b> meminta data. <b>POST</b> mengirim data untuk diproses, misalnya pesan baru di buku tamu.',
		'<b>Path</b> memilih tujuan di situs, seperti /about. <b>Header</b> membawa keterangan tambahan. <b>Body</b> membawa isinya, misalnya teks pesanmu.',
		'Server mengirim <b>response</b>. Di awal ada status, seperti 200 OK atau 404 Not Found. Lihat pesan mentahnya di bawah, bukan hanya halaman yang tampil.',
		'Coba POST ke /messages lalu GET ke alamat yang sama. Pesanmu tersimpan di server simulasi dan muncul dalam balasan berikutnya.',
		'[ingat] <b>2 berhasil, 3 diarahkan, 4 request tidak terpenuhi, 5 server bermasalah.</b> Baca juga isi balasannya untuk tahu penyebab yang lebih tepat.',
		'[fyi] <b>HTTPS</b> melindungi pertukaran HTTP dengan [[TLS|security/tls]]. Lab memakai tampilan teks HTTP/1.1 agar mudah dibaca. HTTP/2 dan HTTP/3 memakai bentuk pengiriman berbeda.',
		'Kumpulkan empat jawaban. Setelah berhasil membaca dan mengirim, coba halaman yang tidak ada dan laporan yang servernya bermasalah.'
	],
	reactions: {
		ok: 'Dapat <b>200 OK</b>. Server nemu halamannya dan ngirim balik. Baca response dari atas, baris status dulu, lalu header kayak <b>Content-Type</b> yang bilang ke browser ini HTML, baru halamannya.',
		list: 'GET ke <b>/messages</b> ngasih balik data, bukan halaman. Content-Type nya <b>application/json</b>, format rapi yang gampang dibaca aplikasi. Kalau tadi kamu sempat ngirim pesan, coba cari di daftarnya.',
		created:
			'<b>201 Created</b>. Pakai POST, pesanmu ikut di dalam <b>body</b> request dan server menyimpannya. Sekarang ganti lagi ke GET ke /messages, pesanmu udah nongkrong di sana.',
		notfound:
			'404. Server tidak menemukan /pricing. Penyebabnya bisa path keliru atau halaman yang sudah dihapus, jadi periksa alamatnya.',
		notallowed:
			'<b>405 Method Not Allowed</b>. Halamannya ada, tapi cuma boleh dibaca. Kamu nggak bisa POST ke situ, jadi server nolak dengan sopan, dan header <b>Allow</b> nya ngasih tahu apa yang boleh.',
		broken:
			'<b>500 Internal Server Error</b>. Request kamu kali ini benar kok. Kode di balik /report yang crash di server, jadi angka 5 di depan artinya salah di sisi mereka, bukan kamu.',
		done: 'Empat jawaban terkumpul! Method, path, header, status code, itulah HTTP. Browser kamu ngelakuin ini puluhan kali tiap buka satu halaman, diam diam, sekejap mata.'
	},
	missionsLabel: 'Kumpulkan empat jawaban',
	missions: {
		read: 'Baca halaman dan dapat 200',
		send: 'Kirim pesan pakai POST',
		missing: 'Minta halaman yang nggak ada',
		broken: 'Pergoki server yang kesandung'
	},
	methodLabel: 'Method',
	pathLabel: 'Path',
	bodyLabel: 'Pesanmu',
	bodyDefault: 'Halo Nim!',
	pathHints: {
		'/': 'halaman depan',
		'/about': 'tentang Nimbus',
		'/messages': 'buku tamu',
		'/pricing': 'halaman harga, mungkin',
		'/report': 'laporan bulanan'
	},
	send: 'Kirim request',
	sending: 'Lagi dikirim',
	youLabel: 'Browser kamu',
	serverLabel: 'nimbus.com',
	requestLabel: 'Request',
	responseLabel: 'Response',
	waiting: 'Belum ada balasan',
	screen: {
		home: 'Selamat datang di Nimbus',
		about: 'Tentang Nimbus',
		aboutText: 'Awan yang ngajarin teknologi.',
		messages: 'Buku tamu',
		created: 'Pesan terkirim',
		notFound: 'Halaman nggak ketemu',
		broken: 'Ada yang rusak',
		notAllowed: 'Nggak boleh di sini'
	},
	statusNotes: {
		ok: 'Diawali 2, berarti berhasil',
		client: 'Diawali 4, request tidak bisa dipenuhi',
		server: 'Diawali 5, berarti servernya rusak'
	},
	allDone: 'Empat response HTTP diperiksa'
};
