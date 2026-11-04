import type { CableText } from '../../types';

export const id: CableText = {
	title: 'Lewat mana data jalan?',
	intro: [
		'Data center tempat servermu disewa bisa ada di negara lain, bahkan benua lain. Lewat apa sih data menyeberang sejauh itu?',
		'Banyak yang ngira lewat satelit di langit. Padahal hampir semua data antar benua, sekitar 99%, jalan lewat <b>kabel serat optik di dasar laut</b>. Datanya dikirim sebagai kilatan cahaya lewat kaca setipis rambut.',
		'Garis garis tipis di peta ini kabel laut sungguhan yang aktif sekarang.',
		'Tiap kabel naik ke darat di titik yang disebut <b>landing station</b> (titik titik kecil itu). Dari situ data masuk ke jaringan darat, lalu sampai ke data center.',
		'Penggunamu di Argentina sudah siap mengirim. Pilihkan satu tujuan, lalu temani datanya menyelam sampai ke seberang.'
	],
	reactions: {
		leaving: 'Datamu keluar dari HP, lewat router dan ISP, menuju pantai...',
		undersea: 'Sekarang menyelam, melintasi dasar laut lewat kabel, ribuan kilometer jauhnya...',
		near: 'Sampai! Tujuannya dekat, kabelnya pendek, jadi datanya cepat tiba.',
		far: 'Sampai juga. Tapi tadi datamu benar benar menyeberangi separuh bumi lewat kabel. Itulah kenapa makin jauh makin lama.'
	},
	users: 'Penggunamu',
	prompt: 'Klik sebuah tujuan untuk mengirim data',
	again: 'Klik lagi untuk mengirim ulang',
	phases: {
		leaving: 'Keluar dari HP menuju pantai',
		undersea: 'Melintasi dasar laut',
		arrived: 'Tiba di data center'
	},
	cablesNote: 'Garis tipis itu kabel laut yang aktif sekarang',
	routeNote: 'Contoh jalur nyata, rute asli tiap paket bisa beda.',
	credit: 'Data kabel oleh TeleGeography',
	compare: {
		near: 'Dekat',
		far: 'Jauh',
		hint: 'Kirim ke satu tempat dekat dan satu yang jauh biar kerasa bedanya'
	},
	dests: { 'sa-east-1': 'São Paulo', 'eu-central-1': 'Frankfurt', 'ap-northeast-1': 'Tokyo' }
};
