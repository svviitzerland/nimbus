import type { ExperimentText } from '../../types';

export const id: ExperimentText = {
	title: 'Apa itu data center',
	intro: [
		'Server itu komputer. Kalau jumlahnya ratusan, mereka tinggal di mana? Di <b>data center</b>, atau pusat data, bangunan yang disiapkan agar komputer bisa bekerja terus.',
		'Lihat lemari tinggi di gedung ini. Itu <b>rak</b>. Di dalamnya ada server, perangkat penyimpanan, dan perangkat jaringan. Kabel menghubungkan mereka ke satu sama lain dan ke internet.',
		'Padamkan listrik utama. Server masih hidup karena <b>UPS</b>, baterai yang mengambil alih seketika. Cadangannya terbatas. Majukan waktu untuk melihat baterai berkurang.',
		'<b>Generator</b> menyediakan listrik lebih lama selama bahan bakarnya cukup. UPS menjembatani jeda sebelum generator siap. Nyalakan generator sebelum baterainya habis.',
		'Server juga menghasilkan panas. Matikan pendingin lalu majukan waktu. Di simulasi ini, suhu tinggi menghentikan server. Kabel internet yang putus juga bisa membuat situs tak terjangkau meski server masih menyala.',
		'[ingat] <b>Komputasi membutuhkan fasilitas.</b> Server memproses data, jaringan membawa data, dan pusat data menyediakan listrik, pendingin, serta pengamanan fisik.',
		'Menyewa [[cloud|cloud/cloud]] berarti memakai sumber daya di pusat data milik penyedia. [[Region|cloud/region]] adalah kawasan geografis. Satu [[availability zone|resilience/availability-zone]] dapat terdiri dari satu atau beberapa pusat data.'
	],
	reactions: {
		ups: 'Listrik utama mati, tapi UPS langsung mengambil alih. Coba majukan waktu. Baterai memberi waktu untuk bertindak, bukan listrik tanpa batas.',
		generator:
			'Generator menyuplai listrik. UPS bisa diisi kembali, sementara server tetap bekerja.',
		blackout:
			'UPS habis dan belum ada sumber pengganti. Server ikut mati. Pulihkan listrik utama atau nyalakan generator.',
		cooling:
			'Pendinginnya berhenti. Server masih bekerja sekarang, tapi panas mulai terkumpul. Majukan waktu untuk melihat akibatnya.',
		hot: 'Panasnya melewati batas simulasi. Nyalakan pendingin dan majukan waktu supaya suhu turun.',
		network:
			'Rak masih menyala, tapi pengunjung tidak bisa menjangkaunya. Daya hidup dan koneksi internet adalah dua hal berbeda.',
		recovered:
			'Situs kembali bisa dibuka. Kamu memperbaiki penyebab gangguannya, bukan cuma menyalakan ulang browser.',
		running:
			'Sumber listrik, pendingin, dan jaringan sedang bekerja bersama. Coba ubah satu bagian dan amati hasilnya.'
	},
	labLabel: 'Percobaanmu',
	goal: 'Jaga nimbus.com tetap menyala',
	tasks: [
		'Coba listrik cadangan',
		'Nyalakan generator',
		'Temukan penyebab gangguan',
		'Pulihkan situs'
	],
	hintLabel: 'Petunjuk',
	hint: 'Matikan listrik utama, majukan waktu sekali, lalu nyalakan generator. Uji pendingin atau jaringan secara terpisah, kemudian pulihkan.',
	scope:
		'Model sederhana. Kapasitas UPS, kenaikan suhu, dan batas 50 °C dibuat untuk percobaan, bukan angka perancangan pusat data.',
	labels: {
		mains: 'Listrik utama',
		generator: 'Generator',
		cooling: 'Pendingin',
		network: 'Jaringan',
		on: 'nyala',
		off: 'mati',
		advance: 'Majukan 5 menit',
		building: 'Pusat data Nimbus',
		minutes: 'menit',
		rack: 'Rak',
		temperature: 'Suhu ruangan',
		floor: 'Rak, kabel, listrik, dan pendingin dalam satu gedung',
		online: 'nimbus.com dapat dibuka',
		offline: 'Situs tidak terjangkau',
		noPower: 'Semua sumber listrik habis atau mati.',
		tooHot: 'Suhu terlalu tinggi untuk model server ini.',
		noNetwork: 'Server hidup, jalur internet terputus.',
		serving: 'Permintaan pengunjung sampai ke server dan mendapat balasan.'
	}
};
