import type { HardeningText } from './types';

export const id: HardeningText = {
	title: 'Server Hardening',
	intro: [
		'Kamu baru saja menyewa server baru untuk nimbus.com. Begitu keluar dari kotaknya, dia kayak rumah baru yang semua pintunya dibiarkan terbuka sama tukangnya, plus kunci cadangan di bawah keset.',
		'Dan kamu nggak bakal sendirian lama. Beberapa menit setelah online, <b>bot</b> mulai mengetuk. Bot itu program kecil yang keliling seluruh internet, mencoba semua pintu yang dia temukan, siang dan malam.',
		'Pintu pintu itu namanya <b>port</b>. Port adalah pintu bernomor tempat sebuah program menunggu tamu, misalnya 443 untuk website atau 22 untuk login dari jauh. <b>Scanner</b> berjalan melewati tiap pintu dan melaporkan mana yang menjawab. Sekarang skornya jelek.',
		'Langkah pertama, update. Tahun 2017 biro kredit Equifax kebobolan data pribadi sekitar 147 juta orang lewat celah di Apache Struts, software yang jalan di web servernya. Perbaikannya sudah keluar dua bulan sebelumnya. Nggak ada yang memasangnya.',
		'Langkah kedua, tutup semua pintu yang nggak kamu perlukan. Berbagi file model lama, Telnet, database, halaman tes yang terlupa. Lihat mereka tertutup satu per satu, dan lihat skor scanner naik.',
		'Langkah ketiga, kunci pintu yang tetap dipakai. Pintu admin (SSH) sekarang cuma bisa dibuka pakai <b>file kunci</b> yang tersimpan di laptopmu, bukan password yang bisa ditebak bot. Dan nggak ada yang login sebagai root, user yang boleh melakukan apa saja.',
		'Satu pintu sengaja tetap terbuka, pintu website yang dipakai pengunjung. Hardening bukan mengunci semuanya, tapi memastikan satu satunya jalan masuk adalah jalan yang kamu awasi.',
		'[fyi] Hardening bukan cuma untuk server. HP kamu yang terus minta update juga bentuk hardening. Di cloud, provider mengamankan gedung dan mesinnya, tapi server yang kamu sewa tetap urusanmu, itulah [[shared responsibility|networking/shared-responsibility]].',
		'[ingat] Rumus keluar rumah. Pintu yang nggak dipakai, tutup. Pintu yang dipakai, gembok. Dan gemboknya jangan yang sudah karatan, alias selalu update.',
		'Mau lihat kenapa ini penting? Buka lagi pintu Telnet, lalu lihat apa yang dilakukan bot dan scanner.'
	],
	reactions: {
		reopen:
			'Beberapa detik kemudian bot sudah langsung menyerbu, dan skornya turun. Satu pintu yang terlupa bisa merusak banyak kerja bagus.',
		reclose: 'Tertutup lagi. Bot cuma mental lalu pergi mencari server lain yang lebih gampang.'
	},
	steps: [
		{
			title: 'Server baru',
			body: 'Dari pabriknya, banyak program sudah nyala dan mendengarkan, masing masing di balik <b>pintu terbuka</b> sendiri.'
		},
		{
			title: 'Bot mengetuk',
			body: 'Program otomatis menyisir seluruh internet tanpa henti. Server baru biasanya ketemu dalam hitungan <b>menit</b>.'
		},
		{
			title: 'Port dan scanner',
			body: '<b>Port</b> itu pintu bernomor tempat program mendengarkan. <b>Scanner</b> mendata pintu mana yang menjawab, alat yang sama persis dengan yang dipakai penyerang.'
		},
		{
			title: 'Update dulu',
			body: '<b>Update</b> (disebut juga patch) menambal celah yang sudah diketahui pembuatnya. Software lama adalah pintu paling gampang.'
		},
		{
			title: 'Tutup yang nggak perlu',
			body: 'Matikan program yang nggak dipakai siapa pun. Port yang tertutup bikin bot <b>nggak punya lawan bicara</b>.'
		},
		{
			title: 'Kunci yang dipakai',
			body: 'Login pakai <b>kunci</b>, bukan password, dan kasih tiap program kuasa secukupnya saja.'
		},
		{
			title: 'Satu pintu diawasi',
			body: 'Pintu website sengaja tetap terbuka. Makin sedikit pintu, makin sedikit tempat yang perlu dijaga.'
		},
		{
			tag: 'Info',
			title: 'Hardening di mana mana',
			body: 'Update HP dan kunci layar juga hardening. Di cloud, server yang kamu sewa tetap <b>tanggung jawabmu</b>.'
		},
		{
			tag: 'Biar nempel',
			title: 'Tutup, gembok, update',
			body: 'Nggak dipakai, <b>tutup</b>. Dipakai, <b>gembok</b>. Selalu <b>update</b>.'
		},
		{
			tag: 'Giliranmu',
			title: 'Buka lagi satu pintu',
			body: 'Kalau mau, buka lagi Telnet dan lihat bot menyerbu sementara skornya turun.'
		}
	],
	serverLabel: 'server nimbus.com',
	botsLabel: 'Bot',
	scoreLabel: 'Skor scanner',
	software: 'Apache Struts',
	outdated: 'lama',
	patched: 'terbaru',
	doors: {
		ftp: 'Berkas',
		ssh: 'Admin',
		telnet: 'Telnet',
		web: 'Website',
		db: 'Database',
		test: 'Halaman tes'
	},
	reopen: 'Buka lagi Telnet',
	reclose: 'Tutup Telnet'
};
