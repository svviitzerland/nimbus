import type { OnCallText } from './types';

export const id: OnCallText = {
	title: 'Incident dan on call',
	intro: [
		'Website nggak pernah tidur, jadi harus ada orang yang bisa dihubungi waktu ada yang rusak jam tiga pagi. Orang itu sedang <b>on call</b>. Tim bergiliran, biasanya seminggu sekali ganti, jadi nggak ada yang pegang HP darurat selamanya. Minggu ini giliranmu.',
		'Jam 02.58 garis error di grafik [[monitoring|compute/monitoring]] melonjak. Checkout mulai gagal buat kebanyakan pembeli, dan alarm memanggil siapa pun yang sedang on call. Masa rusak itu namanya <b>incident</b>.',
		'HP terus berdering sampai ada manusia yang menjawab. Menekan <b>acknowledge</b> memberi tahu sistem pemanggilnya (pager) bahwa kamu sedang menangani. Kalau lima menit nggak dijawab, giliran orang berikutnya yang dibangunkan.',
		'Orang setengah tidur susah mikir jernih, makanya tim menulis <b>runbook</b> dari jauh hari, resep singkat untuk satu jenis masalah. Cek ini, lalu itu, lalu lakukan ini. Kamu tinggal ikuti, nggak perlu improvisasi.',
		'Langkah satu, buka dashboard error. Error melonjak dari hampir nol ke 38 persen jam 02.58. Langkah dua, cek apa yang berubah. Ada rilis baru, v2.4.1, keluar jam 02.57, semenit sebelumnya.',
		'Langkah tiga, <b>rollback</b>, artinya memasang lagi rilis terakhir yang sehat. Errornya turun lagi, dan langkah empat menutup incidentnya. Kamu nggak perlu paham bugnya jam tiga pagi, cukup hentikan kerusakannya dulu.',
		'[ingat] <b>Yang terakhir berubah, yang pertama dicurigai.</b> Kebanyakan incident muncul tepat setelah ada perubahan, rilis baru, setelan baru, server baru. Cek di situ dulu sebelum ke mana mana.',
		'Siang harinya tim menulis <b>post mortem</b>, cerita tentang apa yang terjadi dan apa yang diubah setelahnya. Yang bagus itu <b>blameless</b>, tanpa menyalahkan orang. Lihat kalimat yang menyalahkan orang dicoret. Orang yang takut disalahkan akan menyembunyikan kesalahan, dan kesalahan yang disembunyikan pasti datang lagi.',
		'[fyi] Kata yang sama, dunia yang beda. Tim keamanan juga menangani incident, tapi untuk pembobolan, bukan kerusakan, di [[incident response|security/incident]]. Dan kalau satu region padam total, rencananya adalah [[failover|resilience/failover]].',
		'Penasaran kenapa runbook bilang rollback, bukan restart? Ketuk tombolnya dan coba restart semua server. Atau nikmati saja malam yang tenang, itu juga boleh.'
	],
	reactions: {
		panic:
			'Restart semua server rasanya kayak sedang berbuat sesuatu, dan errornya sempat turun sebentar. Lalu langsung balik lagi, karena restart cuma menjalankan rilis rusak yang sama. Makanya runbook bilang rollback.'
	},
	steps: [
		{
			tag: 'Bergiliran',
			title: 'On call',
			body: 'Tiap minggu satu orang menjaga HP tetap dekat, siang dan malam. Minggu depan gantian orang lain.'
		},
		{
			tag: 'Ada yang rusak',
			title: 'Incident',
			body: 'Masa antara sesuatu rusak sampai jalan lagi. Alarmnya datang dari monitoring, bukan dari orang.'
		},
		{
			tag: 'Aku tangani',
			title: 'Acknowledge',
			body: 'Satu ketukan menghentikan dering dan memberi tahu tim ada manusia yang menangani. Nggak dijawab, orang berikutnya dipanggil.'
		},
		{
			tag: 'Resepnya',
			title: 'Runbook',
			body: 'Langkah pendek yang ditulis waktu siang dan tenang, untuk satu jenis masalah, supaya otak ngantuk nggak perlu mengarang.'
		},
		{
			tag: 'Lihat dulu',
			title: 'Dashboard, lalu perubahan',
			body: 'Kapan mulainya, dan apa yang berubah sesaat sebelumnya? Di sini, rilis semenit sebelumnya.'
		},
		{
			tag: 'Pulihkan cepat',
			title: 'Rollback',
			body: 'Pasang lagi versi sehat terakhir. Situsnya pulih dalam hitungan menit, perbaikan sungguhannya menunggu pagi.'
		},
		{
			tag: 'Biar nempel',
			title: 'Terakhir berubah, pertama dicurigai',
			body: 'Ada yang rusak? Tanya apa yang terakhir berubah. Lebih sering benar daripada salah.'
		},
		{
			tag: 'Sesudahnya',
			title: 'Post mortem blameless',
			body: 'Tanya apa yang membuat kesalahan lolos, jangan siapa pembuatnya. Lalu pasang jaring pengaman supaya nggak terulang.'
		},
		{
			tag: 'Beda hal',
			title: 'Incident jenis lain',
			body: 'Pembobolan itu incident keamanan. Satu region padam total butuh failover.'
		},
		{
			tag: 'Opsional',
			title: 'Restart saja?',
			body: 'Coba jalan pintas yang menggoda itu dan lihat garis errornya.'
		}
	],
	onCallNote: 'On call minggu ini',
	pagerApp: 'Pager',
	alertTitle: 'Error 38%',
	alertBody: 'checkout nimbus.com',
	ackBtn: 'Acknowledge',
	ackedTag: 'Ditangani',
	resolvedTag: 'Selesai',
	runbookTitle: 'Runbook, error tinggi',
	runbook: [
		{ label: 'Buka dashboard error', result: 'Naik dari 0.3% ke 38% jam 02.58' },
		{ label: 'Cek apa yang berubah', result: 'Rilis v2.4.1 keluar jam 02.57' },
		{ label: 'Rollback rilisnya', result: 'Kembali ke v2.4.0, error turun' },
		{ label: 'Pastikan, lalu tutup', result: 'Error 0.3%, incident ditutup' }
	],
	pmTitle: 'Post mortem, error checkout',
	blameLine: 'Dimas merilis kode rusak',
	pmLines: [
		'Rilis tanpa satu setelan merusak checkout',
		'Belum ada cek bahwa semua setelan lengkap',
		'Tambah cek itu, rollback otomatis saat lonjakan'
	],
	errorsLabel: 'error',
	releaseTag: 'v2.4.1',
	panicBtn: 'Restart semua server saja'
};
