import type { PwaText } from './types';

export const id: PwaText = {
	title: 'Apa itu PWA',
	intro: [
		'Ingat tarik ulur di [[native dan cross platform|web/mobile-apps]]? Situs menjangkau semua orang tanpa perlu dipasang, tapi belum terasa seperti aplikasi. Ini nimbus.com biasa di HP, dan semua filenya datang langsung dari server.',
		'Sekarang lihat internetnya putus. Situs biasa tinggal di server, jadi tanpa koneksi browser sama sekali nggak punya apa apa buat ditampilkan.',
		'<b>PWA</b>, singkatan dari Progressive Web App, membereskan dua hal itu. Dia tetap situs yang sama, tapi bisa nangkring di layar utama kayak aplikasi, terbuka penuh tanpa kolom alamat, dan tetap jalan waktu offline.',
		'Bahan pertama adalah file kecil bernama <b>manifest</b>. Isinya memberi tahu HP nama aplikasinya, ikonnya, dan warnanya. Begitu HP menemukannya, dia menawarkan untuk memasang situs itu.',
		'Bahan kedua adalah <b>service worker</b>, skrip kecil yang berdiri di antara halaman dan internet, kayak satpam di pintu. Di kunjungan pertama dia menyimpan file file penting ke dalam <b>cache</b>, kotak penyimpanan langsung di HP.',
		'Ketuk pasang, dan nimbus.com dapat ikonnya sendiri di samping aplikasi lain. Tanpa toko aplikasi, tanpa menunggu disetujui.',
		'Sekarang putus lagi internetnya dan buka aplikasinya. Tetap terbuka! Service worker menjawab dari cache, bukan dari server.',
		'[ingat] Manifest itu KTP, service worker itu satpam yang bawa bekal. KTP bikin bisa dipasang, bekal bikin tetap jalan waktu offline.',
		'[fyi] Waktu Twitter meluncurkan Twitter Lite sebagai PWA tahun 2017, ukurannya kurang dari 1 MB di HP, sementara aplikasi Android-nya butuh berkali kali lipat. Starbucks dan Pinterest juga membuat PWA, supaya orang dengan sinyal lemah tetap bisa memesan dan scroll.',
		'Kalau mau, matikan dan nyalakan internetnya, lalu lihat aplikasinya tetap terbuka. Ini opsional kok.'
	],
	reactions: {
		offline:
			'Masih ada! Nggak ada internet, tapi aplikasinya tetap terbuka, langsung dari cache di HP.',
		online:
			'Online lagi. Sekarang service worker bisa mengambil file baru dari server dan diam diam memperbarui cache.'
	},
	panels: [
		{
			tag: 'Situs biasa',
			title: 'Langsung dari server',
			body: 'Situs biasa meminta semua filenya ke server, setiap kali kamu membukanya.'
		},
		{
			tag: 'Offline',
			title: 'Nggak ada yang bisa ditampilkan',
			body: 'Tanpa koneksi, tanpa file. Browser cuma bisa menampilkan halaman offline yang menyedihkan.'
		},
		{
			tag: 'PWA',
			title: 'Situs yang bertingkah kayak aplikasi',
			body: 'Situs yang sama, alamat yang sama, tapi punya ikon sendiri di <b>layar utama</b> dan bisa dibuka waktu offline.'
		},
		{
			tag: 'Bahan 1',
			title: 'Manifest',
			body: '<b>manifest.json</b> berisi nama, ikon, dan warna. Karena file inilah HP menawarkan untuk memasang.'
		},
		{
			tag: 'Bahan 2',
			title: 'Service worker',
			body: 'Skrip yang berdiri di antara halaman dan internet. Dia menyalin halaman, gaya, dan logo ke dalam <b>cache</b>.'
		},
		{
			tag: 'Pasang',
			title: 'Masuk ke layar utama',
			body: 'Berkat manifest, situsnya mendarat di samping aplikasi lain dan terbuka layar penuh.'
		},
		{
			tag: 'Offline lagi',
			title: 'Disajikan dari cache',
			body: 'Service worker menangkap permintaannya dan menyerahkan salinan yang tersimpan. Server sama sekali nggak ditanya.'
		},
		{
			tag: 'Cara ingat',
			title: 'KTP dan satpam',
			body: 'Manifest berarti bisa dipasang. Service worker berarti bisa offline. PWA butuh keduanya.'
		},
		{
			tag: 'Coba',
			title: 'Online atau nggak',
			body: 'Waktu online, file bisa datang dari server. Waktu offline, file datang dari cache. Aplikasinya tetap terbuka.'
		}
	],
	picture:
		'Sebuah HP menampilkan nimbus.com, server tersambung lewat internet, file manifest, service worker yang berjaga di sambungan, dan kotak cache di HP.',
	serverLabel: 'nimbus.com',
	noInternet: 'Tidak ada internet',
	installAsk: 'Pasang nimbus?',
	installBtn: 'Pasang',
	appName: 'nimbus',
	tagline: 'Belajar teknologi dari nol',
	fromCache: 'dari cache',
	fromServer: 'dari server',
	cacheLabel: 'Cache di HP',
	workerLabel: 'service worker',
	memo: { manifest: 'KTP', worker: 'satpam' },
	rule: 'KTP buat dipasang, satpam buat offline',
	offBtn: 'Matikan internet',
	onBtn: 'Nyalakan internet lagi'
};
