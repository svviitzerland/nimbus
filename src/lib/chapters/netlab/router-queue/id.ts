import type { RouterQueueText } from './types';

export const id: RouterQueueText = {
	title: 'Manajemen bandwidth',
	intro: [
		'Senin pagi. Sari lagi video call sama klien, Dewi baca email, dan Budi baru mulai download update game yang gede banget. Tiba tiba call Sari macet.',
		'Jalur internet kantor dari ISP itu 20 Mbps (megabit per detik, seberapa banyak data yang muat lewat tiap detik), kayak jalan raya dengan jumlah lajur yang tetap. Download Budi buka banyak koneksi sekaligus dan ngambil hampir semua lajurnya. Kamu udah ketemu ini di [[bottleneck|trafficflow/bottleneck]].',
		'Sebelum benerin apa apa, cari tau dulu siapa pelakunya. <b>torch</b> nunjukin lalu lintas di sebuah port saat ini juga, yang paling gede di atas. Lihat terminalnya.',
		'Solusinya <b>queue</b>. Simple queue di MikroTik bilang alamat ini paling banyak boleh pakai segini, namanya <b>max-limit</b>. Sisa yang nggak kepakai Budi jadi buat yang lain.',
		'Lihat terminalnya ngasih Budi sebuah queue. <b>target</b> itu alamatnya, dan <b>max-limit=5M/10M</b> artinya maksimal 5 Mbps upload dan 10 Mbps download. Perhatikan batangnya.',
		'Bagi jalur secara adil, atau ngasih prioritas ke lalu lintas tertentu, namanya <b>QoS</b> (quality of service). Konsepnya ada di [[Apa itu QoS|network/qos]]. Budi tetap bisa download cepat, cuma nggak bisa nenggelamin yang lain lagi.',
		'[ingat] max-limit ditulis upload dulu baru download. Ingat aja “naik dulu baru turun”, kayak naik tangga dulu baru meluncur di perosotan. Dan queue itu rambu batas kecepatan buat satu alamat, bukan tembok.',
		'[fyi] Hampir semua RT RW net di Indonesia jalan pakai ini. Sepuluh rumah berbagi satu jalur, dan satu queue per rumah yang bikin download satu keluarga nggak ngerusak malam satu gang.',
		'Giliran kamu. Cek queue Budi pakai <b>/queue simple print</b>.'
	],
	reactions: {
		queuePrint:
			'Itu queue Budi, target 192.168.88.253 dan max-limit 5M/10M. Upload di kiri, download di kanan.',
		torch:
			'Torch lagi, lalu lintas langsung di ether2. Budi sekarang mentok di 10 Mbps, dan call Sari punya ruang buat napas.',
		error:
			'Yang itu RouterOS nggak ngerti. Cek lagi ejaannya, atau tekan sarannya dan lihat diketikin.'
	},
	steps: [
		{
			title: 'Call yang macet',
			body: 'Tiga orang, satu jalur internet. Kalau satu orang ngambil semuanya, yang lain langsung kerasa.'
		},
		{
			tag: 'Mbps',
			title: 'Jalan dengan lajur',
			body: 'Bandwidth itu jumlah lajur jalannya. <b>20 Mbps</b> itu seluruh jalan, dipakai bareng satu kantor.'
		},
		{
			tag: 'torch',
			title: 'Siapa yang pakai',
			body: '<b>torch</b> itu intipan langsung ke satu port. <b>RX</b> itu yang diterima port itu, <b>TX</b> yang dikirim port itu.'
		},
		{
			tag: 'queue',
			title: 'Batas per alamat',
			body: '<b>Simple queue</b> ngasih satu alamat batas atas. Di bawah batas, nggak ada yang berubah. Lewat batas, router memperlambat alamat itu.'
		},
		{
			tag: 'max-limit',
			title: 'Budi dapat batas',
			body: '<b>5M/10M</b> artinya maksimal 5 Mbps upload dan 10 Mbps download buat 192.168.88.253.'
		},
		{
			tag: 'QoS',
			title: 'Adil, bukan lambat',
			body: 'Jalurnya nggak jadi lebih cepat. Cuma dibagi, jadi call Sari dapat 3 Mbps yang dia butuh.'
		},
		{
			tag: 'Biar nempel',
			title: 'Naik dulu baru turun',
			body: 'Di <b>5M/10M</b>, angka kiri itu upload, angka kanan itu download.'
		},
		{
			title: 'Satu queue per rumah',
			body: 'RT RW net dan warkop ngasih tiap pelanggan satu queue, biar jalurnya tetap adil di jam sibuk.'
		},
		{
			title: 'Giliran kamu',
			body: '<b>/queue simple</b> nampilin semua queue, berurutan, lengkap dengan target dan batasnya.'
		}
	],
	ispLabel: 'ISP',
	lineLabel: 'Jalur kantor, 20 Mbps',
	roles: ['video call', 'email', 'update game'],
	inputLabel: 'perintah',
	tryLabel: 'Coba ini',
	termHint: '# giliran kamu, ketik perintahnya lalu tekan Enter',
	hintTry: '# coba {cmd}',
	didYouMean: '# mungkin maksudnya {word}',
	hintBudi: '# 192.168.88.253 itu Budi, ngabisin hampir semua jalur'
};
