import type { RouterQueueText } from './types';

export const id: RouterQueueText = {
	title: 'Manajemen bandwidth',
	intro: [
		'Senin pagi. Sari lagi video call sama klien, Dewi lagi baca email, dan Budi baru mulai download update game yang gede banget. Tiba tiba call Sari macet.',
		'Jalur internet kantor dari ISP itu 20 Mbps, kayak jalan raya dengan jumlah lajur yang tetap. Download Budi buka banyak koneksi sekaligus, jadi dia nguasain hampir semua lajur dan yang lain kegencet ke bahu jalan. Kamu udah ketemu ini di [[bottleneck|trafficflow/bottleneck]].',
		'Solusinya <b>queue</b>. Simple queue di MikroTik bilang alamat ini paling banyak boleh pakai segini, namanya <b>max-limit</b>. Sisa yang nggak dipakai Budi jadi jatah yang lain.',
		'Bagi jalur secara adil, atau ngasih prioritas ke lalu lintas tertentu, namanya <b>QoS</b> (quality of service). Konsepnya ada di [[Apa itu QoS|network/qos]].',
		'[fyi] Hampir semua RT RW net di Indonesia jalan pakai ini. Sepuluh rumah berbagi satu jalur, dan queue per rumah yang bikin download satu keluarga nggak ngerusak malamnya satu gang.',
		'Giliran kamu. Cari siapa yang nguasain jalur pakai torch, kasih Budi queue, lalu geser limitnya sampai semua dapat jatah yang adil.'
	],
	reactions: {
		torch:
			'Torch nunjukin lalu lintas di ether2 saat ini, yang paling gede di atas. 192.168.88.253 itu Budi, makan hampir semua 20 Mbps sendirian.',
		wrongUser:
			'Queue itu kepasang di orang lain. Budi masih bebas ngambil semuanya, jadi callnya tetap patah patah. Pasang queue di <b>192.168.88.253</b>.',
		tooHarsh:
			'Pelan pelan, Budi juga harus kerja. Neken dia segitu malah buang jalur yang nggak dipakai orang lain. Kasih dia minimal 4M.',
		notYet:
			'Mendingan, tapi Budi masih ngambil kebanyakan. Call Sari butuh 3 Mbps, geser limit Budi sedikit lagi ke bawah.',
		fair: 'Sekarang semua kebagian. Budi tetap download dengan cepat, call Sari lancar, dan halaman Dewi kebuka. Itu jatah yang adil buat masing masing.',
		tuned: 'Masih adil buat semua. Bebas mainin limitnya dan lihat batangnya bergerak.',
		noQueue: 'Belum ada queue. Tambahin satu dulu, buat Budi.',
		stats:
			'Stats nunjukin kecepatan tiap queue saat ini dan seberapa banyak yang udah lewat. Admin ngecek ini buat tau siapa yang pakai jalur, dan kapan.',
		error:
			'Yang itu RouterOS nggak ngerti. Cek lagi ejaannya, atau ketik <b>?</b> buat lihat yang ada. Tombol Bantu juga bisa ngetikin buat kamu.',
		done: 'Jalurnya kebagi adil. Satu queue per orang, begitulah kantor dan RT RW net jaga kedamaian. Berikutnya, hotspot ala kafe buat tamu.'
	},
	missionsLabel: 'Misi',
	missions: [
		'Cari si rakus pakai torch',
		'Kasih Budi queue',
		'Semua dapat jatah adil',
		'Lihat queuenya bekerja'
	],
	hintBtn: 'Bantu',
	doneNote: 'Nggak ada lagi yang nguasain jalur',
	ispLabel: 'ISP',
	inputLabel: 'perintah',
	termHint: '# ketik perintah RouterOS lalu tekan Enter',
	hintUnknown: '# perintah itu nggak ada, ketik ? buat lihat menunya',
	didYouMean: '# mungkin maksudnya {word}',
	lineLabel: 'Jalur ISP, {n} Mbps dipakai bareng',
	users: [
		{ name: 'Sari', doing: 'video call' },
		{ name: 'Budi', doing: 'download gede' },
		{ name: 'Dewi', doing: 'email dan browsing' }
	],
	status: {
		smooth: 'lancar',
		choppy: 'patah patah',
		fine: 'kebuka',
		slow: 'lemot',
		downloading: 'download'
	},
	addQueue: 'Tambah queue',
	limitLabel: 'Max limit buat {name}',
	unlimited: 'tanpa queue, bebas',
	hintTorch: '# kantornya di ether2, coba /tool torch interface=ether2',
	hintTarget: '# target itu alamat laptop, misalnya 192.168.88.253/32 buat Budi',
	hintLimit: '# max-limit bentuknya 10M/10M (upload/download)',
	hintNeeds: '# perintah ini masih butuh {keys}',
	hintNoQueue: '# queue itu nggak ada, lihat /queue simple print',
	hintStats: '# RATE itu saat ini, BYTES itu total sejauh ini',
	hintExists: '# laptop itu udah punya queue, pakai /queue simple set'
};
