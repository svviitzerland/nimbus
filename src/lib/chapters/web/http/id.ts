import type { HttpText } from './types';

export const id: HttpText = {
	title: 'Apa itu HTTP',
	intro: [
		'Tiap kali kamu buka <b>nimbus.com</b>, browser kamu dan [[server|foundations/server]] ngobrol sebentar. Browser bertanya, server menjawab. Obrolan itu selalu ngikutin tata krama yang sama, namanya <b>HTTP</b>.',
		'HTTP itu singkatan dari HyperText Transfer Protocol. <b>Protokol</b> itu cuma cara ngobrol yang sudah disepakati, kayak telepon yang selalu dibuka pakai halo. Dua duanya tahu aturannya, jadi selalu nyambung.',
		'Tiap pertanyaan dari browser namanya <b>request</b>, dan dibuka pakai <b>method</b>, kata kerja yang bilang kamu mau apa. <b>GET</b> artinya tolong kasih ini, buat membaca halaman. <b>POST</b> artinya tolong terima ini, buat mengirim sesuatu kayak komentar atau login.',
		'Setelah method ada <b>path</b>, halaman mana yang kamu mau, misalnya <b>/about</b>. Lalu ada <b>header</b>, catatan kecil yang ditulis di amplopnya, misalnya situs mana yang kamu maksud (Host) dan jawaban jenis apa yang bisa kamu baca (Accept).',
		'Server membalas dengan <b>response</b>, dan hal pertama di dalamnya adalah <b>status code</b>, angka tiga digit. 200 artinya aman, 404 artinya halaman itu nggak ada, dan 500 artinya servernya sendiri lagi kesandung sesuatu.',
		'[fyi] Digit pertamanya udah cerita banyak. 2xx berarti sukses, 3xx berarti coba cari di tempat lain, 4xx berarti request kamu minta yang salah (salah di sisimu), dan 5xx berarti servernya rusak (salah di sisi mereka). [[API|foundations/api]] juga ngomong pakai HTTP yang sama persis, cuma jawabannya data, bukan halaman.',
		'[fyi] HTTP biasa dikirim sebagai teks yang bisa dibaca, jadi siapa pun di tengah jalan bisa ngintip. Huruf S di <b>HTTPS</b> membungkus seluruh obrolan itu pakai enkripsi. Nanti dibahas di [[SSL dan TLS|security/tls]].',
		'Giliran kamu! Pilih method dan path, kirim request ke nimbus.com, terus baca apa yang balik. Coba kumpulkan empat jenis jawaban.'
	],
	reactions: {
		ok: 'Dapat <b>200 OK</b>. Server nemu halamannya dan ngirim balik. Baca response dari atas, baris status dulu, lalu header kayak <b>Content-Type</b> yang bilang ke browser ini HTML, baru halamannya.',
		list: 'GET ke <b>/messages</b> ngasih balik data, bukan halaman. Content-Type nya <b>application/json</b>, format rapi yang gampang dibaca aplikasi. Kalau tadi kamu sempat ngirim pesan, coba cari di daftarnya.',
		created:
			'<b>201 Created</b>. Pakai POST, pesanmu ikut di dalam <b>body</b> request dan server menyimpannya. Sekarang ganti lagi ke GET ke /messages, pesanmu udah nongkrong di sana.',
		notfound:
			'<b>404 Not Found</b>. Servernya sehat kok, cuma nggak punya halaman di /pricing. Kode yang diawali 4 artinya request kamu minta sesuatu yang nggak ada.',
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
		client: 'Diawali 4, berarti request kamu minta yang salah',
		server: 'Diawali 5, berarti servernya rusak'
	},
	allDone: 'Empat jawaban terkumpul, mantap'
};
