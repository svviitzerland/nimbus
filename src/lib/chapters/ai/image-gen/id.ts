import type { ImageGenText } from './types';

export const id: ImageGenText = {
	title: 'AI pembuat gambar',
	intro: [
		'Kamu ketik "kucing di atas sofa", dan beberapa detik kemudian muncul gambar yang belum pernah ada sebelumnya. Jadi gimana caranya komputer <b>menggambar</b>?',
		'Anehnya, dia mulai dari <b>noise</b> (derau). Isinya kotak berisi titik titik acak, kayak semut di layar TV jadul. Nggak ada gambar yang tersembunyi di dalamnya, cuma berantakan.',
		'Waktu dilatih, model ini cuma belajar satu keahlian. Dia ditunjukkan jutaan foto yang ditaburi titik acak, lalu berlatih menebak titik mana yang merupakan noise. Kalau sudah jago, dia bisa <b>membuang</b> sedikit noise dari gambar apa pun.',
		'Sekarang jalankan kebalikannya. Mulai dari noise murni, bersihkan sedikit, lalu sedikit lagi, langkah demi langkah. Di tiap langkah model bertanya ke dirinya sendiri, titik mana yang bikin ini makin mirip prompt.',
		'<b>Prompt</b> adalah setirnya. Kata katamu diubah jadi angka (mirip [[embedding|ai/embeddings]]), dan tiap langkah pembersihan condong ke arah angka itu. Noise yang sama dengan prompt berbeda akan tumbuh jadi gambar berbeda.',
		'[fyi] Cara ini namanya <b>diffusion model</b>, ide di balik kebanyakan AI pembuat gambar sekarang. Yang asli melukis gambar besar dalam puluhan langkah di [[GPU|ai/gpu]] yang kuat. Punya kita cuma kotak mini 16 kali 16 biar kamu bisa lihat tiap titiknya.',
		'Pilih sebuah prompt, lalu bersihkan noisenya selangkah demi selangkah. Perhatikan mana yang muncul duluan, bentuk kasarnya atau detail kecilnya.'
	],
	reactions: {
		prompt:
			'Prompt sudah dipilih. Tapi kanvasnya masih noise murni, belum ada yang digambar. Ayo mulai bersihkan.',
		step: 'Satu langkah selesai. Susah kelihatan ya? Tiap langkah cuma membuang sedikit noise.',
		shapes:
			'Nah! Gumpalan warna besar mulai muncul. Diffusion selalu menentukan tata letak kasarnya dulu, di mana langitnya dan di mana tanahnya.',
		details:
			'Sekarang bagian kecilnya makin tajam. Tepian, mata, jendela. Detail selalu datang paling akhir.',
		clean:
			'Bersih! Gambar baru dari noise murni, selangkah kecil demi selangkah kecil. Coba noise baru, atau ganti promptnya.',
		seed: 'Noise baru, prompt sama, dan gambarnya keluar sedikit beda. Noise awal itu namanya <b>seed</b>, makanya membuat gambar dua kali nggak pernah menghasilkan gambar yang persis sama.',
		reprompt:
			'Noise sama, prompt beda, gambarnya beda total. Prompt yang menyetir setiap langkahnya.'
	},
	promptLabel: 'Prompt',
	prompts: ['awan di atas gunung', 'kucing oranye', 'rumah kecil'],
	pickPrompt: 'Pilih prompt di bawah',
	stepBtn: 'Bersihkan satu langkah',
	autoBtn: 'Bersihkan semua',
	seedBtn: 'Noise baru',
	stepLabel: 'Langkah {n} dari {total}',
	noiseLabel: 'Sisa noise {n}%',
	sliderLabel: 'Langkah pembersihan',
	canvasLabel: 'Gambar yang sedang dibuat',
	phase: {
		noise: 'Noise murni, belum ada gambar',
		shapes: 'Bentuk kasar mulai terbentuk',
		details: 'Detail kecil makin tajam',
		done: 'Gambar sudah jadi'
	}
};
