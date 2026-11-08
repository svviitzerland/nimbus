import type { EncryptionText } from '../types';

export const id: EncryptionText = {
	title: 'Enkripsi',
	intro: [
		'Data yang jalan lewat internet itu melewati banyak tangan, router rumah, ISP, kabel antar negara. Di sepanjang jalan itu bisa saja ada yang menguping.',
		'<b>Enkripsi</b> mengacak pesanmu jadi huruf acak yang cuma bisa dibaca pemegang <b>kunci</b>. Penguping tetap bisa melihat lalu lintasnya, tapi isinya cuma acak acakan tak berarti.',
		'<b>HTTPS</b> memakai [[TLS|security/tls]] untuk melindungi data selama dikirim. Data yang tersimpan juga dapat dienkripsi, disebut enkripsi at rest. Keduanya melindungi tahap yang berbeda.',
		'Di tengah jalur ini ada penyadap yang sedang menunggu. Kirim PIN kartumu dua kali, sekali tanpa kunci dan sekali terkunci, lalu bandingkan apa yang berhasil dia baca.',
		'[ingat] Enkripsi menyamarkan isi dengan kunci. Tanpa kunci yang tepat, isi seharusnya sulit dipulihkan.'
	],
	reactions: {
		plain:
			'Bahaya. Tanpa enkripsi, penyadap di tengah jalan membaca PIN-mu bulat bulat. Begitulah nasib data telanjang di internet.',
		encrypted:
			'Pesan dikirim sebagai ciphertext. Penyadap pada contoh ini tidak memiliki kunci yang diperlukan untuk membacanya.'
	},
	youLabel: 'HP kamu',
	snooperLabel: 'Penyadap',
	serverLabel: 'Server',
	message: 'PIN 1234',
	cipher: 'x7#q!9z@f2',
	sendPlain: 'Kirim tanpa enkripsi',
	sendLocked: 'Kirim dengan enkripsi',
	readTag: 'Isi terbaca',
	scrambledTag: 'Isi terenkripsi',
	noteIdle: 'Penyadap dapat mengamati data yang dikirim',
	notePlain: 'Pesan tidak dienkripsi, isinya dapat dibaca penyadap',
	noteLocked: 'Pesan terenkripsi, penyadap tidak memiliki kunci untuk membacanya'
};
