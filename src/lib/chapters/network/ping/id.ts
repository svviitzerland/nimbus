import type { PingText } from './types';

export const id: PingText = {
	title: 'Ping dan traceroute',
	intro: [
		'nimbus.com kerasa lambat, atau malah nggak kebuka. Sebelum menebak nebak, orang jaringan biasanya bertanya dua hal sederhana. Servernya ada nggak sih? Dan di bagian jalan mana masalahnya?',
		'Pertanyaan pertama punya alat namanya <b>ping</b>. Komputermu mengirim paket kecil yang bilang "kamu di situ?", lalu server menjawab "iya, aku di sini". Lama jawaban itu kembali diukur dalam milidetik (ms, seperseribu detik).',
		'Namanya diambil dari sonar di kapal selam. Bunyi dikirim, memantul dari sesuatu, dan gemanya memberi tahu kalau benda itu ada dan seberapa jauh. Ping kerjanya sama, cuma pakai paket, bukan bunyi.',
		'Tapi paketmu nggak langsung lompat ke server. Dia dioper dari router ke router, dari rumahmu, ke ISP, lintas kota, mungkin lintas laut. Tiap operan namanya <b>hop</b>, dan itulah [[routing|network/routing]] yang sedang bekerja.',
		'<b>traceroute</b> (di Windows namanya <b>tracert</b>) menampilkan semua hop di jalan, lengkap dengan waktu sampai ke masing masing. Kalau waktunya tiba tiba melonjak, atau daftarnya berhenti, kamu tahu kira kira di mana masalahnya.',
		'[fyi] Ada router yang diam saja dan muncul sebagai <b>* * *</b>. Dia nggak rusak, cuma disuruh nggak menjawab, sering kali oleh [[firewall|networking/firewall]]. Paketnya tetap lewat di situ.',
		'[ingat] Ping menguji balasan ICMP dan waktu pulangnya. Traceroute mencoba menampilkan hop yang dilalui. Tidak ada balasan belum tentu berarti perangkat mati.',
		'Terminalnya punya kamu. Ping nimbus.com dulu buat cek dia hidup, lalu traceroute buat lihat seluruh jalannya. Kalau bingung, tekan Bantu dan perintahnya diketikin buat kamu.'
	],
	reactions: {
		ping: 'Dijawab empat kali, masing masing sekitar 24 ms. Berarti nimbus.com hidup, dan sekali bolak balik lebih cepat dari kedipan mata. Tapi ping cuma tahu dua ujungnya, apa yang ada di tengah masih misteri.',
		pingRouter:
			'Router rumahmu menjawab dalam sekitar 2 ms, karena dia ada di rumahmu sendiri. Ping ke router itu cara cepat ngecek jaringan rumah sebelum menyalahkan internet.',
		trace:
			'Itu dia seluruh jalannya. Router rumah, ISP kamu, satu router yang diam, titik tukar di Jakarta, lalu kabel laut ke Singapura tempat servernya tinggal. Lihat lonjakan besar di Singapura? Itu jarak di bawah laut.',
		unknown:
			'Komputermu bahkan nggak bisa menemukan nama itu, jadi nggak ada paket yang dikirim. Biasanya salah ketik alamat, atau namanya memang nggak ada. Urusan mencari nama itu tugas [[DNS|networking/dns]].',
		error:
			'Terminalnya nggak kenal perintah itu. Coba <b>ping nimbus.com</b> atau <b>traceroute nimbus.com</b>, atau tekan Bantu.',
		done: 'Dua duanya beres! Ping memberi tahu servernya hidup dan seberapa jauh rasanya, traceroute menunjukkan tiap hop di jalan. Dua alat ini yang pertama diambil siapa pun saat jaringan rewel.'
	},
	missionsLabel: 'Misi',
	missions: ['Ping nimbus.com', 'Traceroute nimbus.com'],
	hintBtn: 'Bantu',
	doneNote: 'Dua misi beres',
	inputLabel: 'perintah',
	termHint: '# ketik perintah lalu tekan Enter',
	hintUnknownCmd: '# coba ping nimbus.com atau traceroute nimbus.com',
	hintNeedHost: '# tambahkan tujuannya, contohnya ping nimbus.com',
	didYouMean: '# mungkin maksudnya {word}',
	hintTimeout: '# nggak ada yang menjawab di alamat itu',
	hintStars: '# * * * itu router yang memilih nggak menjawab',
	routeLabel: 'Jalan menuju nimbus.com',
	youLabel: 'Laptopmu',
	hops: [
		{ name: 'Router rumah', place: 'rumahmu' },
		{ name: 'ISP kamu', place: 'Jakarta' },
		{ name: 'Jalur utama ISP', place: 'Jakarta' },
		{ name: 'Titik tukar internet', place: 'Jakarta' },
		{ name: 'Ujung kabel laut', place: 'Singapura' },
		{ name: 'Server nimbus.com', place: 'Singapura' }
	],
	hiddenHop: 'nggak kelihatan oleh ping',
	quietTag: 'diam saja',
	roundTrip: '{ms} ms bolak balik'
};
