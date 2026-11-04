import type { IncidentText } from './types';

export const id: IncidentText = {
	title: 'Incident Response',
	intro: [
		'Juni 2017. Di Maersk, raksasa pelayaran yang mengangkut sekitar seperlima kargo laut dunia, layar komputer menghitam satu per satu. Sebuah [[malware|security/malware]] bernama NotPetya sedang mengamuk di jaringannya. Maersk sampai harus membangun ulang sekitar 4.000 server dan 45.000 komputer.',
		'[fyi] Penyelamatnya ternyata keberuntungan. Satu satunya salinan bersih dari satu server penting ada di kantor Ghana, kebetulan sedang offline gara gara mati listrik. Staf membawa harddisk itu jauh jauh ke Inggris dan membangun ulang dari sana.',
		'Kalau kejadian begini datang, panik adalah musuh. Tim mengikuti rencana yang disusun waktu tenang, namanya <b>incident response</b>. Yuk kita jalani bareng. Sudah tengah malam, dan alarm berbunyi di nimbus.com.',
		'Satu, <b>cek</b>. Beneran atau bukan, dan seberapa besar? Lihat dulu sebelum lompat. Di sini ternyata beneran, satu mesin terinfeksi.',
		'Dua, <b>kurung</b>. Hentikan penyebarannya, sebelum yang lain. Cabut mesin itu dari jaringan supaya malwarenya nggak bisa menjangkau tetangganya, kayak menutup pintu dapur yang terbakar.',
		'Tiga, <b>bersihkan</b>. Singkirkan penyerangnya sampai tuntas. Sering kali cara paling aman adalah menghapus total mesinnya dan mulai dari nol, karena kamu nggak pernah bisa yakin sudah menemukan semua tempat sembunyinya.',
		'Empat, <b>pulihkan</b>. Kembalikan mesinnya dari backup yang bersih, dan sambungkan lagi ke jaringan cuma kalau sudah pasti sehat.',
		'Lima, <b>belajar</b>. Catat apa yang terjadi dan perbaiki jalan masuknya, tanpa menyalahkan orang. Langkah inilah yang bikin insiden berikutnya lebih kecil.',
		'[ingat] Anggap saja dapur kebakaran. Tutup pintunya dulu biar apinya nggak merembet, padamkan, perbaiki dapurnya, lalu cari tahu kenapa bisa terbakar. Kurung, bersihkan, pulihkan, belajar.',
		'Kalau mau, giliran kamu. Lewati langkah mengurung, langsung bersihkan, dan lihat apa yang dilakukan malwarenya sementara itu.'
	],
	reactions: {
		skip: 'Lihat kan? Selagi kamu sibuk bersih bersih, dia lompat ke dua tetangga lalu balik lagi ke mesin yang sudah bersih. Makanya mengurung itu nomor satu.',
		right:
			'Dikurung duluan, jadi dia nggak bisa ke mana mana. Satu mesin kena, satu mesin dipulihkan, yang lain aman.'
	},
	steps: [
		{
			title: 'NotPetya',
			body: 'Malware yang melompat sendiri dari mesin ke mesin, mengunci tiap mesin untuk selamanya. Tampangnya kayak ransomware, tapi bayar tebusan pun nggak bisa mengembalikan filenya.'
		},
		{
			tag: 'Info',
			title: 'Salinan di Ghana',
			body: 'Malware nggak bisa menjangkau salinan yang <b>offline</b>. Mati listrik kebetulan menyelamatkan salinan itu.'
		},
		{
			title: 'Incident response',
			body: 'Rencana yang ditulis <b>sebelum</b> masalah datang, supaya orang mengikuti langkah, bukan menebak nebak.'
		},
		{
			title: 'Cek',
			body: 'Pastikan ini beneran dan cari tahu <b>sejauh mana</b> dia menyebar.'
		},
		{
			title: 'Kurung',
			body: 'Putus mesin yang terinfeksi supaya <b>berhenti menyebar</b>. Di sinilah kecepatan paling penting.'
		},
		{
			title: 'Bersihkan',
			body: 'Hapus semua jejaknya, sering kali dengan <b>menghapus total</b> mesinnya.'
		},
		{
			title: 'Pulihkan',
			body: 'Kembalikan dari <b>backup yang bersih</b>, lalu sambungkan lagi cuma kalau sudah sehat.'
		},
		{
			title: 'Belajar',
			body: 'Tulis laporannya tanpa menyalahkan, dan tambal celahnya supaya nggak terulang dengan <b>cara yang sama</b>.'
		},
		{
			tag: 'Cara ingat',
			title: 'Dapur kebakaran',
			body: '<b>Kurung</b>, bersihkan, pulihkan, belajar.'
		},
		{
			tag: 'Giliranmu',
			title: 'Lewati satu langkah',
			body: 'Bersihkan sebelum mengurung, dan lihat malwarenya memanfaatkan waktu itu.'
		}
	],
	maersk: 'Maersk, Juni 2017',
	nimbus: 'nimbus.com, tengah malam',
	ghana: 'Kantor Ghana',
	offline: 'offline',
	backup: 'Backup',
	notes: 'Catatan',
	lessons: ['Tambal celahnya', 'Kunci login admin', 'Uji backupnya'],
	checkTag: 'Asli, satu mesin',
	phases: {
		check: 'Cek',
		contain: 'Kurung',
		clean: 'Bersihkan',
		recover: 'Pulihkan',
		learn: 'Belajar'
	},
	skip: 'Lewati mengurung',
	right: 'Urutan benar'
};
