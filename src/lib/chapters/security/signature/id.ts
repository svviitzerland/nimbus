import type { SignatureText } from './types';

export const id: SignatureText = {
	title: 'Tanda tangan digital',
	intro: [
		'HP kamu terus memperbarui aplikasinya. Tapi gimana dia tahu update itu benar benar dari pembuat aplikasinya, dan nggak ada yang menyelipkan sesuatu yang jahat di tengah jalan?',
		'Di kertas, kamu tanda tangan pakai pulpen. <b>Tanda tangan digital</b> melakukan tugas yang sama, cuma jauh lebih susah dipalsukan. Dasarnya [[kunci publik dan privat|security/keys]] yang sudah kamu kenal, hanya saja dipakai terbalik.',
		'Ingat gemboknya? Siapa pun bisa mengunci, cuma kunci privat yang bisa membuka. Tanda tangan membalik itu. Cuma <b>kunci privat</b> kamu yang bisa membuat tanda tangan, dan siapa pun yang pegang <b>kunci publik</b> kamu bisa memeriksanya.',
		'Pertama, filenya dibuatkan <b>sidik jari</b>, kode pendek yang dihitung dari setiap huruf di dalamnya (nama aslinya <b>hash</b>, lebih lengkap di [[hashing|security/hashing]]). Ubah satu huruf saja, sidik jarinya jadi beda total.',
		'Lalu si pembuat aplikasi mengunci sidik jari itu pakai kunci privatnya. Sidik jari yang terkunci itulah tanda tangannya, dan dia ikut dikirim bersama filenya.',
		'HP membuka tanda tangan itu pakai kunci publik, lalu menghitung sendiri sidik jari dari file yang dia terima. Kalau sama, filenya utuh dan benar dari si pembuat. Kalau beda, HP menolak memasangnya.',
		'[fyi] Kamu memakainya tiap hari. App store, update Windows dan Android, sampai [[sertifikat di balik HTTPS|security/tls]] semuanya dicek pakai tanda tangan. Di Indonesia, tanda tangan elektronik tersertifikasi juga diakui hukum untuk dokumen, sama seperti tanda tangan basah.',
		'Giliranmu. Kamu pembuat aplikasi nimbus.com. Tanda tangani sebuah update lalu kirim, habis itu jadi penjahatnya dan coba selipkan sesuatu.'
	],
	reactions: {
		fingerprint:
			'Itu dia sidik jari update kamu. File yang sama selalu menghasilkan sidik jari yang sama, di komputer mana pun di dunia.',
		signed:
			'Sudah ditandatangani. Kamu mengunci sidik jari itu pakai kunci privat, yang nggak pernah keluar dari laptopmu. Cuma kamu yang bisa membuat tanda tangan persis seperti ini.',
		verified:
			'HP membuka tanda tangan pakai kunci publik kamu dan dapat sidik jarinya lagi, lalu menghitung sendiri dari filenya. Cocok, jadi updatenya terpasang. Ini benar dari kamu, dan nggak ada yang mengutak atik.',
		edit: 'Lihat sidik jarinya melompat? Satu perubahan kecil, seluruh kodenya berubah. Tapi tanda tangannya masih membawa sidik jari yang lama.',
		untouched:
			'Nggak ada yang diubah, jadi semuanya masih cocok dan updatenya terpasang. Coba selipkan perubahan licik sebelum sampai ke HP.',
		tampered:
			'Ketahuan. Tanda tangannya masih membuka sidik jari lama, tapi filenya sekarang menghasilkan sidik jari baru. HP menolak updatenya, dan penggunanya selamat.',
		forged:
			'Usaha yang bagus, penjahat. Penyerang menandatangani pakai kunci privatnya sendiri, tapi HP memeriksa pakai kunci publik nimbus, yang cuma bisa membuka tanda tangan dari kunci nimbus asli. Hasilnya acak, jadi updatenya ditolak lagi.'
	},
	acts: ['Tanda tangan', 'Utak atik', 'Palsukan'],
	actLabel: 'Babak {n}',
	nextAct: 'Lanjut ke babak berikutnya',
	devLabel: 'Kamu, si pembuat',
	userLabel: 'Pengguna',
	attackerLabel: 'Penyerang',
	fileName: 'update aplikasi nimbus',
	lines: ['aplikasi nimbus versi 2.0', 'menambah mode gelap', 'memuat postingan dari nimbus.com'],
	tampers: [
		{ btn: 'Ganti satu angka', line: 0, text: 'aplikasi nimbus versi 2.1' },
		{ btn: 'Sisipkan pencuri password', line: 1, text: 'mode gelap, menyalin password' },
		{ btn: 'Kirim data ke orang asing', line: 2, text: 'memuat postingan, lalu mengirimnya keluar' }
	],
	fingerprintLabel: 'Sidik jari',
	signatureLabel: 'Tanda tangan',
	noSig: 'belum ditandatangani',
	nimbusKey: 'kunci privat nimbus',
	attackerKey: 'kunci privat penyerang',
	hashBtn: 'Buat sidik jarinya',
	signBtn: 'Tanda tangani pakai kunci privat',
	sendBtn: 'Kirim updatenya',
	tamperHint: 'Updatenya lewat di tangan penyerang. Pilih perubahan licik',
	deliverBtn: 'Biarkan sampai ke HP',
	retryBtn: 'Rebut lagi dan ubah sesuatu',
	forgeBtn: 'Tanda tangani pakai kunci penyerang lalu kirim',
	check: {
		heading: 'HP memeriksa',
		opened: 'Tanda tangan dibuka pakai kunci publik nimbus',
		computed: 'Sidik jari dari file yang diterima',
		ok: 'Cocok, update terpasang',
		bad: 'Nggak cocok, update ditolak'
	}
};
