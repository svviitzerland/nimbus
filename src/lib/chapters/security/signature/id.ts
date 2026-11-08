import type { SignatureText } from './types';

export const id: SignatureText = {
	title: 'Tanda tangan digital',
	intro: [
		'Saat HP menerima update aplikasi, perangkat perlu memeriksa siapa yang menerbitkannya dan apakah file berubah selama pengiriman. <b>Tanda tangan digital</b> membantu memeriksa dua hal itu.',
		'Pembuat aplikasi menandatangani file dengan <b>kunci privat</b>. Perangkat memverifikasi tanda tangan memakai <b>kunci publik</b> penerbit yang dipercaya. Pasangan kuncinya dibahas di [[kunci publik dan privat|security/keys]].',
		'Verifikasi harus memakai kunci publik yang benar. Tanda tangan dari kunci orang lain tidak membuktikan bahwa file diterbitkan oleh Nimbus.',
		'Proses tanda tangan biasanya melibatkan <b>hash</b>, ringkasan yang dihitung dari isi file. Perubahan isi menghasilkan hash berbeda. Pelajari sifatnya di [[hashing|security/hashing]].',
		'Algoritma tanda tangan memakai kunci privat dan data yang ditandatangani untuk menghasilkan signature. Menandatangani file tidak menyembunyikan isinya.',
		'Perangkat memverifikasi file, signature, dan kunci publik bersama. File yang berubah atau signature dari kunci lain gagal diverifikasi.',
		'[fyi] Angka pendek di latihan ini adalah visualisasi, bukan implementasi kriptografi. Sistem nyata menggunakan algoritma standar seperti Ed25519, ECDSA, atau RSA dengan parameter yang sesuai.',
		'[ingat] <b>Kunci privat menandatangani, kunci publik memverifikasi.</b> Lindungi kunci privat dan pastikan kunci publik berasal dari penerbit yang dipercaya.',
		'Tanda tangani update dan kirim. Setelah itu, ubah isi file dan coba tanda tangan dari kunci berbeda. Bandingkan hasil pemeriksaan HP.'
	],
	reactions: {
		fingerprint:
			'Itu dia sidik jari update kamu. File yang sama selalu menghasilkan sidik jari yang sama, di komputer mana pun di dunia.',
		signed:
			'Update ditandatangani dengan kunci privat Nimbus. Kunci privat harus tetap rahasia, sedangkan file dan tanda tangan dapat dibagikan.',
		verified:
			'Verifikasi berhasil dengan kunci publik Nimbus. File cocok dengan data yang ditandatangani oleh pemilik kunci privat pasangannya.',
		edit: 'Isi file berubah dan hash yang dihitung ikut berubah. Signature sebelumnya masih dibuat untuk isi yang lama.',
		untouched:
			'File tidak berubah, jadi verifikasi berhasil. Coba ubah satu bagian sebelum mengirimnya lagi.',
		tampered:
			'Verifikasi gagal karena isi file berbeda dari data yang ditandatangani. HP menolak update tersebut.',
		forged:
			'Signature dibuat dengan kunci penyerang, sedangkan HP memeriksa dengan kunci publik Nimbus. Pasangannya tidak cocok, jadi update ditolak.'
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
	tamperHint: 'Pilih bagian file yang akan diubah',
	deliverBtn: 'Biarkan sampai ke HP',
	retryBtn: 'Ubah file lagi',
	forgeBtn: 'Tanda tangani pakai kunci penyerang lalu kirim',
	check: {
		heading: 'HP memeriksa',
		opened: 'Kunci publik untuk verifikasi',
		computed: 'Sidik jari dari file yang diterima',
		ok: 'Verifikasi berhasil, update terpasang',
		bad: 'Verifikasi gagal, update ditolak'
	}
};
