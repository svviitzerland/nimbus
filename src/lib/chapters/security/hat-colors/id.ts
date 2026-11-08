import type { HatColorsText } from './types';

export const id: HatColorsText = {
	title: 'Jenis hacker',
	intro: [
		'Istilah <b>white hat</b>, <b>black hat</b>, dan <b>gray hat</b> sering dipakai untuk membahas kegiatan hacker. Untuk menilai contoh di sini, periksa izin dan tujuan tindakannya.',
		'<b>Hacker</b> sebenarnya cuma orang yang paham sebuah sistem begitu dalam sampai bisa membuatnya melakukan hal yang nggak pernah direncanakan. Keahliannya sendiri netral, mirip tukang kunci yang bisa membuka pintu apa saja.',
		'<b>White hat</b> menguji sistem dengan izin untuk memperbaiki keamanan. <b>Black hat</b> menyalahgunakan sistem, misalnya untuk mencuri atau memeras. <b>Gray hat</b> biasanya merujuk pada pengujian tanpa izin walau pelakunya mengaku ingin membantu.',
		'Dua orang dapat memakai alat yang sama dengan batas akses berbeda. Satu diberi akun tes dan scope tertulis, sedangkan yang lain masuk tanpa persetujuan pemilik.',
		'Izin perlu menjelaskan sistem yang boleh diuji dan tindakan yang diperbolehkan. Menguasai teknik pengujian tidak memberikan izin untuk mencobanya pada sistem orang lain.',
		'[fyi] Kabar baiknya, sekarang perusahaan malah mengundang hacker. Tahun 1995 Netscape sudah membayar orang yang menemukan bug di browsernya, dan sekarang program <b>bug bounty</b> seperti ini membayar uang sungguhan untuk laporan yang rapi. Lebih lengkapnya di [[pentest dan bug bounty|security/pentest]].',
		'[ingat] <b>Periksa izinnya sebelum tekniknya.</b> Niat membantu tidak menggantikan persetujuan pemilik dan batas pengujian.',
		'Baca enam kasus ini dan tentukan apakah tindakannya mendapat izin. Setelah itu, lihat kategori yang sesuai dengan kasus tersebut.'
	],
	reactions: {
		lab: 'Dina memakai perangkat dan lingkungan latihannya sendiri. Pengujian tidak menyentuh sistem pihak lain.',
		wifi: 'Tidak ada izin dari pemilik WiFi. Rasa ingin tahu tidak mengubah batas akses yang diberikan.',
		pentest:
			'Sari memiliki izin pengujian yang menetapkan ruang lingkup, waktu, dan metode. Pengujian tetap harus mengikuti batas tersebut.',
		extort:
			'Akses dilakukan tanpa izin dan diikuti ancaman penyebaran data. Ini contoh penyalahgunaan sistem.',
		warn: 'Tono tidak memiliki izin untuk mengakses sistem tersebut. Menyampaikan temuan sesudahnya tidak menggantikan izin sebelum pengujian.',
		bounty:
			'Bima mengikuti izin dan aturan program bug bounty. Temuan disampaikan melalui saluran yang ditentukan.'
	},
	askLabel: 'Ada izin untuk tindakan ini?',
	legalBtn: 'Ada izin',
	illegalBtn: 'Tidak ada izin',
	scenarios: {
		lab: {
			who: 'Dina, 16 tahun',
			story:
				'Dina mencoba membobol laptop lama miliknya sendiri di rumah, buat belajar cara kerjanya.',
			why: 'Perangkatnya sendiri, jadi nggak perlu izin orang lain.'
		},
		wifi: {
			who: 'Raka',
			story: 'Raka menebak nebak password WiFi tetangganya, cuma buat lihat bisa atau nggak.',
			why: 'Nggak ada izin dari pemiliknya, walau tanpa niat jahat.'
		},
		pentest: {
			who: 'Sari, konsultan keamanan',
			story:
				'Sebuah bank menandatangani kontrak dengan Sari dan memintanya mencoba membobol aplikasi mereka.',
			why: 'Ada izin tertulis dari pemilik, dengan batasan yang jelas.'
		},
		extort: {
			who: 'Email tanpa nama',
			story: 'Seseorang membobol sebuah toko, lalu minta uang atau data pelanggannya akan disebar.',
			why: 'Tanpa izin, dan berubah jadi pemerasan.'
		},
		warn: {
			who: 'Tono',
			story:
				'Tono menyelinap ke situs sekolahnya tanpa izin, lalu mengirim email ke admin untuk memberi tahu celahnya.',
			why: 'Niatnya baik, tapi tetap nggak ada izin sebelum dia masuk.'
		},
		bounty: {
			who: 'Bima',
			story:
				'Bima membaca aturan bug bounty nimbus.com, menemukan bug sesuai aturan itu, lalu melaporkannya diam diam.',
			why: 'Program bug bounty itu izin tertulis, dan dia mengikuti aturannya.'
		}
	},
	hats: { white: 'White hat', gray: 'Gray hat', black: 'Black hat' },
	legalTag: 'berizin',
	illegalTag: 'tanpa izin',
	rightTag: 'tebakanmu benar',
	wrongTag: 'belum tepat',
	nextBtn: 'Cerita berikutnya',
	progress: 'Cerita {n} dari {total}',
	scoreLine: 'Kamu menebak benar {n} dari {total}',
	doneLine: 'Periksa izin, tujuan, dan batas pengujian pada setiap kasus.',
	again: 'Dengar ceritanya lagi'
};
