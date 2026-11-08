import type { OnCallText } from './types';

export const id: OnCallText = {
	title: 'Incident dan on call',
	intro: [
		'Website nggak pernah tidur, jadi harus ada orang yang bisa dihubungi waktu ada yang rusak jam tiga pagi. Orang itu sedang <b>on call</b>. Tim bergiliran, biasanya seminggu sekali ganti, jadi nggak ada yang pegang HP darurat selamanya.',
		'Waktu alarm dari [[monitoring|compute/monitoring]] berbunyi, alarm itu memanggil siapa pun yang sedang on call. Masa rusaknya disebut <b>incident</b>, dan tugas pertama adalah menghentikan kerusakannya, bukan mencari siapa yang salah.',
		'<b>Runbook</b> mencatat langkah pemeriksaan dan penanganan suatu masalah. Gunakan hasil metrik dan log untuk menentukan apakah langkahnya sesuai insiden yang sedang terjadi.',
		'Setelah apinya padam, tim menulis <b>post mortem</b>, cerita tentang apa yang terjadi dan apa yang diubah setelahnya. Post mortem yang bagus itu <b>blameless</b>, tanpa menyalahkan orang. Orang yang takut disalahkan akan menyembunyikan kesalahan, dan kesalahan yang disembunyikan pasti datang lagi.',
		'[fyi] Kata yang sama, dunia yang beda. Tim keamanan juga menangani incident, tapi untuk pembobolan, bukan kerusakan, di [[incident response|security/incident]]. Dan kalau satu region padam total, rencananya adalah [[failover|resilience/failover]].',
		'[ingat] Periksa perubahan terbaru sebagai salah satu petunjuk. Cocokkan dengan metrik dan log sebelum menyimpulkan penyebab insiden.',
		'HP kamu bergetar. Malam ini kamu yang on call untuk nimbus.com. Angkat, yuk.'
	],
	reactions: {
		ack: 'Sudah di acknowledge. Itu memberi tahu pager bahwa ada manusia yang menangani, jadi dia berhenti berbunyi dan nggak membangunkan Sari. Sekarang buka runbooknya, dan jangan gaya bebas.',
		panic:
			'Restart semua server rasanya kayak sedang berbuat sesuatu, tapi errornya langsung balik. Bugnya ada di kode baru, dan restart cuma menjalankan kode rusak yang sama lagi. Ikuti runbooknya.',
		dash: 'Dashboard menunjukkan error melonjak tiba tiba jam 02.58. Pasti ada yang berubah sesaat sebelumnya. Kata runbook, cek itu berikutnya.',
		change:
			'Ada rilis baru, v2.4.1, keluar jam 02.57, semenit sebelum error mulai. Itu petunjuk paling kuat.',
		rollback:
			'Sudah di rollback, dan errornya mencair. Kamu nggak harus paham bugnya jam tiga pagi, cukup bikin nimbus.com jalan lagi. Perbaikan sungguhannya bisa menunggu pagi.',
		resolved:
			'Incident selesai, dua belas menit dari panggilan sampai beres. Silakan tidur lagi. Besok tim menulis post mortem bareng.',
		blame:
			'Jawaban itu menunjuk satu orang. Lain kali, orang bakal menyembunyikan kesalahannya, bukan menceritakannya. Tanyakan apa yang membuat kesalahan itu lolos, bukan siapa yang membuatnya.',
		postmortem:
			'Itulah post mortem yang blameless. Nggak ada yang dihukum, dan sistemnya dapat jaring pengaman baru, jadi kesalahan yang sama nggak bisa lolos dua kali. Tim seperti Google dan Etsy yang membuat cara kerja ini terkenal.'
	},
	acts: ['Alarm', 'Runbook', 'Post mortem'],
	pagerApp: 'Pager',
	alertTitle: 'Error nimbus.com 38%',
	alertBody: 'Checkout gagal untuk sebagian besar pembeli',
	onCallNote: 'Minggu ini kamu yang on call',
	escalateNote: 'Nggak dijawab 5 menit, giliran Sari yang ditelepon',
	ackBtn: 'Acknowledge',
	ackedTag: 'diterima',
	runbookBtn: 'Buka runbooknya',
	runbookTitle: 'Runbook, error rate tinggi',
	errorsLabel: 'request yang gagal',
	panicBtn: 'Restart semua server',
	panicResult: 'Semua server sudah direstart, dan errornya langsung balik lagi',
	steps: [
		{ label: 'Buka dashboard error', result: 'Error melonjak dari 0.3% ke 38% jam 02.58' },
		{ label: 'Cek apa yang baru berubah', result: 'Rilis v2.4.1 keluar jam 02.57' },
		{ label: 'Rollback ke rilis terakhir yang sehat', result: 'Kembali ke v2.4.0, error turun' },
		{ label: 'Pastikan sudah sehat, lalu tutup', result: 'Error 0.3%, incident ditutup' }
	],
	rollingTag: 'sedang rollback',
	postBtn: 'Tulis post mortem',
	pmTitle: 'Post mortem, error checkout',
	timelineLabel: 'Kronologi',
	timeline: [
		'02.57 rilis v2.4.1 keluar',
		'02.58 error checkout mulai',
		'03.12 alarm memanggil engineer on call',
		'03.20 rollback ke v2.4.0',
		'03.24 error kembali normal'
	],
	questions: [
		{
			q: 'Apa yang terjadi?',
			good: 'Rilis dengan satu setelan yang hilang merusak checkout selama 26 menit',
			bad: 'Dimas merilis kode rusak dan menjatuhkan checkout'
		},
		{
			q: 'Kenapa bisa lolos?',
			good: 'Belum ada langkah di pipeline yang mengecek semua setelan sudah lengkap',
			bad: 'Dimas ceroboh dan nggak mengecek ulang'
		},
		{
			q: 'Apa yang kita ubah?',
			good: 'Tambah cek setelan di pipeline, dan rollback otomatis kalau error melonjak setelah rilis',
			bad: 'Dimas nggak boleh merilis lagi'
		}
	],
	nopeTag: 'itu menyalahkan orang',
	pmDoneTag: 'Post mortem blameless, beres',
	noteAlarm: 'Jam tiga pagi, dan HP kamu nggak mau diam',
	noteAcked: 'Pager tahu kamu sedang menangani',
	noteRunbook: 'Ikuti langkahnya berurutan',
	noteFixed: 'nimbus.com sehat lagi',
	notePm: 'Pilih jawaban yang memperbaiki sistem, bukan orangnya',
	notePmDone: 'Sudah ditulis, dibagikan, dan nggak ada yang kena masalah'
};
