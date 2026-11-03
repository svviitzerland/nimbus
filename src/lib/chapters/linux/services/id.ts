import type { ServicesText } from './types';

export const id: ServicesText = {
	title: 'Service dan systemd',
	intro: [
		'Aplikasi nimbus.com itu program, dan program cuma kerja selama dia lagi jalan. Ditutup, situsnya hilang. Terus siapa yang nyalain dia waktu server nyala jam 3 pagi, dan siapa yang ngangkat dia lagi kalau dia mogok pas kamu tidur?',
		'Di Linux, tugas itu punya <b>systemd</b>, program paling pertama yang jalan waktu mesin dinyalain. Dia baca resep singkat buat tiap program, nyalain semuanya dengan urutan yang benar, terus ngawasin mereka seharian.',
		'Program yang dijagain systemd disebut <b>service</b>, dan resepnya itu file teks kecil yang namanya <b>unit</b>. Punya kita nyebutin perintah apa yang dijalanin, plus satu baris ajaib, <b>Restart=always</b>, artinya kalau dia mati, nyalain lagi.',
		'Kamu ngobrol sama systemd pakai <b>systemctl</b>. <b>status</b> nunjukin kabar sebuah service, <b>start</b> dan <b>stop</b> ya sesuai namanya, dan <b>enable</b> artinya nyala sendiri tiap kali booting. Ngubah service itu kerjaan admin, jadi yang itu butuh sudo.',
		'[fyi] Windows juga punya ide yang sama. Buka jendela Services, nanti kelihatan program yang diset nyala Automatically. HP kamu juga gitu, makanya aplikasi chat tetap dapat pesan habis HP direstart.',
		'Giliran kamu. Cek service nimbus terus nyalain. Habis itu jahil dikit, bikin dia mogok, lalu reboot seluruh server, dan lihat siapa yang ngebalikin situsnya.'
	],
	reactions: {
		status:
			'<b>inactive (dead)</b>, jadi nimbus.com lagi mati sekarang. Lihat juga tulisan <b>disabled</b> di baris Loaded, artinya dia juga nggak bakal nyala sendiri waktu booting.',
		started:
			'Aplikasinya jalan, lihat PID (nomor prosesnya) dan garis hijaunya. Pengunjung bisa buka nimbus.com lagi.',
		startedAgain: 'Jalan lagi.',
		restarted:
			'Direstart, berhenti dan nyala sekaligus, dengan PID baru. Berguna habis kamu ngubah pengaturan.',
		crashed:
			'Duar, aplikasinya mati dan pengunjung nggak lihat apa apa. Sekarang diam aja, perhatiin kartu systemd.',
		revived:
			'Balik sendiri! systemd lihat programnya mati, nunggu sebentar, terus nyalain lagi pakai PID baru. Berkat Restart=always, situsnya cuma mati sekitar dua detik, bukan sampai pagi.',
		revivedAgain: 'Balik lagi, tiap kali. Lihat angka restartnya naik.',
		nothingToCrash: 'Nggak ada yang bisa dibikin mogok, aplikasinya belum jalan. Nyalain dulu.',
		statusRestarting:
			'Ketangkap pas lagi diselamatin. <b>activating (auto-restart)</b> artinya systemd sebentar lagi ngebalikin dia.',
		stopped:
			'Dimatiin dengan sengaja. systemd nggak bakal nyalain lagi service yang kamu matiin sendiri, Restart=always cuma buat kejadian nggak terduga.',
		enabled:
			'Enabled. systemd bikin link kecil yang bilang nyalain nimbus tiap booting. Sekarang coba tombol reboot.',
		disabled:
			'Disabled, jadi habis reboot berikutnya aplikasinya bakal tetap mati sampai ada yang nyalain.',
		rebooting:
			'Servernya lagi restart. Sesi SSH kamu ikut putus karena semuanya dimatiin, terus kamu login lagi.',
		bootDown:
			'Servernya udah balik, tapi nimbus.com nggak. Servicenya belum pernah di<b>enable</b>, jadi systemd nggak nyalain dia waktu booting. Ini persis masalah jam 3 pagi tadi. Enable dulu, terus reboot lagi.',
		bootIdle:
			'Servernya balik, dan aplikasinya mati, sama kayak sebelumnya. Nyalain, enable, lalu reboot biar kelihatan bedanya.',
		boot: 'Nyala sendiri habis reboot total! Karena udah enabled, systemd nyalain aplikasinya waktu booting, bahkan sebelum kamu login lagi.',
		bootAgain: 'Balik lagi habis reboot. Service yang enabled pasti balik.',
		journal:
			'Itu <b>journal</b>, buku harian systemd. Tiap nyala, mogok, dan restart dicatat di situ lengkap sama jamnya, jadi kamu bisa lihat apa yang terjadi waktu kamu nggak ada.',
		unitFile:
			'Itu isi unitnya. <b>ExecStart</b> perintah yang dijalanin, <b>Restart=always</b> ngebalikin dia kalau mati, dan <b>WantedBy</b> tempat enable nyantolin dia waktu booting.',
		needSudo:
			'Ngubah service itu kerjaan admin, jadi systemd nanya kamu siapa. Taruh <b>sudo</b> di depan, kayak di [[Permission dan sudo|linux/permissions]].',
		noUnit: 'systemd nggak punya service dengan nama itu. Yang kita urus namanya <b>nimbus</b>.',
		missing: 'Nggak ada yang namanya itu di sini. Jalanin <b>ls</b> buat lihat isinya.',
		denied: 'Dikunci. Yang itu butuh kuasa admin, coba pakai <b>sudo</b> di depan.',
		error:
			'Server nggak kenal perintah itu. Cek lagi ejaannya, atau ketik <b>help</b> buat lihat perintah yang dia tau.',
		done: 'Semua misi beres! Kamu ngecek service, nyalain, bikin mogok terus lihat systemd ngidupin lagi, dan bikin dia selamat dari reboot total. Server beneran jalanin puluhan service kayak gini, nginx, database, SSH, dan systemd diam diam ngejagain semuanya.'
	},
	missionsLabel: 'Misi',
	missions: [
		'Cek service nimbus',
		'Nyalain',
		'Bikin mogok, lihat dia balik',
		'Bikin nyala waktu booting, lalu reboot'
	],
	hintBtn: 'Bantu',
	doneNote: 'Semua misi beres, nimbus.com bisa jaga dirinya sendiri',
	inputLabel: 'perintah',
	termHint: '# coba systemctl status nimbus, lalu tekan Enter',
	hintUnknown: '# perintah itu nggak ada di sini, ketik help buat lihat daftarnya',
	didYouMean: '# mungkin maksudnya {word}',
	hintMissing: '# nggak ada yang namanya itu, ls nampilin isi sekitar',
	hintDenied: '# dikunci, coba pakai sudo di depan',
	crashBtn: 'Bikin mogok',
	rebootBtn: 'Reboot server',
	serverLabel: 'Server kamu',
	bootLabel: 'Nyala waktu booting',
	restartsLabel: 'Restart',
	yes: 'ya',
	no: 'nggak',
	visitorsLabel: 'Yang dilihat pengunjung',
	siteUp: 'nimbus.com nyala',
	siteDown: 'nimbus.com mati',
	states: {
		active: 'jalan',
		inactive: 'berhenti',
		dead: 'mogok',
		restarting: 'lagi restart',
		booting: 'server lagi reboot'
	},
	hintSudo: '# ngubah service butuh kuasa admin, taruh sudo di depan',
	hintSystemctl: '# coba systemctl status nimbus',
	hintUnit: '# nama servicenya nimbus',
	hintKill: '# ps nunjukin program yang jalan dan PIDnya'
};
