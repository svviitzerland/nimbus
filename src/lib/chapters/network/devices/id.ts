import type { DevicesText } from './types';

export const id: DevicesText = {
	title: 'Perangkat jaringan',
	intro: [
		'Internet nggak jatuh dari langit langsung ke laptopmu. Dia datang lewat kabel dari penyedia internet (namanya <b>ISP</b>), lalu beberapa kotak meneruskannya, masing masing dengan satu tugas.',
		'Yang pertama <b>modem</b>. Dia dipasang di tempat kabel dari penyedia masuk ke gedung, dan menerjemahkan sinyal kabel itu jadi sesuatu yang dimengerti perangkatmu. Kalau kabelnya fiber, kotak ini biasa disebut <b>ONT</b>.',
		'Berikutnya <b>router</b>, si penunjuk jalan. Dia memberi setiap perangkat [[alamat IP|network/ip-address]] dan memutuskan mana yang keluar ke internet dan mana yang tetap di dalam.',
		'Lalu <b>switch</b>, kotak yang penuh colokan. Semua kabel di kantor dicolokkan ke sini, dan dia mengantar data langsung ke perangkat yang dituju.',
		'Terakhir, <b>access point</b> mengubah jaringan berkabel jadi gelombang radio, supaya HP dan laptop bisa ikut tanpa kabel. Radio itulah WiFi yang kamu kenal, lebih lengkapnya di [[Apa itu WiFi|network/wifi]].',
		'[ingat] Bayangkan gedung kantor. Modem itu gerbang depan, router itu resepsionis yang hafal semua orang duduk di mana, switch itu lorong penuh pintu, dan access point itu pengeras suara buat yang nggak pakai kabel.',
		'[fyi] Di rumah, satu kotak yang dipasang penyedia internet biasanya mengerjakan keempat tugas ini sekaligus dalam satu badan. Kantor memisahkannya supaya masing masing bisa lebih besar dan gampang diganti sendiri sendiri. Di cloud, semuanya jadi pengaturan, seperti router virtual di dalam [[VPC|networking/vpc]].',
		'Penasaran seberapa penting tiap kotak? Ketuk salah satu buat mencabutnya, lalu lihat siapa yang kehilangan internet. Ketuk lagi buat memasangnya kembali.'
	],
	reactions: {
		noModem:
			'Tanpa modem, nggak ada yang sampai ke penyedia internet. PC masih bisa saling berbagi file (LAN di dalam baik baik saja), tapi internetnya hilang buat semua orang.',
		noRouter:
			'Nggak ada router, nggak ada jalan keluar. Nggak ada yang membagikan alamat atau tahu jalan ke internet, jadi semuanya terjebak di dalam. Switch masih menyambungkan perangkat satu sama lain.',
		noSwitch:
			'Cabut switch, dan semua kabel di dalam nggak punya tempat colokan. PC, bahkan access point, ikut terputus, jadi seisi kantor gelap.',
		noAp: 'Cuma HP yang putus. PC yang pakai kabel bahkan nggak sadar, mereka memang nggak pernah pakai radio.',
		fixed: 'Sudah terpasang lagi, semua online kembali. Coba kotak yang lain.'
	},
	steps: [
		{
			title: 'Dari jalan sampai ke meja',
			body: 'Internet datang lewat satu kabel dari <b>ISP</b> (penyedia layanan internet). Rangkaian kotak pendek membawanya ke setiap perangkat.'
		},
		{
			title: 'Modem (ONT)',
			body: 'Dipasang di tempat kabel penyedia masuk, dan menerjemahkan sinyalnya. Tanpa dia, kabel itu nggak bisa dibaca.'
		},
		{
			title: 'Router',
			body: 'Memberi setiap perangkat alamat dan memilih jalan, keluar ke internet atau ke perangkat lain di dalam.'
		},
		{
			title: 'Switch',
			body: 'Kotak penuh colokan. Semua kabel masuk ke sini, dan dia mengirim data cuma ke perangkat yang dituju.'
		},
		{
			title: 'Access point',
			body: 'Mengubah jaringan berkabel jadi gelombang radio (WiFi) supaya HP dan laptop bisa ikut tanpa kabel.'
		},
		{
			tag: 'Cara ingat',
			title: 'Gerbang, resepsionis, lorong, pengeras suara',
			body: 'Ikuti datanya dari luar ke dalam, <b>modem</b> lalu <b>router</b> lalu <b>switch</b>, ditambah <b>access point</b> buat yang tanpa kabel.'
		},
		{
			tag: 'FYI',
			title: 'Satu kotak di rumah',
			body: 'Router rumah biasanya berisi keempatnya dalam satu badan. Kantor memisahkannya.'
		},
		{
			tag: 'Coba',
			title: 'Cabut satu',
			body: 'Ketuk kotak di gambar. Hijau artinya online, kuning artinya cuma di dalam, merah artinya putus.'
		}
	],
	parts: {
		modem: { name: 'Modem', memo: 'gerbang' },
		router: { name: 'Router', memo: 'resepsionis' },
		switch: { name: 'Switch', memo: 'lorong' },
		ap: { name: 'Access point', memo: 'pengeras suara' }
	},
	internetLabel: 'Dari ISP',
	pcLabel: 'PC {n}',
	phoneLabel: 'HP',
	homeBoxLabel: 'Di rumah, semua dalam satu kotak',
	status: { online: 'online', local: 'cuma di dalam', offline: 'putus' },
	unplugHint: 'Ketuk kotak di gambar buat mencabutnya'
};
