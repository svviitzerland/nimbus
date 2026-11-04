import type { WiresharkText } from './types';

export const id: WiresharkText = {
	title: 'Apa itu Wireshark',
	intro: [
		'Tiap kali kamu membuka halaman, puluhan paket kecil keluar masuk laptopmu. Kamu nggak pernah melihatnya, browser menyembunyikan semua itu dan cuma menampilkan halamannya.',
		'<b>Wireshark</b> itu aplikasi gratis yang bikin kamu bisa melihatnya. Dia menguping di kartu jaringanmu dan mencatat tiap paket yang lewat. Rekaman itu namanya <b>capture</b>. Lihat daftarnya terisi saat nimbus.com dimuat.',
		'Pilih satu paket dan Wireshark membuka bungkusnya, seperti paket di dalam paket. Paling luar ada frame WiFi (laptop ke router), di dalamnya paket IP (ke alamat mana), lalu port (pintu yang mana), dan di tengah isi sebenarnya. Bungkusan itu adalah [[lapisan|networking/layers]].',
		'Sekarang lihat paket paket terakhir, halamannya sendiri. Bungkus luarnya masih bisa dibaca, tapi isinya terkunci. Itu kerjanya [[HTTPS|security/tls]], bahkan terhadap alat seperti ini.',
		'[ingat] Wireshark itu kayak CCTV di jalan raya. Semua mobil terekam dan plat nomornya kebaca, tapi bagasi yang dikunci tetap tertutup.',
		'[fyi] Versi mininya sebenarnya sudah kamu punya. Buka Developer Tools di browser dan lihat tab Network, di situ ada daftar semua permintaan yang dibuat sebuah halaman. Wireshark masuk lebih dalam, sampai ke tiap paket.',
		'Kalau penasaran, ketuk baris mana pun di capture buat membuka bungkusnya.'
	],
	reactions: {
		dns: 'Paket DNS. Laptopmu nanya nimbus.com tinggal di mana. Paket ini jalan tanpa gembok, jadi siapa pun di jaringanmu bisa tahu situs apa yang mau kamu buka.',
		tcp: 'Bagian dari jabat tangan TCP. Laptopmu dan server saling menyapa tiga kali (SYN, SYN ACK, ACK) sebelum data beneran dikirim.',
		hello:
			'Sapaan TLS. Di sini kedua pihak menyepakati kunci rahasia. Nama nimbus.com masih kelihatan, semua setelah ini dikunci.',
		data: 'Data aplikasi, terkunci. Wireshark tahu siapa pengirimnya, ke mana, dan lewat pintu mana, tapi halamannya sendiri cuma acakan.'
	},
	steps: [
		{
			title: 'Lalu lintas tak terlihat',
			body: 'Memuat satu halaman butuh banyak paket kecil bolak balik. Browser cuma menunjukkan hasil akhirnya.'
		},
		{
			tag: 'Capture',
			title: 'Mencatat tiap paket',
			body: 'Wireshark mendaftar tiap paket dengan nomor, protokol, dan ringkasan pendek. Warna mengelompokkan jenisnya.'
		},
		{
			title: 'Paket di dalam paket',
			body: 'Tiap paket dibungkus berlapis. Paling luar <b>dari siapa ke siapa</b> di WiFi kamu, lalu <b>alamat IP</b>, lalu <b>port</b>, dan isinya ada di tengah.'
		},
		{
			title: 'Isi terkunci',
			body: 'Dengan HTTPS, bagian tengahnya dienkripsi. Wireshark tetap lihat bagian luar (siapa ngobrol dengan siapa, dan seberapa banyak), tapi nggak lihat halamannya.'
		},
		{
			tag: 'Cara ingat',
			title: 'Plat kebaca, bagasi nggak',
			body: 'Alamat di luar selalu bisa dibaca. Isi di dalam HTTPS nggak bisa.'
		}
	],
	capturing: 'Merekam di WiFi',
	colNo: 'No.',
	colProto: 'Protokol',
	colInfo: 'Info',
	layerNames: { frame: 'Frame WiFi', ip: 'Paket IP', port: 'Port', content: 'Isi' },
	lockedLabel: 'terkunci',
	packetTitle: 'Paket {n}',
	contents: [
		'nimbus.com di mana?',
		'nimbus.com ada di 76.76.21.21',
		'SYN, boleh ngobrol?',
		'SYN ACK, boleh',
		'ACK, sip',
		'Halo, aku mau nimbus.com',
		'Ini sertifikatku',
		'',
		''
	],
	packetNotes: [
		'Laptopmu nanya ke router, nimbus.com tinggal di mana.',
		'Jawabannya datang, nimbus.com ada di 76.76.21.21.',
		'Jabat tangan, langkah satu. Laptopmu mengetuk pintu 443 di server.',
		'Jabat tangan, langkah dua. Server balas mengetuk.',
		'Jabat tangan, langkah tiga. Sambungannya terbuka.',
		'Laptopmu mulai memasang gembok, dan menyebut situs yang dia mau.',
		'Server menjawab dengan sertifikatnya, bukti bahwa dia benar benar nimbus.com.',
		'Permintaan halamanmu, terkunci rapat.',
		'Halamannya sendiri datang, juga terkunci rapat.'
	]
};
