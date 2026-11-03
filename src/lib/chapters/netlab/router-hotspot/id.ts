import type { RouterHotspotText } from './types';

export const id: RouterHotspotText = {
	title: 'Hotspot',
	intro: [
		'Kantor buka pojok kafe kecil buat tamu. Tamu pengen WiFi, tapi kamu nggak mau orang asing masuk ke jaringan kantor, dan nggak mau ada satu tamu yang nongkrong di WiFi seharian.',
		'Masuklah <b>hotspot</b>. Begitu HP nyambung, halaman pertama yang dia buka dibelokkan ke <b>halaman login</b> (orang nyebutnya captive portal). Internet baru kebuka setelah login.',
		'Loginnya pakai <b>voucher</b>, username dan password di kertas kecil, biasanya ada batas waktunya. Beli kopi, dapat WiFi satu jam. Banyak RT RW net jualan persis kayak gini.',
		'Access point buat tamu dicolok ke <b>ether3</b>, port sendiri, jadi tamu dapat jaringan sendiri (10.5.50.x), jauh dari laptop kantor di ether2.',
		'[fyi] Hotspot diam diam pakai lagi yang udah kamu bangun di lab sebelumnya. Dia punya [[DHCP server|netlab/router-ip]] sendiri buat alamat tamu dan aturan [[masquerade|netlab/router-nat]] buat bawa mereka online. Wizardnya cuma nyiapin semuanya sekaligus.',
		'Giliran kamu. Jalankan <b>/ip hotspot setup</b> di ether3, bikin voucher satu jam, lalu ambil HP tamu dan login.'
	],
	reactions: {
		setup:
			'Hotspot udah jalan di ether3. Di balik layar wizardnya bikin pool alamat, DHCP server, aturan masquerade, dan halaman login. Satu lab penuh dalam satu perintah.',
		wizardBad:
			'Wizardnya nggak terima jawaban itu. Baca baris petunjuknya, access point tamu ada di <b>ether3</b>.',
		noHotspot:
			'HPnya nyambung ke WiFi, tapi belum ada yang jawab di ether3, jadi nggak dapat alamat dan nggak ada internet. Pasang hotspotnya dulu.',
		portal:
			'HPnya nyoba buka halaman dan malah nyampe di halaman login. Itu captive portal, nggak ada yang lewat tanpa voucher.',
		badLogin:
			'Username atau passwordnya salah. Cek voucher yang kamu bikin, terminal nampilin itu tepat setelah kamu nambahinnya.',
		usedUp: 'Voucher itu udah habis jamnya. Bikin yang baru, kayak jual kopi lagi.',
		voucher:
			'Voucher kecetak. WiFi satu jam buat siapa aja yang pegang username dan password ini. Sekarang ambil HPnya dan sambungin ke WiFi kafe.',
		otherLimit:
			'Voucher dengan batas waktu lain, itu juga bisa. Kafe sering jual beberapa ukuran. Sekarang ambil HPnya dan sambungin ke WiFi kafe.',
		noLimit:
			'User itu nggak punya limit-uptime, jadi nggak bakal pernah habis. Oke buat karyawan, tapi nggak buat tamu. Tambahin <b>limit-uptime=1h</b>.',
		online:
			'Udah login, jamnya jalan. nimbus.com kebuka, dan router ngitung mundur satu jam vouchernya sendiri.',
		onlineNoLimit:
			'Udah login, tapi pakai voucher yang nggak pernah habis. Jalan sih, cuma tamunya bisa betah selamanya. Bikin juga yang pakai limit-uptime=1h.',
		neverEnds: 'Sejam lewat dan sesinya masih jalan. Begitulah voucher tanpa batas.',
		expired:
			'Waktunya habis! Router nendang HPnya balik ke halaman login sendiri. Nggak perlu ada karyawan yang nyamperin buat matiin.',
		active: 'Ini daftar tamu yang lagi online, lengkap dengan udah berapa lama dan sisa waktunya.',
		noActive: 'Belum ada yang login. Login pakai HPnya dulu.',
		error:
			'Yang itu RouterOS nggak ngerti. Cek lagi ejaannya, atau ketik <b>?</b> buat lihat yang ada. Tombol Bantu juga bisa ngetikin buat kamu.',
		done: 'WiFi kafe jalan, lengkap dengan vouchernya. Sepanjang lab ini kamu udah ngatur alamat, NAT, firewall, queue yang adil, dan hotspot, jaringan kantor kecil beneran dari nol.'
	},
	missionsLabel: 'Misi',
	missions: [
		'Pasang hotspot di ether3',
		'Bikin voucher satu jam',
		'Login pakai HP tamu',
		'Lihat siapa yang online'
	],
	hintBtn: 'Bantu',
	doneNote: 'WiFi kafe siap melayani',
	ispLabel: 'ISP',
	inputLabel: 'perintah',
	termHint: '# ketik perintah RouterOS lalu tekan Enter',
	hintUnknown: '# perintah itu nggak ada, ketik ? buat lihat menunya',
	didYouMean: '# mungkin maksudnya {word}',
	apLabel: 'WiFi tamu',
	wifiName: 'Nimbus Cafe',
	phone: {
		joinBtn: 'Sambung ke WiFi {wifi}',
		joining: 'Lagi nyambung',
		noNet: 'Tersambung, tapi nggak ada internet',
		retry: 'Coba lagi',
		loginTitle: 'WiFi Nimbus Cafe',
		loginSub: 'Ketik voucher dari struk kamu',
		user: 'Username',
		pass: 'Password',
		loginBtn: 'Masuk',
		bad: 'Username atau password salah',
		used: 'Waktu voucher ini udah habis',
		welcome: 'Kamu online, {user}',
		left: 'Sisa waktu',
		siteOk: 'nimbus.com kebuka lancar',
		skip: 'Lompat satu jam',
		expired: 'Waktumu habis. Mau kopi lagi?'
	},
	hintIface: '# ether1 itu ISP dan ether2 kantor, access point tamu ada di ether3',
	hintWizard: '# satu pertanyaan per baris, tekan Enter buat pakai nilai yang tampil',
	hintNeeds: '# perintah ini masih butuh {keys}',
	hintUptime: '# kasih tamu batas waktu, misalnya limit-uptime=1h',
	hintNoActive: '# belum ada yang login',
	hintNoHotspot: '# belum ada hotspot, jalankan /ip hotspot setup',
	hintVoucher: '# voucher siap, username {user}, password {pass}'
};
