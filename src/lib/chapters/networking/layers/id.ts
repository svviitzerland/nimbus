import type { LayersText } from '../types';

export const id: LayersText = {
	title: 'Lapisan dan paket',
	intro: [
		'Kamu mau lihat halaman produk nimbus. Tapi halamannya tersimpan di komputer nimbus yang jauh di sana, kita sebut server. Jadi HP-mu menulis pesan kecil, minta halaman itu, dan pesan inilah yang kita antar ke server.',
		'Sebelum berangkat, pesannya [[dikunci|networking/encryption]] dulu. Tulisan yang tadinya kebaca diubah jadi kode acak, biar orang lain di WiFi yang sama tidak bisa mengintip, atau istilahnya [[sniffing|security/sniffing]]. Ini yang bikin ada gembok di situs yang aman.',
		'Sekarang HP-mu menghubungi server itu dulu dan bikin sambungan. Sambungannya dijaga tetap nyala selama kamu masih buka halamannya.',
		'Pesannya dipotong jadi beberapa paket kecil yang dikasih nomor urut. Tiap paket juga dikasih nomor pintu tujuan, tiap layanan punya pintunya sendiri, dan buat web yang aman pintunya 443. Bagian ini nanti kamu coba sendiri.',
		'Tiap paket ditulisi alamat servernya, contohnya 76.76.21.21, mirip alamat rumah. Lalu paketnya dikirim menuju alamat itu, dioper dari satu titik ke titik berikutnya melintasi internet.',
		'Paketnya tidak loncat langsung ke server. Dia dioper dekat dekat dulu, dari HP ke router rumahmu, router ke kotak berikutnya, satu langkah tiap kali. Perjalanan jauh itu sebenarnya kumpulan banyak operan kecil seperti ini.',
		'Di tingkat paling bawah, paketnya cuma jadi sinyal, cahaya di kabel atau gelombang di udara. Di sinilah dia benar benar keluar dari HP-mu dan meluncur ke server.',
		'Server menerimanya, lalu membuka semua bungkus tadi satu satu secara terbalik, sampai pesan aslimu kebaca. Habis itu dia mengirim halaman produknya balik ke kamu lewat jalan yang sama.',
		'Jadi begini polanya. Tiap lapisan cuma menambah satu bungkus, lalu mengopernya ke bawah. Pas berangkat dibungkus dari atas ke bawah, pas sampai dibuka dari bawah ke atas, dan urutannya selalu begitu. Kadang ada langkah yang cepat atau dilewati, misalnya situs tanpa kunci, tapi susunannya tetap sama.',
		'Paket tadi bisa dikirim dua gaya, yang hati hati atau yang ngebut. Coba kirim lewat TCP dan lewat UDP, lihat sendiri bedanya.'
	],
	reactions: {
		tcp: 'TCP salaman dulu, baru mengirim tiap paket dan menunggu satu satu. Keempatnya sampai urut, tidak ada yang hilang. Kehati hatian itu memang makan sedikit waktu.',
		udp: 'UDP langsung melempar semuanya, tanpa salaman, tanpa pengecekan. Sebagian besar sampai sekejap, tapi paket dua lolos hilang dan tidak ada yang menanyakannya lagi.',
		both: 'Sekarang kamu rasakan tukar tambahnya. TCP itu andal, pas buat halaman, file, dan chat yang tiap byte-nya wajib sampai. UDP itu cepat dan longgar, pas buat panggilan, video langsung, dan game yang satu serpih hilang lebih baik daripada nunggu.'
	},
	scenarioNote:
		'Kamu buka nimbus.com, dan halamannya ada di server nimbus yang jauh. Ikuti pesanmu dibungkus berlapis pas berangkat, lalu dibuka lagi pas sampai di server.',
	startTag: 'pesanmu',
	layers: [
		{
			name: 'Application',
			chip: 'GET /products',
			job: 'Pesan aslimu, kata kata yang benar benar kamu kirim.',
			where: 'Di browser HP-mu, sebelum apa apa terjadi.'
		},
		{
			name: 'Presentation',
			chip: 'disegel buat HTTPS',
			job: 'Mengunci pesannya jadi kode rahasia buat di jalan.',
			where: 'Gembok yang kamu lihat di situs yang aman.'
		},
		{
			name: 'Session',
			chip: 'jalur kebuka',
			job: 'Menghubungi server dan menjaga sambungannya tetap nyala.',
			where: 'Tetap login, panggilan yang nyambung, unduhan panjang.'
		},
		{
			name: 'Transport',
			chip: 'TCP port 443',
			job: 'Memotong jadi paket bernomor dan menempel nomor pintunya.',
			where: 'Tempat TCP, UDP, dan port. Kamu mainkan di bawah.'
		},
		{
			name: 'Network',
			chip: 'ke 76.76.21.21',
			job: 'Menulis alamat server dan mencari jalan ke sana.',
			where: 'Tiap router di internet membaca bagian ini.'
		},
		{
			name: 'Data Link',
			chip: 'lompat ke router',
			job: 'Mengoper paket satu sambungan ke perangkat tepat berikutnya.',
			where: 'HP-mu ke router WiFi, lalu kotak ke kotak.'
		},
		{
			name: 'Physical',
			chip: 'sinyal di kabel',
			job: 'Mengubah semuanya jadi sinyal, cahaya, listrik, atau radio.',
			where: 'Kabel, serat optik, atau gelombang WiFi yang sebenarnya.'
		}
	],
	arriveNote:
		'Server sudah membuka semua bungkusnya dan membaca pesanmu. Sekarang halamannya dikirim balik lewat jalan yang sama.',
	recapTitle: 'Cara semuanya nyambung',
	wrapLabel: 'bungkus, berangkat',
	unwrapLabel: 'buka, sampai',
	orderNote:
		'Nomornya cuma nama buat tugas tugas itu. Makanya orang bilang alat layer 7 membaca permintaan web, sedangkan yang layer 4 cuma lihat alamat dan port.',
	playPrompt: 'Kirim empat paket dari kamu ke server',
	tcpBtn: 'Kirim lewat TCP',
	udpBtn: 'Kirim lewat UDP',
	senderLabel: 'Kamu',
	receiverLabel: 'Server',
	connectingLabel: 'menyambung',
	connectedLabel: 'tersambung',
	lostLabel: 'hilang',
	receivedLabel: 'masuk',
	tcpUse:
		'Andal. Ini yang dipakai halaman web, unduhan, dan chat, yang tiap byte-nya harus sampai.',
	udpUse:
		'Cepat tapi rawan hilang. Ini yang dipakai panggilan, video langsung, dan game, yang kecepatan lebih penting daripada salinan sempurna.',
	tryBothHint: 'Coba dua duanya dan rasakan bedanya'
};
