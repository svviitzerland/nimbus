import type { ProtocolsText } from './types';

export const id: ProtocolsText = {
	title: 'Protokol jaringan',
	intro: [
		'Dua komputer cuma bisa kerja bareng kalau sepakat cara ngobrolnya. Siapa yang ngomong duluan, pesannya bentuknya kayak apa, gimana bilang "udah selesai". Kesepakatan itu namanya <b>protokol</b>, mirip kayak telepon yang selalu dibuka dengan "halo".',
		'Tiap pekerjaan punya protokolnya sendiri. <b>HTTP</b> dan <b>HTTPS</b> buat ngambil halaman web, <b>SMTP</b> buat ngirim email, <b>IMAP</b> buat bacanya, <b>FTP</b> dan <b>SFTP</b> buat mindahin file, dan <b>SSH</b> buat ngetik di terminal komputer lain dari jauh.',
		'Tiap protokol nunggu di balik pintu bernomornya sendiri di server, yaitu [[port|foundations/port]] yang udah pernah kamu kenal. HTTPS ngetuk pintu 443, SSH pintu 22. Satu alamat, banyak pintu.',
		'Protokol aplikasi memakai lapisan transport di bawahnya. Banyak memakai TCP. DNS sering memakai UDP, dan HTTP/3 memakai QUIC di atas UDP. Port dan aturan transport dibaca bersama.',
		'[fyi] HTTPS adalah HTTP yang dilindungi TLS. SFTP adalah protokol transfer file melalui SSH, bukan FTP yang sekadar ditambah huruf S.',
		'[ingat] Port bawaan yang umum adalah 80 untuk HTTP, 443 untuk HTTPS, 22 untuk SSH, dan 53 untuk DNS. Konfigurasi layanan dapat memakai port lain.',
		'Giliran kamu. Ada lima pekerjaan di nimbus.com. Pilih protokol yang pas buat masing masing dan lihat pintu mana yang diketuk.'
	],
	reactions: {
		https:
			'HTTPS, pintu 443. Browser dan server sepakat soal gembok dulu, baru ngobrolin halamannya. Ikon gembok kecil di address bar itu persis ini.',
		http: 'Halamannya sih bakal kebuka, tapi HTTP polos (pintu 80) bisa dibaca siapa aja yang satu WiFi sama kamu. Browser bahkan ngasih label "Not secure". Pilih versi yang bergembok.',
		smtp: 'SMTP, Simple Mail Transfer Protocol. Aplikasi email kamu nyerahin suratnya ke server email lewat pintu 587, terus antar server email saling oper lewat pintu 25 sampai nyampe ke nim@nimbus.com.',
		imap: 'IMAP nyimpen email kamu di server dan nunjukin salinannya, makanya HP dan laptop kamu lihat inbox yang sama. Pintu 993 itu versi terenkripsinya.',
		sftp: 'SFTP mindahin file lewat koneksi SSH di pintu 22, semuanya dienkripsi. Fotomu nyampe dan nggak ada yang bisa ngintip di jalan.',
		ftp: 'FTP (pintu 21) udah ada sejak 1971 dan masih jalan, tapi dia ngirim password kamu sebagai teks polos. Pilih saudaranya yang lebih aman.',
		ssh: 'SSH, Secure Shell, di pintu 22. Sekarang kamu ngetik di terminal server langsung dari laptopmu sendiri.',
		wrong:
			'Protokol itu ngomong bahasa lain buat pekerjaan lain, jadi server nggak bakal ngerti di sini. Baca petunjuknya dan coba yang lain.',
		done: 'Kelima pekerjaan beres! SSH barusan ngebuka terminal server lewat pintu 22, pintu yang sama yang dipakai SFTP. Pekerjaan beda, bahasa beda, semua di satu alamat. Itulah protokol jaringan secara singkat.'
	},
	laptopLabel: 'Laptopmu',
	serverLabel: 'nimbus.com',
	doorsLabel: 'Port di server',
	taskLabel: 'Pekerjaan {n} dari {total}',
	pickLabel: 'Protokol mana yang cocok?',
	protocols: [
		{ id: 'http', name: 'HTTP', port: 80 },
		{ id: 'https', name: 'HTTPS', port: 443 },
		{ id: 'smtp', name: 'SMTP', port: 587 },
		{ id: 'imap', name: 'IMAP', port: 993 },
		{ id: 'ftp', name: 'FTP', port: 21 },
		{ id: 'sftp', name: 'SFTP', port: 22 },
		{ id: 'ssh', name: 'SSH', port: 22 }
	],
	tasks: [
		{
			text: 'Buka halaman depan nimbus.com',
			answer: 'https',
			close: 'http',
			hint: 'Halaman web lewat protokol yang namanya diawali HT, ambil yang bergembok'
		},
		{
			text: 'Kirim email ke nim@nimbus.com',
			answer: 'smtp',
			hint: 'Ngirim email punya protokol sendiri, yang Simple Mail Transfer'
		},
		{
			text: 'Baca balasannya di inbox',
			answer: 'imap',
			hint: 'Baca email yang disimpan di server itu pekerjaan beda dari ngirim'
		},
		{
			text: 'Upload foto ke server',
			answer: 'sftp',
			close: 'ftp',
			hint: 'File Transfer Protocol, yang versi aman'
		},
		{
			text: 'Login ke terminal server',
			answer: 'ssh',
			hint: 'Secure Shell, terminal di komputer lain'
		}
	],
	wrongNote: '{name} kurang cocok buat pekerjaan ini',
	doneNote: 'Semua pekerjaan beres, lima protokol, satu server',
	againBtn: 'Main lagi'
};
