import type { RagText } from './types';

export const id: RagText = {
	title: 'Apa itu RAG',
	intro: [
		'Model pada contoh ini belum mendapat kebijakan refund nimbus.com. Jika langsung ditanya, ia bisa memberi jawaban yang tidak sesuai dokumen perusahaan.',
		'Kalau [[LLM|ai/llm]] nggak tahu, dia tetap menebak token berikutnya yang paling mungkin, jadi dia mengarang jawaban yang terdengar benar. Ini namanya <b>halusinasi</b>, salah satu masalah terbesar AI.',
		'<b>RAG</b>, retrieval augmented generation, menambahkan tahap pencarian sebelum model menjawab. Sistem mengambil potongan dokumen yang relevan lalu memasukkannya ke konteks bersama pertanyaan.',
		'Pencariannya biasanya pakai [[embedding|ai/embeddings]]. Pertanyaan dan tiap dokumen diubah jadi angka, dan yang paling dekat menang. Lalu model menjawab dari halaman di depannya, mirip ujian open book.',
		'[fyi] Dokumen RAG dapat diperbarui tanpa melatih ulang model. Indeks pencariannya juga perlu diperbarui agar mengambil versi yang benar. Dokumen yang keliru tetap dapat menghasilkan jawaban keliru.',
		'[ingat] <b>Cari sumber, beri konteks, periksa jawaban.</b> RAG menyediakan bahan rujukan, tetapi tidak otomatis menghilangkan halusinasi.',
		'Tanyakan soal refund dua kali, sekali ke model saja dan sekali pakai dokumen. Lalu coba ubah jumlah hari refund di kebijakannya dan tanya lagi.'
	],
	reactions: {
		plain_refund:
			'Kedengarannya yakin kan? Padahal dia nggak pernah baca kebijakan nimbus.com, dia cuma menebak yang biasanya dibilang situs lain. Itulah halusinasi, jawaban yang meyakinkan tanpa dasar apa apa.',
		plain_support:
			'Hotline 24 jam? nimbus.com sama sekali nggak punya nomor telepon. Modelnya mengisi kekosongan dengan sesuatu yang kedengarannya benar, dan dia santai saja mengarahkan pelanggan ke nomor yang nggak ada.',
		rag_refund:
			'Kali ini dia mencari dulu, menemukan Kebijakan refund, lalu menjawab dari situ. Lihat label sumber kecilnya? Kamu bisa cek persis dari mana jawabannya berasal.',
		rag_support:
			'Pencarian mengambil halaman Kontak, lalu jawaban mengikuti informasi pada halaman itu. Periksa kutipan sumber untuk memastikan jawabannya sesuai.',
		edit: 'Kebijakannya diperbarui. Model saja nggak akan sadar, dia nggak bisa lihat halaman ini. Tanya lagi pakai dokumen dan lihat hasilnya.',
		edit_rag:
			'Kamu mengubah dokumennya dan jawabannya ikut berubah, tanpa melatih ulang sama sekali. Dengan RAG, menjaga AI tetap update semudah mengedit satu halaman.'
	},
	appTitle: 'Bantuan nimbus.com',
	modePlain: 'Model saja',
	modeRag: 'Pakai dokumen',
	askBtn: 'Tanya',
	searching: 'Mencari di dokumen nimbus.com',
	you: 'Kamu',
	ai: 'AI',
	source: 'dari {doc}',
	noSource: 'tanpa sumber',
	shelfTitle: 'Dokumen nimbus.com',
	unseen: 'Model saja nggak bisa melihat ini',
	attached: 'ditempel',
	match: '{n}% cocok',
	daysLabel: 'Batas refund dalam hari',
	fewer: 'Kurangi hari',
	more: 'Tambah hari',
	docs: {
		refund: {
			title: 'Kebijakan refund',
			body: 'Uang kembali penuh dalam {days} hari setelah bayar. Lewat dari itu, sisa waktunya jadi saldo akun.'
		},
		pricing: {
			title: 'Harga',
			body: 'Hosting mulai Rp 25.000 per bulan. Bayar tahunan dapat gratis dua bulan.'
		},
		contact: {
			title: 'Kontak',
			body: 'Chat kami lewat gelembung di dashboard, hari kerja pukul 09.00 sampai 17.00. Kami nggak punya nomor telepon.'
		},
		about: {
			title: 'Tentang nimbus',
			body: 'Penyedia cloud kecil yang ramah, dijalankan Nim dan teman teman sejak 2024.'
		}
	},
	questions: {
		refund: {
			chip: 'Refund setelah 20 hari?',
			ask: 'Aku bayar hosting nimbus.com 20 hari lalu. Masih bisa refund nggak?',
			plain:
				'Bisa dong! Kebanyakan penyedia hosting kasih garansi uang kembali 30 hari, jadi kamu masih aman.',
			rag: 'Maaf, nggak bisa. nimbus.com cuma memberi refund dalam {days} hari setelah pembayaran. Lewat dari itu, sisa waktumu diubah jadi saldo akun.'
		},
		support: {
			chip: 'Cara hubungi support?',
			ask: 'Gimana cara menghubungi support nimbus.com?',
			plain:
				'Telepon saja hotline 24 jam mereka, atau kirim email ke tim support dan mereka akan membalas dalam sehari.',
			rag: 'Buka gelembung chat di dashboard nimbus.com kamu. Timnya siap di hari kerja pukul 09.00 sampai 17.00. Nggak ada nomor telepon.'
		}
	},
	refundYes:
		'Bisa! nimbus.com memberi refund dalam {days} hari setelah pembayaran, dan 20 hari masih masuk. Kamu bisa ajukan dari halaman tagihan.'
};
