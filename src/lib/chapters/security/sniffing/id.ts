import type { SniffingText } from './types';

export const id: SniffingText = {
	title: 'Sniffing dan MITM',
	intro: [
		'Kamu duduk di kafe, pesan kopi, terus nyambung ke WiFi gratis. Praktis! Tapi WiFi itu satu ruangan bersama. Laptopmu, orang asing di meja sebelah, dan semua orang lain ngobrol lewat udara yang sama.',
		'Gelombang radio nggak peduli buat siapa dia dikirim. Siapa pun di dekat situ dengan aplikasi gratis bisa diam diam merekam tiap paket data kecil yang lewat. Itu namanya <b>sniffing</b>, kayak anjing yang mengendus semua bau di ruangan.',
		'Lihat Sari login ke nimbus.com lewat <b>HTTP</b> biasa. Loginnya jalan kayak kartu pos, jadi si pengintip bisa baca nama dan passwordnya persis seperti yang dia ketik.',
		'Sekarang login yang sama lewat <b>HTTPS</b>. Semuanya diacak dulu sebelum keluar dari laptop, kayak amplop yang disegel. Pengintipnya tetap merekam, tapi cuma dapat acakan. Cara gembok itu dibuat ada di [[SSL dan TLS|security/tls]].',
		'Pengintip yang lebih licik nggak cuma nguping. Dia bikin hotspot palsu dengan nama mirip WiFi kafe, jadi semua lewat laptop <b>dia</b> dulu. Itu serangan <b>man in the middle</b>. HTTPS tetap bertahan, browser ngecek siapa yang sebenarnya menjawab dan ngasih peringatan kalau itu bukan nimbus.com.',
		'[ingat] <b>Nggak ada gembok, jangan ketik password.</b> Sebelum ngetik apa pun yang rahasia, cari gembok kecil di sebelah alamat. Nggak ada gembok, nggak usah ngetik.',
		'[fyi] Alatnya sama, dunianya beda. Engineer jaringan sengaja merekam lalu lintas buat benerin masalah, pakai alat kayak [[Wireshark|network/wireshark]]. Alatnya sama, yang penting jaringan siapa itu. Di WiFi umum, [[VPN|network/vpn]] nambah satu gembok lagi di atasnya.',
		'Mau lihat lagi? Ganti ganti antara HTTP dan HTTPS, terus lihat apa yang didapat si pengintip. Atau santai aja nikmatin kopinya, itu juga boleh.'
	],
	reactions: {
		http: 'Mode kartu pos. Si pengintip bisa baca <b>sari</b> dan <b>kopi123</b> dengan jelas. Siapa pun di WiFi ini dengan aplikasi gratis bisa melakukan hal yang sama.',
		https:
			'Mode amplop. Si pengintip tahu Sari buka nimbus.com, tapi semua isinya cuma acakan. Itu HTTPS lagi kerja.'
	},
	steps: [
		{
			tag: 'Di kafe',
			title: 'WiFi bersama',
			body: 'WiFi umum itu <b>satu ruangan bersama</b>. Semua orang di kafe ngobrol lewat kotak dan udara yang sama.'
		},
		{
			tag: 'Menguping',
			title: 'Sniffing',
			body: 'Diam diam <b>merekam</b> paket yang lewat. Nggak perlu membobol apa pun, cukup berada di dekat situ.'
		},
		{
			tag: 'Kartu pos',
			title: 'HTTP biasa',
			body: 'Data jalan sebagai <b>teks yang bisa dibaca</b>. Siapa pun yang merekamnya bisa baca passwordnya kata per kata.'
		},
		{
			tag: 'Amplop',
			title: 'HTTPS',
			body: 'Data <b>diacak</b> sebelum berangkat. Cuma nimbus.com yang punya kunci buat membukanya lagi.'
		},
		{
			tag: 'Di tengah',
			title: 'Man in the middle',
			body: 'Hotspot palsu menaruh si pengintip <b>di tengah jalan</b>. HTTPS tetap bertahan, dan browser ngasih peringatan kalau ada yang pura pura jadi nimbus.com.'
		},
		{
			tag: 'Cara ingat',
			title: 'Nggak ada gembok, jangan ketik',
			body: 'Cari <b>gembok</b> di sebelah alamat sebelum ngetik apa pun yang rahasia.'
		},
		{
			tag: 'Sekilas',
			title: 'Alat sama, tangan beda',
			body: 'Engineer merekam lalu lintas di jaringan <b>milik sendiri</b> buat benerin masalah. Izin yang membedakan.'
		},
		{
			tag: 'Opsional',
			title: 'Coba dua duanya',
			body: 'Ganti antara HTTP dan HTTPS, lalu lihat layar si pengintip.'
		}
	],
	youLabel: 'Laptop Sari',
	routerLabel: 'WiFi kafe',
	serverLabel: 'nimbus.com',
	snooperLabel: 'Pengintip di meja sebelah',
	twinLabel: 'Hotspot palsu',
	engineerLabel: 'Engineer, jaringan sendiri',
	notSecure: 'Tidak aman',
	loginBtn: 'Masuk',
	snoop: {
		title: 'Tertangkap',
		waiting: 'Menunggu',
		recording: 'Merekam paket',
		readable: 'terbaca',
		noise: 'teracak'
	},
	rule: 'Nggak ada gembok, jangan ketik password',
	pickLabel: 'Kirim login lewat',
	modes: { http: 'HTTP', https: 'HTTPS' }
};
