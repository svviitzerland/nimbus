import type { CompilerText } from './types';

export const id: CompilerText = {
	title: 'Compiler dan interpreter',
	intro: [
		'Ingat masalah besarnya? Manusia nulis kode pakai bahasa yang ramah, tapi komputer sama sekali nggak ngerti. CPU cuma menjalankan [[0 dan 1|basics/binary]]. Jadi harus ada yang <b>menerjemahkan</b>.',
		'Penerjemah itu juga sebuah program, dan ada dua gaya. Bayangkan sebuah buku yang ditulis dalam bahasa yang nggak bisa kamu baca.',
		'<b>Compiler</b> menerjemahkan <b>seluruh buku dulu</b>, baru menyerahkan hasil terjemahannya. Kamu nunggu di awal, tapi setelah itu bacanya ngebut, dan bisa dibaca ulang kapan aja tanpa diterjemahkan lagi. C, Go, dan Rust bekerja begini.',
		'<b>Interpreter</b> duduk di sebelahmu dan menerjemahkan <b>satu kalimat per kalimat</b> sambil kamu baca. Kamu bisa langsung mulai, tapi tiap kalimat makan waktu tambahan. Python dan JavaScript biasanya bekerja begini.',
		'Ada satu beda lagi, soal kesalahan. Compiler membaca semuanya sebelum apa pun jalan, jadi salah ketik ketahuan dari awal. Interpreter baru menemukan salah ketik waktu sampai di baris itu, padahal baris sebelumnya sudah terlanjur jalan.',
		'[fyi] Di dunia nyata batasnya agak kabur. Java dan C# dikompilasi dulu jadi bahasa setengah jadi, lalu sebuah mesin virtual menerjemahkan sisanya sambil programnya jalan. Mesin JavaScript modern di browser kamu juga mencampur dua cara ini, biar makin cepat.',
		'Ini satu program kecil dan dua penerjemah. Jalankan berdampingan, jalankan lagi, lalu selipkan salah ketik di baris 5 dan lihat siapa yang sadar duluan.'
	],
	reactions: {
		race: 'Lihat kan? Compiler bikin kamu nunggu selagi dia menerjemahkan semuanya, lalu ngebut. Interpreter langsung mulai tapi jalannya santai, menerjemahkan tiap baris sambil jalan. Sekarang coba jalankan lagi.',
		rerun:
			'Kali ini compiler nggak menerjemahkan apa apa, file hasil terjemahannya sudah tersimpan, jadi langsung jalan. Makanya aplikasi yang kamu install biasanya hasil compile, diterjemahkan sekali di komputer pembuatnya, lalu cepat buat semua orang.',
		typo: 'Compiler menangkap salah ketiknya sebelum satu baris pun jalan. Interpreter santai menjalankan baris 1 sampai 4, sempat menampilkan tulisan di layar, dan baru crash waktu sampai di baris 5. Kesalahannya sama, ketahuannya di saat yang beda jauh.'
	},
	code: [
		'name = "Nimbus"',
		'visitors = 120',
		'visitors = visitors + 1',
		'print("Halo,", name)',
		'print(visitors)',
		'print("Dadah!")'
	],
	output: [null, null, null, 'Halo, Nimbus', '121', 'Dadah!'],
	typoLine: 4,
	typoCode: 'prnit(visitors)',
	compiler: { name: 'Compiler', sub: 'terjemahkan semua dulu' },
	interpreter: { name: 'Interpreter', sub: 'terjemahkan baris per baris' },
	run: 'Jalankan keduanya',
	runAgain: 'Jalankan lagi',
	addTypo: 'Bikin salah ketik di baris 5',
	fixTypo: 'Betulkan salah ketiknya',
	compiling: 'Menerjemahkan seluruh program',
	ready: 'Sudah diterjemahkan, disimpan jadi nimbus.exe',
	reused: 'Sudah diterjemahkan, langsung jalankan nimbus.exe',
	readingLine: 'Menerjemahkan baris {n}, lalu menjalankannya',
	finishedIn: 'Selesai dalam {s} detik',
	errCompile: 'Salah ketik ketahuan di baris {n}, nggak ada yang jalan',
	errInterp: 'Crash di baris {n}, baris di atasnya sudah terlanjur jalan',
	screenLabel: 'Layar',
	waiting: 'belum ada apa apa',
	noteIdle: 'Siap kapan aja'
};
