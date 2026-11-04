import type { RouterFirewallText } from './types';

export const id: RouterFirewallText = {
	title: 'Firewall filter',
	intro: [
		'Kantornya udah online, dan itu bawa masalah baru. Sari ngabisin setengah hari main game online, dan siapa aja di kantor bisa buka Winbox terus ngubah ubah router. Lihat, dua paket itu lolos semua.',
		'Ingat [[firewall|networking/firewall]], satpam yang pegang daftar tamu? Di MikroTik satpam itu namanya <b>firewall filter</b>, daftar aturan yang dicek router buat setiap paket.',
		'Aturan ditaruh di <b>chain</b>. Lalu lintas yang <i>lewat</i> router (laptop yang buka website) masuk chain <b>forward</b>. Lalu lintas yang <i>menuju</i> router itu sendiri (orang yang buka Winbox, yang ngetok port 8291) masuk chain <b>input</b>.',
		'Pertama, gamenya. Server game ada di internet, jadi game Sari lewat router, chain forward. Lihat terminalnya nulis aturan berisi alamat Sari, alamat server game, dan mau diapain.',
		'Tiap aturan diakhiri action. <b>accept</b> ngebolehin paketnya lewat, <b>drop</b> diam diam ngebuang, tanpa balasan sama sekali. Lihat game Sari sekarang, nunggu terus, lalu nyerah.',
		'Sekarang lindungi routernya. Dua aturan input, pertama terima Winbox dari Budi (dia adminnya), lalu buang Winbox dari semua orang lain. Lihat daftar aturannya nyala waktu tiap paket dicek.',
		'[ingat] Aturan dibaca dari atas ke bawah, yang pertama cocok langsung menang. Kayak satpam yang berhenti baca daftar tamu begitu nemu namamu. Gampangnya, yang khusus di atas, yang umum di bawah.',
		'[fyi] Ngunci diri sendiri itu pengalaman wajib admin router. Pasang drop sebelum accept buat dirimu, dan Winbox langsung mati di tengah klik. Makanya Winbox punya tombol <b>Safe Mode</b> yang ngebatalin semuanya kalau koneksimu putus.',
		'Giliran kamu. Lihat seluruh daftarnya, sesuai urutan, pakai <b>/ip firewall filter print</b>.'
	],
	reactions: {
		filterPrint:
			'Tiga aturan, nomornya mulai dari 0. Router nyusurin daftar ini buat tiap paket dan berhenti di yang pertama cocok. Tukar 1 dan 2, Budi juga ikut kekunci.',
		error:
			'Yang itu RouterOS nggak ngerti. Cek lagi ejaannya, atau tekan sarannya dan lihat diketikin.'
	},
	steps: [
		{
			title: 'Dua masalah',
			body: 'Game Sari ngabisin harinya, dan siapa aja bisa masuk ke pengaturan router. Sekarang belum ada yang ngehalangin.'
		},
		{
			tag: 'filter',
			title: 'Daftar si satpam',
			body: '<b>Firewall filter</b> itu daftar aturan bernomor. Tiap paket dicek sama daftar ini.'
		},
		{
			tag: 'chain',
			title: 'Lewat atau menuju',
			body: '<b>forward</b> itu lalu lintas yang lewat router. <b>input</b> itu lalu lintas yang tujuannya router itu sendiri.'
		},
		{
			tag: 'forward',
			title: 'Blokir gamenya',
			body: '<b>src-address</b> itu pengirimnya (Sari), <b>dst-address</b> itu tujuannya (server game).'
		},
		{
			tag: 'action',
			title: 'Terima atau buang',
			body: '<b>accept</b> ngebolehin lewat. <b>drop</b> ngebuang tanpa kabar, jadi gamenya cuma timeout.'
		},
		{
			tag: 'input',
			title: 'Jaga routernya',
			body: 'Winbox ngetok <b>tcp port 8291</b>. Alamat Budi diterima, yang lain dibuang.'
		},
		{
			tag: 'Cara ingat',
			title: 'Yang pertama cocok menang',
			body: 'Atas ke bawah, berhenti di yang pertama cocok. Yang khusus di atas, yang umum di bawah.'
		},
		{
			tag: 'Safe Mode',
			title: 'Jangan ngunci diri sendiri',
			body: 'Selalu pasang aturan yang ngebolehin <b>kamu</b> masuk sebelum aturan yang nutup buat semua orang.'
		},
		{
			title: 'Giliran kamu',
			body: 'Nomor di depan tiap aturan itu urutan antrenya. Nomor kecil dicek duluan.'
		}
	],
	ispLabel: 'ISP',
	gameLabel: 'Server game',
	tagGame: 'game',
	tagWinbox: 'Winbox',
	rulesLabel: 'Aturan filter',
	rules: ['Sari ke game, buang', 'Budi ke Winbox, terima', 'Siapa aja ke Winbox, buang'],
	inputLabel: 'perintah',
	tryLabel: 'Coba ini',
	termHint: '# giliran kamu, ketik perintahnya lalu tekan Enter',
	hintTry: '# coba {cmd}',
	didYouMean: '# mungkin maksudnya {word}',
	hintOrder: '# baca dari atas, aturan pertama yang cocok yang menentukan'
};
