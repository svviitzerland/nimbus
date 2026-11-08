import type { RouterHotspotText } from './types';

export const id: RouterHotspotText = {
	title: 'Hotspot',
	intro: [
		'Kantornya buka pojok kafe kecil buat tamu. Tamu pengin WiFi, tapi kamu nggak mau orang asing masuk jaringan kantor, dan nggak mau ada satu tamu yang nongkrong seharian.',
		'Access point tamu (kotak yang mancarin WiFi) dicolok ke <b>ether3</b>, port tersendiri. Jadi tamu dapat jaringan sendiri, 10.5.50.x, jauh dari laptop kantor di ether2.',
		'Sekarang <b>hotspot</b>nya. Begitu HP nyambung, halaman pertama yang dia buka diganti jadi <b>halaman login</b> (orang nyebutnya captive portal). Internet baru kebuka setelah login.',
		'Satu perintah nyiapin semuanya. <b>/ip hotspot setup</b> itu wizard yang nanya beberapa hal lalu bikin semuanya. Lihat dia jawab pertanyaannya, dan lihat HP tamunya.',
		'Login pakai <b>voucher</b>, username dan password di secarik kertas, biasanya ada batas waktunya. Beli kopi, dapat WiFi satu jam. Di sini terminalnya nyetak satu voucher dengan <b>limit-uptime=1h</b>.',
		'Tamu ngetik voucher di halaman login, dan internet kebuka. Router mulai ngitung mundur satu jam itu sendiri, dan nyatat tamunya sebagai <b>active</b>.',
		'Sejam kemudian (udah kita percepat), waktunya habis. Router balikin HP ke halaman login dengan sendirinya. Nggak ada staf yang perlu jalan ke sana buat matiin apa apa.',
		'[ingat] Hotspot memeriksa login dan batas pemakaian pengguna. Terhubung ke WiFi belum tentu sudah mendapat izin mengakses internet.',
		'[fyi] Hotspot diam diam make ulang yang udah kamu bangun sebelumnya. Dia jalanin [[DHCP server|netlab/router-ip]] sendiri buat alamat tamu dan aturan [[masquerade|netlab/router-nat]] biar tamu bisa online. Wizardnya cuma ngerjain semuanya sekaligus.',
		'Giliran kamu. Lihat daftar voucher dan berapa jam yang udah kepakai pakai <b>/ip hotspot user print</b>.'
	],
	reactions: {
		users:
			'Itu kopi42, limit-uptime 1h, dan uptime 1h. Jatah sejamnya udah habis, jadi kopi berikutnya berarti voucher baru. Begini cara banyak RT RW net jualan WiFi.',
		active:
			'Sekarang nggak ada yang online, jatah satu satunya tamu udah habis. Intip vouchernya pakai <b>/ip hotspot user print</b>.',
		error:
			'Yang itu RouterOS nggak ngerti. Cek lagi ejaannya, atau tekan sarannya dan lihat diketikin.'
	},
	steps: [
		{
			title: 'WiFi untuk tamu',
			body: 'Tamu butuh internet, tapi bukan jaringan kantor, dan bukan selamanya.'
		},
		{
			tag: 'ether3',
			title: 'Interface khusus tamu',
			body: 'Access point tamu punya port sendiri dan jaringan sendiri, <b>10.5.50.x</b>, pisah dari kantor.'
		},
		{
			tag: 'captive portal',
			title: 'Halaman login',
			body: 'Tiap HP di WiFi tamu mendarat di halaman login dulu. Nggak login, nggak ada internet.'
		},
		{
			tag: 'hotspot setup',
			title: 'Menyiapkan hotspot',
			body: 'Wizardnya milih port, alamat buat tamu, dan nama halaman login, lalu bikin semuanya.'
		},
		{
			tag: 'user',
			title: 'Akun voucher',
			body: '<b>User</b> hotspot itu voucher. <b>limit-uptime=1h</b> artinya berlaku buat satu jam online.'
		},
		{
			tag: 'active',
			title: 'Pengguna yang terhubung',
			body: 'Setelah login, tamu muncul di daftar <b>active</b> lengkap dengan sisa waktu vouchernya.'
		},
		{
			title: 'Batas waktu pemakaian',
			body: 'Begitu jamnya habis, router ngeluarin tamu dan halaman login muncul lagi.'
		},
		{
			tag: 'Cara ingat',
			title: 'Login dan masa berlaku',
			body: 'Nggak ada voucher, nggak ada WiFi. Waktu habis, balik ke halaman login.'
		},
		{
			title: 'DHCP, NAT, dan hotspot',
			body: 'Pool, DHCP server, dan aturan masquerade, kepingan yang sama dengan lab sebelumnya.'
		},
		{
			title: 'Coba login hotspot',
			body: '<b>uptime</b> itu berapa lama voucher udah dipakai, <b>limit-uptime</b> itu berapa lama boleh dipakai.'
		}
	],
	ispLabel: 'ISP',
	apLabel: 'WiFi tamu',
	wifiName: 'nimbus cafe',
	phone: {
		searching: 'Lagi nyari WiFi',
		loginTitle: 'WiFi nimbus cafe',
		loginSub: 'Ketik kode dari vouchermu',
		user: 'Username',
		pass: 'Password',
		loginBtn: 'Masuk',
		welcome: 'Hai {user}, kamu udah online',
		left: 'Sisa waktu',
		siteOk: 'nimbus.com kebuka',
		expired: 'Jatah sejammu habis, ambil voucher baru ya'
	},
	inputLabel: 'perintah',
	tryLabel: 'Coba ini',
	termHint: '# giliran kamu, ketik perintahnya lalu tekan Enter',
	hintTry: '# coba {cmd}',
	didYouMean: '# mungkin maksudnya {word}',
	hintSetup: '# wizardnya juga bikin pool, DHCP server, dan aturan masquerade',
	hintVoucher: '# slip voucher, user kopi42, password 1234, satu jam'
};
