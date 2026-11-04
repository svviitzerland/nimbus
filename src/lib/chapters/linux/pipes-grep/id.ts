import type { PipesGrepText } from './types';

export const id: PipesGrepText = {
	title: 'Pipe dan grep',
	intro: [
		'Tiap kunjungan ke nimbus.com ninggalin satu baris di file log namanya <b>access.log</b>. Situs yang rame bisa nulis ribuan baris sehari. Baca semuanya pakai mata? Nim bisa nangis.',
		'Nim buka filenya pakai <b>cat access.log</b> (cat nampilin seluruh isi file). Tembok tulisan. Tiap baris itu satu kunjungan, ada jamnya, alamatnya, halamannya, dan angka status. 200 artinya aman, 404 artinya halaman nggak ketemu, 500 artinya servernya rusak.',
		'Buat nyisain baris yang kamu peduliin aja, ada <b>grep</b>. <b>grep 404 access.log</b> cuma nampilin baris yang ada 404nya, bahkan katanya diwarnain buat kamu.',
		'Sekarang bagian ajaibnya, pipe <b>|</b> (di kebanyakan keyboard itu Shift plus tombol backslash). Dia ngambil apa yang dicetak satu perintah lalu nuang ke perintah berikutnya, kayak air lewat pipa. <b>cat access.log | grep 404</b> ngasih baris yang sama, dirakit dari dua alat kecil.',
		'Pipenya bisa disambung terus. Tambah <b>wc -l</b> di ujung (wc itu ngitung, l artinya baris), <b>cat access.log | grep 404 | wc -l</b>, dan jawabannya tinggal satu angka. Ada 4 pengunjung yang nyasar ke halaman hilang hari ini.',
		'[ingat] Bayangin ban berjalan di pabrik. cat numpahin semua kotak ke ban, grep itu pekerja yang cuma ngambil kotak bertempel stiker merah, dan wc ngitung yang sampai di ujung. Tiap alat ngerjain satu tugas kecil, dan | itu ban berjalan di antaranya.',
		'Nemuin baru separuh kerjaan, kadang kamu juga perlu ngubah file. <b>nano</b> itu editor teks sederhana langsung di dalam terminal. <b>nano todo.txt</b> buka filenya, kamu ngetik, lalu Ctrl+O nyimpan dan Ctrl+X keluar.',
		'[fyi] grep punya saklar yang berguna. <b>grep -i</b> nggak peduli huruf besar kecil, dan <b>grep -v</b> nyisain baris yang nggak cocok. Dan <b>grep 404 access.log | wc -l</b> juga bisa, satu alat lebih sedikit.',
		'Giliranmu. Ada berapa kunjungan yang rusak di sisi server (status 500)? Ketik <b>cat access.log | grep 500 | wc -l</b>.'
	],
	reactions: {
		server:
			'Ada dua kunjungan yang dapat 500, dan dua duanya di /checkout. Itu halaman yang harus dibenerin duluan, ketemu cuma pakai satu baris pipe.',
		counted404:
			'Empat kunjungan nyasar ke halaman hilang. Satu baris pipe ngejawab yang bakal makan bermenit menit kalau pakai mata.',
		counted:
			'Tinggal satu angka di ujung pipe. cat, grep, dan wc masing masing ngerjain satu tugas kecil.',
		piped: 'Dua alat disambung pakai pipe. Apa yang dicetak cat langsung ngalir ke grep.',
		grepped: 'grep cuma nyisain baris yang cocok dan ngewarnain katanya.',
		noMatch: 'grep nggak nemu baris dengan kata itu, jadi nggak ada yang keluar dari pipe.',
		read: 'Itu seluruh lognya. Sekarang bayangin ada ribuan baris kayak gitu.',
		nano: 'Tersimpan. Ngedit kecil kecilan di server sering dilakuin persis kayak gini, pakai nano.',
		missing: 'Nggak ada yang namanya itu di sini. Lognya namanya <b>access.log</b>.',
		denied: 'Dikunci, itu butuh admin. Taruh <b>sudo</b> di depan.',
		error:
			'Servernya nggak ngerti. Coba <b>cat access.log | grep 500 | wc -l</b>, persis kayak gitu.'
	},
	panels: [
		{
			tag: 'Masalahnya',
			title: 'Tembok baris',
			body: 'Log nyatet tiap kunjungan. Berharga banget waktu ada yang rusak, tapi kepanjangan buat dibaca satu satu.'
		},
		{
			tag: 'cat',
			title: 'Cetak semuanya',
			body: '<b>cat access.log</b> nampilin seluruh file. Lihat angka status di ujung tiap baris.'
		},
		{
			tag: 'grep',
			title: 'Cari katanya',
			body: '<b>grep 404 access.log</b> cuma nyisain baris yang ada 404nya. Sisanya ditinggal.'
		},
		{
			tag: 'Pipe |',
			title: 'Tuang ke depan',
			body: '<b>|</b> ngirim hasil perintah di kirinya ke perintah di kanannya.'
		},
		{
			tag: 'wc -l',
			title: 'Hitung',
			body: '<b>cat access.log | grep 404 | wc -l</b> nampilin satu angka, berapa baris yang lolos.'
		},
		{
			tag: 'Biar nempel',
			title: 'Ban berjalan',
			body: 'cat ngisi ban, grep milih stiker merah, wc ngitung kotaknya. Pipe itu ban berjalannya.'
		},
		{
			tag: 'nano',
			title: 'Ngedit di terminal',
			body: '<b>nano todo.txt</b> buka file buat diedit. <b>Ctrl+O</b> nyimpan, <b>Ctrl+X</b> nutup nano.'
		},
		{
			tag: 'Info',
			title: 'Saklar yang berguna',
			body: '<b>grep -i</b> cuek soal huruf besar kecil, <b>grep -v</b> ngebalik pencarian, dan grep bisa baca file sendiri.'
		},
		{
			tag: 'Giliranmu',
			title: 'Hitung yang 500',
			body: 'Ketik <b>cat access.log | grep 500 | wc -l</b> lalu tekan Enter. Jawabannya keluar dari kotak terakhir.'
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
	logLabel: 'access.log',
	linesLabel: '{n} baris',
	nanoTitle: 'GNU nano, todo.txt',
	nanoLines: ['cek halaman 404', 'benerin /checkout (500)'],
	nanoSave: '^O simpan',
	nanoExit: '^X keluar',
	rule: 'Satu alat, satu tugas. Pipe yang nyambungin.',
	hintNano: '# nano kebuka layar penuh, Nim ngetik, Ctrl+O simpan, Ctrl+X keluar',
	hintPipe: '# coba cat access.log | grep 500 | wc -l'
};
