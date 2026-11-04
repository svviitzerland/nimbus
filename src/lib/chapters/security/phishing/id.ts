import type { PhishingText } from './types';

export const id: PhishingText = {
	title: 'Apa itu phishing',
	intro: [
		'Membobol komputer itu kerja keras. Menipu orang yang duduk di depannya sering jauh lebih gampang. Ngapain repot membongkar gembok kalau bisa minta kuncinya aja? Lihat, ada email baru masuk.',
		'Ini namanya <b>phishing</b>. Pesan palsu pura pura datang dari pihak yang kamu percaya (bankmu, bosmu, nimbus.com) dan mendorongmu buat ngetuk link lalu ngetik password. Namanya dari kata fishing, memancing, lempar umpan terus tunggu ada yang nyangkut. Penipu udah melakukannya sejak pertengahan 1990an, dan sampai sekarang ini masih cara paling umum sebuah serangan dimulai.',
		'Kabar baiknya, kebanyakan email palsu ninggalin petunjuk. Yuk baca yang ini pelan pelan, kayak detektif, dan biarin petunjuknya nyala satu per satu.',
		'Petunjuk pertama, <b>pengirimnya</b>. Namanya nimbus.com Security, tapi alamat di belakangnya <b>nimbuss.com</b>, kelebihan satu huruf. Siapa pun bisa ngetik nama apa aja, alamatnya jauh lebih susah dipalsukan.',
		'Petunjuk kedua, <b>tekanannya</b>. Ditutup dalam 24 jam, semua datamu hilang! Email palsu senang bikin kamu buru buru, karena orang yang panik lupa mikir. Perusahaan asli jarang ngancam kayak gitu.',
		'Petunjuk ketiga, <b>linknya</b>. Tombolnya bilang verifikasi, tapi sebenarnya ke mana? Tahan jari atau mouse di atasnya tanpa ngetuk. Alamatnya diawali nimbus.com, padahal pemilik aslinya adalah nama tepat sebelum garis miring pertama, <b>verify.xyz</b>.',
		'[ingat] <b>Tenang dulu, cek pengirim, cek link.</b> Tiga kebiasaan kecil, dan kebanyakan phishing langsung ketahuan di situ.',
		'[fyi] Trik yang sama juga lewat jalan lain. Lewat SMS namanya smishing, lewat telepon namanya vishing. Di Indonesia kamu mungkin pernah lihat versi WhatsApp, file "undangan pernikahan" yang ternyata aplikasi. Kalaupun password sempat bocor, [[MFA|security/mfa]] masih bisa menahan pintunya.',
		'Mau bandingin? Ganti ganti antara email palsu ini dan email asli dari nimbus.com, lihat gimana petunjuknya berubah. Inbox ini cuma pura pura, nggak ada yang bisa melukaimu.'
	],
	reactions: {
		fake: 'Yang palsu lagi. Alamat kelebihan satu huruf, ancaman 24 jam, dan tombol yang menuju verify.xyz. Tiga tanda bahaya dalam satu email.',
		real: 'Yang asli. Alamatnya persis nimbus.com, nggak ada yang nyuruh buru buru, dan tombolnya menuju nimbus.com sendiri. Tapi kalau ragu, mending buka situsnya sendiri daripada ngetuk tombolnya.'
	},
	steps: [
		{
			tag: 'Inbox',
			title: 'Email baru',
			body: 'Kelihatannya dari nimbus.com. Itulah persis yang diinginkan email palsu yang bagus.'
		},
		{
			tag: 'Umpannya',
			title: 'Phishing',
			body: 'Pesan yang <b>pura pura</b> jadi pihak yang kamu percaya, buat dapetin password, uang, atau satu ketukan di link.'
		},
		{
			tag: 'Mode detektif',
			title: 'Cari petunjuk',
			body: 'Email palsu hampir selalu kepeleset di tiga tempat yang sama. Baca pelan pelan, nggak ada yang perlu dijawab sekarang.'
		},
		{
			tag: 'Petunjuk satu',
			title: 'Pengirimnya',
			body: 'Nama bisa ditulis apa aja. <b>Alamat</b> di belakangnya yang asli, dan di sini kelebihan satu huruf.'
		},
		{
			tag: 'Petunjuk dua',
			title: 'Tekanannya',
			body: 'Tenggat dan ancaman ada supaya kamu <b>buru buru</b>. Buru buru itu sahabat terbaik penyerang.'
		},
		{
			tag: 'Petunjuk tiga',
			title: 'Linknya',
			body: 'Baca alamatnya <b>sebelum</b> ngetuk. Nama tepat sebelum garis miring pertama itulah pemilik aslinya, di sini <b>verify.xyz</b>.'
		},
		{
			tag: 'Cara ingat',
			title: 'Tenang, cek, cek',
			body: '<b>Tenang dulu</b>, cek <b>pengirim</b>, cek <b>link</b>. Urutannya gitu, tiap kali.'
		},
		{
			tag: 'Sekilas',
			title: 'Bukan cuma email',
			body: 'SMS, telepon, dan aplikasi chat juga bawa umpan yang sama. Tiga kebiasaan tadi juga ampuh di sana.'
		},
		{
			tag: 'Opsional',
			title: 'Palsu atau asli',
			body: 'Ganti antara dua email dan bandingin petunjuknya.'
		}
	],
	inboxLabel: 'Kotak masuk',
	olderRows: [
		{ from: 'Ibu', subject: 'Minggu makan malam di rumah?' },
		{ from: 'Kafe Nimbus', subject: 'Poin member kamu bulan ini' }
	],
	goesTo: 'Sebenarnya menuju',
	clues: {
		fake: { sender: 'kelebihan satu huruf', urgency: 'bikin buru buru', link: 'bukan nimbus.com' },
		real: { sender: 'persis nimbus.com', urgency: 'nggak buru buru', link: 'nimbus.com sendiri' }
	},
	rule: 'Tenang dulu, cek pengirim, cek link',
	pickLabel: 'Tunjukkan',
	modes: { fake: 'Yang palsu', real: 'Yang asli' },
	emails: {
		fake: {
			fromName: 'nimbus.com Security',
			fromAddr: 'security@nimbuss.com',
			time: '09.12',
			subject: 'Akun kamu akan ditutup',
			body: 'Kami melihat aktivitas mencurigakan di akun nimbus.com kamu. Mohon konfirmasi data kamu supaya akun tetap aktif.',
			urgent: 'Lakukan dalam 24 jam atau semua datamu hilang!',
			cta: 'Verifikasi sekarang',
			url: 'nimbus.com.verify.xyz/login'
		},
		real: {
			fromName: 'nimbus.com',
			fromAddr: 'hello@nimbus.com',
			time: '09.12',
			subject: 'Tanda terima bulan November',
			body: 'Makasih udah belajar bareng Nimbus. Tanda terima bulananmu sudah siap, bisa dilihat kapan aja.',
			urgent: '',
			cta: 'Lihat tanda terima',
			url: 'nimbus.com/account'
		}
	}
};
