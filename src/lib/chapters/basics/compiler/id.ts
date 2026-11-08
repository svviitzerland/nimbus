import type { CompilerText } from './types';

export const id: CompilerText = {
	title: 'Compiler dan interpreter',
	intro: [
		'CPU tidak langsung menjalankan kalimat yang kita tulis. Program perlu diterjemahkan atau dijalankan oleh program lain yang memahami bahasanya.',
		'<b>Compiler</b> menerjemahkan kode ke bentuk lain, misalnya kode mesin atau bytecode. Hasilnya bisa disimpan untuk dijalankan kemudian.',
		'<b>Interpreter</b> menjalankan instruksi melalui program penerjemah saat aplikasi berjalan. Sistem nyata sering menggabungkan kompilasi dan interpretasi.',
		'Meja ini membandingkan dua <b>model sederhana</b>. Satu menerjemahkan dahulu, satu menjalankan langkah bertahap. Waktunya diperlambat agar perbedaannya terlihat.',
		'Coba ubah print menjadi prnit. Model kiri memeriksa nama fungsi sebelum berjalan. Model kanan baru memeriksanya saat baris itu dijalankan. Ini pilihan model, bukan aturan semua bahasa.',
		'[fyi] Python bisa menemukan syntax error sebelum program berjalan. Nama fungsi yang tidak ada dapat menghasilkan NameError saat dipakai. Program hasil kompilasi pun masih bisa mengalami error saat berjalan.',
		'[ingat] <b>Compiler menghasilkan terjemahan, interpreter menjalankan instruksi.</b> Satu aplikasi bisa menggunakan keduanya.',
		'Jalankan sekali, ulangi dengan hasil terjemahan tersimpan, lalu uji nama fungsi yang salah. Bandingkan kapan model berhenti.'
	],
	reactions: {
		race: 'Di model ini, penerjemahan awal memerlukan waktu. Waktu sebenarnya bergantung pada bahasa, runtime, dan programnya. Coba jalankan lagi.',
		rerun:
			'Hasil terjemahan model kiri sudah disimpan, jadi tahap itu tidak diulang. Runtime nyata juga dapat menyimpan bytecode atau hasil optimasi dengan cara berbeda.',
		typo: 'Model pemeriksaan awal berhenti sebelum eksekusi. Model bertahap berhenti di prnit. Nama fungsi tidak ada, bukan kesalahan tanda baca.'
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
