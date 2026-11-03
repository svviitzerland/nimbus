import type { ThreatsText } from './types';

export const id: ThreatsText = {
	title: 'Threat modeling',
	intro: [
		'Maling yang pintar nggak pernah melawan gembok besar di pintu depan. Dia mengecek jendela kamar mandi, pagar belakang, dan kunci cadangan di bawah pot bunga.',
		'Penyerang juga berpikir begitu. <b>Threat modeling</b> artinya melihat sistemmu sendiri lewat mata penyerang, sebelum penyerang sungguhan melakukannya, lalu menambal pintu paling lemah duluan.',
		'Intinya cuma empat pertanyaan sederhana. Kita lagi membangun apa? Apa yang bisa salah? Apa yang akan kita lakukan? Sudah cukup bagus belum? Penulis keamanan Adam Shostack yang membuat empat pertanyaan ini terkenal.',
		'Cerita nyata menunjukkan kenapa ini penting. Tahun 2013 jaringan toko Amerika, Target, kebobolan sekitar 40 juta nomor kartu. Penyerangnya nggak mulai dari situs toko. Mereka masuk duluan pakai akun milik perusahaan kecil jasa pemanas dan AC yang bekerja untuk Target.',
		'[fyi] Tahun 1999, dua insinyur Microsoft, Loren Kohnfelder dan Praerit Garg, menulis daftar periksa bernama <b>STRIDE</b>, enam jenis ancaman yang perlu dicari. Sampai sekarang banyak tim di dunia masih memakainya.',
		'Nih peta toko nimbus.com. Ketuk setiap tempat yang menurutmu bisa dicoba penyerang, lalu bandingkan daftarmu dengan daftar Nim.'
	],
	reactions: {
		first:
			'Awal yang bagus. Tiap tanda itu satu pintu yang perlu dijaga. Lanjut, dan coba pikirkan juga yang di luar situsnya.',
		vendor:
			'Jeli banget. Persis begitu cara Target dibobol, lewat mitra yang kuncinya lebih lemah. Siapa pun yang bisa login ke sistemmu ikut jadi bagian keamananmu, termasuk teknisi AC.',
		backup:
			'Mantap, kebanyakan orang lupa soal backup. Backup itu salinan lengkap datamu, jadi mencurinya sama saja dengan mencuri aslinya.',
		compareAll:
			'Semua tempat di daftar Nim kamu temukan. Kamu sudah berpikir seperti penjaga. Tim sungguhan melakukan ini di papan tulis sebelum mulai menulis kode.',
		compareSome:
			'Lumayan banget. Yang warna kuning itu yang terlewat, ketuk untuk lihat kenapa penting. Kelewatan beberapa itu wajar, makanya tim memetakan ancaman bareng bareng, makin banyak mata makin banyak pintu yang ketemu.'
	},
	spots: {
		phone: {
			name: 'HP pelanggan',
			threat: 'Halaman login palsu menipu pelanggan supaya mengetik password (phishing).',
			fix: 'Tambah langkah login kedua, jadi password curian saja nggak cukup.'
		},
		wifi: {
			name: 'WiFi kafe',
			threat: 'Orang di WiFi yang sama ikut menguping data yang lewat.',
			fix: 'Pakai HTTPS di mana mana, jadi yang lewat sudah terenkripsi.'
		},
		login: {
			name: 'Halaman login',
			threat: 'Bot menebak ribuan password tiap menit.',
			fix: 'Batasi jumlah percobaan dan perlambat kalau gagal terus.'
		},
		server: {
			name: 'Server web',
			threat: 'Software lama dengan celah terkenal yang belum diperbarui.',
			fix: 'Rajin update dan tutup port yang nggak dipakai.'
		},
		db: {
			name: 'Database',
			threat: 'Data pelanggan disalin keluar sekaligus.',
			fix: 'Simpan hash password saja dan enkripsi data penting.'
		},
		admin: {
			name: 'Laptop admin',
			threat: 'Isinya kunci ke semua hal, dan kadang ditinggal di meja tanpa dikunci.',
			fix: 'Beri tiap orang akses secukupnya, dan kunci layarnya.'
		},
		vendor: {
			name: 'Akun mitra',
			threat: 'Teknisi AC juga punya akun login, dan keamanannya mungkin lebih lemah dari kamu.',
			fix: 'Beri mitra akun terpisah yang aksesnya kecil, lalu awasi aktivitasnya.'
		},
		backup: {
			name: 'Disk backup',
			threat: 'Salinan lengkap data, sering dijaga lebih santai daripada aslinya.',
			fix: 'Enkripsi backup dan simpan di tempat terkunci.'
		}
	},
	tapHint: 'Ketuk tempat di peta untuk menandainya',
	compareBtn: 'Bandingkan dengan daftar Nim',
	compareNeed: 'Tandai {n} lagi untuk membandingkan',
	score: 'Kamu menemukan {n} dari {total}',
	missedLabel: 'Nim juga menemukan',
	threatLabel: 'Yang bisa salah',
	fixLabel: 'Cara menambal',
	foundTag: 'punyamu',
	missedTag: 'terlewat',
	resetBtn: 'Ulangi petanya'
};
