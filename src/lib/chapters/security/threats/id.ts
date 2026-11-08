import type { ThreatsText } from './types';

export const id: ThreatsText = {
	title: 'Threat modeling',
	intro: [
		'Toko nimbus.com menyimpan akun, pesanan, dan backup. Data mengalir dari HP pelanggan ke server, database, dan layanan mitra. Setiap hubungan memiliki akses yang perlu diperiksa.',
		'<b>Threat modeling</b> memetakan apa yang dilindungi, bagaimana sistem bekerja, dan apa yang bisa salah. Hasilnya membantu memilih perbaikan sebelum atau selama aplikasi dibangun.',
		'Mulai dengan empat pertanyaan. Apa yang sedang dibangun? Apa yang bisa salah? Apa yang akan dilakukan? Apakah perbaikannya cukup? Jawab dengan diagram dan bukti dari sistem.',
		'<b>Vulnerability</b> adalah kelemahan keamanan. <b>Exploit</b> memanfaatkan kelemahan itu, sedangkan <b>patch</b> memperbaikinya. Sebagian kerentanan yang dipublikasikan memiliki ID [[CVE|security/cve-cwe]]. Pilih titik lemah pada sistem, lalu lihat kontrol yang bisa mengurangi risikonya.',
		'<b>STRIDE</b> membantu mengelompokkan ancaman. <b>Spoofing</b> memakai identitas palsu, <b>tampering</b> mengubah data tanpa izin, dan <b>repudiation</b> menyangkal tindakan ketika bukti aktivitas tidak memadai.',
		'Tiga kategori berikutnya adalah <b>information disclosure</b>, membocorkan informasi, <b>denial of service</b>, membuat layanan tidak tersedia, dan <b>elevation of privilege</b>, mendapat hak akses melebihi yang diberikan.',
		'[ingat] <b>Aset, aliran data, ancaman, kontrol.</b> Catat apa yang dilindungi, ke mana datanya lewat, apa yang bisa salah, lalu perlindungan yang sesuai.',
		'Tandai bagian peta yang perlu diperiksa. Baca ancaman dan perlindungannya, termasuk akun mitra serta backup yang berada di luar halaman toko.'
	],
	reactions: {
		first:
			'Bagian itu masuk daftar pemeriksaan. Lanjutkan ke hubungan antara perangkat, akun, dan layanan lain.',
		vendor:
			'Akun mitra bisa mengakses bagian sistem yang diberikan kepadanya. Batasi izin dan periksa aktivitasnya seperti akun internal.',
		backup:
			'Backup berisi salinan data, sehingga akses tanpa izin ke backup juga dapat membocorkan informasi.',
		compareAll:
			'Semua bagian contoh sudah diperiksa. Langkah berikutnya adalah menentukan kontrol, penanggung jawab, dan cara menguji perbaikannya.',
		compareSome:
			'Bagian berwarna kuning belum ditandai. Pilih untuk melihat ancaman yang belum masuk daftarmu.'
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
			threat: 'Versi software yang terpasang memiliki celah yang belum diperbaiki.',
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
			threat: 'Akun mitra disalahgunakan untuk mengakses sistem yang terhubung.',
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
