import type { HttpText } from './types';

export const id: HttpText = {
	title: 'Apa itu HTTP',
	intro: [
		'Tiap kali kamu buka <b>nimbus.com</b>, ada dua komputer yang ngobrol sebentar. Di satu sisi ada <b>browser</b> kamu, aplikasi yang kamu pakai buat buka website. Di sisi lain ada [[server|foundations/server]], komputer yang nyimpen situsnya.',
		'Mereka selalu ngobrol pakai tata krama yang sama, namanya <b>HTTP</b> (singkatan dari HyperText Transfer Protocol). <b>Protokol</b> itu cuma cara ngobrol yang udah disepakati, kayak telepon yang selalu dibuka pakai halo, jadi dua duanya selalu nyambung.',
		'Browser ngomong duluan. Pesannya namanya <b>request</b>, isinya halaman mana yang dia mau, misalnya <b>/about</b>. Bagian itu namanya <b>path</b>. Lihat amplop kecilnya terbang ke server.',
		'Alamat lengkap yang kamu ketik juga punya nama, <b>URL</b>. Baca per bagian. <b>https://</b> menyebut tata kramanya (HTTP yang digembok), <b>nimbus.com</b> bilang server yang mana, <b>/about</b> itu path, dan <b>?lang=id</b> itu <b>query</b>, permintaan tambahan kecil buat halamannya.',
		'Tiap request dibuka pakai kata kerja yang namanya <b>method</b>. <b>GET</b> artinya tolong kasih ini, buat membaca halaman. <b>POST</b> artinya tolong terima ini, buat ngirim sesuatu, kayak komentar atau login.',
		'Server baca requestnya, nyari halamannya, terus ngirim <b>response</b> balik. Browser membukanya dan nunjukin halamannya ke kamu. Perjalanan bolak balik ini biasanya lebih cepat dari kedipan mata.',
		'Di paling atas tiap response ada <b>status code</b>, angka tiga digit yang bilang hasilnya gimana. 200 artinya aman, 301 artinya halamannya pindah, 404 artinya nggak ada, dan 500 artinya servernya lagi kesandung.',
		'[ingat] Cukup lihat digit pertamanya. <b>2 beres, 3 belok, 4 salahmu, 5 salah server.</b> Ucapin sekali keras keras, pasti nempel.',
		'[fyi] HTTP biasa dikirim sebagai teks yang bisa dibaca, jadi siapa pun di tengah jalan bisa ngintip. Huruf S di <b>HTTPS</b> ngunci amplopnya pakai enkripsi, nanti dibahas di [[SSL dan TLS|security/tls]]. [[API|foundations/api]] juga ngomong pakai HTTP yang sama, cuma jawabannya data, bukan halaman.',
		'Mau coba ngirim sendiri? Pilih satu halaman dan lihat status code apa yang balik. Atau santai aja nonton obrolannya, itu juga boleh.'
	],
	reactions: {
		ok: '<b>200 OK</b>. Server nemu /about dan langsung ngirim balik. Angka 2 di depan artinya semuanya beres.',
		moved:
			'<b>301 Moved</b>. Blog lamanya udah pindah alamat, jadi server ngasih tahu browser harus ke mana. Angka 3 di depan artinya belok ke tempat lain, dan browser ngikutin sendiri.',
		notfound:
			'<b>404 Not Found</b>. Servernya sehat kok, cuma nggak punya halaman /pricing. Angka 4 di depan artinya request kamu minta yang salah, jadi salahnya di sisi yang nanya.',
		broken:
			'<b>500 Internal Server Error</b>. Request kamu kali ini benar, tapi kode di balik /report crash di server. Angka 5 di depan artinya sisi mereka yang rusak, bukan kamu.'
	},
	steps: [
		{
			tag: 'Dua sisi',
			title: 'Browser dan server',
			body: '<b>Browser</b> di laptopmu yang nanya. <b>Server</b> nyimpen situsnya dan ngejawab. Semua halaman yang pernah kamu buka datang dari obrolan kayak gini.'
		},
		{
			tag: 'Aturannya',
			title: 'HTTP',
			body: 'Satu tata krama bersama, jadi browser mana pun di dunia bisa ngobrol sama server mana pun di dunia.'
		},
		{
			tag: 'Bertanya',
			title: 'Request',
			body: 'Pesan kecil dari browser. Isinya nama halaman yang dia mau, misalnya <b>/about</b>.'
		},
		{
			tag: 'Alamatnya',
			title: 'URL',
			body: 'Empat bagian, dari kiri ke kanan. <b>Scheme</b> bilang cara ngobrolnya, <b>domain</b> bilang tanya ke siapa, <b>path</b> bilang halaman yang mana, <b>query</b> menambah permintaan kecil.'
		},
		{
			tag: 'Kata kerjanya',
			title: 'Method',
			body: '<b>GET</b> buat membaca, <b>POST</b> buat mengirim. Hampir semua halaman yang kamu buka itu GET yang diam diam.'
		},
		{
			tag: 'Menjawab',
			title: 'Response',
			body: 'Balasan dari server. Yang dibawa duluan status code, baru halamannya.'
		},
		{
			tag: 'Hasilnya',
			title: 'Status code',
			body: 'Tiga digit di atas tiap response. Digit pertamanya udah cerita semuanya.'
		},
		{
			tag: 'Biar nempel',
			title: 'Baca digit pertama',
			body: '<b>2</b> beres, <b>3</b> belok, <b>4</b> salahmu, <b>5</b> salah server.'
		},
		{
			tag: 'Terkunci',
			title: 'HTTPS',
			body: 'Obrolan yang sama, tapi disegel. Orang di tengah jalan cuma lihat ada amplop lewat, nggak bisa baca isinya.'
		},
		{
			tag: 'Opsional',
			title: 'Kirim sendiri',
			body: 'Pencet satu halaman buat memintanya. Tiap halaman balik dengan digit pertama yang beda.'
		}
	],
	youLabel: 'Browser kamu',
	serverLabel: 'Server nimbus.com',
	screen: {
		loading: 'Nunggu jawaban',
		results: {
			ok: { title: 'Tentang Nimbus', text: 'Awan yang ngajarin teknologi.' },
			moved: { title: 'Halaman ini pindah', text: 'Lagi diarahkan ke alamat baru.' },
			notfound: { title: 'Halaman nggak ada', text: 'Nggak ada apa apa di path ini.' },
			broken: { title: 'Ada yang rusak', text: 'Servernya yang kesandung, bukan kamu.' }
		}
	},
	legend: ['2 beres', '3 belok', '4 salahmu', '5 salah server'],
	pagesLabel: 'Minta satu halaman',
	urlQuery: '?lang=id',
	urlParts: { scheme: 'scheme', domain: 'domain', path: 'path', query: 'query' }
};
