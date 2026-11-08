import type { BackupText } from './types';

export const id: BackupText = {
	title: 'Backup dan recovery',
	intro: [
		'Bayangkan hard disk di server database nimbus.com tiba tiba mati. Semua pesanan dan semua akun, hilang bareng satu disk rusak. Dan disk memang mati tiap hari, di suatu tempat di setiap data center.',
		'<b>Backup</b> itu salinan datamu yang disimpan di tempat lain. <b>Recovery</b>, disebut juga restore, itu memasang salinan itu balik setelah ada yang rusak.',
		'Tapi backup cuma sesegar salinan terakhirmu. Apa pun yang ditulis setelah salinan terakhir itu ya hilang. Jadi seberapa sering kamu backup menentukan seberapa banyak yang bisa hilang.',
		'[fyi] Kata yang sama, dunia yang beda. Backup itu bukan region cadangan di [[failover|resilience/failover]]. Failover menjaga situs tetap jalan, backup mengembalikan data, bahkan data yang nggak sengaja dihapus atau dikunci [[ransomware|security/malware]].',
		'Tempat menyimpan salinannya juga penting banget. Tim yang sudah berpengalaman memakai <b>aturan 3 2 1</b>. Tiga salinan data, di dua jenis penyimpanan, dengan satu disimpan di luar lokasi, jauh dari yang lain.',
		'[ingat] Simpan tiga salinan data, pada dua jenis media, dengan satu salinan di lokasi berbeda. Uji pemulihan dan lindungi salinan dari perubahan yang tidak diinginkan.',
		'Yuk coba langsung. Jalankan satu hari sibuk di nimbus.com, cabut colokan servernya, lalu lihat apa yang bisa dikembalikan backup.'
	],
	reactions: {
		daily:
			'Aduh. Satu satunya salinan dibuat tengah malam, jadi semua pesanan sejak itu ikut mati bareng disknya. Ganti jadi backup tiap jam, lalu jalankan harinya lagi.',
		hourly:
			'Jauh lebih baik. Salinan terbaru dari jam empat sore, jadi cuma pesanan empat puluh menit terakhir yang hilang. Celah itu punya nama, <b>RPO</b>, seberapa banyak data yang masih boleh hilang. Sekarang babak kedua, di mana salinannya disimpan.',
		rule: 'Itu sudah memenuhi semua syarat aturan 3 2 1. Sekarang lihat apakah tetap aman waktu seluruh gedungnya ketiban sial.',
		fireLost:
			'Semua salinan tinggal di gedung yang sama, jadi satu kebakaran melahap semuanya. Tiga salinan kelihatan aman di atas kertas, tapi nggak kalau duduknya sebelahan. Coba lagi dan kirim satu salinan jauh jauh.',
		fireSafe:
			'Data center Jakarta habis, tapi salinan di Singapura selamat. Restore dari situ dan nimbus.com hidup lagi. Satu salinan di luar lokasi itulah inti aturannya.'
	},
	acts: ['Hari sial', 'Aturan 3 2 1'],
	nextAct: 'Lanjut ke aturan 3 2 1',
	dbLabel: 'Database nimbus.com',
	ordersLabel: 'pesanan tersimpan',
	backupLabel: 'Drive backup',
	lastCopy: 'salinan terbaru {t}',
	noCopy: 'belum ada salinan',
	scheduleLabel: 'Backup',
	daily: 'sehari sekali',
	hourly: 'tiap jam',
	runBtn: 'Jalankan harinya',
	crashBtn: 'Disknya mati',
	restoreBtn: 'Restore dari backup',
	againBtn: 'Jalankan harinya lagi',
	lostTag: '{n} pesanan hilang',
	backTag: '{n} pesanan kembali',
	noteIdle: 'Pilih seberapa sering backup, lalu buka tokonya',
	noteRunning: 'Pesanan terus masuk sepanjang hari',
	noteLive: 'Jam lima kurang dua puluh, dan toko lagi ramai',
	noteDead: 'Disknya mati, dan semua pesanan di dalamnya ikut mati',
	noteDaily: 'Semua yang masuk setelah tengah malam nggak pernah disalin',
	noteHourly: 'Cuma beberapa menit terakhir yang lolos',
	siteLabel: 'Data center Jakarta',
	siteSub: 'tempat nimbus.com berjalan',
	offLabel: 'Region Singapura',
	offSub: 'jauh, di luar lokasi',
	places: {
		original: 'Disk server',
		disk2: 'Disk kedua',
		nas: 'Kotak backup',
		cloud: 'Cloud storage'
	},
	kinds: {
		original: 'disk di dalam server',
		disk2: 'disk di server yang sama',
		nas: 'kotak penyimpanan terpisah',
		cloud: 'object storage'
	},
	originalTag: 'asli',
	pickHint: 'Pilih dua tempat untuk salinan tambahanmu',
	checkCopies: '{n} salinan',
	checkKinds: '{n} jenis penyimpanan',
	checkOff: 'satu di luar lokasi',
	fireBtn: 'Nyalakan api di Jakarta',
	resetBtn: 'Bangun ulang dan coba lagi',
	fireTag: 'kebakaran',
	noteLost: 'Nggak ada lagi yang bisa dipakai restore',
	noteSafe: 'Satu salinan yang jauh sudah cukup'
};
