import type { ImageGenText } from './types';

export const id: ImageGenText = {
	title: 'AI pembuat gambar',
	intro: [
		'Kamu ketik "awan di atas gunung", dan beberapa detik kemudian muncul gambar yang belum pernah ada sebelumnya. Jadi gimana caranya komputer <b>menggambar</b>?',
		'Anehnya, dia mulai dari <b>noise</b> (derau). Isinya kotak berisi titik titik acak, kayak semut di layar TV jadul. Nggak ada gambar yang tersembunyi di dalamnya, cuma berantakan.',
		'Waktu dilatih, model ini cuma belajar satu keahlian. Dia ditunjukkan jutaan foto yang ditaburi titik acak, lalu berlatih menebak titik mana yang merupakan noise.',
		'Sekarang jalankan kebalikannya. Mulai dari noise murni, bersihkan sedikit, lalu sedikit lagi, langkah demi langkah. Perhatikan, bentuk kasarnya muncul duluan, di mana langitnya dan di mana gunungnya.',
		'Baru di akhir detail kecilnya makin tajam, salju di puncak, tepian awannya.',
		'<b>Prompt</b> adalah setirnya. Kata katamu diubah jadi angka (mirip [[embedding|ai/embeddings]]), dan tiap langkah pembersihan condong ke arah angka itu.',
		'[ingat] AI pembuat gambar itu pemahat, bukan pelukis. Mulai dari bongkahan noise, lalu pahat semua yang nggak mirip promptmu.',
		'[fyi] Cara ini namanya <b>diffusion model</b>. Yang asli melukis gambar besar dalam puluhan langkah di [[GPU|ai/gpu]] yang kuat. Tiap kali jalan, dia mulai dari noise acak baru yang disebut <b>seed</b>, makanya prompt yang sama nggak pernah menghasilkan gambar yang persis sama.',
		'Kalau mau, pilih prompt lain dan lihat noise yang sama tumbuh jadi gambar yang beda sama sekali. Ini opsional kok.'
	],
	reactions: {
		reprompt: 'Noise sama, prompt beda, gambarnya beda total. Prompt menyetir setiap langkah.'
	},
	panels: [
		{
			tag: 'Prompt',
			title: 'Kata masuk, gambar keluar',
			body: 'Kamu jelaskan gambarnya pakai kata kata biasa. Beberapa detik kemudian muncul gambar yang benar benar baru.'
		},
		{
			tag: 'Noise',
			title: 'Semut TV',
			body: 'Setiap gambar dimulai dari titik warna acak. <b>Belum ada</b> apa apa di dalamnya.'
		},
		{
			tag: 'Latihan',
			title: 'Belajar mengenali noise',
			body: 'Ambil foto asli, taburi noise, lalu suruh model menebak noisenya. Ulangi jutaan kali.'
		},
		{
			tag: 'Membersihkan',
			title: 'Bentuk kasar dulu',
			body: 'Tiap langkah membuang sedikit noise. Gumpalan warna besar muncul lebih awal, itulah tata letak gambarnya.'
		},
		{
			tag: 'Membersihkan',
			title: 'Detail paling akhir',
			body: 'Langkah langkah terakhir menajamkan bagian kecil, tepian, salju, garis awan.'
		},
		{
			tag: 'Menyetir',
			title: 'Prompt memandu tiap langkah',
			body: 'Kata katamu jadi angka. Di tiap langkah model bertanya titik mana yang bikin gambar ini makin mirip <b>kata itu</b>.'
		},
		{
			tag: 'Cara ingat',
			title: 'Pemahat',
			body: 'Mulai dari bongkahan noise, pahat yang bukan bagiannya. Yang tersisa itulah gambarnya.'
		},
		{
			tag: 'Perlu tahu',
			title: 'Seed',
			body: 'Noise baru, prompt sama, gambarnya sedikit beda. Noise awal itu disebut <b>seed</b>.'
		},
		{
			tag: 'Coba',
			title: 'Ganti promptnya',
			body: 'Noise awal sama, prompt lain. Lihat gambar berbeda tumbuh dari kekacauan yang sama.'
		}
	],
	picture:
		'Aplikasi pembuat gambar dengan kolom prompt di atas dan kanvas kotak kecil berisi titik warna yang pelan pelan berubah dari noise acak menjadi gambar.',
	prompts: ['awan di atas gunung', 'kucing oranye', 'rumah kecil'],
	generate: 'Buat',
	stepLabel: 'Langkah {n} dari {total}',
	noiseCaption: 'Noise murni',
	trainCaption: 'Foto latihan, ditaburi noise',
	shapesCaption: 'Bentuk kasar',
	detailsCaption: 'Detail halus',
	seedLabel: 'Seed {n}',
	memo: 'pemahat',
	rule: 'Mulai dari noise, pahat yang bukan bagiannya',
	tryLabel: 'Pilih prompt'
};
