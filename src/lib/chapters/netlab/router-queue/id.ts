import type { RouterQueueText } from './types';

export const id: RouterQueueText = {
	title: 'Manajemen bandwidth',
	intro: [
		'Senin pagi. Sari lagi video call sama klien, Dewi baca email, dan Budi baru mulai download update game yang gede banget. Tiba tiba call Sari macet.',
		'Sambungan kantor memiliki kapasitas 20 Mbps, yaitu 20 megabit per detik. Unduhan Budi memakai sebagian besar kapasitas itu sehingga panggilan video terganggu. Ini contoh [[bottleneck|trafficflow/bottleneck]].',
		'Sebelum benerin apa apa, cari tau dulu siapa pelakunya. <b>torch</b> nunjukin lalu lintas di sebuah port saat ini juga, yang paling gede di atas. Lihat terminalnya.',
		'Solusinya <b>queue</b>. Simple queue di MikroTik bilang alamat ini paling banyak boleh pakai segini, namanya <b>max-limit</b>. Sisa yang nggak kepakai Budi jadi buat yang lain.',
		'Lihat terminalnya ngasih Budi sebuah queue. <b>target</b> itu alamatnya, dan <b>max-limit=5M/10M</b> artinya maksimal 5 Mbps upload dan 10 Mbps download. Perhatikan batangnya.',
		'Bagi jalur secara adil, atau ngasih prioritas ke lalu lintas tertentu, namanya <b>QoS</b> (quality of service). Konsepnya ada di [[Apa itu QoS|network/qos]]. Budi tetap bisa download cepat, cuma nggak bisa nenggelamin yang lain lagi.',
		'[ingat] Pada simple queue ini, max-limit ditulis upload lalu download, dilihat dari perangkat target.',
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
			title: 'Panggilan video terputus',
			body: 'Tiga orang, satu jalur internet. Kalau satu orang ngambil semuanya, yang lain langsung kerasa.'
		},
		{
			tag: 'Mbps',
			title: 'Kapasitas sambungan',
			body: 'Bandwidth itu jumlah lajur jalannya. <b>20 Mbps</b> itu seluruh jalan, dipakai bareng satu kantor.'
		},
		{
			tag: 'torch',
			title: 'Melihat pemakaian bandwidth',
			body: '<b>torch</b> itu intipan langsung ke satu port. <b>RX</b> yang masuk (download), <b>TX</b> yang keluar.'
		},
		{
			tag: 'queue',
			title: 'Batas per alamat',
			body: '<b>Simple queue</b> ngasih satu alamat batas atas. Di bawah batas, nggak ada yang berubah. Lewat batas, router memperlambat alamat itu.'
		},
		{
			tag: 'max-limit',
			title: 'Membatasi koneksi Budi',
			body: '<b>5M/10M</b> artinya maksimal 5 Mbps upload dan 10 Mbps download buat 192.168.88.253.'
		},
		{
			tag: 'QoS',
			title: 'Membagi kapasitas jaringan',
			body: 'Jalurnya nggak jadi lebih cepat. Cuma dibagi, jadi call Sari dapat 3 Mbps yang dia butuh.'
		},
		{
			tag: 'Cara ingat',
			title: 'Urutan upload dan download',
			body: 'Di <b>5M/10M</b>, angka kiri itu upload, angka kanan itu download.'
		},
		{
			title: 'Membatasi tiap pelanggan',
			body: 'RT RW net dan warkop ngasih tiap pelanggan satu queue, biar jalurnya tetap adil di jam sibuk.'
		},
		{
			title: 'Atur batas bandwidth',
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
