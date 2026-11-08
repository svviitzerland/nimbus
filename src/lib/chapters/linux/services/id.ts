import type { ServicesText } from './types';

export const id: ServicesText = {
	title: 'Service dan systemd',
	intro: [
		'Aplikasi yang dijalankan dari terminal bisa berhenti ketika sesi ditutup, bergantung cara menjalankannya. Untuk nimbus.com, kita ingin proses dikelola terpisah dari sesi terminal.',
		'<b>Service</b> dapat berjalan tanpa sesi terminal pengguna. Pada Ubuntu ini, <b>systemd</b> mengelola kapan service dimulai, dihentikan, atau dijalankan ulang sesuai konfigurasi.',
		'Kamu ngobrol sama systemd pakai <b>systemctl</b>. Pertama Nim nanya kabar appnya, <b>systemctl status nimbus</b>. Jawabannya inactive (dead). Sama sekali nggak jalan.',
		'Jadi Nim nyalain, <b>sudo systemctl start nimbus</b> (ngatur service itu kerjaan admin, makanya pakai sudo). Lampunya hijau dan situsnya balik.',
		'Nim menghentikan proses memakai <b>pkill</b>. Dalam contoh ini, konfigurasi systemd mengaktifkan restart otomatis sehingga proses dijalankan lagi. Restart membantu pemulihan, tetapi penyebab kegagalan tetap perlu diperiksa.',
		'Tinggal satu masalah. Kalau seluruh server restart (update, listrik mati), appnya balik nggak? Cuma kalau kamu minta. <b>sudo systemctl enable nimbus</b> nyuruh systemd nyalain dia tiap kali server boot. Lihat saklarnya.',
		'[ingat] <b>start</b> itu buat sekarang, <b>enable</b> itu buat tiap kali nyala. Biasanya kamu mau dua duanya. stop dan disable itu kebalikannya.',
		'[fyi] Kata yang sama, dunia yang beda. Provider cloud jualan "managed services", dan Windows punya jendela Services sendiri. Tempatnya beda, idenya sama, program yang dijagain biar terus jalan di belakang layar.',
		'Giliranmu. Habis ngubah app, admin biasanya restart biar versi barunya kepakai. Ketik <b>sudo systemctl restart nimbus</b> dan lihat lampunya kedip mati lalu nyala lagi.'
	],
	reactions: {
		restarted:
			'Service dihentikan lalu dijalankan kembali. Restart dapat menimbulkan jeda layanan, jadi periksa status dan log setelahnya.',
		started: 'Jalan. Lampunya hijau dan pengunjung bisa buka nimbus.com lagi.',
		stopped:
			'Berhenti, situsnya gelap. systemd nggak bakal nyalain yang sengaja kamu matiin. Nyalain lagi pakai <b>sudo systemctl start nimbus</b>.',
		status:
			'status itu hal pertama yang dicek, dia ngasih tau appnya jalan atau nggak dan sejak kapan.',
		enabled: 'Enabled. Sekarang nimbus nyala sendiri tiap kali server boot.',
		disabled: 'Disabled. Sekarang masih jalan, tapi habis reboot berikutnya dia bakal tetap mati.',
		crashed: 'Mati! Lihat roda giginya. systemd sadar dan nyalain appnya lagi sebentar lagi.',
		nothingToCrash: 'Nggak ada yang bisa dimatiin, appnya lagi nggak jalan.',
		needSudo:
			'systemd mau tau kamu admin atau bukan. Taruh <b>sudo</b> di depan, kayak di [[Permission dan sudo|linux/permissions]].',
		noUnit:
			'systemd nggak kenal service dengan nama itu di sini. Punya kita namanya <b>nimbus</b>.',
		missing: 'Nggak ada yang namanya itu di sini. Coba <b>sudo systemctl restart nimbus</b>.',
		denied: 'Dikunci, itu butuh admin. Taruh <b>sudo</b> di depan.',
		error: 'Perintah belum sesuai latihan. Coba <b>sudo systemctl restart nimbus</b>.'
	},
	panels: [
		{
			tag: 'Masalahnya',
			title: 'Sesi terminal ditutup',
			body: 'Program yang kamu nyalain manual itu milik sesimu. Logout, dan dia ikut berhenti.'
		},
		{
			tag: 'Service',
			title: 'Program yang dikelola sebagai service',
			body: '<b>Service</b> tetap jalan walau nggak ada yang login. <b>systemd</b> itu penjaga yang nyalain, ngawasin, dan restart dia.'
		},
		{
			tag: 'status',
			title: 'Status service',
			body: '<b>systemctl status</b> nunjukin service nya jalan atau nggak, dan diset nyala waktu boot atau nggak.'
		},
		{
			tag: 'start',
			title: 'Menjalankan service',
			body: '<b>sudo systemctl start nimbus</b> nyalain app di belakang layar. Lampu di rak nunjukin dia hidup.'
		},
		{
			tag: 'Restart=always',
			title: 'Restart otomatis',
			body: 'Satu baris di file service minta systemd nyalain app lagi tiap kali dia mati. Tiap restart juga dihitung.'
		},
		{
			tag: 'enable',
			title: 'Aktif saat boot',
			body: '<b>enable</b> nggak nyalain apa pun sekarang. Dia cuma nyalain saklar biar app ikut nyala tiap server boot.'
		},
		{
			tag: 'Cara ingat',
			title: 'Start dan enable',
			body: 'start, sekarang. enable, tiap nyala. stop dan disable ngebatalin, dan restart itu stop plus start yang cepat.'
		},
		{
			tag: 'Info',
			title: 'Contoh service lainnya',
			body: 'Web server, database, bahkan pintu SSH tempat kamu masuk tadi, semuanya service yang dijagain systemd.'
		},
		{
			tag: 'Giliranmu',
			title: 'Memulai ulang aplikasi',
			body: 'Ketik <b>sudo systemctl restart nimbus</b> lalu tekan Enter. Lampunya kedip, situsnya tetap nyala.'
		}
	],
	watchLabel: 'Nim lagi ngetik, lihat aja dulu',
	tryLabel: 'Giliranmu, ketik',
	tryTip: 'Tap biar Nim yang ngetik',
	inputLabel: 'perintah',
	termHint: '# Nim ngetik di sini dulu, lihat aja',
	hintUnknown: '# perintah itu nggak ada di sini',
	didYouMean: '# mungkin maksudnya {word}',
	hintMissing: '# nggak ada yang namanya itu di sini',
	hintDenied: '# dikunci, cuma admin yang boleh',
	serverLabel: 'Server nimbus.com',
	bootLabel: 'Nyala waktu boot',
	siteUp: 'online',
	siteDown: 'nggak bisa dibuka',
	states: {
		active: 'jalan',
		inactive: 'nggak jalan',
		dead: 'mati mendadak',
		restarting: 'lagi bangkit'
	},
	rule: 'start itu sekarang, enable itu tiap nyala.',
	hintSudo: '# ngatur service butuh admin, taruh sudo di depan',
	hintSystemctl: '# coba sudo systemctl restart nimbus'
};
