import type { OsText } from './types';

export const id: OsText = {
	title: 'Sistem operasi',
	intro: [
		'Sekarang ini HP atau laptopmu menjalankan banyak aplikasi sekaligus, musik, chat, browser. Padahal CPU dan RAM yang dia punya cuma satu, bagian yang sudah kamu kenal di [[CPU, RAM, dan storage|basics/hardware]]. Terus siapa yang mengatur aplikasi mana dapat apa?',
		'Itu tugas <b>sistem operasi</b>, atau <b>OS</b> (operating system). Anggap saja dia manajer yang berdiri di antara aplikasi dan hardware. Aplikasi nggak pernah mengambil CPU, RAM, atau storage sendiri, mereka minta baik baik ke OS.',
		'Kamu pasti sudah kenal beberapa. <b>Windows</b> dan <b>macOS</b> menjalankan laptop, <b>Android</b> dan <b>iOS</b> menjalankan HP, dan <b>Linux</b> menjalankan sebagian besar server di internet (Android juga dibangun di atas Linux). Kamu bisa ngobrol dengan OS lewat ikon atau lewat perintah yang diketik, lihat [[CLI dan GUI|foundations/cli-gui]].',
		'OS membagi CPU dengan cara gantian. Tiap aplikasi dapat jatah waktu sangat singkat, beberapa per seribu detik, lalu giliran aplikasi berikutnya. Gantinya cepat banget sampai semuanya kelihatan jalan bersamaan.',
		'OS juga memberi tiap aplikasi bagian RAM sendiri dan menjaganya tetap terpisah, jadi game yang crash nggak bikin chat kamu ikut berantakan. Dia juga mengurus file di storage, dari situlah folder berasal.',
		'[fyi] Kalau RAM penuh, OS meminjam sedikit storage dan pura pura itu RAM (namanya <b>swap</b>, atau virtual memory). Bisa jalan, tapi storage jauh lebih lambat dari RAM, dan saat itulah komputer mulai lemot.',
		'Ini laptop dengan OS di tengahnya. Buka aplikasinya satu per satu, lihat OS membagi CPU dan RAM, dan terus tambah sampai dia kewalahan.'
	],
	reactions: {
		first:
			'Satu aplikasi terbuka. OS memberinya sepotong RAM dan giliran di CPU. Karena belum ada yang lain, CPU hampir sepenuhnya miliknya.',
		more: 'Sekarang CPU dipakai gantian. Lihat sorotannya pindah pindah antar aplikasi? Tiap aplikasi dapat jatah sangat singkat, terus berulang, aslinya jauh terlalu cepat untuk kamu sadari. Makanya semua terasa jalan bareng.',
		slow: 'Waduh, RAM penuh. OS mulai menitipkan sebagian aplikasi di storage, dan storage itu lambat, jadi semuanya tersendat. Inilah saat kipas laptop berisik dan lingkaran loading muter terus. Coba tutup satu aplikasi.',
		close:
			'Menutup aplikasi mengembalikan RAM miliknya ke OS, lalu OS membagikannya ke yang lain. Makanya menutup aplikasi yang nggak dipakai beneran membantu laptop yang sudah tua.'
	},
	dockHint: 'Ketuk aplikasi untuk membukanya',
	apps: [
		{ id: 'browser', name: 'Browser' },
		{ id: 'music', name: 'Musik' },
		{ id: 'chat', name: 'Chat' },
		{ id: 'game', name: 'Game' }
	],
	desktopEmpty: 'Belum ada yang dibuka',
	osLabel: 'Sistem operasi',
	osSub: 'manajer antara aplikasi dan hardware',
	cpuLabel: 'CPU',
	turn: 'giliran {app}',
	cpuIdle: 'menunggu kerjaan',
	ramLabel: 'RAM',
	ramUsed: '{n} dari 8 GB terpakai',
	osChunk: 'OS',
	swapLabel: 'tumpah ke storage yang lambat',
	closeLabel: 'Tutup {app}',
	slowTag: 'lemot',
	notes: {
		idle: 'Baru OS yang jalan, menyisihkan sedikit RAM untuk dirinya',
		one: 'Satu aplikasi, sepotong RAM, CPU untuk dia sendiri',
		sharing: 'OS memberikan CPU ke tiap aplikasi secara bergiliran',
		slow: 'RAM penuh, jadi OS mendorong sisanya ke storage',
		eased: 'RAM lega lagi, semuanya kembali lancar'
	}
};
