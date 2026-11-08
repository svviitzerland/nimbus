import type { HardeningText } from './types';

export const id: HardeningText = {
	title: 'Server hardening',
	intro: [
		'Sebelum server nimbus.com menerima pengunjung, periksa software, akun, dan layanan yang aktif. Konfigurasi awal belum tentu cocok dengan kebutuhan aplikasi.',
		'Layanan yang terbuka ke internet dapat menerima percobaan login dan pemindaian otomatis. Setiap layanan tambahan perlu diperbarui dan diawasi.',
		'<b>Server hardening</b> adalah mengurangi peluang sistem disalahgunakan. Caranya termasuk memperbarui software, menonaktifkan layanan yang tidak diperlukan, membatasi akses jaringan, dan memberi akun izin secukupnya.',
		'Software lama belum tentu rentan hanya karena usianya. Cocokkan versi yang terpasang dengan [[advisori keamanan|security/cve-cwe]], lalu pasang perbaikan yang sesuai dan uji aplikasinya.',
		'[fyi] Saat menyewa VM di cloud, penyedia mengelola perangkat fisik, sedangkan kamu biasanya mengelola sistem operasi dan aplikasi di VM. Pembagian ini berubah menurut jenis layanan, sesuai [[shared responsibility|networking/shared-responsibility]].',
		'[ingat] <b>Perbarui, batasi, periksa.</b> Perbarui software, batasi layanan dan izin, lalu periksa hasil konfigurasi secara berkala.',
		'Jalankan scanner simulasi untuk melihat enam konfigurasi yang perlu diperbaiki. Pertahankan port HTTPS agar pengunjung tetap bisa membuka nimbus.com.'
	],
	reactions: {
		scan: 'Ada enam konfigurasi yang perlu diperbaiki. Pilih temuan untuk melihat perubahan yang diterapkan. Angka di layar menunjukkan progres latihan.',
		update:
			'Pembaruan keamanan dipasang dan pembaruan otomatis diaktifkan. Perbaikan ini mengatasi celah yang tercakup dalam paket tersebut. Aplikasi tetap perlu diuji setelah pembaruan.',
		telnet:
			'Layanan Telnet dinonaktifkan. Telnet mengirim login sebagai teks biasa. Gunakan SSH untuk administrasi jarak jauh melalui koneksi terenkripsi.',
		db: 'Akses database dibatasi ke server web. Permintaan langsung dari internet ditolak oleh aturan jaringan. Akun dan izin database tetap perlu diatur.',
		sshkey:
			'Login SSH sekarang memerlukan kunci. Ini mengurangi percobaan menebak password. Lindungi kunci privat dengan passphrase dan cabut aksesnya jika kunci bocor.',
		root: 'Aplikasi berjalan dengan akun khusus yang izinnya terbatas. Ini <b>least privilege</b>, memberi izin sesuai tugas untuk membatasi dampak jika aplikasi disusupi.',
		default:
			'Password bawaan diganti dengan password panjang dan unik. Kredensial bawaan mudah diketahui dari dokumentasi atau daftar konfigurasi umum.',
		web: 'nimbus.com tidak dapat dibuka karena port HTTPS ditutup. Buka kembali port 443 agar pengunjung bisa mengakses layanan yang memang dibutuhkan.',
		done: 'Enam perbaikan latihan selesai dan HTTPS tetap aktif. Konfigurasi ini mengurangi beberapa risiko, tetapi pemeriksaan, pembaruan, dan pemantauan tetap diperlukan.'
	},
	serverLabel: 'Server nimbus.com',
	scanBtn: 'Jalankan scanner',
	scoreLabel: 'Progres hardening',
	doors: {
		update: {
			name: 'Paket belum diperbarui',
			risk: 'Versi rentan masih terpasang',
			fix: 'Update',
			done: 'Terbaru, update otomatis nyala'
		},
		telnet: {
			name: 'Port 23, Telnet',
			risk: 'Login lama yang mengirim password apa adanya',
			fix: 'Tutup',
			done: 'Layanan Telnet dinonaktifkan'
		},
		db: {
			name: 'Port 3306, database',
			risk: 'Bisa dijangkau dari seluruh internet',
			fix: 'Tutup',
			done: 'Cuma server web yang bisa menjangkau'
		},
		sshkey: {
			name: 'Login SSH pakai password',
			risk: 'Login terbuka untuk tebakan password',
			fix: 'Pakai kunci',
			done: 'Cuma bisa login pakai kunci'
		},
		root: {
			name: 'Aplikasi jalan sebagai root',
			risk: 'Aplikasi memiliki hak administrator',
			fix: 'Batasi izin',
			done: 'Akun aplikasi dengan izin terbatas'
		},
		default: {
			name: 'Panel admin, admin dan admin',
			risk: 'Password bawaan pabrik, yang pertama dicoba bot',
			fix: 'Ganti',
			done: 'Password panjang dan unik'
		}
	},
	web: {
		name: 'Port 443, HTTPS',
		note: 'Pintu masuk pengunjungmu',
		close: 'Tutup',
		reopen: 'Buka lagi',
		closedNote: 'Tertutup, nggak ada yang bisa membuka nimbus.com'
	},
	openTag: 'terbuka',
	closedTag: 'tertutup',
	neededTag: 'dibutuhkan',
	siteUp: 'online',
	siteDown: 'offline',
	hintIdle: 'Periksa konfigurasi server',
	hintScan: 'Pilih temuan untuk memperbaiki konfigurasi',
	hintDone: 'Enam perbaikan latihan selesai'
};
