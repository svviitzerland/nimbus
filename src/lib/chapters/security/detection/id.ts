import type { DetectionText } from './types';

export const id: DetectionText = {
	title: 'Log dan Deteksi',
	intro: [
		'Tahun 1986 Cliff Stoll, seorang astronom yang mengurus komputer di sebuah lab di Berkeley, California, menemukan dua sistem tagihan yang selisih 75 sen. Cuma 75 sen.',
		"Dia nggak cuek. Dia menggali <b>log</b>, buku harian tempat komputer mencatat semua yang terjadi, siapa yang login, kapan, dan dari mana. Jejaknya berujung ke seorang hacker di Jerman yang menjual rahasia ke KGB, dinas rahasia Uni Soviet. Stoll menceritakan semuanya di buku The Cuckoo's Egg.",
		'Sekarang semua server menyimpan log. [[Monitoring|compute/monitoring]] menunjukkan angka kesehatan seperti CPU, sedangkan log menceritakan kisah di balik angka itu, baris demi baris. Masalahnya, situs sibuk seperti nimbus.com menulis jutaan baris per hari.',
		'Jadi yang dicari adalah <b>pola</b>. Lihat. Satu alamat mencoba login admin, gagal, gagal lagi, gagal lagi, lalu berhasil masuk. Itulah serangan [[brute force|security/brute-force]], password yang ditebak dengan cara mencoba terus menerus.',
		'Tim menyerahkan pekerjaan ini ke <b>SIEM</b> (Security Information and Event Management, dibaca kayak "sim"). Dia mengumpulkan log dari semua server ke satu tempat, menyambungkan titik titiknya, lalu membunyikan alert supaya dicek manusia.',
		'[fyi] Alert cuma berguna kalau ada yang membacanya. Waktu Target kebobolan tahun 2013, alat keamanannya sebenarnya sudah membunyikan alert saat penyerang ada di dalam, tapi nggak ada yang bertindak tepat waktu.',
		'[ingat] Sekali salah password itu typo. Seratus kali salah dari alamat yang sama, itu serangan.',
		'Kalau mau, giliran kamu. Ketuk baris mana saja di log, dan semua baris dari alamat yang sama ikut menyala.'
	],
	reactions: {
		innocent:
			'Cuma pengunjung biasa. Lihat lihat toko, mungkin sekali salah ketik, nggak ada yang berulang terus.',
		found:
			'Ketemu. Alamat yang sama gagal terus menerus, lalu berhasil masuk. Saatnya kunci akun admin itu dan blokir alamatnya.'
	},
	steps: [
		{
			title: 'Si 75 sen',
			body: 'Dua sistem tagihan selisih 75 sen. Kecil, tapi artinya <b>ada orang</b> yang memakai komputer tanpa ditagih.'
		},
		{
			title: 'Log',
			body: '<b>Log</b> itu buku harian komputer. Stoll mengikutinya sekitar sepuluh bulan, sampai ke Hannover di Jerman.'
		},
		{
			title: 'Kebanyakan baris',
			body: 'Situs sibuk menulis <b>jutaan</b> baris per hari. Membaca semuanya dengan mata itu mustahil.'
		},
		{
			title: 'Sebuah pola',
			body: 'Alamat sama, akun sama, gagal berkali kali, lalu <b>sekali berhasil</b>. Bentuk itu adalah serangan brute force.'
		},
		{
			title: 'SIEM',
			body: '<b>SIEM</b> menarik log dari semua server ke satu tempat dan membunyikan <b>alert</b> kalau ada pola yang cocok.'
		},
		{
			tag: 'Info',
			title: 'Harus ada yang lihat',
			body: 'Alert yang nggak dibaca nggak melindungi siapa siapa. Tim yang baik menentukan dari awal <b>siapa</b> yang menjawab tiap alert.'
		},
		{
			tag: 'Biar nempel',
			title: 'Typo atau serangan',
			body: 'Sekali gagal itu <b>typo</b>. Berkali kali dari satu alamat itu <b>serangan</b>.'
		},
		{
			tag: 'Giliranmu',
			title: 'Ikuti satu alamat',
			body: 'Ketuk baris mana saja untuk menyalakan semua baris dari alamat yang sama.'
		}
	],
	printTitle: 'Tagihan lab, 1986',
	printGap: 'selisih tagihan $0.75',
	trail: ['Lab Berkeley', 'jalur telepon', 'Hannover, Jerman'],
	logTitle: 'log nimbus.com',
	sources: { web: 'web', shop: 'toko', auth: 'login' },
	alert: 'Alert. Banyak login gagal, lalu berhasil, dari {ip}',
	tapHint: 'Ketuk satu baris'
};
