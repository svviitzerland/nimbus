import type { CiscoIpText } from './types';

export const id: CiscoIpText = {
	title: 'Interface dan DHCP pool',
	intro: [
		'Router kita sekarang namanya nimbus, dan udah ada kabel dari <b>GigabitEthernet0/1</b> ke switch kantor. Tapi lihat, lampunya mati. Router Cisco dikirim dengan port yang dimatiin, jadi belum ada yang bisa lewat.',
		'Pertama, port itu butuh alamat, nomor rumah si router di sisi kantor. Kita masuk ke portnya pakai <b>interface g0/1</b>, lalu kasih <b>192.168.88.1</b>. Perhatiin, Cisco mau ukuran jaringannya ditulis sebagai <b>mask</b> lengkap, <b>255.255.255.0</b>, bukan /24 (artinya sama).',
		'Habis itu kita nyalain pakai <b>no shutdown</b>. Lampunya jadi hijau, dan IOS ngumumin pakai tulisan kuning, changed state to up.',
		'[ingat] Di IOS, <b>no</b> di depan perintah artinya batalin. shutdown itu matiin port, jadi no shutdown ya nyalain lagi. Gampangnya, no itu tombol undo. Berlaku di mana mana, no hostname, no ip address, dan lainnya.',
		'Sekarang Sari, Budi, dan Dewi nyolok laptopnya. Masing masing teriak ke kabel, ada yang punya alamat buat aku nggak? Itu namanya <b>DHCP</b>, resepsionis jaringan yang bagiin badge bernomor, lihat [[Apa itu DHCP|network/dhcp]]. Belum ada yang jawab.',
		'Sebelum resepsionisnya buka, kita sisihin beberapa alamat dulu, 192.168.88.1 sampai .10, buat router dan barang yang nanti diatur manual kayak printer. Itu <b>ip dhcp excluded-address</b>.',
		'Sekarang <b>pool</b>nya. Kita kasih nama OFFICE, kasih tau <b>network</b> mana yang dibagiin, <b>default-router</b> mana jalan keluarnya, dan <b>dns-server</b> mana yang jawab pertanyaan soal nama. Lihat laptopnya dapat badge.',
		'[ingat] Pool DHCP itu jawab tiga pertanyaan tiap laptop. Nomorku berapa (network), pintu keluarnya di mana (default router), dan siapa yang tau nama nama (DNS server). Singkatnya, nomor, pintu, buku telepon.',
		'Si resepsionis punya buku catatan, <b>show ip dhcp binding</b>. Tiap baris nunjukin alamat mana dikasih ke laptop mana. Mulainya dari .11 karena .1 sampai .10 tadi disisihin.',
		'Giliran kamu. Cek apa laptop Dewi beneran jawab, ketik <b>ping 192.168.88.13</b>.'
	],
	reactions: {
		task: 'Lima tanda seru, lima balasan! Tiap ! itu satu jawaban dari laptop Dewi. Portnya nyala, poolnya jalan, dan sekantor udah punya alamat semua.',
		pingOther: 'Laptop itu juga jawab. Tapi misinya Dewi ya, dia dapat <b>192.168.88.13</b>.',
		pingMiss:
			'Titik titik artinya nggak ada balasan. Nggak ada yang pakai alamat itu. Dewi dapat <b>192.168.88.13</b>, cek daftar binding di atas.',
		needEnable: 'Itu butuh prompt bos. Ketik <b>enable</b> dulu.',
		needConfig: 'Itu ngubah router, ketik <b>conf t</b> dulu.',
		needDo:
			'Di mode config, kasih <b>do</b> di depannya, misalnya <b>do ping 192.168.88.13</b>, atau ketik <b>end</b> dulu.',
		needSub:
			'Perintah itu tempatnya satu tingkat lebih dalam. Masuk dulu ke interface atau poolnya, misalnya <b>interface g0/1</b>.',
		mask: 'Cisco nggak nerima /24 di situ. Tulis masknya lengkap, <b>255.255.255.0</b>.',
		error:
			'Yang itu IOS nggak ngerti. Tanda ^ nunjuk kata yang bikin bingung, dan <b>?</b> nampilin yang cocok.'
	},
	steps: [
		{
			title: 'Port yang mati',
			body: 'Di tabelnya, Gi0/1 tulisannya <b>administratively down</b>. Kabelnya ada, tapi portnya belum pernah dinyalain.'
		},
		{
			title: 'Mode interface',
			body: '<code>interface g0/1</code> bawa kamu masuk ke satu port itu, dan promptnya jadi <b>(config-if)#</b>. Semua yang kamu ketik sekarang cuma berlaku buat port ini.'
		},
		{
			title: 'Nyalain',
			body: '<code>no shutdown</code> bikin portnya hidup. Tulisan kuning itu buku harian router, namanya log message.'
		},
		{
			title: 'Batalin pakai no',
			tag: 'Biar nempel',
			body: 'Taruh <b>no</b> di depan buat undo. <code>shutdown</code> itu mati, <code>no shutdown</code> itu nyala.'
		},
		{
			title: 'Laptop minta alamat',
			body: 'Laptop tanpa alamat nggak bisa ngobrol sama siapa pun. Dengan DHCP dia nanya ke jaringan, dan router bisa jawab. Router WiFi di rumahmu juga persis begini.'
		},
		{
			title: 'Sisihin sebagian',
			body: '<code>ip dhcp excluded-address 192.168.88.1 192.168.88.10</code> artinya jangan pernah bagiin alamat ini. Router sendiri udah pakai .1.'
		},
		{
			title: 'Pool',
			body: '<code>ip dhcp pool OFFICE</code> ngebuka poolnya, dan promptnya jadi <b>(dhcp-config)#</b>. Tiga baris berikutnya ngisi apa yang dikasih tau ke tiap laptop.'
		},
		{
			title: 'Tiga pertanyaan',
			tag: 'Biar nempel',
			body: '<b>network</b> nomorku berapa, <b>default-router</b> pintunya di mana, <b>dns-server</b> siapa yang tau nama.'
		},
		{
			title: 'Buku catatan',
			body: 'Satu baris per laptop, alamatnya dan alamat hardwarenya. Di MikroTik daftar yang sama namanya DHCP lease.'
		},
		{
			title: 'Giliran kamu',
			tag: 'Coba',
			body: 'Ketuk console lalu ketik <code>ping 192.168.88.13</code>. Tiap <b>!</b> itu balasan, tiap <b>.</b> itu sepi.'
		}
	],
	tagAsk: 'DHCP?',
	capDark: 'Gi0/1 masih mati, kantornya gelap',
	capLit: 'Gi0/1 udah nyala dengan 192.168.88.1',
	capWaiting: 'Laptopnya terus nanya minta alamat',
	capLeased: 'Semua laptop dapat alamat dari pool',
	ispLabel: 'ISP',
	inputLabel: 'perintah',
	doneNote: 'Beres',
	termHint: '! Nim ngetik duluan di sini, giliranmu nanti di akhir',
	hintInvalid: '! IOS bingung di tanda ^, cek kata itu atau ketik ? buat lihat yang cocok',
	hintIncomplete:
		'! dikit lagi, perintahnya kurang kata, kasih spasi lalu ? buat lihat lanjutannya',
	hintAmbiguous:
		'! kependekan, ada lebih dari satu perintah yang awalnya begitu, tambah satu dua huruf',
	hintUnknown: '! perintah itu nggak ada di sini, ketik ? buat lihat daftarnya',
	didYouMean: '! mungkin maksudnya {word}',
	hintNeedEnable: '! itu butuh mode bos, ketik enable dulu',
	hintNeedConfig: '! itu ngubah router, ketik conf t dulu',
	hintDo: '! kamu lagi di mode config, kasih do di depan, contohnya do sh run',
	hintSub: '! perintah itu tempatnya di dalam interface, pool, atau line, masuk dulu ke sana',
	hintMask: '! Cisco mau masknya ditulis lengkap, kayak 255.255.255.0',
	hintWild: '! hati hati, wildcard itu kebalikan mask, 255.255.255.0 jadi 0.0.0.255'
};
