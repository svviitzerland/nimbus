import type { ShellScriptText } from './types';

export const id: ShellScriptText = {
	title: 'Shell script',
	intro: [
		'Tiap malam kamu nyimpen salinan nimbus.com, jaga jaga. Lihat Nim ngerjain pakai tangan. Bikin folder backups, terus bungkus seluruh situs jadi satu file pakai <b>tar</b> (mirip nge zip). Sekarang bayangin ngetik itu tiap malam.',
		'Komputer suka kerjaan membosankan, jadi kita serahin aja. <b>Shell script</b> itu file teks biasa isinya perintah, persis yang biasa kamu ketik. Nim nampilin backup.sh pakai <b>cat</b>, dan kartunya nulis dirinya sendiri.',
		'Baris paling pertama itu spesial. <b>#!/bin/bash</b> (orang nyebutnya shebang) ngasih tau Linux program mana yang harus baca file ini. Di sini bash, shell yang sama tempat kamu ngetik.',
		'Variabel <b>DAY</b> menyimpan tanggal, lalu <b>$DAY</b> dipakai pada nama file backup. Tanggal yang berbeda menghasilkan nama berbeda. Jika dijalankan dua kali pada tanggal yang sama, script ini bisa menimpa file sebelumnya.',
		'Agar script dapat dieksekusi langsung, beri izin eksekusi memakai <b>chmod +x backup.sh</b>. Pengaturan ini dibahas di [[Permission dan sudo|linux/permissions]].',
		'Jalankan <b>./backup.sh</b>. Bash menjalankan perintah dalam script sehingga folder dan arsip backup dibuat tanpa mengetik ulang setiap baris.',
		'[ingat] Tulis perintah dalam file. Dengan shebang dan izin eksekusi yang sesuai, jalankan script memakai ./nama-file.',
		'[fyi] Pasangin script sama <b>cron</b>, jam weker nya Linux, dan dia jalan jam 2 pagi waktu kamu tidur. Begitulah server beneran ngerjain [[backup|devops/backup]] tiap malam.',
		'Giliranmu. Udah malam berikutnya nih. Ketik <b>./backup.sh</b> dan lihat kotak baru dengan tanggal baru mendarat di rak.'
	],
	reactions: {
		ran: 'Malam baru, kotak baru, dan kamu cuma ngetik satu perintah pendek. Jalanin lagi kalau mau, tiap kali jalan itu malam berikutnya.',
		bashRun:
			'Itu juga bisa. <b>bash backup.sh</b> nyuruh bash baca filenya, jadi malah nggak butuh saklar run.',
		chmod: 'Saklar run nya nyala. Sekarang <b>./backup.sh</b> bisa jalanin dia.',
		chmodOff:
			'Kamu nyabut saklar run nya, jadi ./backup.sh bakal ditolak. Pasang lagi pakai <b>chmod +x backup.sh</b>.',
		read: 'File ini berisi urutan perintah backup. Shell membaca dan menjalankan perintah tersebut ketika script dipanggil.',
		runDenied:
			'Permission denied, scriptnya belum punya saklar run. Kasih pakai <b>chmod +x backup.sh</b>.',
		missing:
			'Nggak ada yang namanya itu di sini. Scriptnya ada di folder rumahmu, jadi ketik <b>./backup.sh</b>.',
		denied: 'Dikunci, cuma pemiliknya atau admin yang boleh.',
		error: 'Servernya nggak ngerti. Coba <b>./backup.sh</b>, titik dan garis miringnya ikut.'
	},
	panels: [
		{
			tag: 'Manual',
			title: 'Mengulang perintah yang sama',
			body: '<b>mkdir</b> bikin folder, <b>tar</b> bungkus banyak file jadi satu. Sekali sih oke, tiap malam capek, dan gampang salah ketik tengah malam.'
		},
		{
			tag: 'Script',
			title: 'Perintah dalam file',
			body: '<b>Shell script</b> itu file teks berisi perintah. Jalanin script sama aja kayak ngetik tiap barisnya sendiri, berurutan.'
		},
		{
			tag: 'Shebang',
			title: 'Menentukan interpreter',
			body: '<b>#!/bin/bash</b> ditaruh di baris satu. Dia nyebut program yang jalanin sisanya, di sini bash.'
		},
		{
			tag: 'Variabel',
			title: 'Variabel DAY',
			body: '<b>DAY=</b> nyimpen nilai, <b>$DAY</b> makai nilainya. <b>$(date +%F)</b> jalanin date dan masukin jawabannya, kayak 2026 11 03.'
		},
		{
			tag: 'chmod +x',
			title: 'Memberi izin eksekusi',
			body: 'Tanpa saklar run, Linux nolak jalanin filenya. Satu chmod dan dia dianggap program.'
		},
		{
			tag: './backup.sh',
			title: 'Menjalankan script',
			body: '<b>./</b> artinya file yang ada di sini. Bash baca tiap baris berurutan, dan sorotannya ikut jalan.'
		},
		{
			tag: 'Cara ingat',
			title: 'Membuat dan menjalankan script',
			body: 'Tulis resepnya sekali, kasih saklar run sekali, lalu satu baris pendek ngerjain semuanya.'
		},
		{
			tag: 'Info',
			title: 'Menjadwalkan script',
			body: '<b>cron</b> nyalain perintah sesuai jadwal, tiap malam, tiap jam, tiap Senin. Script dan cron itu pasangan.'
		},
		{
			tag: 'Giliranmu',
			title: 'Jalankan backup',
			body: 'Ketik <b>./backup.sh</b> lalu tekan Enter. Tiap jalan itu malam baru, jadi tiap jalan nambah satu kotak.'
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
	hintDenied: '# dikunci, filenya butuh saklar run',
	byHand: 'Malam ini, pakai tangan',
	runnableChip: 'boleh jalan',
	emptyShelf: 'masih kosong',
	rule: 'chmod +x memberi izin eksekusi. ./backup.sh menjalankan script dari folder saat ini.',
	nightLine: '# malam berikutnya, {day}'
};
