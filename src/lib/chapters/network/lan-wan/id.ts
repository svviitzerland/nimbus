import type { LanWanText } from './types';

export const id: LanWanText = {
	title: 'LAN, WAN, dan internet',
	intro: [
		'Colokkan dua laptop ke kotak yang sama pakai kabel, dan mereka sudah bisa saling kirim file. Kelompok kecil itu namanya jaringan, dan kalau muat di satu ruangan atau satu gedung, namanya <b>LAN</b> (Local Area Network).',
		'Sekarang kantormu buka cabang di beberapa sudut kota, mungkin juga di kota lain. Tiap kantor punya LAN sendiri, dan buat menyambungkannya kamu menyewa jalur panjang dari perusahaan telekomunikasi. Jaringan yang menyebar seluas itu namanya <b>WAN</b> (Wide Area Network).',
		'Lalu <b>internet</b>? Dia bukan satu jaringan raksasa milik seseorang. Internet itu jutaan jaringan (rumah, kampus, perusahaan, penyedia internet, data center) yang sepakat saling menitipkan data. Jaringan dari jaringan jaringan.',
		'[fyi] Coba lihat bagian belakang router rumah. Biasanya ada satu port berlabel <b>WAN</b>, yang menghadap dunia luar, dan sisanya berlabel <b>LAN</b>, menghadap ke dalam rumah. Kata yang sama, cuma dikecilkan jadi satu kotak. Kotak itu akan kamu kenal di [[perangkat jaringan|network/devices]].',
		'[ingat] LAN menghubungkan perangkat dalam area lokal. WAN menghubungkan jaringan pada area lebih luas. Internet menghubungkan banyak jaringan.',
		'Yuk bangun dari dalam ke luar. Mulai dari satu ruangan, colokkan semuanya, lalu zoom out sampai kamu melihat seluruh dunia.'
	],
	reactions: {
		lan: 'Itu dia LAN. Semua perangkat tercolok ke switch di tengah, dan sekarang mereka bisa ngobrol langsung dengan cepat, tanpa butuh internet. Printer, folder bersama, sampai main game bareng teman kantor, semuanya di sini.',
		wan: 'Kantor kantornya sekarang jadi satu WAN. Tiap kantor tetap punya LAN sendiri di dalam, jalur panjang tadi cuma menjahit mereka jadi satu. Data antar kantor menempuh berkilo kilometer, jadi sedikit lebih lambat dibanding di dalam satu ruangan.',
		internet:
			'Dan jadilah internet. Nggak ada pusatnya, nggak ada pemilik tunggal, cuma jaringan jaringan yang sepakat saling mengantar data. Kalau satu jalur putus, datanya cari jalan memutar. HP kamu yang membuka nimbus.com melompati beberapa jaringan seperti ini.'
	},
	levels: {
		lan: {
			tab: 'LAN',
			scope: 'satu ruangan',
			hint: 'Ketuk tiap perangkat buat mencolokkan kabelnya ke switch',
			done: 'Satu ruangan, satu LAN'
		},
		wan: {
			tab: 'WAN',
			scope: 'satu kota',
			hint: 'Ketuk tiap kantor cabang buat menyambungkannya ke kantor pusat',
			done: 'Banyak kantor, satu WAN'
		},
		net: {
			tab: 'Internet',
			scope: 'seluruh dunia',
			hint: 'Ketuk tiap jaringan buat menyambungkannya ke yang lain',
			done: 'Jaringan dari jaringan jaringan, itulah internet'
		}
	},
	zoomBtn: 'Zoom out',
	againBtn: 'Balik ke ruangan',
	switchLabel: 'Switch',
	laptopLabel: 'Laptop',
	pcLabel: 'PC',
	hqLabel: 'Kantor pusat',
	branchLabel: 'Cabang {n}',
	nets: ['Kantormu', 'ISP rumahan', 'Kafe', 'nimbus.com', 'Kampus', 'Jaringan seluler']
};
