import type { ShellScriptText } from './types';

export const id: ShellScriptText = {
	title: 'Shell script',
	intro: [
		'Tiap malam sebelum tidur, kamu backup nimbus.com secara manual. Bikin folder, bungkus seluruh website jadi satu file arsip, cek filenya udah ada. Tiga perintah, tiap malam tanpa absen. Lupa satu malam aja, pasti malam itu juga disknya rusak.',
		'<b>Shell script</b> nyelesaiin masalah ini. Isinya cuma file teks berisi perintah perintahmu, ditulis berurutan, satu per baris. Jalanin filenya, dan shell bakal ngetikin semuanya buat kamu, dari atas ke bawah, persis sama tiap kali.',
		'Ada dua tambahan kecil yang bikin script kerasa pintar. Baris pertama, <b>#!/bin/bash</b> (orang nyebutnya shebang), ngasih tau program mana yang harus baca filenya. Terus <b>variabel</b> kayak DAY=$(date +%F) nyimpen tanggal hari ini, jadi tiap backup dapat nama sendiri.',
		'[fyi] Gabungin script sama <b>cron</b>, jam weker punya Linux, dan dia bakal jalan jam 2 pagi waktu kamu tidur. Begitulah server beneran ngelakuin [[backup|devops/backup]] tiap malam.',
		'Giliran kamu. Lakuin backup malam ini secara manual sekali, biar kerasa capeknya. Habis itu tulis langkahnya ke backup.sh, bikin bisa dijalanin kayak di [[Permission dan sudo|linux/permissions]], terus jalankan.'
	],
	reactions: {
		mkdir:
			'Foldernya jadi. Sekarang yang panjang, bungkus /var/www/nimbus jadi arsip dengan tanggal hari ini di namanya.',
		hand: 'Backup malam ini beres, tapi lihat betapa panjangnya baris tar tadi, tanggalnya juga diketik manual. Sekarang tulis ke script biar kamu nggak perlu ngetik itu lagi. Ketik <b>nano backup.sh</b> atau buka tab nano.',
		handAgain: 'Malam lain, baris panjang lain yang diketik manual. Inilah gunanya script.',
		write:
			'Kesimpan! backup.sh sekarang nyimpen semua langkah, dengan urutan yang benar. Tapi sekarang dia masih file teks biasa.',
		saved: 'Kesimpan lagi.',
		order:
			'Kesimpan, tapi urutan itu bakal bikin kesandung. Lihat catatan kuning di editor, terus benerin barisnya dan simpan lagi. Atau jalanin aja dan lihat apa yang salah.',
		chmod: 'backup.sh sekarang bisa dijalanin, saklar x yang sama kayak di pelajaran permission.',
		exec: 'backup.sh sekarang bisa dijalanin, saklar x yang sama kayak di pelajaran permission. Jalankan pakai <b>./backup.sh</b>.',
		runDenied:
			'Permission denied, file baru nggak pernah dapat saklar x dengan sendirinya. Kasih pakai <b>chmod +x backup.sh</b>.',
		brokenRun:
			'Dia jalan baris demi baris, tapi ada yang aneh. Script ngelakuin persis apa yang ditulis, dengan urutan persis segitu, jadi benerin urutannya di nano lalu simpan lagi.',
		emptyDay:
			'Lihat arsip bernama nimbus-.tar.gz itu? Baris tar jalan sebelum DAY diisi, jadi tanggalnya kosong. Variabel harus diisi dulu sebelum dipakai.',
		bashRun:
			'Itu bisa, bash baca filenya terus jalanin. Sekarang coba cara yang benar, <b>./backup.sh</b>, habis ngasih saklar x.',
		ran: 'Satu perintah, dan seluruh backup kejadian, folder, arsip, plus pesan ramah. Tekan Malam berikutnya buat lihat untung beneran.',
		run: 'Satu perintah, dan seluruh backup kejadian, folder, arsip, plus pesan ramah.',
		again:
			'Malam baru, tetap satu perintah pendek, dan arsip barunya dapat tanggal sendiri secara otomatis. Itulah sihirnya script.',
		nextDay: 'Malam baru udah datang. Jalanin <b>./backup.sh</b> lagi, satu perintah, bukan tiga.',
		nextDayHand:
			'Malam baru, dan backupnya harus dilakuin lagi. Kalau manual, tiga perintah, tiap malam, selamanya.',
		missing: 'Nggak ada yang namanya itu di sini. Jalanin <b>ls</b> buat lihat isinya.',
		denied: 'Dikunci. Cek huruf permissionnya pakai <b>ls -l</b>.',
		error:
			'Server nggak kenal perintah itu. Cek lagi ejaannya, atau ketik <b>help</b> buat lihat perintah yang dia tau.',
		done: 'Semua misi beres! Kamu ngubah tiga perintah ngebosenin jadi satu file yang ngerjain semuanya dengan sempurna tiap kali, lengkap sama tanggal yang benar. Script kayak gini dipakai buat backup, deploy website, sampai nyiapin server utuh, dan ini langkah pertama buat ngotomatisasi semuanya.'
	},
	missionsLabel: 'Misi',
	missions: [
		'Backup malam ini secara manual',
		'Tulis langkahnya ke backup.sh',
		'Bikin backup.sh bisa dijalanin',
		'Jalankan pakai ./backup.sh'
	],
	hintBtn: 'Bantu',
	doneNote: 'Semua misi beres, backupnya jalan sendiri',
	inputLabel: 'perintah',
	termHint: '# mulai dengan mkdir -p ~/backups, lalu tekan Enter',
	hintUnknown: '# perintah itu nggak ada di sini, ketik help buat lihat daftarnya',
	didYouMean: '# mungkin maksudnya {word}',
	hintMissing: '# nggak ada yang namanya itu, ls nampilin isi sekitar',
	hintDenied: '# permission denied, script baru butuh chmod +x',
	termTab: 'Terminal',
	editorEmpty: 'File kosong, tap baris di bawah sesuai urutan jalannya',
	poolLabel: 'Tap baris buat nambahin',
	saveBtn: 'Simpan',
	editorHint: 'Tap baris di file buat ngeluarin',
	orderNotes: {
		shebang: 'Shebang, #!/bin/bash, harus jadi baris paling pertama',
		day: 'DAY dipakai sebelum diisi, jadi tanggalnya bakal kosong',
		mkdir: 'tar jalan sebelum folder backups ada'
	},
	emptyShelf: 'Belum ada backup, nimbus.com belum terlindungi',
	nextDayBtn: 'Malam berikutnya',
	days: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
	nightLine: '# malam baru, {day}',
	hintNano: '# script yang mau diedit itu backup.sh, coba nano backup.sh'
};
