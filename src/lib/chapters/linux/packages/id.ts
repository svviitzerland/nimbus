import type { PackagesText } from './types';

export const id: PackagesText = {
	title: 'Package manager',
	intro: [
		'Servermu masih baru dan kosong. Biar bisa nyajiin nimbus.com, dia butuh <b>web server</b>, program yang ngebagiin halaman ke pengunjung. Zaman dulu kamu harus nyari file download, bongkar sendiri, terus berharap semua potongan kecil yang dia butuhin juga udah ada.',
		'Linux punya cara yang jauh lebih enak, namanya <b>package manager</b>. Bayangin toko aplikasi yang kamu pakai dengan ngetik. <b>Package</b> itu satu program yang udah dibungkus rapi, dan tokonya disebut <b>repository</b>, dikelola Ubuntu dan dicek keamanannya.',
		'Di Ubuntu, package managernya bernama <b>apt</b>. <b>apt update</b> nyegerin daftar barang di rak toko, <b>apt install</b> download program sekalian semua yang dia butuhin, dan <b>apt remove</b> ngehapusnya lagi. Masang program itu ngubah seluruh sistem, jadi butuh <b>sudo</b>, persis kayak di [[Permission dan sudo|linux/permissions]].',
		'[fyi] Sistem lain punya penjaga tokonya sendiri. Fedora dan Red Hat pakai dnf, Mac pakai Homebrew, Windows punya winget, dan HP kamu punya Play Store atau App Store. Programmer bahkan punya package manager buat kode, kayak npm buat JavaScript dan pip buat Python.',
		'Giliran kamu. Pasang <b>nginx</b> (bacanya engine x), salah satu web server yang paling banyak dipakai di dunia, terus buka nimbus.com dan lihat dia nyapa kamu. Tekan Bantu kalau mentok.'
	],
	reactions: {
		updated:
			'Daftar raknya udah segar. Sekarang apt tau versi terbaru tiap package di repository. Yang didownload cuma daftarnya, belum ada yang dipasang.',
		installed:
			'Kepasang cuma pakai satu baris! apt ngambil nginx plus nginx-common (potongan yang dia butuhin), ngebongkarnya, bahkan langsung nyalain web servernya. Kalau manual, bisa lama banget.',
		version:
			'nginx jawab pakai versinya, bukti programnya beneran udah ada di server. Ngecek versi itu cara paling cepat buat tau pemasangannya berhasil.',
		opened:
			'Itu dia halaman sambutan nginx, disajiin sama server kamu sendiri! Nanti kamu ganti pakai file nimbus.com yang asli, tapi bagian web servernya udah beres.',
		needSudo:
			'Lihat bagian akhirnya, <b>are you root?</b> Masang program nyentuh seluruh sistem, jadi apt minta kuasa admin. Taruh <b>sudo</b> di depan lalu coba lagi.',
		notInstalled:
			'Ubuntu lagi baik nih. Programnya belum ada, tapi dia ngasih tau persis baris apt mana yang bakal masangnya.',
		noPackage:
			'apt nggak nemu package dengan nama itu. Nama package harus persis, cek lagi ejaannya (nginx, huruf g sebelum i).',
		already:
			'Nggak ada yang perlu dilakuin, package itu udah terpasang dan paling baru. apt nggak pernah download hal yang sama dua kali.',
		other:
			'Kepasang! Satu baris yang sama bisa dipakai buat program apa aja di toko. Tapi misinya tetap minta nginx ya.',
		abort:
			'Kamu jawab nggak, jadi apt berhenti dan nggak ngubah apa pun. Pertanyaan itu kesempatan terakhir buat ngecek apa yang mau dipasang. Tambahin <b>-y</b> di akhir buat jawab iya duluan.',
		removed:
			'nginx hilang, dan nimbus.com ikut sepi. Satu baris buat masang, satu baris buat hapus. Pasang lagi biar situsnya balik.',
		removedOther: 'Kehapus bersih, kayak nggak pernah ada.',
		upgrade:
			'<b>apt upgrade</b> naikin semua package yang terpasang ke versi paling baru. Sekarang semuanya udah baru, tapi di server beneran kamu sering jalanin update lalu upgrade, biar dapat perbaikan keamanan.',
		offline:
			'Belum ada yang jawab. Belum ada web server yang jalan di mesin ini, jadi kunjungannya nggak punya tempat mendarat. Pasang nginx dulu.',
		missing: 'Nggak ada yang namanya itu di sini. Jalanin <b>ls</b> buat lihat isinya.',
		denied: 'Dikunci. Yang itu butuh kuasa admin, coba pakai <b>sudo</b> di depan.',
		error:
			'Server nggak kenal perintah itu. Cek lagi ejaannya, atau ketik <b>help</b> buat lihat perintah yang dia tau.',
		done: 'Semua misi beres! Kamu nyegerin daftar toko, masang web server beneran pakai satu perintah, ngeceknya, dan buka halaman sambutannya. Semua server cloud mulai hidupnya kayak gini, beberapa baris apt dan dia siap kerja.'
	},
	missionsLabel: 'Misi',
	missions: ['Segarkan daftar package', 'Pasang nginx', 'Cek nginx udah ada', 'Buka nimbus.com'],
	hintBtn: 'Bantu',
	doneNote: 'Semua misi beres, web servernya udah nyala',
	inputLabel: 'perintah',
	termHint: '# coba sudo apt update, lalu tekan Enter',
	hintUnknown: '# perintah itu nggak ada di sini, ketik help buat lihat daftarnya',
	didYouMean: '# mungkin maksudnya {word}',
	hintMissing: '# nggak ada yang namanya itu, ls nampilin isi sekitar',
	hintDenied: '# dikunci, coba pakai sudo di depan',
	storeLabel: 'Toko package Ubuntu',
	serverLabel: 'Server kamu',
	openBtn: 'Buka',
	reloadBtn: 'Muat ulang',
	browserIdle: 'Tap Buka buat ngunjungin nimbus.com',
	offlineTitle: 'Situs ini nggak bisa dijangkau',
	offlineSub: 'nimbus.com menolak sambungan',
	hintSudo: '# masang program butuh kuasa admin, taruh sudo di depan',
	hintApt: '# coba sudo apt install nginx',
	hintVersion: '# {name} udah terpasang, coba {name} -v',
	hintCurl: '# coba curl localhost'
};
