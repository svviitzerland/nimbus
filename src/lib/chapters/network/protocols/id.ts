import type { ProtocolsText } from './types';

export const id: ProtocolsText = {
	title: 'Protokol jaringan',
	intro: [
		'Dua komputer cuma bisa kerja bareng kalau sepakat cara ngobrolnya. Siapa yang ngomong duluan, pesannya kayak apa, gimana cara pamitnya. Kesepakatan itu namanya <b>protokol</b>, mirip kayak telepon yang selalu dibuka pakai "halo".',
		'Lihat server nimbus.com. Alamatnya satu, tapi pintunya banyak, masing masing ada nomornya. Nomor itu namanya [[port|foundations/port]]. Tiap protokol ngetuk pintunya sendiri.',
		'Pintu 80 itu <b>HTTP</b>, protokol buat ngambil halaman web. Browsermu ngetuk, terus halamannya dikirim balik.',
		'Pintu 443 itu <b>HTTPS</b>, hal yang sama tapi dalam amplop terkunci. Nggak ada yang bisa baca di tengah jalan. Sekarang hampir semua website tinggal di balik pintu ini.',
		'Pintu 22 itu <b>SSH</b>. Lewat sini kamu bisa ngetik perintah ke komputer yang jauh banget, dengan aman, seolah kamu duduk di depannya.',
		'Pintu 53 itu <b>DNS</b>, buku alamat dari [[DNS|networking/dns]]. Sebelum laptopmu bisa buka nimbus.com, dia nanya ke sini dulu nama itu alamatnya apa.',
		'[ingat] Hafalin empat pintu dulu aja. 80 web biasa, 443 web bergembok, 22 SSH, 53 DNS. SSH hurufnya S kembar, pintunya juga 2 kembar.',
		'[fyi] Masih banyak yang lain. Email dikirim pakai <b>SMTP</b> dan dibaca pakai <b>IMAP</b>, file dipindah pakai <b>SFTP</b>. Huruf S hampir selalu artinya obrolannya dienkripsi. Di bawahnya, semuanya numpang di TCP dan IP yang sama dari [[Lapisan dan paket|networking/layers]].',
		'Itulah protokol, pintu yang punya nama dan nomor. Kalau mau, ketuk sendiri pintu mana aja.'
	],
	reactions: {
		http: 'Pintu 80, HTTP biasa. Halamannya nyampe, tapi siapa pun di jalan bisa ngintip. Makanya browser sekarang suka ngasih peringatan.',
		https:
			'Pintu 443, HTTPS. Halamannya sama, amplopnya dikunci. Ini pintu yang kamu ketuk hampir tiap hari tanpa sadar.',
		ssh: 'Pintu 22, SSH. Di baliknya ada terminal, jadi kamu bisa jalanin perintah di server langsung dari laptopmu.',
		dns: 'Pintu 53, DNS. Kamu nanya nimbus.com, dapat jawaban 203.0.113.10. Tiap kunjungan dimulai dengan ketukan kayak gini.'
	},
	steps: [
		{
			title: 'Protokol',
			body: 'Cara ngobrol yang udah disepakati. Siapa ngomong duluan, pesannya kayak apa, dan gimana pamitnya.'
		},
		{
			title: 'Satu alamat, banyak pintu',
			body: 'Tiap pintu bernomor itu <b>port</b>. Tiap protokol punya pintu langganannya, jadi server tahu kamu mau apa.'
		},
		{
			tag: 'Port 80',
			title: 'HTTP',
			body: 'Ngambil halaman web. Isinya teks polos, jadi siapa pun di jalan bisa baca.'
		},
		{
			tag: 'Port 443',
			title: 'HTTPS',
			body: 'Halaman web yang sama, tapi dienkripsi. S nya singkatan dari secure, alias aman.'
		},
		{
			tag: 'Port 22',
			title: 'SSH',
			body: 'Secure Shell. Ngetik perintah ke komputer yang jauh, seolah kamu duduk di depannya.'
		},
		{
			tag: 'Port 53',
			title: 'DNS',
			body: 'Ngubah nama kayak nimbus.com jadi alamat kayak 203.0.113.10.'
		},
		{
			tag: 'Pegangan',
			title: 'Empat pintu wajib',
			body: '<b>80</b> web, <b>443</b> web aman, <b>22</b> SSH, <b>53</b> DNS.'
		},
		{
			title: 'Masih banyak lagi',
			body: '<b>SMTP</b> ngirim email, <b>IMAP</b> bacanya, <b>SFTP</b> mindahin file. Ada S biasanya artinya dienkripsi.'
		},
		{
			title: 'Ketuk pintunya',
			body: 'Ketuk satu pintu, paketnya bakal jalan ke sana dan ngetuk.'
		}
	],
	laptopLabel: 'Laptopmu',
	serverLabel: 'nimbus.com',
	serverSub: '203.0.113.10',
	doors: [
		{ name: 'HTTP', use: 'web' },
		{ name: 'HTTPS', use: 'web aman' },
		{ name: 'SSH', use: 'terminal jarak jauh' },
		{ name: 'DNS', use: 'buku alamat' }
	],
	knockHint: 'Ketuk satu pintu',
	doorAria: 'Ketuk pintu {port}, {name}'
};
