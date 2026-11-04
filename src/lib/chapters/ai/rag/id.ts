import type { RagText } from './types';

export const id: RagText = {
	title: 'Apa itu RAG',
	intro: [
		'Ini chat bantuan nimbus.com. Seorang pelanggan bayar hosting 20 hari yang lalu, dan dia nanya apakah masih bisa refund. Sebuah chatbot siap menjawab.',
		'Dia langsung jawab, yakin banget. Bisa, 30 hari, aman! Padahal bot ini belum pernah lihat kebijakan refund nimbus.com. Dia belajar dari internet publik, jadi dia cuma bilang apa yang biasanya dibilang kebanyakan situs.',
		'Kebijakan aslinya bilang 14 hari, jadi jawabannya salah. Kalau [[LLM|ai/llm]] nggak tahu sesuatu, dia tetap menebak kata kata yang paling mungkin dan mengarang jawaban yang kedengarannya benar. Ini namanya <b>halusinasi</b>.',
		'Solusinya namanya <b>RAG</b>, singkatan dari retrieval augmented generation. Namanya keren, idenya sederhana. Sebelum menjawab, bot <b>mencari</b> dulu di dokumen milikmu, potongan mana yang paling cocok dengan pertanyaannya. Pencariannya pakai [[embedding|ai/embeddings]], jadi yang dicocokkan maknanya, bukan kata yang persis sama.',
		'Gimana pencariannya bekerja? Pertama, tiap dokumen dipotong jadi bagian kecil bernama <b>chunk</b>, beberapa kalimat saja. Tiap chunk diubah jadi [[embedding|ai/embeddings]], deretan angka untuk maknanya, lalu disimpan di <b>vector database</b>. Pertanyaannya juga jadi angka, dan database itu mengembalikan chunk yang paling dekat.',
		'Yang paling cocok, kebijakan refund, ditempelkan ke prompt tepat di sebelah pertanyaannya. Sekarang model nggak menjawab dari ingatan lagi. Dia membaca halaman yang ada di depannya.',
		'Dan sekarang jawabannya benar. Maaf, refund cuma berlaku dalam 14 hari. Dia bahkan menunjukkan asal jawabannya, jadi siapa pun bisa mengecek.',
		'[ingat] RAG mengubah ujian tutup buku jadi ujian buka buku. Tanpa RAG, AI menjawab dari ingatan dan kadang ngarang. Dengan RAG, AI buka bukunya dulu, baru menjawab.',
		'[fyi] Bagian terbaiknya, kalau kebijakannya berubah kamu nggak perlu melatih ulang apa pun. Cukup edit dokumennya. Makanya kebanyakan chatbot customer service sekarang dibangun pakai RAG.',
		'Mau lihat buktinya? Ubah kebijakan refundnya dan lihat bot itu mencari lagi. Ini opsional kok.'
	],
	reactions: {
		longer:
			'Kebijakannya diubah jadi 30 hari, dan bot menemukan halaman barunya lalu mengganti jawabannya. Tanpa melatih ulang, cuma dokumennya yang beda.',
		shorter:
			'Balik ke 14 hari, dan jawabannya langsung ikut. Dengan RAG, menjaga AI tetap up to date semudah mengedit satu halaman.'
	},
	panels: [
		{
			tag: 'Pertanyaannya',
			title: 'Pelanggan bertanya',
			body: 'Chat bantuan di nimbus.com dijalankan oleh LLM. Pelanggannya butuh fakta yang cuma nimbus.com yang tahu.'
		},
		{
			tag: 'Dari ingatan',
			title: 'Tebakan yang pede',
			body: 'Model menjawab dari yang dia pelajari waktu dilatih. Dia nggak pernah lihat dokumen nimbus.com, jadi bagian yang kosong diisi jawaban yang umum.'
		},
		{
			tag: 'Halusinasi',
			title: 'Kedengarannya benar, ternyata salah',
			body: '<b>Halusinasi</b> itu jawaban karangan yang terdengar meyakinkan. Modelnya bukan sengaja bohong, dia cuma menebak kata yang paling mungkin.'
		},
		{
			tag: 'Retrieve',
			title: 'Cari dulu',
			body: 'Pertanyaannya dibandingkan dengan tiap dokumen. Masing masing dapat skor kecocokan, dan yang maknanya paling dekat menang.'
		},
		{
			tag: 'Chunk',
			title: 'Potong, jadikan angka, simpan',
			body: 'Tiap halaman dipotong jadi chunk kecil, dan tiap chunk dapat embedding sendiri. Vector database menaruh makna yang mirip saling berdekatan, jadi chunk yang paling dekat dengan pertanyaan menang.'
		},
		{
			tag: 'Augment',
			title: 'Tempel ke prompt',
			body: 'Dokumen pemenangnya dimasukkan ke prompt bareng pertanyaannya, jadi model bisa membacanya.'
		},
		{
			tag: 'Generate',
			title: 'Jawab dari halamannya',
			body: 'Model menulis jawaban dari dokumen yang ada di depannya, lalu menunjukkan sumbernya.'
		},
		{
			tag: 'Biar nempel',
			title: 'Ujian buka buku',
			body: 'Tanpa RAG, AI ikut ujian tutup buku. Dengan RAG, dia boleh buka buku dulu.'
		},
		{
			tag: 'Coba',
			title: 'Edit dokumennya',
			body: 'Ubah kebijakannya lalu tanya lagi. Bot membaca halaman baru, tanpa perlu dilatih ulang.'
		}
	],
	picture:
		'Chat bantuan yang menjawab dari ingatan, lalu mencari kebijakan refund dan menjawab ulang',
	appTitle: 'bantuan nimbus.com',
	you: 'Pelanggan',
	ai: 'Bot bantuan',
	question: 'Aku bayar hosting 20 hari lalu. Masih bisa refund nggak?',
	wrongAnswer:
		'Bisa dong! Kebanyakan perusahaan hosting kasih garansi uang kembali 30 hari, jadi kamu masih aman.',
	answerNo:
		'Maaf, sudah lewat. nimbus.com cuma refund dalam {days} hari sejak pembayaran. Sisa masa aktifmu bisa diubah jadi saldo akun.',
	answerYes: 'Bisa! nimbus.com refund dalam {days} hari sejak pembayaran, dan 20 hari masih masuk.',
	fromMemory: 'dari ingatan',
	source: 'dari {doc}',
	madeUp: 'Karangan',
	shelfTitle: 'Dokumen nimbus.com',
	unseen: 'Bot sendirian nggak bisa lihat ini',
	searching: 'Mencari di dokumen',
	match: '{n}% cocok',
	readsTitle: 'Yang dibaca model',
	chunkTitle: 'Dokumen dipotong jadi chunk',
	dbTitle: 'Vector database',
	questionDot: 'pertanyaan',
	docs: {
		refund: {
			title: 'Kebijakan refund',
			body: 'Refund penuh dalam {days} hari sejak pembayaran. Sesudah itu, sisa masa aktif jadi saldo akun.'
		},
		pricing: {
			title: 'Harga',
			body: 'Hosting mulai Rp 25.000 sebulan. Bayar tahunan, gratis dua bulan.'
		},
		contact: {
			title: 'Kontak',
			body: 'Chat kami dari dashboard, Senin sampai Jumat jam 9 sampai 17.'
		},
		about: {
			title: 'Tentang nimbus',
			body: 'Penyedia cloud kecil yang ramah, dijalankan Nim dan kawan kawan.'
		}
	},
	closedBook: 'Dari ingatan',
	openBook: 'Cari dulu',
	rule: 'Tutup buku menebak, buka buku mengecek',
	editBtn: 'Ubah kebijakan jadi {days} hari'
};
