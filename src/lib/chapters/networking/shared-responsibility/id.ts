import type { SharedResponsibilityText } from '../types';

export const id: SharedResponsibilityText = {
	title: 'Tanggung Jawab Bersama',
	intro: [
		'Satu kesalahpahaman paling umum soal cloud, "kan sudah di cloud, berarti aman dong". Belum tentu.',
		'Keamanan di cloud itu dibagi dua, namanya <b>shared responsibility</b>. Penyedia cloud menjaga <b>gedungnya</b>, fisik data center, hardware, dan jaringannya.',
		'Sedangkan kamu menjaga <b>isi di dalamnya</b>, yaitu data, siapa yang boleh akses, kunci, dan pengaturanmu sendiri. Sebagian besar kebobolan di cloud terjadi karena salah atur di sisi pelanggan, bukan karena penyedianya jebol.',
		'Pembagiannya sudah disiapkan. Bentangkan, dan lihat siapa kebagian apa.',
		'[ingat] Penyedia menjaga bagian yang dikelolanya. Kamu tetap menjaga data, akses, dan pengaturan yang menjadi tanggung jawabmu.'
	],
	reactions: {
		shown:
			'Jelas ya. Gedung dan mesinnya urusan penyedia, isi dan kuncinya urusanmu. Kalau datamu bocor karena lupa mengunci akses, itu bukan salah cloudnya.'
	},
	providerTitle: 'Penyedia cloud',
	providerSub: 'Mengelola infrastruktur layanan',
	youTitle: 'Kamu',
	youSub: 'Mengelola data, akses, dan konfigurasi',
	providerItems: ['Gedung data center', 'Hardware & mesin', 'Jaringan & listrik'],
	youItems: ['Datamu', 'Siapa boleh akses', 'Kunci & pengaturan'],
	reveal: 'Lihat pembagiannya',
	noteIdle: 'Pembagian bergantung pada layanan yang digunakan',
	noteDone: 'Periksa tanggung jawab tiap pihak untuk layananmu'
};
