import type { RouterFirewallText } from './types';

export const id: RouterFirewallText = {
	title: 'Firewall filter',
	intro: [
		'Kantor udah online, dan itu bawa masalah baru. Sari ngabisin setengah hari main game online, dan siapa aja di kantor bisa buka Winbox terus ngubah ngubah router.',
		'Ingat [[firewall|networking/firewall]], satpam yang pegang daftar tamu? Di MikroTik satpamnya namanya <b>firewall filter</b>, daftar aturan yang dibaca dari atas ke bawah. Aturan pertama yang cocok yang mutusin, dan yang nggak disebut aturan mana pun dibiarin lewat.',
		'Aturan tinggal di <b>chain</b>. Lalu lintas yang <i>lewat</i> router (laptop ke sebuah situs) masuk chain <b>forward</b>. Lalu lintas yang <i>menuju</i> router itu sendiri (orang buka Winbox, yang ngetok port 8291) masuk chain <b>input</b>.',
		'Tiap aturan nyebut ini soal siapa (alamat pengirim), mau ke mana (alamat atau port tujuan), dan harus ngapain. <b>Accept</b> artinya boleh lewat, <b>drop</b> artinya dibuang diam diam.',
		'[fyi] Ngunci diri sendiri itu pengalaman wajib admin router. Drop semua input sebelum ngizinin laptopmu sendiri, dan Winbox langsung putus di tengah klik. Makanya Winbox punya tombol <b>Safe Mode</b> yang ngebatalin semua perubahan kalau koneksimu putus.',
		'Kali ini kita klik klik, kayak di Winbox, dan jendelanya nunjukin perintah yang dia ketik buat kamu. Bikin aturannya, perhatiin urutannya, lalu jalankan tes sampai keempatnya lolos.'
	],
	reactions: {
		added:
			'Aturan masuk di paling bawah daftar. Lihat perintah di bawah jendela, persis itu yang dikirim Winbox ke router. Jalankan tesnya kapan aja.',
		mismatch:
			'Aturan itu nggak bakal pernah cocok. Lalu lintas game <i>lewat</i> router (forward), sedangkan Winbox <i>menuju</i> router (input). Cek lagi chainnya.',
		moved:
			'Urutannya berubah. Router baca dari atas dan berhenti di yang pertama cocok, jadi posisi sama pentingnya dengan aturannya.',
		gameOpen:
			'Sari masih main. Tambahin aturan <b>forward</b> dengan alamat dia dan server game sebagai tujuan, action drop.',
		overBlock:
			'Waduh, Sari jadi nggak bisa buka nimbus.com juga. Aturan yang ngedrop semua dari dia kelebaran. Arahkan ke server game aja.',
		winboxOpen:
			'Sari masih bisa buka Winbox di router. Lalu lintas ke router itu chain <b>input</b>, drop tcp port 8291 di situ.',
		order:
			'Budi udah punya aturan accept, tapi ada aturan drop di atasnya yang nangkep dia duluan. Yang pertama cocok menang, jadi naikin accept di atas drop.',
		lockedOut:
			'Kamu barusan ngunci adminnya juga, sekarang nggak ada yang bisa buka Winbox. Di dunia nyata kamu harus nyetir ke kantor. Tambahin aturan accept buat Budi di atas drop.',
		allPass: 'Keempat tes masih lolos. Aturanmu kokoh.',
		done: 'Keempatnya lolos! Game diblok buat Sari, nimbus.com tetap jalan, dan cuma Budi yang bisa ngatur router. Izinkan yang perlu, drop sisanya, dan selalu perhatiin urutan.'
	},
	missionsLabel: 'Tes',
	missions: [
		'Sari nggak bisa ke server game',
		'Sari tetap bisa buka nimbus.com',
		'Sari nggak bisa buka Winbox',
		'Budi (admin) tetap bisa buka Winbox'
	],
	hintBtn: 'Bantu',
	doneNote: 'Semua tes lolos',
	ispLabel: 'ISP',
	inputLabel: 'perintah',
	termHint: '# tiap aturan yang kamu tambah muncul di sini sebagai perintah',
	hintUnknown: '# perintah itu nggak ada',
	didYouMean: '# mungkin maksudnya {word}',
	runBtn: 'Jalankan tes',
	running: 'Lagi ngetes',
	staffName: 'Sari',
	adminName: 'Budi (admin)',
	netLabel: 'internet',
	builderTitle: 'New Firewall Rule',
	chainLabel: 'Chain',
	srcLabel: 'Dari',
	targetLabel: 'Menuju',
	actionLabel: 'Action',
	anyone: 'semua',
	targets: { game: 'server game', winbox: 'Winbox (8291)', any: 'ke mana aja' },
	actions: { accept: 'accept', drop: 'drop' },
	addBtn: 'Tambah aturan',
	rulesTitle: 'Filter Rules',
	emptyRules: 'Belum ada aturan, jadi semuanya dibiarin lewat.',
	defaultRow: 'Yang nggak cocok sama aturan mana pun dibiarin lewat.',
	packetsLabel: 'hit',
	upLabel: 'Naikkan',
	downLabel: 'Turunkan',
	removeLabel: 'Hapus',
	logTitle: 'Terminal'
};
