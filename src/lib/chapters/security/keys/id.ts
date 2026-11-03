import type { KeysText } from './types';

export const id: KeysText = {
	title: 'Kunci simetris dan asimetris',
	intro: [
		'Dari dulu orang pengin kirim pesan yang cuma bisa dibaca si penerima. Sekitar 2000 tahun lalu, Julius Caesar menulis surat ke jenderalnya dengan menggeser tiap huruf tiga langkah, A jadi D, B jadi E, dan seterusnya.',
		'Yang tahu rahasia "geser tiga" bisa membaliknya dan membaca suratnya. Satu rahasia yang sama dipakai buat mengunci dan membuka, itu namanya <b>kunci simetris</b>. Ini dasar dari [[Enkripsi|networking/encryption]] yang sudah kamu kenal.',
		'Di Perang Dunia II, Jerman memakai mesin <b>Enigma</b> yang jauh lebih rumit, setelannya diganti tiap hari. Alan Turing dan timnya di Bletchley Park akhirnya berhasil membongkarnya, dan itu ikut mempercepat akhir perang.',
		'Tapi ada sakit kepala yang lebih besar. Gimana caranya memberi kunci yang sama ke semua orang dengan aman? Buku kode Enigma harus dibawa kurir dan kapal, dan beberapa kali buku itu direbut musuh. Sekali kuncinya bocor, semua pesan ikut terbaca.',
		'Tahun 1976, Whitfield Diffie dan Martin Hellman menerbitkan ide yang waktu itu terdengar mustahil. Kuncinya dibelah dua. Ada <b>kunci publik</b> yang boleh disebar ke siapa saja, dan <b>kunci privat</b> yang nggak pernah keluar dari pemiliknya.',
		'Bayangkan gembok yang terbuka. Siapa pun bisa menekannya sampai terkunci, tapi cuma pemilik kuncinya yang bisa membukanya lagi. Gembok itu kunci publik, anak kuncinya kunci privat. Itulah <b>kunci asimetris</b>.',
		'Setahun kemudian, 1977, tiga peneliti di MIT (Ron Rivest, Adi Shamir, dan Leonard Adleman) membuat cara nyatanya, namanya <b>RSA</b> dari huruf depan nama mereka. Rahasianya ada di bilangan prima, angka yang cuma bisa dibagi 1 dan dirinya sendiri. Mengalikan dua prima besar itu gampang, tapi memecah hasilnya balik jadi dua prima itu susahnya minta ampun.',
		'[fyi] Ternyata Clifford Cocks, matematikawan di GCHQ (badan intelijen Inggris), sudah menemukan ide yang sama di tahun 1973. Karena rahasia negara, temuannya baru boleh diceritakan ke publik tahun 1997.',
		'Sekarang kedua cara ini kerja bareng tiap kamu buka [[HTTPS|security/tls]], dan kunci asimetris juga jadi dasar [[tanda tangan digital|security/signature]]. Yuk coba sendiri dalam tiga babak. Kirim surat rahasia ke temanmu di nimbus.com, tapi hati hati, ada penyadap di tengah jalan.'
	],
	reactions: {
		symKey:
			'Kuncinya sampai di temanmu, tapi lihat penyadapnya. Dia diam diam memotret kunci itu waktu lewat. Sekarang ada tiga orang yang pegang kunci yang sama.',
		symRead:
			'Kena. Suratnya memang terkunci, tapi penyadap punya salinan kuncinya, jadi dia buka dan baca semuanya. Inilah masalah besar kunci simetris, kuncinya harus ikut jalan.',
		padlock:
			'Temanmu cuma mengirim gembok terbuka. Penyadap boleh saja menyalinnya, toh gembok cuma bisa dipakai buat mengunci, bukan membuka. Anak kuncinya tetap di saku temanmu.',
		sealed:
			'Aman. Penyadap pegang kotak dan gemboknya, tapi nggak bisa membuka apa pun. Cuma kunci privat temanmu yang cocok. Nggak ada kunci rahasia yang pernah lewat jalan.',
		multiply:
			'Langsung jadi, kan? Mengalikan dua bilangan prima itu pekerjaan sepele, bahkan buat kalkulator HP paling murah.',
		factor1:
			'Gampang, ya. Angka kecil bisa dipecah dalam sekali dua kali coba. Sekarang angkanya dibuat lebih besar.',
		factor2:
			'Mulai terasa, kan? Kamu harus coba lebih banyak prima dulu sampai ketemu yang pas. Coba yang terakhir, ini angka yang tadi kita kalikan.',
		factor3:
			'Ketemu juga, 61 dikali 53. Tadi mengalikannya sekejap, tapi membaliknya butuh banyak percobaan. Kunci RSA asli memakai angka sepanjang ratusan digit, dan memecahnya butuh waktu lebih lama dari umur alam semesta. Itulah yang membuat gembok asimetris aman.'
	},
	acts: ['Satu kunci', 'Gembok', 'Bilangan prima'],
	actLabel: 'Babak {n}',
	nextAct: 'Lanjut ke babak berikutnya',
	youLabel: 'Kamu',
	friendLabel: 'Temanmu',
	friendSub: 'nimbus.com',
	snooperLabel: 'Penyadap',
	message: 'Ketemu jam 7',
	cipher: 'Nhwhpx mdp 7',
	keyChip: 'kunci',
	padlockChip: 'gembok',
	boxChip: 'kotak terkunci',
	privateKey: 'kunci privat',
	sym: {
		sendKey: 'Kirim kuncinya dulu',
		sendBox: 'Kirim surat terkunci',
		copiedTag: 'kunci disalin',
		readTag: 'kebaca',
		noteIdle: 'Biar temanmu bisa membuka surat, dia butuh kunci yang sama',
		noteKey: 'Kunci yang sama sekarang ada di temanmu, dan juga di penyadap',
		noteRead: 'Penyadap membuka suratmu dengan kunci curiannya'
	},
	asym: {
		askLock: 'Minta gembok temanmu',
		sendBox: 'Kunci kotaknya lalu kirim',
		copiedTag: 'gembok disalin',
		stuckTag: 'nggak bisa dibuka',
		noteIdle: 'Kali ini temanmu yang mengirim duluan, sebuah gembok yang terbuka',
		noteLock: 'Gemboknya sudah di tanganmu, tinggal ditekan sampai terkunci',
		noteSafe: 'Cuma kunci privat temanmu yang bisa membuka kotak ini'
	},
	rsa: {
		multiplyBtn: 'Kalikan 61 × 53',
		instant: 'sekejap',
		prompt: 'Prima berapa dikali prima berapa yang hasilnya {n}?',
		pickHint: 'Ketuk sebuah prima untuk mencoba membagi',
		tries: '{n} kali coba',
		triesOne: '1 kali coba',
		autoBtn: 'Biar Nim coba satu satu',
		nextBtn: 'Angka berikutnya',
		effortLabel: 'Seberapa capek membaliknya',
		realLabel: 'Ukuran angka di kunci RSA sungguhan',
		realDigits: 'dan masih ratusan digit lagi (sekitar 617 digit)',
		forever: 'lebih lama dari umur alam semesta'
	}
};
