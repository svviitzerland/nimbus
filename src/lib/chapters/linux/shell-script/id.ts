import type { ShellScriptText } from './types';

export const id: ShellScriptText = {
	title: 'Shell script',
	intro: [
		'Tiap malam kamu nyimpen salinan nimbus.com, jaga jaga. Lihat Nim ngerjain pakai tangan. Bikin folder backups, terus bungkus seluruh situs jadi satu file pakai <b>tar</b> (mirip nge zip). Sekarang bayangin ngetik itu tiap malam.',
		'Komputer suka kerjaan membosankan, jadi kita serahin aja. <b>Shell script</b> itu file teks biasa isinya perintah, persis yang biasa kamu ketik. Nim nampilin backup.sh pakai <b>cat</b>, dan kartunya nulis dirinya sendiri.',
		'Baris paling pertama itu spesial. <b>#!/bin/bash</b> (orang nyebutnya shebang) ngasih tau Linux program mana yang harus baca file ini. Di sini bash, shell yang sama tempat kamu ngetik.',
		'Baris kedua bikin <b>variabel</b>, kotak bernama buat nyimpen nilai. DAY nyimpen tanggal hari ini, dan di bawahnya <b>$DAY</b> nuangin isinya ke nama file. Jadi tiap malam backupnya dapat nama baru, nggak ada yang ketimpa.',
		'Script itu program, jadi dia butuh saklar run, persis kayak di [[Permission dan sudo|linux/permissions]]. Nim ngetik <b>chmod +x backup.sh</b>, dan kartunya bilang boleh jalan.',
		'Sekarang <b>./backup.sh</b>. Bash baca barisnya dari atas ke bawah, persis kayak resep di [[Program dan algoritma|basics/program]], dan satu kotak baru mendarat di rak. Satu perintah pendek ngerjain semua ketikan tadi.',
		'[ingat] Script itu resep buat terminal. Tulis sekali, <b>chmod +x</b> sekali, terus <b>./</b> jalanin sesering yang kamu mau. Gampangnya, tulis, izinin, jalan.',
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
		read: 'Itu seluruh scriptnya, lima baris biasa. Nggak ada sulap, cuma perintah yang tadinya kamu ketik sendiri.',
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
			title: 'Baris yang sama tiap malam',
			body: '<b>mkdir</b> bikin folder, <b>tar</b> bungkus banyak file jadi satu. Sekali sih oke, tiap malam capek, dan gampang salah ketik tengah malam.'
		},
		{
			tag: 'Script',
			title: 'Perintah dalam file',
			body: '<b>Shell script</b> itu file teks berisi perintah. Jalanin script sama aja kayak ngetik tiap barisnya sendiri, berurutan.'
		},
		{
			tag: 'Shebang',
			title: 'Siapa yang baca file ini',
			body: '<b>#!/bin/bash</b> ditaruh di baris satu. Dia nyebut program yang jalanin sisanya, di sini bash.'
		},
		{
			tag: 'Variabel',
			title: 'Kotak bernama',
			body: '<b>DAY=</b> nyimpen nilai, <b>$DAY</b> makai nilainya. <b>$(date +%F)</b> jalanin date dan masukin jawabannya, kayak 2026 11 03.'
		},
		{
			tag: 'chmod +x',
			title: 'Boleh jalan',
			body: 'Tanpa saklar run, Linux nolak jalanin filenya. Satu chmod dan dia dianggap program.'
		},
		{
			tag: './backup.sh',
			title: 'Dari atas ke bawah',
			body: '<b>./</b> artinya file yang ada di sini. Bash baca tiap baris berurutan, dan sorotannya ikut jalan.'
		},
		{
			tag: 'Cara ingat',
			title: 'Tulis, izinin, jalan',
			body: 'Tulis resepnya sekali, kasih saklar run sekali, lalu satu baris pendek ngerjain semuanya.'
		},
		{
			tag: 'Info',
			title: 'Biar jalan sendiri',
			body: '<b>cron</b> nyalain perintah sesuai jadwal, tiap malam, tiap jam, tiap Senin. Script dan cron itu pasangan.'
		},
		{
			tag: 'Giliranmu',
			title: 'Backup malam ini',
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
	rule: 'Tulis sekali, chmod +x sekali, ./ selamanya.',
	nightLine: '# malam berikutnya, {day}'
};
