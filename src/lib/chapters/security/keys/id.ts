import type { KeysText } from './types';

export const id: KeysText = {
	title: 'Kunci simetris dan asimetris',
	intro: [
		'Dari dulu orang pengin kirim surat yang cuma bisa dibaca si penerima. Sekitar 2000 tahun lalu, Julius Caesar menulis surat ke jenderalnya dengan menggeser tiap huruf tiga langkah, jadi A berubah jadi D, B jadi E.',
		'Yang tahu rahasia "geser tiga" bisa membaliknya dan membaca suratnya. Satu rahasia yang dipakai buat mengunci sekaligus membuka namanya <b>kunci simetris</b>. Sampai sekarang ini masih jadi mesin [[enkripsi|networking/encryption]] cepat yang kamu pakai tiap hari.',
		'Di Perang Dunia II, Jerman memakai mesin bernama <b>Enigma</b>. Rotornya yang berputar mengacak tiap huruf, dan setelannya diganti tiap hari. Alan Turing dan timnya di Bletchley Park membuat mesin yang berhasil membongkarnya, dan itu ikut mempercepat akhir perang.',
		'Tapi satu kunci bersama punya titik lemah. Sebelum temanmu bisa membuka suratmu, kuncinya harus dikirim dulu ke dia. Lihat jalannya. Ada orang di tengah yang diam diam menyalin kunci itu, lalu nanti membuka suratmu pakai salinannya.',
		'Tahun 1976, Whitfield Diffie dan Martin Hellman menerbitkan ide yang waktu itu terdengar mustahil. Kuncinya dibelah dua. Ada <b>kunci publik</b> yang boleh dibagi ke siapa saja, dan <b>kunci privat</b> yang nggak pernah keluar dari pemiliknya. Kuncinya beda dua, makanya disebut <b>kunci asimetris</b>.',
		'Lihat jalan yang sama sekali lagi. Kali ini temanmu mengirim gembok yang terbuka. Penyadap boleh saja menyalinnya, toh gembok cuma bisa mengunci. Kamu kunci suratmu pakai gembok itu, dan cuma kunci privat temanmu yang bisa membukanya.',
		'[ingat] Kunci publik itu <b>gembok terbuka</b>, siapa pun bisa menguncinya. Kunci privat itu <b>satu satunya anak kunci</b> yang bisa membukanya. Gampangnya, gembok boleh dibagi, anak kunci jangan pernah pergi.',
		'Tahun 1977, tiga peneliti di MIT (Ron Rivest, Adi Shamir, dan Leonard Adleman) membuat cara nyatanya, namanya <b>RSA</b> dari huruf depan nama mereka. Rahasianya ada di bilangan prima. Mengalikan dua bilangan prima itu sekejap, tapi mencari keduanya lagi dari hasilnya susahnya minta ampun.',
		'[fyi] Ada kejutan. Clifford Cocks, matematikawan di GCHQ (badan intelijen Inggris), ternyata sudah menemukan ide yang sama tahun 1973. Karena rahasia negara, dunia baru tahu ceritanya tahun 1997.',
		'Sekarang kedua jenis kunci ini kerja bareng tiap kamu buka [[HTTPS|security/tls]], dan kunci privat juga jadi dasar [[tanda tangan digital|security/signature]]. Kalau mau, coba ganti jalannya antara satu kunci bersama dan gembok, lalu lihat bedanya.'
	],
	reactions: {
		shared:
			'Satu kunci bersama lagi. Kuncinya harus jalan duluan, penyadap menyalinnya di tengah, dan suratmu nggak rahasia lagi.',
		padlock:
			'Pakai gembok lagi. Penyadap cuma dapat salinan gembok terbuka, dan itu nggak bisa dipakai membuka apa pun. Cuma kunci privat temanmu yang bisa mengeluarkan suratnya.'
	},
	steps: [
		{
			tag: 'Sekitar 50 SM',
			title: 'Surat rahasia',
			body: 'Caesar menggeser tiap huruf tiga langkah. <b>HELLO</b> jadi <b>KHOOR</b>, dan cuma yang tahu geserannya yang bisa membaca.'
		},
		{
			tag: 'Satu kunci',
			title: 'Kunci simetris',
			body: 'Rahasia yang <b>sama</b> dipakai buat mengunci dan membuka. Pengirim dan penerima sama sama butuh salinannya.'
		},
		{
			tag: '1939 sampai 1945',
			title: 'Enigma dan Bletchley Park',
			body: 'Enigma tetap satu kunci bersama, cuma sangat rumit. Turing membuktikan mesin secanggih apa pun tetap bisa dibongkar.'
		},
		{
			tag: 'Titik lemah',
			title: 'Kuncinya harus jalan',
			body: 'Siapa pun yang menyalin kunci di jalan bisa membuka <b>semua</b> surat yang dikunci dengannya. Membagi kunci dengan aman itulah sakit kepala sebenarnya.'
		},
		{
			tag: '1976',
			title: 'Kuncinya dibelah dua',
			body: 'Ada <b>kunci publik</b> yang boleh dipegang siapa saja, dan <b>kunci privat</b> yang tetap di rumah. Keduanya satu pasangan.'
		},
		{
			tag: 'Dua kunci',
			title: 'Kunci asimetris',
			body: 'Yang jalan cuma gembok terbuka. Menyalinnya nggak ada gunanya, karena gembok cuma bisa mengunci.'
		},
		{
			tag: 'Cara ingat',
			title: 'Gembok dan anak kunci',
			body: 'Kunci publik, gembok terbuka yang <b>bisa dikunci siapa saja</b>. Kunci privat, <b>satu satunya</b> anak kunci yang bisa membukanya.'
		},
		{
			tag: '1977',
			title: 'RSA dan bilangan prima',
			body: 'Bilangan <b>prima</b> cuma bisa dibagi 1 dan dirinya sendiri. Mengalikan dua prima itu cepat, mundur lagi harus coba angka satu per satu. Kunci asli memakai prima ratusan digit.'
		},
		{
			tag: 'Cerita sampingan',
			title: 'Ketemu duluan, disimpan rapat',
			body: 'Clifford Cocks sudah punya idenya tahun 1973, tapi intelijen menyimpan rahasianya. Diffie, Hellman, dan RSA tetap dikenang karena membaginya ke dunia.'
		},
		{
			tag: 'Opsional',
			title: 'Coba dua jalan',
			body: 'Ganti antara satu kunci bersama dan gembok. HTTPS sungguhan memakai gembok buat mengirim kunci bersama dengan aman, lalu kunci bersama yang cepat buat sisanya.'
		}
	],
	youLabel: 'Kamu',
	friendLabel: 'Temanmu',
	snooperLabel: 'Penyadap',
	message: 'Ketemu jam 7',
	tags: {
		copiedKey: 'kunci disalin',
		copiedLock: 'gembok disalin',
		read: 'surat terbaca',
		stuck: 'nggak bisa dibuka'
	},
	sharedKey: 'satu kunci bersama',
	publicKey: 'kunci publik',
	privateKey: 'kunci privat',
	rule: { anyone: 'siapa pun bisa mengunci', only: 'cuma kunci ini yang membuka' },
	rsa: {
		easy: 'sekejap',
		hard: 'mundurnya lama sekali',
		tries: '{n} kali coba'
	},
	secret: 'RAHASIA',
	enigma: {
		alt: 'Foto mesin Enigma asli dengan rotor, lampu huruf, dan papan tombol',
		caption: 'Mesin Enigma asli'
	},
	turing: {
		alt: 'Foto hitam putih Alan Turing muda memakai jas',
		caption: 'Alan Turing, sekitar 1928'
	},
	modes: { label: 'Kirim suratnya pakai', shared: 'Satu kunci bersama', padlock: 'Gembok' }
};
