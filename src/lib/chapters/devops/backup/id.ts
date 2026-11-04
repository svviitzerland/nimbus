import type { BackupText } from './types';

export const id: BackupText = {
	title: 'Backup dan recovery',
	intro: [
		'Ini server database nimbus.com, duduk di sebuah data center di Jakarta. Tiap pesanan pembeli mendarat di <b>disk</b> di dalamnya, bagian yang tetap ingat walau listriknya mati.',
		'Disk itu mesin, dan mesin bisa aus. Suatu hari disk ini berhenti begitu saja. Semua pesanan dan semua akun di dalamnya, hilang bareng satu bagian yang rusak. Di setiap data center, ada disk yang mati seperti ini tiap hari.',
		'Makanya tim menyimpan <b>backup</b>, salinan data yang disimpan di tempat lain. Di sini ada kotak kedua di gedung yang sama yang diam diam menyalin database sesuai jadwal, kayak fotokopi buku catatanmu.',
		'Sekarang lihat hari sialnya sekali lagi. Disknya mati, disk baru dipasang, lalu salinannya mengalir balik. Memasang salinan itu kembali namanya <b>recovery</b>, atau <b>restore</b>. Pesanannya pulang lagi.',
		'Tapi backup cuma sesegar salinan terakhirnya. Apa pun yang ditulis setelah itu hilang. Salin sekali sehari, lalu rusak sore hari, hilang hampir satu hari penuh. Salin tiap jam, yang hilang cuma beberapa menit.',
		'[fyi] Jangan ketuker. Backup itu bukan region cadangan di [[failover|resilience/failover]]. Failover menjaga situs tetap jalan, backup mengembalikan data, bahkan data yang nggak sengaja dihapus atau dikunci [[ransomware|security/malware]].',
		'Tempat menyimpan salinannya juga penting banget. Tim yang berpengalaman memakai <b>aturan 3 2 1</b>. Tiga salinan data, di dua jenis penyimpanan, dengan satu disimpan di luar lokasi, jauh di kota lain.',
		'[ingat] Hitung pakai jari. <b>Tiga salinan, dua wadah, satu di luar rumah.</b> Kalau satu hari sial bisa menjangkau semua salinan sekaligus, itu belum backup namanya.',
		'Ini alasan salinan jauh itu penting. Kebakaran melahap seluruh gedung Jakarta, server dan kotak backupnya sekaligus. Salinan di Singapura nggak merasakan apa apa, dan dialah yang menghidupkan nimbus.com lagi.',
		'Mau lihat jadwalnya bikin beda? Pilih seberapa sering backup, lalu lihat satu hari sibuk berakhir dengan disk mati. Atau santai saja menonton, itu juga boleh.'
	],
	reactions: {
		daily:
			'Aduh. Satu satunya salinan dibuat tengah malam, jadi semua pesanan sejak itu ikut mati bareng disknya. Coba tiap jam dan lihat celahnya menyusut.',
		hourly:
			'Jauh lebih baik. Salinan terbaru dari jam empat sore, jadi cuma pesanan empat puluh menit terakhir yang hilang. Celah itu punya nama, <b>RPO</b>, seberapa banyak data yang masih boleh hilang.'
	},
	steps: [
		{
			tag: 'Aslinya',
			title: 'Server database',
			body: 'Satu server, satu <b>disk</b>, semua pesanan yang pernah diterima nimbus.com. Sekarang cuma di situ mereka tinggal.'
		},
		{
			tag: 'Bahayanya',
			title: 'Disk mati',
			body: 'Tanpa peringatan, tanpa undo. Kalau nggak ada salinan lain, datanya ikut tenggelam bareng disknya.'
		},
		{
			tag: 'Salinannya',
			title: 'Backup',
			body: 'Salinan yang disimpan di tempat lain, dibuat berulang sesuai jadwal, biasanya otomatis tiap malam atau tiap jam.'
		},
		{
			tag: 'Mengembalikan',
			title: 'Restore',
			body: 'Disk baru masuk, salinan mengalir balik, pesanan kembali. Backup yang belum pernah dicoba restore itu cuma harapan, jadi tim rajin latihan.'
		},
		{
			tag: 'Kesegaran',
			title: 'Seberapa sering',
			body: 'Semua setelah salinan terakhir hilang. Celah yang masih bisa kamu terima namanya <b>RPO</b>.'
		},
		{
			tag: 'Beda hal',
			title: 'Backup bukan failover',
			body: 'Failover menjaga situs tetap hidup. Backup mengembalikan data lama, bahkan setelah salah hapus.'
		},
		{
			tag: 'Disimpan di mana',
			title: 'Aturan 3 2 1',
			body: '<b>3</b> salinan, di <b>2</b> jenis penyimpanan, <b>1</b> di luar lokasi.'
		},
		{
			tag: 'Biar nempel',
			title: '3, 2, 1',
			body: 'Tiga salinan, dua wadah, satu di luar rumah. Satu hari sial nggak boleh menjangkau semuanya.'
		},
		{
			tag: 'Di luar lokasi',
			title: 'Salinan yang jauh',
			body: 'Kebakaran, banjir, atau maling menghantam satu gedung penuh. Salinan di kota lain selamat.'
		},
		{
			tag: 'Opsional',
			title: 'Satu hari sibuk',
			body: 'Pilih jadwalnya. Harinya berjalan, disknya mati, dan restore menunjukkan apa yang hilang.'
		}
	],
	siteLabel: 'Data center Jakarta',
	dbLabel: 'database nimbus.com',
	ordersLabel: 'pesanan',
	boxLabel: 'Kotak backup',
	offLabel: 'Region Singapura',
	offSub: 'di luar lokasi',
	deadTag: 'disk mati',
	newTag: 'disk baru',
	lostTag: '{n} hilang',
	backTag: '{n} kembali',
	fireTag: 'kebakaran',
	rule: ['3 salinan', '2 wadah', '1 jauh'],
	dailyLabel: 'Sekali sehari',
	hourlyLabel: 'Tiap jam',
	startTime: '00.00',
	crashTime: '16.40',
	gapLabel: 'tanpa salinan',
	pickLabel: 'Backup seberapa sering?',
	plans: { daily: 'Sekali sehari', hourly: 'Tiap jam' }
};
