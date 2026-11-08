import type { LinuxFilesText } from './types';

export const id: LinuxFilesText = {
	title: 'File system Linux',
	intro: [
		'Server nimbus.com pada latihan ini memakai Ubuntu Linux. Kamu mengaksesnya melalui <b>terminal</b> lewat [[SSH|cloud/remote-access]]. Perintah terminal dapat digunakan untuk melihat file dan mengelola aplikasi.',
		'Struktur direktori Linux dimulai dari <b>/</b>, disebut direktori root. Direktori lain berada di bawahnya, misalnya /home, /etc, dan /var.',
		'Pertanyaan pertama di tempat baru, aku lagi di mana? Perintah <b>pwd</b> yang jawab (print working directory). Lihat Nim ngetik. Kamu ada di /home/nim, folder rumahmu sendiri.',
		'<b>ls</b> menampilkan isi direktori. Jalankan <b>ls /</b> untuk melihat direktori utama. /home berisi direktori pengguna, /etc berisi konfigurasi, dan /var memuat data yang berubah seperti log.',
		'<b>cd</b> berpindah direktori. Path <b>/var/log/nimbus</b> berarti direktori nimbus di dalam log, yang berada di dalam var. Perhatikan penanda posisi saat perintah dijalankan.',
		'Terakhir, baca. <b>cat</b> nampilin isi file ke layar. Nim lihat isi foldernya, lalu baca error.log, dan ketemu deh alasan nimbus.com mati semalam. Disknya penuh.',
		'[ingat] pwd menampilkan direktori saat ini, ls menampilkan isinya, cd berpindah direktori, dan cat membaca isi file.',
		'[fyi] Windows caranya beda, tiap drive punya pohonnya sendiri (C, D, dan seterusnya). Di Linux, disk kedua atau flashdisk cuma muncul sebagai satu folder lagi di pohon yang sama.',
		'Giliranmu, dan ini kecil banget. Kamu lagi jauh di dalam /var/log/nimbus. Ketik <b>cd ~</b> buat langsung pulang. Tanda bergelombang <b>~</b> itu selalu berarti folder rumahmu.'
	],
	reactions: {
		home: 'Wuss, udah pulang ke /home/nim. Lihat promptnya, ada <b>~</b> lagi. Mau nyasar sejauh apa pun di server, cd ~ selalu bawa kamu pulang.',
		moved:
			'Kamu pindah, dan pinnya ikut pindah. Prompt selalu nunjukin kamu lagi di mana, jadi nggak perlu nebak. Ketik <b>cd ~</b> kapan aja kamu mau pulang.',
		looked:
			'Itu ls nampilin isi folder ini. Folder warnanya biru, file biasa putih. Mau masuk ke salah satunya? Pakai cd.',
		read: 'cat menampilkan isi file ini. Perintah ini cocok untuk membaca file teks pendek, seperti contoh log tersebut.',
		pwd: 'pwd ngasih tau persis kamu lagi di mana, path yang sama kayak yang ditunjuk pinnya.',
		rootHome:
			'Akses ke <b>/root</b> ditolak. Itu direktori home pengguna root, berbeda dari direktori utama <b>/</b>. Pelajari pengaturannya di [[Permission dan sudo|linux/permissions]].',
		missing:
			'Nggak ada yang namanya itu di sana. Coba <b>ls</b> buat lihat isinya. Oh iya, Linux peduli huruf besar kecil, jadi Log sama log itu dua nama yang beda.',
		denied:
			'Dikunci, yang itu cuma buat admin. Kuncinya nanti kamu pelajari di [[Permission dan sudo|linux/permissions]].',
		error: 'Server nggak kenal perintah itu. Cek lagi ejaannya, atau coba <b>cd ~</b>.'
	},
	panels: [
		{
			tag: 'Server',
			title: 'Mengakses file melalui terminal',
			body: '<b>Server</b> nyala siang malam di data center. Kamu ngobrol sama dia lewat ngetik di <b>terminal</b>, dan dia jawab pakai teks.'
		},
		{
			tag: 'Root',
			title: 'Direktori root',
			body: 'Semuanya mulai dari <b>/</b>. Path itu daftar folder yang kamu lewati dari puncak, dipisah pakai garis miring.'
		},
		{
			tag: 'pwd',
			title: 'Melihat direktori saat ini',
			body: '<b>pwd</b> nampilin folder tempat kamu berdiri. Pin di pohon nandain tempat yang sama.'
		},
		{
			tag: 'ls',
			title: 'Melihat daftar file',
			body: '<b>ls</b> nampilin isi folder. Di terminal, folder warnanya biru dan file biasa warnanya putih.'
		},
		{
			tag: 'cd',
			title: 'Berpindah direktori',
			body: '<b>cd</b> ditambah path bikin kamu pindah. Promptnya ikut berubah, selalu nunjukin kamu di mana.'
		},
		{
			tag: 'cat',
			title: 'Membaca isi file',
			body: '<b>cat</b> nampilin seluruh isi file. Log kayak gini itu teks biasa, memang dibuat buat dibaca manusia.'
		},
		{
			tag: 'Cara ingat',
			title: 'Empat perintah dasar',
			body: 'pwd, aku di mana. ls, ada apa di sini. cd, ayo ke sana. cat, lihat isinya.'
		},
		{
			tag: 'Info',
			title: 'Struktur direktori Linux',
			body: 'Disk tambahan gabung ke pohon sebagai folder, biasanya di <b>/mnt</b> atau <b>/media</b>. Nggak pernah ada drive C.'
		},
		{
			tag: 'Giliranmu',
			title: 'Kembali ke direktori home',
			body: 'Ketik <b>cd ~</b> lalu tekan Enter, terus lihat pinnya terbang balik ke /home/nim.'
		}
	],
	watchLabel: 'Nim lagi ngetik, lihat aja dulu',
	tryLabel: 'Giliranmu, ketik',
	tryTip: 'Tap biar Nim yang ngetik',
	inputLabel: 'perintah',
	termHint: '# Nim ngetik di sini dulu, lihat aja',
	hintUnknown: '# perintah itu nggak ada di sini',
	didYouMean: '# mungkin maksudnya {word}',
	hintMissing: '# nggak ada yang namanya itu, ls nampilin isi sekitar',
	hintDenied: '# dikunci, cuma pemiliknya atau admin yang boleh buka',
	hereLabel: 'Kamu di',
	cheats: [
		{ cmd: 'pwd', means: 'aku di mana' },
		{ cmd: 'ls', means: 'ada apa di sini' },
		{ cmd: 'cd', means: 'ayo ke sana' },
		{ cmd: 'cat', means: 'lihat isinya' }
	]
};
