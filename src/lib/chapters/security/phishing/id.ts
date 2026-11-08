import type { PhishingText } from './types';

export const id: PhishingText = {
	title: 'Apa itu phishing',
	intro: [
		'Seseorang bisa mencoba memperoleh password atau uang tanpa membobol software. Salah satu caranya adalah mengirim pesan yang menipu penerima.',
		'<b>Phishing</b> meniru pihak yang dipercaya agar penerima memberikan informasi atau melakukan tindakan. Contohnya halaman login palsu yang meminta password nimbus.com.',
		'Ceritanya mulai pertengahan 1990an, waktu penipu menyamar jadi staf AOL (penyedia internet raksasa zaman itu) dan minta password ke penggunanya. Sampai sekarang ini masih jadi cara paling umum serangan dimulai, karena orang sibuk dan tiruan yang bagus kelihatan persis seperti aslinya.',
		'Untungnya kebanyakan tiruan meninggalkan petunjuk. Cek <b>pengirimnya</b>, alamatnya bisa beda satu huruf. Cek <b>linknya</b>, ke mana tombol itu sebenarnya pergi. Dan rasakan <b>desakannya</b>, penipu suka bikin kamu buru buru supaya lupa mikir.',
		'[fyi] Trik yang sama, jalur yang beda. Lewat SMS namanya smishing, lewat telepon namanya vishing. Di Indonesia kamu mungkin pernah lihat versi WhatsAppnya, file "undangan pernikahan" yang ternyata jebakan.',
		'[ingat] Periksa alamat pengirim, tujuan link, dan permintaannya. Untuk tindakan penting, konfirmasi lewat saluran yang sudah kamu kenal.',
		'Kotak masuk ini pura pura, nggak ada yang bisa melukaimu. Buka tiap email, intip ke mana tombolnya sebenarnya pergi, lalu putuskan, asli atau phishing?'
	],
	reactions: {
		peek: 'Itu yang terjadi kalau kamu arahkan kursor ke link di komputer. Tulisan tombolnya bisa apa saja, tapi alamat di baliknya yang jujur. Lihat bagian tepat sebelum garis miring pertama, itulah situs aslinya.',
		invoiceRight:
			'Betul, yang ini asli. Pengirimnya berakhiran nimbus.com, linknya ke nimbus.com, dan nggak ada yang buru buru. Email tenang seperti ini wajar.',
		invoiceWrong:
			'Eh, yang ini asli. Pengirimnya berakhiran nimbus.com, linknya tetap di nimbus.com, dan nggak ada desakan. Curiga itu bagus, tapi cek dulu petunjuknya sebelum memutuskan.',
		lookalikeRight:
			'Matamu jeli. Lihat baik baik, tulisannya nirnbus.com, huruf r dan n dirapatkan supaya mirip m. Penipu bisa beli alamat begini cuma dengan beberapa puluh ribu rupiah.',
		lookalikeWrong:
			'Kena deh. Baca pengirimnya pelan pelan, itu nirnbus.com, bukan nimbus.com. Huruf r dan n yang berdempetan kelihatan seperti m kalau sekilas, dan itulah triknya.',
		resetRight:
			'Mantap. Pengirimnya kelihatan wajar, tapi linknya ke accountcheck.xyz. Tulisan nimbus.com di depannya cuma kedok, situs aslinya ada tepat sebelum garis miring pertama.',
		resetWrong:
			'Yang ini palsu. Nama pengirim bisa dipalsukan, jadi link adalah saksi yang lebih jujur, dan link ini menuju accountcheck.xyz. Mengetik password di sana sama saja menyerahkannya ke penipu.',
		bossRight:
			'Benar. Bos yang tiba tiba butuh voucher, minta dirahasiakan, dan bilang jangan telepon, itu desakan bertumpuk. Obatnya gampang, telepon dia ke nomor yang sudah kamu simpan.',
		bossWrong:
			'Ini penipuan. Rahasia, mendesak, voucher, dan "jangan telepon aku". Bos asli bisa menunggu lima menit sementara kamu memastikan lewat telepon. Kode voucher langsung hilang begitu dikirim.',
		signinRight:
			'Pesan ini sesuai contoh notifikasi asli. Untuk memeriksa aktivitas akun, buka alamat nimbus.com sendiri dan masuk melalui situs tersebut.',
		signinWrong:
			'Yang ini asli, pengirim dan linknya sama sama nimbus.com dan nggak minta apa pun. Tapi hati hatimu itu sehat kok. Kalau ragu, lewati tombolnya dan buka nimbus.com sendiri.',
		done: 'Kotak masuk beres. Kebanyakan tiruan bersandar pada tiga petunjuk yang sama, pengirim, link, dan desakan. Dan kalaupun password sampai bocor, [[MFA|security/mfa]] membuat password saja nggak cukup buat masuk.'
	},
	inboxLabel: 'Kotak masuk',
	counter: 'Email {n} dari {total}',
	peek: 'Intip ke mana tombolnya pergi',
	peekLabel: 'Sebenarnya menuju',
	noLink: 'Nggak ada link sama sekali, dia cuma minta dibalas',
	markReal: 'Kelihatan asli',
	markFake: 'Phishing',
	nextEmail: 'Email berikutnya',
	again: 'Pilah ulang kotak masuk',
	verdictRight: 'Tepat',
	verdictWrong: 'Belum tepat',
	realTag: 'asli',
	fakeTag: 'phishing',
	clues: {
		sender: 'Petunjuk, pengirimnya',
		link: 'Petunjuk, linknya',
		urgency: 'Petunjuk, desakannya',
		none: 'Nggak ada petunjuk, semua cek lolos'
	},
	scoreLabel: '{n} dari {total} dipilah dengan benar',
	safeNote: 'Kotak masuk pura pura, semua email di sini karangan',
	emails: {
		invoice: {
			fromName: 'Nimbus Billing',
			fromAddr: 'billing@nimbus.com',
			time: '08.12',
			subject: 'Struk pembayaran November',
			body: 'Terima kasih atas pembayaran Rp 50.000 untuk paket Starter. Struknya bisa kamu lihat di akunmu kapan saja.',
			urgent: '',
			cta: 'Lihat struk',
			url: 'nimbus.com/billing'
		},
		lookalike: {
			fromName: 'Nimbus Support',
			fromAddr: 'support@nirnbus.com',
			time: '09.40',
			subject: 'Ada aktivitas aneh di akunmu',
			body: 'Kami melihat sesuatu yang janggal di akunmu. Tolong konfirmasi datamu supaya akunmu tetap aman.',
			urgent: '',
			cta: 'Konfirmasi data',
			url: 'nirnbus.com/verify'
		},
		reset: {
			fromName: 'Nimbus',
			fromAddr: 'noreply@nimbus.com',
			time: '11.05',
			subject: 'Passwordmu kedaluwarsa hari ini',
			body: 'Supaya tetap bisa memakai nimbus.com, tolong konfirmasi password kamu yang sekarang.',
			urgent: '',
			cta: 'Pertahankan password',
			url: 'nimbus.com.accountcheck.xyz/login'
		},
		boss: {
			fromName: 'Raka (CEO)',
			fromAddr: 'raka.ceo.nimbus@quickmail.co',
			time: '13.27',
			subject: 'Minta tolong cepat, rahasia ya',
			body: 'Aku lagi terjebak rapat. Tolong belikan lima voucher belanja buat klien, lalu kirim kodenya ke aku.',
			urgent: 'Butuh dalam 30 menit, dan jangan telepon aku.',
			cta: 'Balas',
			url: ''
		},
		signin: {
			fromName: 'Nimbus Security',
			fromAddr: 'security@nimbus.com',
			time: '15.50',
			subject: 'Login baru dari Bandung',
			body: 'Ada yang baru saja login ke akunmu dari HP baru. Kalau itu kamu, nggak perlu melakukan apa apa.',
			urgent: '',
			cta: 'Lihat aktivitas',
			url: 'nimbus.com/security'
		}
	}
};
