import type { HardwareText } from './types';

export const id: HardwareText = {
	title: 'CPU, RAM, dan storage',
	intro: [
		'Semua komputer, dari HP di sakumu sampai server paling besar, dibangun dari tiga bagian utama yang sama. Biar gampang kenalan, bayangkan sesuatu yang sudah kamu kenal banget, dapur.',
		'<b>CPU</b> (central processing unit) itu kokinya. Dia yang mengerjakan semua urusan mikir, menjumlah angka, menggambar layarmu, memutuskan apa yang terjadi berikutnya. Cepatnya nggak masuk akal, miliaran langkah kecil tiap detik, dan jauh di dalam dia cuma paham nyala dan mati ([[bit|basics/binary]]).',
		'Koki butuh meja buat bekerja. Itulah <b>RAM</b> (random access memory), meja tempat semua yang sedang kamu pakai sekarang ditaruh supaya gampang dijangkau. RAM cepat banget, tapi dia lupa semuanya begitu listrik mati.',
		'Lalu ada lemarinya, yaitu <b>storage</b> (SSD atau hard disk). Foto, aplikasi, dan game kamu tinggal di sana, dan tetap aman walaupun komputernya dimatikan. Ukurannya jauh lebih besar dari RAM, tapi lebih lambat dijangkau.',
		'Jadi waktu kamu membuka game, komputer membawanya dari lemari ke atas meja, lalu CPU memainkannya dari situ. Makanya game bikin kamu menunggu sebentar waktu loading, habis itu jalannya lancar.',
		'[fyi] Kalau toko menulis laptop "RAM 8 GB, SSD 512 GB", itulah meja dan lemarinya. Hati hati di HP, banyak orang menyebut storage sebagai "memori", padahal memori yang asli itu RAM. Sebuah [[server|foundations/server]] juga dibangun dari tiga bagian yang sama, cuma lebih besar.',
		'Ini laptop yang isinya kelihatan. Muat game dari storage ke RAM, biarkan CPU memainkannya, lalu cabut colokannya dan lihat siapa yang masih ingat.'
	],
	reactions: {
		load: 'Nah, pindah dari lemari ke atas meja. Jeda sebentar tadi itu karena storage lebih lambat dari RAM. Sekarang gamenya sudah dekat CPU, siap dimainkan.',
		run: 'CPU mengambil game dari RAM lalu mengerjakannya, langkah demi langkah, miliaran kali per detik. Selama main dia nggak pernah merogoh lemari, karena meja jauh lebih cepat.',
		unplug:
			'Listrik mati. RAM langsung lupa semuanya, game di atas meja hilang begitu saja. Tapi lihat storage, gamenya masih aman di lemari. Makanya kerjaan harus disimpan, menyimpan artinya menulisnya ke storage.',
		power:
			'Nyala lagi, dan RAM mulai dalam keadaan kosong, kayak meja yang bersih tiap pagi. Gamenya masih ada di storage, jadi kamu bisa memuatnya lagi kapan saja.'
	},
	locale: 'id-ID',
	cpu: { label: 'CPU', sub: 'si koki, tukang mikir', spec: '3 GHz' },
	ram: { label: 'RAM', sub: 'si meja, yang dipakai sekarang', spec: '8 GB' },
	storage: { label: 'Storage', sub: 'si lemari, menyimpan selamanya', spec: '512 GB' },
	gameName: 'Nimbus Racer',
	otherFiles: ['Foto', 'Tugas sekolah'],
	powerOn: 'Tercolok',
	powerOff: 'Dicabut',
	loadBtn: 'Muat game ke RAM',
	runBtn: 'Mainkan gamenya',
	unplugBtn: 'Cabut colokannya',
	powerBtn: 'Colok lagi',
	ramEmpty: 'kosong',
	loadingTag: 'memuat',
	cpuIdle: 'santai',
	cpuBusy: 'bekerja',
	cpuOff: 'mati',
	steps: '{n} langkah selesai',
	keptTag: 'masih ada',
	notes: {
		idle: 'Gamenya diam di storage, menunggu dibuka',
		loading: 'Menyalin game dari storage ke RAM',
		loaded: 'Gamenya sudah di atas meja, tepat di sebelah CPU',
		running: 'CPU memainkan game langsung dari RAM',
		off: 'Listrik mati, RAM jadi kosong, storage tetap menyimpan filenya',
		back: 'Mulai dari awal, RAM kosong dan storage masih lengkap'
	}
};
