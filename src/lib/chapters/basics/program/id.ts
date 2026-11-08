import type { ProgramText } from './types';

export const id: ProgramText = {
	title: 'Apa itu program',
	intro: [
		'Semua aplikasi di HP kamu, semua game, bahkan halaman yang lagi kamu baca ini, adalah <b>program</b>. Dan program itu sebenarnya cuma <b>daftar langkah</b> yang diikuti komputer, satu per satu.',
		'Komputer itu cepat banget, tapi sama sekali nggak punya akal sehat. Dia melakukan <b>persis</b> apa yang tertulis, sesuai urutannya, nggak lebih. Dia nggak pernah nebak maksud kamu.',
		'Minta teman bikinin teh, dia pasti tahu airnya harus direbus dulu. Kasih tugas yang sama ke komputer, lupa satu langkah aja, dia bakal santai menuang air dingin ke teh celup lalu menyebutnya teh.',
		'Kalau program melakukan hal konyol kayak gitu, orang menyebutnya <b>bug</b>. Biasanya komputernya nggak rusak sama sekali, langkahnya yang salah. Mencari langkah yang salah lalu membetulkannya disebut <b>debugging</b>.',
		'[fyi] Kata yang sama, dunia yang beda. Program TV atau susunan acara nikahan juga daftar hal yang terjadi berurutan. Program komputer itu idenya sama, cuma ditulis buat mesin yang menganggap tiap kata secara harfiah.',
		'CPU menjalankan instruksi mesin yang tersimpan sebagai [[bit|basics/binary]]. Bahasa yang kita tulis perlu diterjemahkan atau dijalankan oleh program lain agar CPU dapat mengerjakannya.',
		'[ingat] Urutan menentukan langkah berikutnya, kondisi memilih cabang, dan loop mengulang langkah selama syaratnya terpenuhi.',
		'Nim sudah nulis program bikin teh, tapi ada yang aneh. Jalankan, lihat Nim mengikuti tiap baris apa adanya, lalu betulkan langkahnya (tambah, pindah, atau hapus) sampai jadi secangkir teh yang beneran.'
	],
	reactions: {
		spill:
			'Byur! Programnya bilang tuang, jadi Nim menuang, langsung ke meja, soalnya nggak ada langkah yang bilang ambil gelas. Komputer nggak mikir, dia cuma ngikutin baris.',
		empty:
			'Program selesai, tetapi gelas masih kosong karena tidak ada instruksi menuang. Ini kesalahan logika, program bisa berjalan tanpa menghasilkan tujuan yang dimaksud.',
		plain:
			'Itu cuma air panas. Coba lihat langkahnya, nggak ada baris yang memasukkan teh celup ke gelas. Manusia pasti sadar, komputer nggak akan pernah.',
		cold: 'Yah, teh dingin. Airnya masuk gelas sebelum direbus, karena memang begitu urutan barisnya. Langkahnya sama, urutannya salah, hasilnya beda total. Coba pindahkan satu baris.',
		tea: 'Teh selesai dibuat. Semua langkah yang diperlukan sudah ada dan urutannya menghasilkan minuman yang diminta.'
	},
	programLabel: 'Program teh buatan Nim',
	paletteLabel: 'Langkah yang bisa ditambah',
	emptyProgram: 'Belum ada langkah, tambahkan dari bawah',
	steps: {
		cup: 'Ambil gelas',
		boil: 'Rebus air',
		bag: 'Masukkan teh celup ke gelas',
		pour: 'Tuang air ke gelas',
		stir: 'Aduk'
	},
	run: 'Jalankan program',
	running: 'Lagi jalan',
	reset: 'Ulang dari awal',
	moveUp: 'Naikkan',
	moveDown: 'Turunkan',
	remove: 'Hapus',
	noteIdle: 'Nim siap di dapur, tinggal ikuti langkahnya',
	noteLine: 'Baris {n}, Nim melakukan persis ini',
	notes: {
		spill: 'Airnya tumpah ke meja',
		empty: 'Gelasnya tetap kosong',
		plain: 'Air panas, tanpa teh',
		cold: 'Air dingin dengan teh celup yang lembek',
		tea: 'Secangkir teh panas'
	},
	cupTag: 'gelas',
	tableTag: 'meja'
};
