import type { IncidentText } from './types';

export const id: IncidentText = {
	title: 'Incident response',
	intro: [
		'Juni 2017. Di Maersk, raksasa pelayaran yang mengangkut sekitar seperlima kargo laut dunia, layar komputer tiba tiba menghitam satu per satu. Sebuah [[malware|security/malware]] bernama NotPetya sedang mengamuk di jaringannya.',
		'Dalam hitungan jam, terminal pelabuhannya berhenti bekerja dan truk mengantre berkilo kilometer. Maersk harus membangun ulang sekitar 4.000 server dan 45.000 komputer dalam kira kira sepuluh hari.',
		'[fyi] Penyelamatnya ternyata keberuntungan. Satu satunya salinan server penting yang selamat ada di Ghana, kebetulan sedang offline gara gara mati listrik. Staf membawa harddisk itu jauh jauh ke Inggris dan membangun ulang semuanya dari sana.',
		'Kalau kejadian begini datang, panik adalah musuh. Tim mengikuti rencana bernama <b>incident response</b>. Pertama <b>cek</b> apa yang sebenarnya terjadi, <b>kurung</b> supaya nggak menyebar, <b>bersihkan</b> penyerangnya, <b>pulihkan</b> dari backup yang bersih, dan terakhir <b>belajar</b> supaya kejadian yang sama nggak terulang.',
		'[fyi] Di cloud langkahnya tetap sama, cuma alatnya yang beda. Mengurung server bisa cukup satu klik yang mengganti aturan firewallnya. Provider menangani insiden di gedungnya sendiri, insiden di sistemmu tetap urusanmu, itulah [[shared responsibility|networking/shared-responsibility]].',
		'[ingat] Batasi dampak, simpan bukti, tangani penyebab, lalu pulihkan layanan. Gunakan hasil evaluasi untuk memperbaiki pencegahan dan respons.',
		'Urutan itu penting, dan waktu terus berjalan. Alarm sedang berbunyi di nimbus.com sekarang. Jawab alarmnya, lalu pilih langkahnya dengan urutan yang benar.'
	],
	reactions: {
		check:
			'Bagus, kamu melihat dulu sebelum melompat. Sekarang kelihatan jelas server mana yang kena dan mana yang masih sehat, jadi kamu tahu mana yang harus diputus.',
		contain:
			'Terkurung. Server yang terinfeksi dicabut dari jaringan, jadi malwarenya nggak punya jalan lagi. Meteran kerusakan akhirnya berhenti naik.',
		clean:
			'Bersih. Malwarenya dihapus dan lubang tempat dia masuk sudah ditambal. Servernya aman sekarang, tapi masih offline.',
		recover:
			'Pulih. Data kembali dari backup bersih yang dibuat sebelum serangan, dan nimbus.com melayani pengunjung lagi. Inilah kenapa backup disimpan di tempat yang nggak bisa dijangkau malware.',
		doneGood:
			'Insiden selesai, dan cuma sedikit server yang kena. Langkah terakhir ini yang paling sering dilewati tim, mencatat apa yang terjadi tanpa saling menyalahkan, lalu memperbaiki penyebabnya. Maersk melakukan persis itu dan sekarang terbuka membagikan pelajarannya.',
		doneSlow:
			'Insiden selesai, tapi banyak server sempat kena. Langkah terakhir, belajar, adalah saat kamu mencatat apa yang salah, termasuk awal yang lambat, lalu berlatih supaya lain kali lebih cepat. Ulangi latihannya dan coba kalahkan skormu.',
		wrongContain:
			'Mau memutus yang mana? Kamu belum tahu server mana yang kena, jadi bisa bisa yang sehat dicabut dan yang sakit terlewat. Semenit untuk mengecek dulu menghemat berjam jam.',
		wrongClean:
			'Selagi kamu sibuk bersih bersih, malwarenya terus menular ke server sebelah. Hentikan penyebarannya dulu, baru bersihkan.',
		wrongRecover:
			'Backupnya kembali, lalu langsung terinfeksi lagi, karena malware dan jalan masuknya masih ada. Pulihkan hanya setelah dibersihkan.',
		wrongLearn:
			'Menulis laporan padahal server masih terbakar? Belajar itu paling akhir, setelah apinya padam.',
		pay: 'Membayar tebusan nggak menjamin datamu kembali, dan uangnya membiayai serangan berikutnya. Banyak korban yang sudah membayar tetap nggak dapat datanya. Memulihkan dari backup sendiri adalah jalan keluar yang sebenarnya.',
		hide: 'Mematikan alarm nggak mematikan serangannya. Malwarenya terus menyebar diam diam. Menyembunyikan insiden biasanya membuat semuanya jauh lebih parah, dan di banyak negara malah melanggar hukum.'
	},
	alarmTitle: 'Alarm di nimbus.com',
	alarmSub: 'File di server berubah jadi sampah acak',
	answerBtn: 'Jawab alarmnya',
	serversLabel: 'Server',
	damageLabel: 'Kerusakan',
	planLabel: 'Rencanamu',
	pickHint: 'Ketuk langkah berikutnya',
	steps: {
		check: { name: 'Cek', sub: 'Cari tahu server mana yang kena' },
		contain: { name: 'Kurung', sub: 'Putus server yang sakit dari jaringan' },
		clean: { name: 'Bersihkan', sub: 'Hapus malware dan tambal lubangnya' },
		recover: { name: 'Pulihkan', sub: 'Kembalikan data dari backup bersih' },
		learn: { name: 'Belajar', sub: 'Catat kejadiannya dan perbaiki penyebabnya' },
		pay: { name: 'Bayar tebusan', sub: 'Berharap penyerangnya menepati janji' },
		hide: { name: 'Matikan alarm', sub: 'Diam saja dan berharap nggak ada yang tahu' }
	},
	stateHit: 'kena',
	stateCut: 'diputus',
	stateClean: 'bersih',
	stateBack: 'pulih',
	restartBtn: 'Ulangi latihannya',
	resultGood: '{n} dari 6 server kena, tertangani dengan baik',
	resultSlow: '{n} dari 6 server kena, awalnya lambat'
};
