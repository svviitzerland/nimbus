import type { PwaText } from './types';

export const id: PwaText = {
	title: 'Apa itu PWA',
	intro: [
		'Ingat tarik ulur di [[native dan cross platform|web/mobile-apps]]? Situs menjangkau semua orang tanpa perlu dipasang, tapi belum terasa seperti aplikasi. Jadi orang bertanya, gimana kalau situs bisa bertingkah kayak aplikasi?',
		'Itulah <b>PWA</b>, singkatan dari Progressive Web App. Dia tetap situs biasa, nimbus.com yang sama, tapi bisa ditaruh di layar utama HP, terbuka penuh tanpa kolom alamat, dan tetap jalan waktu internet putus.',
		'Bahan rahasia pertama adalah file kecil bernama <b>manifest</b>. Isinya memberi tahu HP nama aplikasinya, ikonnya, dan warnanya. Begitu HP menemukannya, dia menawarkan untuk memasang situs itu seperti aplikasi.',
		'Bahan kedua adalah <b>service worker</b>, skrip kecil yang berdiri di antara halaman dan internet, kayak penjaga pintu yang sigap. Di kunjungan pertama dia menyimpan file file penting ke dalam <b>cache</b>, kotak penyimpanan langsung di HP. Nanti kalau internet hilang, dia menyerahkan salinan dari kotak itu.',
		'[fyi] Waktu Twitter meluncurkan Twitter Lite sebagai PWA tahun 2017, ukurannya kurang dari 1 MB di HP, sementara aplikasi Android-nya butuh berkali kali lipat. Starbucks dan Pinterest juga membuat PWA, supaya orang dengan sinyal lemah tetap bisa memesan dan scroll.',
		'Yuk coba. Pertama lihat apa yang terjadi pada situs biasa waktu offline, lalu ubah nimbus.com jadi PWA, pasang, dan cabut internetnya lagi.'
	],
	reactions: {
		plainOffline:
			'Nah, halaman offline yang menyedihkan. Situs biasa tinggal di server, jadi tanpa internet browser nggak punya apa apa buat ditampilkan. Nyalakan lagi, yuk kita perbaiki.',
		manifest:
			'Manifest sudah ada. HP sekarang tahu nama, ikon, dan warnanya, jadi muncul tawaran untuk memasang. Di HP beneran kamu bakal melihat Add to Home Screen.',
		worker:
			'Service worker mulai bertugas. Lihat kotak cache-nya terisi, dia diam diam menyimpan halaman, gaya, dan logo selagi kamu masih online.',
		installed:
			'Terpasang. nimbus.com sekarang punya ikon sendiri di samping aplikasi lainmu, tanpa lewat toko aplikasi. Sekarang cabut internetnya.',
		offlineApp:
			'Kebuka, padahal internetnya mati! Service worker menjawab dari cache, bukan dari server. Itulah keajaiban PWA, situs yang bertingkah kayak aplikasi.'
	},
	steps: ['Situs biasa', 'Bahan PWA', 'Pasang', 'Offline'],
	internetOn: 'online',
	internetOff: 'offline',
	offBtn: 'Matikan internet',
	onBtn: 'Nyalakan internet lagi',
	manifestBtn: 'Tambah manifest.json',
	workerBtn: 'Tambah service worker',
	installBtn: 'Pasang di layar utama',
	offAgainBtn: 'Matikan internet',
	openAppBtn: 'Buka aplikasi nimbus',
	noInternet: 'Nggak ada internet',
	installBanner: 'Pasang nimbus?',
	fromCache: 'dari cache',
	pageTagline: 'Belajar teknologi dari nol',
	appName: 'nimbus',
	cacheLabel: 'Cache di HP',
	cacheEmpty: 'kosong, belum ada yang disimpan',
	notes: {
		plain: 'nimbus.com biasa, langsung dari server',
		plainOffline: 'Tanpa internet, situs biasa nggak bisa dimuat',
		addPieces: 'Beri nimbus.com dua bahan PWA',
		install: 'Sekarang HP menawarkan untuk memasangnya',
		goOffline: 'Sudah terpasang, sekarang putus internetnya',
		openApp: 'Offline. Apakah aplikasinya masih bisa dibuka?',
		done: 'Terbuka tanpa internet, dilayani oleh service worker'
	}
};
