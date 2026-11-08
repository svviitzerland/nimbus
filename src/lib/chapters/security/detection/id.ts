import type { DetectionText } from './types';

export const id: DetectionText = {
	title: 'Log dan SIEM',
	intro: [
		'Tahun 1986, Cliff Stoll, seorang astronom yang mengurus komputer di sebuah lab di California, sadar catatan tagihannya selisih 75 sen. Cuma 75 sen.',
		"Dia nggak membiarkannya. Dia menggali <b>log</b>, buku harian tempat komputer mencatat semua yang terjadi, siapa yang login, kapan, dan dari mana. Jejaknya berujung pada hacker di Jerman yang menjual rahasia ke KGB Uni Soviet. Stoll menceritakan semuanya di buku The Cuckoo's Egg.",
		'Setiap server menyimpan log. [[Monitoring|compute/monitoring]] menunjukkan angka kesehatan seperti CPU, sementara log menceritakan kisah di balik angka itu, baris demi baris. Masalahnya, situs yang ramai menulis jutaan baris sehari, dan nggak ada manusia yang sanggup membaca semuanya.',
		'Makanya tim memakai <b>SIEM</b> (Security Information and Event Management, dibaca seperti "sim"). Dia mengumpulkan log dari semua server ke satu tempat, menyambungkan titik titiknya, lalu membunyikan alert kalau ada pola yang mirip serangan.',
		'[fyi] Alert cuma berguna kalau ada yang membacanya. Saat Target dibobol tahun 2013, alat keamanan mereka sebenarnya sudah membunyikan alert ketika penyerang masih di dalam, tapi peringatannya nggak ditindaklanjuti tepat waktu.',
		'[ingat] Banyak login gagal dapat menjadi tanda serangan. Cocokkan waktu, sumber, akun, dan aktivitas lain sebelum menyimpulkan.',
		'Ini log terbaru dari nimbus.com. Di suatu tempat di sana, ada yang sedang menebak nebak password (serangan [[brute force|security/brute-force]]). Cari di log, temukan penyerangnya, lalu serahkan ke SIEM.'
	],
	reactions: {
		search:
			'Insting yang bagus. Mencari membuat segunung baris menyusut jadi yang penting saja. Sekarang ketuk satu baris untuk melihat semua yang dilakukan alamat itu.',
		innocent:
			'Alamat itu kelihatannya orang sungguhan. Kunjungan halaman biasa, atau salah password dua kali lalu berhasil, itu cuma orang yang jarinya masih ngantuk. Cari alamat yang gagal terus menerus.',
		found:
			'Ketemu. Satu alamat gagal login puluhan kali dalam dua menit, mencoba nama seperti root dan admin. Itu serangan brute force, bot yang menebak password secepat mungkin. Sekarang ubah perburuanmu jadi aturan.',
		siem: 'Tuh, SIEM menangkap penyerang baru sendirian, beberapa detik setelah dia mulai, padahal kamu nggak sedang melihat. Kamu berburu sekali dengan tangan, lalu menuliskannya jadi aturan yang terus berburu selamanya. Itulah gunanya SIEM.'
	},
	searchLabel: 'Cari di log',
	tryLabel: 'Coba',
	countLabel: '{n} baris',
	noMatch: 'Nggak ada baris yang cocok',
	tapHint: 'Ketuk baris mana saja untuk melihat alamatnya',
	ipLines: '{n} baris dari alamat ini',
	ipFailed: '{n} login gagal',
	ipUsers: 'Nama yang dicoba',
	markBtn: 'Tandai sebagai penyerang',
	markedTag: 'penyerang',
	siemBtn: 'Serahkan ke SIEM',
	ruleTitle: 'Aturan SIEM',
	ruleText: 'Kalau satu alamat gagal login lebih dari 10 kali dalam semenit, bunyikan alert',
	liveLabel: 'langsung',
	alertTitle: 'Alert',
	alertText: 'Brute force dari {ip}'
};
