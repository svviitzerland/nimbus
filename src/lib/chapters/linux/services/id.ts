import type { ServicesText } from './types';

export const id: ServicesText = {
	title: 'Service dan systemd',
	intro: [
		'Semalam kamu nyalain app nimbus.com pakai tangan, terus nutup laptop. Begitu kamu logout, appnya ikut berhenti, dan situsnya gelap. Program yang dinyalain manual cuma hidup selama kamu masih di situ.',
		'Website harus jalan siang malam tanpa ada yang nungguin. Program yang jalan diam diam di belakang layar kayak gitu namanya <b>service</b>. Di Ubuntu ada penjaga namanya <b>systemd</b> yang nyalain service, ngawasin, dan bangunin lagi kalau dia jatuh.',
		'Kamu ngobrol sama systemd pakai <b>systemctl</b>. Pertama Nim nanya kabar appnya, <b>systemctl status nimbus</b>. Jawabannya inactive (dead). Sama sekali nggak jalan.',
		'Jadi Nim nyalain, <b>sudo systemctl start nimbus</b> (ngatur service itu kerjaan admin, makanya pakai sudo). Lampunya hijau dan situsnya balik.',
		'Sekarang bagian kerennya. Nim sengaja bikin appnya mati pakai <b>pkill</b> (perintah buat matiin program). Lampunya merah, dan sebentar kemudian systemd sadar lalu nyalain lagi sendiri. Nggak ada yang perlu bangun jam 3 pagi.',
		'Tinggal satu masalah. Kalau seluruh server restart (update, listrik mati), appnya balik nggak? Cuma kalau kamu minta. <b>sudo systemctl enable nimbus</b> nyuruh systemd nyalain dia tiap kali server boot. Lihat saklarnya.',
		'[ingat] <b>start</b> itu buat sekarang, <b>enable</b> itu buat tiap kali nyala. Biasanya kamu mau dua duanya. stop dan disable itu kebalikannya.',
		'[fyi] Kata yang sama, dunia yang beda. Provider cloud jualan "managed services", dan Windows punya jendela Services sendiri. Tempatnya beda, idenya sama, program yang dijagain biar terus jalan di belakang layar.',
		'Giliranmu. Habis ngubah app, admin biasanya restart biar versi barunya kepakai. Ketik <b>sudo systemctl restart nimbus</b> dan lihat lampunya kedip mati lalu nyala lagi.'
	],
	reactions: {
		restarted:
			'Mati dan nyala lagi sekejap. Appnya reload, situsnya hampir nggak kerasa. Begitulah admin ngeluarin versi baru.',
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
		error: 'Servernya nggak ngerti. Coba <b>sudo systemctl restart nimbus</b>, persis kayak gitu.'
	},
	panels: [
		{
			tag: 'Masalahnya',
			title: 'Hilang waktu kamu pergi',
			body: 'Program yang kamu nyalain manual itu milik sesimu. Logout, dan dia ikut berhenti.'
		},
		{
			tag: 'Service',
			title: 'Jalan di belakang layar',
			body: '<b>Service</b> tetap jalan walau nggak ada yang login. <b>systemd</b> itu penjaga yang nyalain, ngawasin, dan restart dia.'
		},
		{
			tag: 'status',
			title: 'Gimana kabarnya',
			body: '<b>systemctl status</b> nunjukin apakah service jalan atau nggak, dan diset nyala waktu boot atau nggak.'
		},
		{
			tag: 'start',
			title: 'Jalanin sekarang',
			body: '<b>sudo systemctl start nimbus</b> nyalain app di belakang layar. Lampu di rak nunjukin dia hidup.'
		},
		{
			tag: 'Restart=always',
			title: 'Bangkit lagi',
			body: 'Satu baris di file service minta systemd nyalain app lagi tiap kali dia mati. Tiap restart juga dihitung.'
		},
		{
			tag: 'enable',
			title: 'Nyala tiap boot',
			body: '<b>enable</b> nggak nyalain apa pun sekarang. Dia cuma nyalain saklar biar app ikut nyala tiap server boot.'
		},
		{
			tag: 'Biar nempel',
			title: 'Sekarang atau tiap boot',
			body: 'start, sekarang. enable, tiap nyala. stop dan disable ngebatalin, dan restart itu stop plus start yang cepat.'
		},
		{
			tag: 'Info',
			title: 'Service di mana mana',
			body: 'Web server, database, bahkan pintu SSH tempat kamu masuk tadi, semuanya service yang dijagain systemd.'
		},
		{
			tag: 'Giliranmu',
			title: 'Restart appnya',
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
