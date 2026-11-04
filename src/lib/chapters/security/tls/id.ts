import type { TlsText } from './types';

export const id: TlsText = {
	title: 'SSL dan TLS',
	intro: [
		'Coba lihat address bar waktu kamu buka nimbus.com. Gembok kecil itu artinya koneksimu privat. Padahal laptopmu dan server yang belum pernah dia kenal harus sepakat soal rahasia, sementara seluruh internet bisa ikut menguping. Kok bisa?',
		'Ceritanya mulai tahun 1995 di <b>Netscape</b>, browser paling populer waktu itu. Orang pengin belanja online, tapi nomor kartu lewat begitu saja tanpa dikunci, jadi Netscape membuat <b>SSL</b>. SSL masih bolong, jadi tahun 1999 diperbaiki dan ganti nama jadi <b>TLS</b>. Sekarang kita pakai TLS 1.3, dari tahun 2018.',
		'[fyi] Orang masih bilang "sertifikat SSL" karena kebiasaan, padahal mesin yang bekerja sekarang adalah TLS. Dan <b>HTTPS</b> itu cuma [[HTTP|web/http]] yang sudah kamu kenal, jalan di dalam terowongan TLS.',
		'Tiap koneksi TLS dibuka dengan <b>handshake</b> singkat, beberapa pesan cepat sebelum data sungguhan mengalir. Pertama, browsermu menyapa dan menyebut cara mengunci apa saja yang dia ngerti.',
		'nimbus.com membalas dengan <b>sertifikat</b>, semacam KTP digital. Isinya "kunci publik ini milik nimbus.com", dan ditandatangani <b>Certificate Authority</b> (CA), perusahaan yang sudah dipercaya browsermu.',
		'Browsermu memeriksa KTP itu dengan teliti. Namanya benar nimbus.com? Ditandatangani CA yang dipercaya? Sudah kedaluwarsa belum? Cuma kalau ketiganya lolos, handshake boleh lanjut.',
		'Sekarang bagian cerdasnya. Dengan bantuan kunci publik dari KTP itu (gembok terbuka dari [[kunci asimetris|security/keys]]), kedua pihak menyusun <b>session key</b> baru yang persis sama. Penguping lihat pesannya lewat, tapi nggak bisa menebak kuncinya.',
		'Mulai sekarang, tiap byte diacak pakai satu session key bersama itu, jenis simetris yang cepat. Gemboknya menyala. Semua tadi cuma makan beberapa per seratus detik.',
		'[ingat] <b>Kenalan pakai gembok, ngobrol pakai kunci bersama.</b> Sertifikat dan kunci publiknya buat berkenalan dengan aman, session key buat ngobrol cepat sesudahnya.',
		'Sekarang kamu pakai WiFi kafe yang mencurigakan. Ada orang di tengah yang pura pura jadi nimbus.com dan menyodorkan KTP palsu yang dia tanda tangani sendiri. Lihat browsermu memeriksanya, lalu menghentikanmu dengan peringatan.',
		'Peringatan itu tandanya TLS sedang bekerja, jadi kalau kamu lihat, mundur saja. Kalau mau, ganti antara WiFi rumah dan WiFi kafe, lalu lihat handshake berjalan dengan dua cara.'
	],
	reactions: {
		home: 'WiFi rumah. nimbus.com yang asli menunjukkan KTP asli, ketiga pemeriksaan lolos, dan gemboknya menyala.',
		cafe: 'WiFi kafe lagi. Si penipu bisa mencetak KTP sendiri, tapi nggak ada CA terpercaya yang mau menandatanganinya untuk nama yang bukan miliknya, jadi pemeriksaannya gagal.'
	},
	steps: [
		{
			tag: 'Pertanyaannya',
			title: 'Gembok kecil',
			body: 'Artinya nggak ada yang bisa membaca atau mengubah kirimanmu di tengah jalan, bukan pemilik WiFi, bukan juga provider internetmu.'
		},
		{
			tag: '1995 sampai 2018',
			title: 'Dari SSL ke TLS',
			body: 'Idenya sama, versinya makin aman. Semua versi SSL sudah pensiun, sekarang <b>TLS 1.2</b> dan <b>TLS 1.3</b> yang bekerja.'
		},
		{
			tag: 'Istilah sama',
			title: 'HTTPS',
			body: 'HTTP di dalam terowongan TLS. Isinya tetap sama, terowongannya yang menyembunyikan.'
		},
		{
			tag: 'Langkah 1',
			title: 'Salam',
			body: 'Browser membuka obrolan dan menyebut apa saja yang dia ngerti. Belum ada yang rahasia.'
		},
		{
			tag: 'Langkah 2',
			title: 'Sertifikat',
			body: "KTP digital berisi nama situs, tanggal kedaluwarsa, dan kunci publik, ditandatangani CA. Banyak situs dapat gratis dari <b>Let's Encrypt</b>."
		},
		{
			tag: 'Langkah 3',
			title: 'Periksa',
			body: '<b>Nama benar</b>, <b>penanda tangan dipercaya</b>, <b>belum kedaluwarsa</b>. Satu saja gagal, browser berhenti.'
		},
		{
			tag: 'Langkah 4',
			title: 'Session key',
			body: 'Kunci bersama yang baru untuk satu kunjungan ini. Kunci publik membantu membuatnya, dan kunci itu nggak pernah lewat dalam bentuk yang bisa dibaca.'
		},
		{
			tag: 'Langkah 5',
			title: 'Aman',
			body: 'Semua setelah handshake diacak pakai session key, dua arah.'
		},
		{
			tag: 'Biar nempel',
			title: 'Gembok dulu, baru kunci bersama',
			body: 'Asimetris buat <b>kenalan</b>, simetris buat <b>ngobrol</b>. Pelan tapi aman dulu, baru yang cepat.'
		},
		{
			tag: 'Penipu',
			title: 'Sertifikat palsu',
			body: 'Siapa pun bisa bikin KTP, tapi cuma CA terpercaya yang bisa menandatangani KTP untuk nimbus.com. KTP yang ditandatangani sendiri gagal diperiksa.'
		},
		{
			tag: 'Opsional',
			title: 'Rumah atau kafe',
			body: 'Ganti WiFi dan lihat handshake yang sama berakhir dengan gembok atau peringatan.'
		}
	],
	youLabel: 'Laptop kamu',
	serverLabel: 'nimbus.com',
	attackerLabel: 'Penipu',
	chips: { hello: 'halo', cert: 'KTP', key: 'kunci' },
	certHeading: 'Sertifikat',
	checks: ['nama nimbus.com', 'penanda tangan dipercaya', 'belum kedaluwarsa'],
	sessionKey: 'session key',
	warnTitle: 'Tidak privat',
	warnBody: 'Ada yang mungkin memalsukan nimbus.com',
	history: [
		{ name: 'SSL 2', year: '1995' },
		{ name: 'SSL 3', year: '1996' },
		{ name: 'TLS 1.0', year: '1999' },
		{ name: 'TLS 1.3', year: '2018' }
	],
	wifi: { label: 'Terhubung lewat', home: 'WiFi rumah', cafe: 'WiFi kafe mencurigakan' }
};
