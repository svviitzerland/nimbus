import type { RouterIntroText } from './types';

export const id: RouterIntroText = {
	title: 'Apa itu MikroTik',
	intro: [
		'Di rumah, di kantor, atau di RT RW net yang dipakai satu kampung, internet nggak nyampe ke tiap laptop dengan sendirinya. Ada satu kotak kecil di tengah yang membagikannya ke semua orang, namanya <b>router</b>.',
		'Merek router yang bakal sering kamu temui itu <b>MikroTik</b>, asalnya dari Latvia. Dia jalan pakai sistem sendiri bernama <b>RouterOS</b>. Ngaturnya bisa klik klik di aplikasi Winbox, atau ngetik di terminalnya, persis dua cara di [[CLI vs GUI|foundations/cli-gui]]. Lihat, terminalnya lagi nanya nama router.',
		'Sekarang namanya masih MikroTik, sama kayak semua router baru. Yuk kasih nama beneran, biar nanti kalau ngurus sepuluh router, kamu selalu tau lagi ngetik di yang mana. Perhatikan promptnya.',
		'Sekarang lihat bagian depan kotaknya. Lubang lubang itu namanya <b>port fisik</b>, tempat nyolok kabel LAN. RouterOS namain mereka ether1 sampai ether5, dan huruf <b>R</b> di daftar artinya running, ada kabel yang nyolok dan nyala.',
		'Hati hati, ini beda sama [[port|foundations/port]] bernomor kayak 80 atau 443. Yang itu <b>port logis</b>, pintu di dalam sebuah layanan. ether2 itu lubang yang bisa kamu pegang, sedangkan 443 cuma nomor tempat web server nunggu tamu.',
		'ether1 nerima kabel dari ISP (penyedia internetmu), ether2 nyambung ke kantor. Kasih alamat ke ether2, dan dia jadi pintu yang dilewati semua laptop kantor buat keluar ke internet.',
		'[ingat] Perintah RouterOS itu kayak pesan makanan. Sebut warungnya dulu (/ip address), lalu mau ngapain (add), baru detailnya (address= dan interface=). Warung, pesanan, level pedas.',
		'Giliran kamu. Minta daftar alamat router pakai <b>/ip address print</b>. Ketik sendiri, atau tekan sarannya.'
	],
	reactions: {
		addrPrint:
			'Nah itu dia, 192.168.88.1 kamu ada di ether2. Baris yang ada huruf <b>D</b> itu dynamic, alamat yang dikasih ISP ke ether1 secara otomatis.',
		interfaces:
			'Daftar port lagi. ether1 dan ether2 ada R, tiga lubang lainnya masih kosong. Mau lihat alamatnya? Coba <b>/ip address print</b>.',
		identity: 'Namanya masih nimbus. Sekarang minta alamatnya pakai <b>/ip address print</b>.',
		error:
			'Yang itu RouterOS nggak ngerti. Cek lagi ejaannya, atau tekan aja sarannya dan lihat diketikin.'
	},
	steps: [
		{
			title: 'Kotak di tengah',
			body: '<b>Router</b> nyambungin dua jaringan. Di sini dia nyambungin internet dari ISP dengan kantor.'
		},
		{
			tag: 'RouterOS',
			title: 'Ngobrol sama router',
			body: 'Tiap perintah diawali menu, kayak <b>/system identity</b>, dan diakhiri kerjaan, kayak <b>print</b> (tunjukin).'
		},
		{
			tag: 'identity',
			title: 'Nama di pintu',
			body: 'Identity itu nama di prompt, <b>[admin@nimbus]</b>. Nggak ngubah lalu lintas apa pun, cuma biar kamu nggak salah ngetik di router lain.'
		},
		{
			tag: 'interface',
			title: 'Port fisik',
			body: 'Tiap port itu sebuah <b>interface</b>. <b>R</b> artinya running, kabelnya nyolok dan nyala. Di sini ether1 dan ether2.'
		},
		{
			title: 'Dua jenis port',
			body: 'Port <b>fisik</b> itu lubang buat kabel (ether2). Port <b>logis</b> itu nomor di dalam layanan (443 buat HTTPS).'
		},
		{
			tag: 'ip address',
			title: 'Pintu kantor',
			body: '<b>192.168.88.1/24</b> di ether2 artinya router jawab di .1, dan semua alamat 192.168.88.x milik jaringan kantor.'
		},
		{
			tag: 'Biar nempel',
			title: 'Warung, pesanan, detail',
			body: '<b>/ip address</b> itu warungnya, <b>add</b> itu pesanannya, pasangan <b>key=value</b> (nama=isi) itu detailnya.'
		},
		{
			title: 'Giliran kamu',
			body: '<b>print</b> bisa dipakai di hampir semua menu. Ini perintah paling aman, dia cuma ngelihat.'
		}
	],
	ispLabel: 'ISP',
	laptopLabel: 'Laptop kantor',
	inputLabel: 'perintah',
	tryLabel: 'Coba ini',
	termHint: '# giliran kamu, ketik perintahnya lalu tekan Enter',
	hintTry: '# coba {cmd}',
	didYouMean: '# mungkin maksudnya {word}',
	hintRunning: '# R artinya running, ada kabel yang nyolok dan nyala',
	hintDynamic: '# D artinya dynamic, alamat dari ISP buat ether1'
};
