import type { PackagesText } from './types';

export const id: PackagesText = {
	title: 'Package manager',
	intro: [
		'Server nimbus.com kamu masih baru dan hampir kosong. Biar bisa nampilin website, dia butuh program <b>web server</b>, dan yang paling disukai namanya <b>nginx</b> (bacanya "engine x"). Terus gimana caranya masang program di komputer yang nggak punya browser dan nggak punya mouse?',
		'Kamu pesan dari toko. Program buat Linux datang dalam bentuk <b>package</b>, kotak rapi berisi programnya plus semua yang dia butuhin. <b>Package manager</b> itu app store yang kamu ajak ngobrol dari terminal. Di Ubuntu namanya <b>apt</b>.',
		'Langkah pertama, <b>apt update</b>. Dia nggak masang apa apa, cuma ngambil daftar terbaru isi rak toko. Lihat daftar kecilnya terbang ke server.',
		'Langkah kedua, <b>apt install nginx</b>. apt nyari kotaknya, download, buka, terus dipasang, sekalian bawa potongan lain yang dibutuhin nginx (namanya <b>dependency</b>). Lihat kotaknya mendarat di rak server.',
		'Perhatiin, dua perintah tadi diawali <b>sudo</b>. Masang program ngubah seluruh server, jadi cuma admin yang boleh. Nim sengaja nggak pakai sudo, dan apt nolak (gembok merah itu), persis kayak di [[Permission dan sudo|linux/permissions]].',
		'Berhasil nggak? Kebanyakan program jawab <b>-v</b> atau <b>--version</b> pakai nomor versinya. Nim ngetik <b>nginx -v</b>, dan servernya jawab. Terpasang dan siap.',
		'[ingat] Update dulu, baru install. Kayak lihat menu terbaru dulu, baru pesan. Dan masang program itu ngubah seisi rumah, jadi selalu minta sudo.',
		'[fyi] Tiap sistem punya tokonya sendiri. Fedora pakai dnf, Mac pakai brew, dan programmer ngambil library kode pakai npm atau pip. App store di HP kamu itu ide yang sama, versi pakai tombol.',
		'Giliranmu. Pasang alat kecil namanya <b>htop</b>, buat lihat langsung server lagi sibuk ngapain. Ketik <b>sudo apt install htop</b> dan lihat kotaknya datang.'
	],
	reactions: {
		installed:
			'Sampai! htop udah ada di server. Ketik <b>htop</b> buat ngintip apa aja yang jalan. Di server beneran dia menuhin layar, dan keluarnya pakai q.',
		other:
			'Sampai. Satu perintah, dan programnya plus semua dependency yang dia butuhin udah ada di server. Itu keajaiban package manager.',
		already:
			'apt ngecek, dan yang itu udah terpasang, versi terbaru pula. Nggak ada yang perlu dikerjain.',
		updated: 'Daftar tokonya segar lagi. Sekarang apt tau versi terbaru di tiap rak.',
		removed:
			'Hilang, kotaknya keluar dari rak. apt remove ngambil program serapi waktu dia datang.',
		ran: 'Dia jawab, berarti udah terpasang dan jalan.',
		notInstalled:
			'Server belum punya program itu, dan dia malah ngasih tau cara dapetinnya. Minta ke apt pakai sudo.',
		needSudo:
			'apt nolak dan nanya "are you root?" Masang program butuh admin. Taruh <b>sudo</b> di depan, kayak <b>sudo apt install htop</b>.',
		noPackage:
			'Tokonya nggak punya kotak dengan nama itu. Cek ejaannya, yang kamu cari itu <b>htop</b>.',
		missing: 'Nggak ada yang namanya itu di sini. Coba <b>sudo apt install htop</b>.',
		denied: 'Dikunci, itu butuh admin. Taruh <b>sudo</b> di depan.',
		error: 'Servernya nggak ngerti. Coba <b>sudo apt install htop</b>, persis kayak gitu.'
	},
	panels: [
		{
			tag: 'Masalahnya',
			title: 'Server kosong',
			body: 'Server baru cuma bisa sedikit hal. Sisanya, web server, database, alat alat kecil, dipasang di atasnya.'
		},
		{
			tag: 'Package',
			title: 'Program dalam kotak',
			body: '<b>Package</b> isinya program dan setelannya. Tokonya, namanya <b>repository</b>, dikelola Ubuntu dan dicek keamanannya.'
		},
		{
			tag: 'apt update',
			title: 'Daftar segar',
			body: 'apt download daftar terbaru package dan versinya. Belum ada yang dipasang, server cuma jadi tau apa aja yang tersedia.'
		},
		{
			tag: 'apt install',
			title: 'Kotaknya datang',
			body: 'apt download package itu, buka, lalu pasang. Semua <b>dependency</b> ikut datang sendiri.'
		},
		{
			tag: 'sudo',
			title: 'Khusus admin',
			body: 'Masang program nyentuh file yang dipakai semua user, jadi apt butuh root. Tanpa sudo, dia berhenti sebelum ngubah apa pun.'
		},
		{
			tag: 'Cek',
			title: 'Tanya versinya',
			body: '<b>nginx -v</b> nampilin versinya. Kalau perintahnya belum ada, Ubuntu malah nyaranin perintah buat masangnya.'
		},
		{
			tag: 'Biar nempel',
			title: 'Lihat menu, baru pesan',
			body: '<b>sudo apt update</b>, lalu <b>sudo apt install</b> plus nama. <b>sudo apt remove</b> buat nyabut lagi.'
		},
		{
			tag: 'Info',
			title: 'Banyak toko, satu ide',
			body: 'dnf, brew, npm, dan pip cara kerjanya sama. Sebut namanya, managernya ngambilin kotak dan semua kebutuhannya.'
		},
		{
			tag: 'Giliranmu',
			title: 'Pasang htop',
			body: 'Ketik <b>sudo apt install htop</b> lalu tekan Enter. Kotak baru mendarat di rak.'
		}
	],
	watchLabel: 'Nim lagi ngetik, lihat aja dulu',
	tryLabel: 'Giliranmu, ketik',
	tryTip: 'Tap biar Nim yang ngetik',
	inputLabel: 'perintah',
	termHint: '# Nim ngetik di sini dulu, lihat aja',
	hintUnknown: '# perintah itu nggak ada di sini',
	didYouMean: '# mungkin maksudnya {word}',
	hintMissing: '# nggak ada yang namanya itu di sini',
	hintDenied: '# dikunci, cuma admin yang boleh',
	storeLabel: 'Toko package Ubuntu',
	serverLabel: 'Server nimbus.com',
	netLabel: 'internet',
	rule: 'Update dulu, baru install, pakai sudo.',
	hintSudo: '# masang program butuh admin, taruh sudo di depan',
	hintApt: '# coba sudo apt install htop'
};
