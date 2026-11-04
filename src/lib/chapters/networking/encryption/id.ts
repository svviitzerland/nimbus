import type { EncryptionText } from '../types';

export const id: EncryptionText = {
	title: 'Enkripsi',
	intro: [
		'Data yang jalan lewat internet itu melewati banyak tangan, router rumah, ISP, kabel antar negara. Di sepanjang jalan itu bisa saja ada yang menguping.',
		'<b>Enkripsi</b> mengacak pesanmu jadi huruf acak yang cuma bisa dibaca pemegang <b>kunci</b>. Penguping tetap bisa melihat lalu lintasnya, tapi isinya cuma acak acakan tak berarti.',
		'Gembok kecil di browser artinya ini, sambunganmu memakai [[HTTPS|security/tls]], semua yang lewat dienkripsi. Data yang disimpan di disk pun bisa diacak juga, namanya enkripsi at rest (saat data sedang diam tersimpan).',
		'Di tengah jalur ini ada penyadap yang sedang menunggu. Kirim PIN kartumu dua kali, sekali tanpa kunci dan sekali terkunci, lalu bandingkan apa yang berhasil dia baca.'
	],
	reactions: {
		plain:
			'Bahaya. Tanpa enkripsi, penyadap di tengah jalan membaca PIN kamu bulat bulat. Begitulah nasib data telanjang di internet.',
		encrypted:
			'Sekarang penyadapnya cuma kebagian huruf acak. Pesannya baru terbuka di tujuan, karena cuma server yang pegang kuncinya. Itulah kerja gembok kecil di browsermu.'
	},
	youLabel: 'HP kamu',
	snooperLabel: 'Penyadap',
	serverLabel: 'Server',
	message: 'PIN 1234',
	cipher: 'x7#q!9z@f2',
	sendPlain: 'Kirim tanpa kunci',
	sendLocked: 'Kirim terkunci',
	readTag: 'kebaca!',
	scrambledTag: 'cuma acak acakan',
	noteIdle: 'Ada yang menguping di tengah jalan',
	notePlain: 'Pesan telanjang, penyadap membacanya',
	noteLocked: 'Teracak rapat, cuma server yang bisa membuka'
};
