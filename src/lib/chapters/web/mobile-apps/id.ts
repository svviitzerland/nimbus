import type { MobileAppsText } from './types';

export const id: MobileAppsText = {
	title: 'Native dan cross platform',
	intro: [
		'nimbus.com makin terkenal, dan orang terus menanyakan hal yang sama. Ada aplikasinya nggak? <b>Aplikasi</b> itu program yang kamu pasang di HP dari Play Store atau App Store, dengan ikonnya sendiri di layar utama.',
		'Masalahnya begini. HP itu bicara dengan bahasa yang beda beda. Aplikasi Android kebanyakan ditulis pakai <b>Kotlin</b>, dan aplikasi iPhone pakai <b>Swift</b>. Aplikasi yang ditulis dengan bahasa asli HP-nya disebut <b>native</b>, kayak penutur asli yang lahir di sana.',
		'Aplikasi native itu paling cepat dan bisa memakai semua isi HP, kamera, sensor, sampai notifikasi. Tapi aplikasinya ditulis dua kali, satu buat Android dan satu buat iPhone, sering dengan dua tim yang berbeda.',
		'Di ujung satunya ada situs biasa di browser, yang kamu bangun pakai [[HTML|web/html]]. Satu kode jalan di semua HP dan laptop tanpa perlu dipasang, tapi rasanya sedikit kurang mulus dan nggak bisa menjangkau semua bagian HP.',
		'Di tengahnya ada <b>cross platform</b>. Kamu menulis sekali pakai <b>Flutter</b> (buatan Google, dengan bahasa bernama Dart) atau <b>React Native</b> (buatan Meta, dengan JavaScript), dan jadilah aplikasi Android sekaligus iPhone. Kecepatannya hampir native, timnya cukup satu.',
		'[fyi] Sebagian Instagram dibangun pakai React Native, dan aplikasi My BMW dibangun pakai Flutter. Perusahaan besar juga suka mencampur, memilih cara yang paling pas buat tiap layar.',
		'Yuk bangun aplikasi nimbus dengan tiga cara itu dan bandingkan. Setelah itu ada tiga klien yang butuh saranmu.'
	],
	reactions: {
		native:
			'Dua aplikasi, dua bahasa. Kotlin buat Android, Swift buat iPhone. Hasilnya paling cepat, tapi tiap fitur dibangun dua kali.',
		cross:
			'Satu kode, dua aplikasi. Flutter atau React Native mengubah kode yang sama jadi aplikasi Android dan iPhone. Sedikit lebih lambat dari native, tapi kerjaannya jauh lebih sedikit.',
		web: 'Satu kode yang jalan di mana mana, di HP maupun laptop, tanpa perlu dipasang. Jangkauannya paling luas, tapi dia tinggal di dalam browser, jadi nggak secepat dan sedalam aplikasi.',
		game: 'Tepat. Game 3D yang kencang memeras habis tenaga HP, jadi native sepadan dengan kerja dua kalinya. Kebanyakan game mobile papan atas memilih native atau game engine yang memang dibuat buat kecepatan.',
		startup:
			'Tepat. Dua orang nggak sanggup menulis semuanya dua kali. Cross platform memberi mereka dua toko aplikasi dari satu kode, makanya banyak startup memilih Flutter atau React Native.',
		menu: 'Tepat. Nggak ada yang mau memasang aplikasi cuma buat membaca menu sekali. Situs langsung terbuka dari QR code, di HP apa pun, dalam sedetik.',
		miss: 'Hmm, pikirkan apa yang paling penting buat klien ini. Kecepatan, jangkauan, atau seberapa banyak kerjaan yang sanggup ditangani timnya?'
	},
	acts: ['Bangun', 'Pilih'],
	actLabel: 'Langkah {n}',
	nextAct: 'Bantu para klien',
	buildPrompt: 'Bangun aplikasi nimbus dengan satu cara',
	ways: {
		native: {
			name: 'Native',
			sub: 'Kotlin dan Swift',
			note: 'Paling cepat, tapi dibangun dua kali'
		},
		cross: {
			name: 'Cross platform',
			sub: 'Flutter, React Native',
			note: 'Satu kode, dua aplikasi'
		},
		web: {
			name: 'Web',
			sub: 'di browser',
			note: 'Di mana mana, tanpa dipasang'
		}
	},
	android: 'Android',
	iphone: 'iPhone',
	browser: 'Browser',
	codeLabel: '{n} kode yang harus ditulis',
	codeLabelOne: '1 kode yang harus ditulis',
	speedLabel: 'Kecepatan',
	reachLabel: 'Jangkauan',
	effortLabel: 'Kerjaan',
	clientPrompt: 'Cara mana yang cocok buat klien ini?',
	clients: {
		game: {
			who: 'Studio game',
			need: 'Game balap dengan mobil 3D yang harus jalan super mulus.'
		},
		startup: {
			who: 'Startup dua orang',
			need: 'Mereka mau ada di dua toko aplikasi bulan depan, dan orangnya cuma dua.'
		},
		menu: {
			who: 'Kafe kecil',
			need: 'Pelanggan memindai QR code di meja buat membaca menu hari ini.'
		}
	},
	rightTag: 'cocok',
	wrongTag: 'kurang cocok',
	nextClient: 'Klien berikutnya',
	progress: 'Klien {n} dari {total}',
	doneLine:
		'Nggak ada cara yang paling jago di semua hal. Tiap cara menang buat pekerjaan yang beda.'
};
