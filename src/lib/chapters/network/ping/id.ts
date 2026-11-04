import type { PingText } from './types';

export const id: PingText = {
	title: 'Ping dan traceroute',
	intro: [
		'nimbus.com terasa lambat, atau malah nggak kebuka sama sekali. Sebelum menebak nebak, orang jaringan mengajukan dua pertanyaan dengan tenang. Servernya ada nggak? Kalau ada, di bagian jalan mana masalahnya?',
		'Pertanyaan pertama punya alat bernama <b>ping</b>. Lihat terminalnya. Laptopmu mengirim paket kecil yang bilang "kamu ada?", lalu server menjawab "aku di sini". Diulang empat kali, biar yakin.',
		'Setiap jawaban menampilkan <b>time</b> dalam ms (milidetik, seperseribu detik). Itu waktu pulang pergi. Nama ping sendiri diambil dari sonar kapal selam, bunyi "ping" dikirim, dan gemanya memberi tahu ada sesuatu di sana.',
		'Tapi paketmu nggak langsung lompat ke server. Paket itu dioper dari router ke router, dari rumahmu, ke ISP (penyedia internetmu), melintasi kota, mungkin lewat bawah laut. Setiap operan disebut <b>hop</b>, dan itulah [[routing|network/routing]] yang sedang bekerja.',
		'<b>traceroute</b> (di Windows namanya <b>tracert</b>) menampilkan setiap hop di jalan, lengkap dengan waktu untuk sampai ke masing masing. Kalau waktunya tiba tiba melonjak, atau daftarnya berhenti, kamu tahu kira kira di mana masalahnya.',
		'[fyi] Lihat baris <b>* * *</b>? Ada router yang disuruh diam, sering kali oleh [[firewall|networking/firewall]]. Router itu nggak rusak, paketmu tetap lewat di situ.',
		'[ingat] Ping itu absen, traceroute itu peta. Ping nanya "kamu ada?", traceroute nanya "tadi lewat mana aja?"',
		'Mau coba sendiri? Ketik perintah di terminal, atau ketuk salah satu saran. <b>ping 192.168.1.1</b> juga seru, itu router di rumahmu sendiri.'
	],
	reactions: {
		ping: 'Dijawab empat kali, masing masing sekitar 24 ms. nimbus.com hidup, dan perjalanan pulang perginya lebih cepat dari kedipan mata.',
		pingRouter:
			'Router kamu menjawab dalam sekitar 2 ms, soalnya dia ada di rumahmu. Ping ke router itu cara cepat mengecek jaringan rumah sebelum menyalahkan internet.',
		trace:
			'Itu dia seluruh jalannya. Lihat lonjakan besar di kabel laut, itu jarak panjang di bawah air menuju Singapura.',
		unknown:
			'Laptopmu bahkan nggak bisa menemukan nama itu, jadi nggak ada yang dikirim. Biasanya karena salah ketik. Mencari alamat di balik sebuah nama itu tugasnya [[DNS|networking/dns]].',
		error:
			'Terminal nggak kenal perintah itu. Coba <b>ping nimbus.com</b> atau ketuk salah satu saran.'
	},
	steps: [
		{
			title: 'Dua pertanyaan',
			body: 'Servernya hidup nggak? Dan di bagian jalan mana jadi lambat atau berhenti? Masing masing pertanyaan punya alatnya sendiri.'
		},
		{
			tag: 'ping',
			title: 'Kamu ada?',
			body: 'ping mengirim permintaan gema yang kecil dan menunggu balasannya. Ada balasan berarti servernya hidup dan bisa dijangkau.'
		},
		{
			title: 'Waktu pulang pergi',
			body: '<b>time</b> di setiap baris adalah lama perjalanan pergi dan pulang. Di bawah 50 ms terasa instan, ratusan ms terasa lelet.'
		},
		{
			title: 'Hop',
			body: 'Di antara kamu dan server ada beberapa router. Masing masing membaca alamatnya dan mengoper paket satu langkah lebih dekat.'
		},
		{
			tag: 'traceroute',
			title: 'Setiap perhentian',
			body: 'traceroute mencetak satu baris per hop, berurutan, lengkap dengan waktunya. Lonjakan waktu menunjukkan di mana jarak jauhnya.'
		},
		{
			title: 'Router pendiam',
			body: 'Baris <b>* * *</b> itu router yang memilih nggak menjawab. Selama hop berikutnya menjawab, jalannya baik baik saja.'
		},
		{
			tag: 'Biar nempel',
			title: 'Absen dan peta',
			body: 'ping menjawab <b>ada atau nggak</b>. traceroute menjawab <b>lewat mana</b>.'
		}
	],
	youLabel: 'Kamu',
	hops: ['Router rumah', 'ISP kamu', 'Inti ISP', 'Exchange', 'Kabel laut', 'nimbus.com'],
	inputLabel: 'perintah',
	suggestLabel: 'Saran',
	demoHint: '# belum ada yang dikirim',
	termHint: '# giliranmu, ketik perintah lalu tekan Enter',
	hintUnknownCmd: '# coba ping nimbus.com atau traceroute nimbus.com',
	hintNeedHost: '# tambahkan tujuannya, misalnya ping nimbus.com',
	didYouMean: '# mungkin maksudmu {word}',
	hintTimeout: '# nggak ada yang menjawab di alamat itu',
	hintStars: '# * * * itu router yang memilih diam'
};
