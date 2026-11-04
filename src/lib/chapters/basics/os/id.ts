import type { OsText } from './types';

export const id: OsText = {
	title: 'Sistem operasi',
	intro: [
		'Lihat laptop ini. Browser, musik, dan chat jalan bersamaan, padahal CPU, RAM, dan storage yang dia punya cuma satu, bagian yang sudah kamu kenal di [[CPU, RAM, dan storage|basics/hardware]]. Terus siapa yang mengatur aplikasi mana dapat apa?',
		'Itu tugas <b>sistem operasi</b>, atau <b>OS</b> (operating system). Dia manajer yang duduk di antara aplikasi dan hardware. Aplikasi nggak pernah mengambil CPU atau RAM sendiri, mereka minta ke OS, lalu OS yang membagikan.',
		'[ingat] OS itu kayak pelayan di warung makan. Aplikasi itu pembelinya, hardware itu dapurnya. Pembeli nggak masuk dapur sendiri, mereka pesan lewat pelayan.',
		'Lihat waktu aplikasinya dibuka. Tiap aplikasi minta dulu ke OS jendela dan sedikit memori, baru setelah itu dia muncul di layar.',
		'CPU cuma bisa mengerjakan sedikit hal sekaligus, padahal aplikasinya jauh lebih banyak, jadi OS menyuruh mereka gantian. Tiap aplikasi dapat jatah waktu sangat singkat, beberapa per seribu detik, lalu giliran berikutnya. Gantinya cepat banget sampai semuanya kelihatan jalan bareng.',
		'OS juga memberi tiap aplikasi bagian RAM sendiri dan menjaganya tetap terpisah. Jadi game yang crash (tiba tiba rusak) nggak bikin chat kamu ikut berantakan. OS juga menyisihkan sedikit RAM untuk dirinya.',
		'Ada satu kata yang bakal sering kamu dengar. Program yang sedang berjalan disebut <b>proses</b>. OS memberi tiap proses nomornya sendiri, namanya <b>PID</b> (process ID), dan jatah RAM sendiri, lalu memutuskan proses mana yang dapat giliran CPU berikutnya. Mengatur giliran itu namanya <b>scheduling</b> (penjadwalan).',
		'[fyi] Buka satu aplikasi kebanyakan dan RAM jadi penuh. OS lalu menitipkan sisanya di storage (namanya <b>swap</b>). Storage jauh lebih lambat dari RAM, dan saat itulah laptop mulai lemot.',
		'OS juga mengurus file kamu. Waktu aplikasi musik mau memutar lagu, dia minta ke OS, lalu OS mengambilnya dari storage. Folder itu cara OS menjaga file kamu tetap rapi.',
		'Kamu pasti sudah kenal beberapa OS. <b>Windows</b> dan <b>macOS</b> menjalankan laptop, <b>Linux</b> menjalankan sebagian besar server di internet, dan <b>Android</b> serta <b>iOS</b> menjalankan HP (Android dibangun di atas Linux). Kamu bisa ngobrol dengan mereka lewat ikon atau perintah yang diketik, lihat [[CLI dan GUI|foundations/cli-gui]].',
		'Namanya beda beda, tugasnya sama. Kalau mau, coba buka dan tutup aplikasi di laptop, lihat OS membagi RAM.'
	],
	reactions: {
		open: 'Satu aplikasi lagi, satu potong RAM lagi. OS menyelipkannya dan memasukkannya ke antrean giliran CPU.',
		slow: 'Waduh, RAM penuh. OS menitipkan sisanya di storage yang lambat, jadi semuanya tersendat dan tiap klik terasa telat. Coba tutup satu aplikasi.',
		close:
			'Menutup aplikasi mengembalikan RAM miliknya ke OS, dan yang lain bisa lega lagi. Makanya menutup aplikasi yang nggak dipakai beneran membantu laptop yang sudah tua.'
	},
	steps: [
		{
			title: 'Hardware cuma satu set',
			body: 'Aplikasinya banyak, tapi <b>CPU</b>, <b>RAM</b>, dan <b>storage</b> cuma satu. Harus ada yang membagi.'
		},
		{
			title: 'Sang manajer',
			body: '<b>OS</b> duduk di antara aplikasi dan hardware. Aplikasi minta, OS yang memutuskan dan membagikan.'
		},
		{
			title: 'Membuka aplikasi',
			body: 'Sebelum aplikasi bisa jalan, OS memberinya jendela di layar dan tempat di memori.'
		},
		{
			title: 'Giliran di CPU',
			body: 'Tiap core (pekerja di dalam CPU) menjalankan satu aplikasi dalam satu waktu. OS mengopernya dalam jatah super singkat, berputar terus.'
		},
		{
			title: 'Berbagi RAM',
			body: 'Tiap aplikasi dapat <b>bagian sendiri</b> di RAM, terpisah dari yang lain. Total 8 GB itu dipakai bersama semua aplikasi.'
		},
		{
			title: 'Proses',
			body: 'Program yang sedang jalan disebut <b>proses</b>. Tiap proses punya <b>PID</b> dan RAM sendiri. Task Manager di Windows dan Activity Monitor di Mac menampilkan daftar persis seperti ini.'
		},
		{
			title: 'Kalau RAM penuh',
			body: 'Sisanya tumpah ke storage, namanya <b>swap</b>. Masih jalan, tapi lambat.'
		},
		{
			title: 'File',
			body: 'Aplikasi minta file ke OS. OS mencarinya di storage dan menjaga foldernya tetap rapi.'
		},
		{
			title: 'OS yang kamu kenal',
			body: '<b>Windows</b>, <b>macOS</b>, dan <b>Linux</b> di komputer dan server. <b>Android</b> dan <b>iOS</b> di HP.'
		},
		{
			title: 'Coba sendiri, kalau mau',
			body: 'Ketuk aplikasi di bawah laptop untuk membuka atau menutupnya, lalu lihat berapa RAM yang terpakai.'
		}
	],
	apps: [
		{ id: 'browser', name: 'Browser' },
		{ id: 'music', name: 'Musik' },
		{ id: 'chat', name: 'Chat' },
		{ id: 'game', name: 'Game' }
	],
	osLabel: 'Sistem operasi',
	cpuLabel: 'CPU',
	ramLabel: 'RAM',
	diskLabel: 'Storage',
	turn: 'giliran {app}',
	ramUsed: '{n} dari 8 GB terpakai',
	procTitle: 'Daftar proses',
	procCols: { pid: 'PID', name: 'Program', ram: 'RAM', state: 'Status' },
	running: 'jalan',
	waiting: 'antre',
	slowTag: 'lemot',
	fileName: 'lagu.mp3',
	osTrick: 'aplikasi pesan, OS melayani',
	devices: [
		{ os: 'Windows', kind: 'laptop' },
		{ os: 'macOS', kind: 'laptop' },
		{ os: 'Linux', kind: 'server' },
		{ os: 'Android', kind: 'HP' },
		{ os: 'iOS', kind: 'HP' }
	],
	dockHint: 'Ketuk aplikasinya',
	toggleLabel: 'Buka atau tutup {app}'
};
