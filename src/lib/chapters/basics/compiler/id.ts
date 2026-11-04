import type { CompilerText } from './types';

export const id: CompilerText = {
	title: 'Compiler dan interpreter',
	intro: [
		'Ini masalah besarnya. Manusia nulis kode pakai kata kata kayak print dan name, tapi komputer sama sekali nggak ngerti satu pun. Jauh di dalam, CPU cuma menjalankan [[0 dan 1|basics/binary]].',
		'Jadi sebelum apa pun bisa jalan, kodenya harus <b>diterjemahkan</b> dulu jadi 0 dan 1. Itulah alasan compiler dan interpreter ada. Dua duanya penerjemah, cuma gayanya beda.',
		'<b>Compiler</b> itu kayak penerjemah yang menerjemahkan <b>satu buku utuh dulu</b>. Kamu nunggu di awal, lalu dapat buku jadinya dan bisa baca dengan ngebut. C dan Go bekerja begini.',
		'<b>Interpreter</b> itu kayak juru bahasa yang berdiri di samping pembicara, menerjemahkan <b>kalimat per kalimat</b>. Kamu bisa langsung mulai, tapi tiap kalimat makan waktu tambahan. Python dan JavaScript biasanya bekerja begini.',
		'Yuk lihat mereka menerjemahkan program kecil yang sama, berdampingan. Compiler diam dulu, lalu ngebut. Interpreter langsung mulai, tapi jalannya santai.',
		'Sekarang ada salah ketik nyelip di baris 3. Compiler membaca semuanya sebelum apa pun jalan, jadi dia berhenti di situ dan nggak ada yang jalan sama sekali. Interpreter santai menjalankan baris baris awal, dan baru crash (berhenti karena error) waktu sampai di baris 3.',
		'Sedikit sejarah. Tahun 1952 <b>Grace Hopper</b> membuat salah satu compiler paling awal, namanya A0. Banyak orang bilang komputer cuma bisa berhitung, tapi dia yakin program sebaiknya ditulis pakai kata kata yang mirip bahasa Inggris, ide yang kemudian tumbuh jadi bahasa COBOL. Timnya bahkan pernah menemukan ngengat sungguhan nyangkut di dalam komputer Harvard Mark II tahun 1947, dan dia senang sekali menceritakan "bug" pertama yang beneran itu.',
		'Satu lagi kelebihan compiler. Hasil terjemahannya disimpan jadi file, jadi waktu dijalankan lagi nggak perlu menerjemahkan, langsung jalan. Makanya aplikasi yang kamu install biasanya hasil compile, diterjemahkan sekali di komputer pembuatnya, lalu cepat buat semua orang.',
		'[fyi] Di dunia nyata batasnya agak kabur. Java dikompilasi dulu jadi bahasa setengah jadi, lalu program pembantu (Java virtual machine) menerjemahkan sisanya sambil programnya jalan. Mesin JavaScript di browser kamu juga mencampur dua gaya ini, biar makin cepat.',
		'[ingat] Compiler itu penerjemah buku, terjemahkan semua dulu baru dibaca. Interpreter itu juru bahasa di rapat, ngomong sekalimat langsung diterjemahkan sekalimat.',
		'Kalau mau, giliran kamu. Selipkan salah ketik di baris 3 dan lihat siapa yang sadar duluan, lalu betulkan lagi.'
	],
	reactions: {
		typo: 'Compiler menangkapnya sebelum satu baris pun jalan. Interpreter sudah sempat menampilkan satu baris di layar, baru crash di baris 3. Kesalahannya sama, ketahuannya di saat yang beda jauh.',
		fixed: 'Sudah betul, dan dua duanya sampai ke akhir lagi.'
	},
	steps: [
		{
			title: 'Cuma 0 dan 1',
			body: 'CPU, otaknya komputer, cuma paham pola <b>0 dan 1</b>. Kata kayak <b>print</b> nggak ada artinya buat dia.'
		},
		{
			title: 'Penerjemahan',
			body: 'Sebuah program penerjemah mengubah kodemu jadi 0 dan 1, baru setelah itu CPU bisa menjalankannya.'
		},
		{
			title: 'Compiler',
			body: 'Menerjemahkan <b>semua baris dulu</b> lalu menyimpan hasilnya jadi file. Setelah itu file tersebut jalan cepat, tanpa menerjemahkan lagi di tengah jalan.'
		},
		{
			title: 'Interpreter',
			body: 'Ambil <b>satu baris</b>, terjemahkan, jalankan, lalu pindah ke baris berikutnya. Nggak ada yang disimpan, jadi tiap kali jalan ya diterjemahkan lagi.'
		},
		{
			title: 'Berdampingan',
			body: 'Compiler nunggu di awal, lalu ngebut. Interpreter langsung mulai, tapi bayar sedikit waktu di tiap baris.'
		},
		{
			title: 'Menangkap salah ketik',
			body: 'Compiler menemukan kesalahan <b>sebelum apa pun jalan</b>. Interpreter baru menemukannya <b>waktu sampai di situ</b>, setelah baris sebelumnya terlanjur jalan.'
		},
		{
			title: 'Grace Hopper',
			tag: 'Sejarah',
			body: 'Membuat compiler <b>A0</b> tahun 1952 dan memperjuangkan kode yang ditulis pakai kata kata mirip bahasa Inggris, yang kemudian melahirkan <b>COBOL</b>. Cerita ngengat timnya ikut bikin kata <b>bug</b> terkenal di dunia komputer.'
		},
		{
			title: 'Terjemahkan sekali',
			body: 'File yang tersimpan (di sini <b>nimbus.exe</b>) bisa jalan lagi tanpa diterjemahkan. Interpreter harus mulai dari awal tiap kali.'
		},
		{
			title: 'Campuran',
			body: 'Java dan JavaScript di browser mencampur dua gaya ini, sebagian diterjemahkan lebih awal dan sisanya sambil program jalan.'
		},
		{
			title: 'Cara ingat',
			tag: 'Cara ingat',
			body: 'Compiler itu <b>penerjemah buku</b>, semua dulu baru dibaca. Interpreter itu <b>juru bahasa di rapat</b>, sekalimat demi sekalimat.'
		}
	],
	code: ['name = "Nim"', 'print("Halo", name)', 'print(1 + 1)', 'print("Dadah")'],
	output: [null, 'Halo Nim', '2', 'Dadah'],
	typoLine: 2,
	typoCode: 'prnit(1 + 1)',
	codeLabel: 'Kode kamu',
	cpuLabel: 'CPU',
	translatorLabel: 'Penerjemah',
	compiler: { name: 'Compiler', sub: 'C, Go' },
	interpreter: { name: 'Interpreter', sub: 'Python, JavaScript' },
	fileName: 'nimbus.exe',
	screenLabel: 'Layar',
	waiting: 'Menunggu',
	compiling: 'Menerjemahkan semua baris',
	saved: 'Tersimpan, sekarang ngebut',
	reused: 'Sudah diterjemahkan, langsung jalan',
	running: 'Jalan',
	readingLine: 'Baris {n}, terjemahkan lalu jalankan',
	done: 'Selesai',
	errCompile: 'Salah ketik di baris {n}, nggak ada yang jalan',
	errInterp: 'Crash di baris {n}',
	hopper: {
		alt: 'Potret Grace Hopper dengan seragam Angkatan Laut Amerika Serikat',
		name: 'Grace Hopper',
		caption: 'Perintis komputer, 1906 sampai 1992',
		logbook: 'First actual case of bug being found.'
	},
	addTypo: 'Bikin salah ketik di baris 3',
	fixTypo: 'Betulkan salah ketiknya'
};
