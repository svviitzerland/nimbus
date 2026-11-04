import type { GpuText } from './types';

export const id: GpuText = {
	title: 'GPU untuk AI',
	intro: [
		'Masih ingat cara [[neural network|ai/neural-net]] menebak? Di balik layar, itu tumpukan raksasa perkalian kecil, kayak 3 × 4, diulang terus. Chatbot melakukan miliaran perkalian begitu untuk setiap kata. Pasti ada yang harus mengerjakan semua hitungan itu.',
		'Otak utama komputer biasanya [[CPU|basics/hardware]]. Di dalamnya ada beberapa <b>core</b>, dan satu core itu satu pekerja yang mengerjakan satu tugas dalam satu waktu. Core CPU itu besar, pintar, dan cepat banget, cocok buat tugas yang rumit.',
		'<b>GPU</b> (graphics processing unit) awalnya dibuat buat game. Layar punya jutaan piksel, dan tiap piksel butuh hitungan kecilnya sendiri berkali kali tiap detik, jadi GPU diisi <b>ribuan core mungil</b> yang kerja di saat yang sama.',
		'Sekarang kita adu mereka di tumpukan hitungan kecil. Core CPU memang gesit, tapi cuma empat, jadi tumpukannya dikerjakan sedikit demi sedikit. GPU membagi satu hitungan ke tiap core mungilnya, dan seluruh tumpukan beres sekali jalan.',
		'[ingat] CPU itu beberapa profesor, GPU itu satu stadion penuh anak sekolah. Satu soal sulit? Tanya profesor. Sejuta soal gampang sekaligus? Stadion yang menang. Sedikit tapi pintar itu CPU, banyak tapi sederhana itu GPU.',
		'Itulah kenapa AI cinta GPU. Neural network sebagian besar isinya tumpukan hitungan kecil yang nggak saling menunggu. Sekitar tahun 2012 para peneliti melatih model pengenal gambar yang terkenal pakai GPU, dan sejak itu AI langsung melesat.',
		'[fyi] Begitulah NVIDIA, perusahaan yang dulu dikenal karena kartu grafis buat game, jadi salah satu perusahaan paling bernilai di dunia. Kebanyakan tim nggak beli GPU sama sekali, mereka sewa per jam di [[cloud|ai/ai-cloud]].',
		'Satu kejutan lagi, kalau penasaran. Ganti tugasnya jadi rantai langkah, di mana tiap langkah butuh jawaban langkah sebelumnya, terus lihat siapa yang menang.'
	],
	reactions: {
		chain:
			'Kali ini CPU yang menang! Tiap langkah butuh langkah sebelumnya, jadi cuma satu pekerja yang bisa jalan. Stadionnya cuma bisa nunggu, dan satu core mungil kalah cepat dari profesor.',
		pile: 'Balik ke tumpukan hitungan gampang, dan stadionnya menang lagi. Tiap komputer AI punya keduanya, CPU buat kerjaan langkah demi langkah dan GPU buat tumpukan hitungan raksasa.'
	},
	panels: [
		{
			tag: 'Pekerjaannya',
			title: 'Tumpukan hitungan kecil',
			body: 'Tiap kotak adalah satu perkalian kecil. AI butuh jutaan perkalian begini untuk tiap jawaban, dan kebanyakan nggak saling bergantung.'
		},
		{
			tag: 'CPU',
			title: 'Beberapa core besar',
			body: '<b>CPU</b> punya sedikit core yang kuat dan cepat. Jago mengerjakan tugas sulit yang langkah demi langkah, sekaligus menjalankan semua hal lain di komputer.'
		},
		{
			tag: 'GPU',
			title: 'Ribuan core mungil',
			body: '<b>GPU</b> punya ribuan core kecil yang sederhana. Masing masing lebih lambat, tapi semuanya kerja di saat yang persis sama.'
		},
		{
			tag: 'Balapan',
			title: 'Banyak hitungan kecil',
			body: 'CPU membereskan tumpukannya empat hitungan sekali jalan. GPU memberi tiap core satu hitungan, jadi tumpukannya habis dalam satu putaran.'
		},
		{
			tag: 'Cara ingat',
			title: 'Profesor dan stadion',
			body: 'Beberapa profesor jenius lawan satu stadion anak sekolah. Hitungan gampang dalam jumlah banyak? Serahkan ke stadion.'
		},
		{
			tag: 'Coba',
			title: 'Rantai langkah',
			body: 'Kalau tiap langkah butuh jawaban sebelumnya, cuma satu pekerja yang bisa jalan, dan profesor yang gesit menang.'
		}
	],
	cpuName: 'CPU',
	cpuSub: 'beberapa core besar',
	gpuName: 'GPU',
	gpuSub: 'ribuan core mungil',
	cpuNick: 'beberapa profesor',
	gpuNick: 'satu stadion anak sekolah',
	jobs: {
		pile: 'Banyak hitungan kecil, nggak ada yang saling menunggu',
		chain: 'Rantai langkah, tiap langkah butuh langkah sebelumnya'
	},
	ready: 'Siap',
	working: 'Bekerja',
	doneIn: 'Beres dalam {s} detik',
	rule: 'Sulit dan berurutan, kasih ke CPU. Gampang dan banyak, kasih ke GPU.',
	switchJob: {
		pile: 'Ganti ke rantai langkah',
		chain: 'Balik ke tumpukan hitungan'
	}
};
