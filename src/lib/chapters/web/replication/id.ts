import type { ReplicationText } from './types';

export const id: ReplicationText = {
	title: 'Replikasi dan sharding',
	intro: [
		'nimbus.com terus tumbuh. Tiap pengunjung, tiap halaman, tiap pesanan lewat <b>satu database</b>. Lihat meteran bebannya naik. Satu mesin cuma sanggup menjawab sekian banyak pertanyaan sekaligus.',
		'Lihat apa yang sebenarnya orang lakukan. Kebanyakan cuma lihat lihat, membaca produk (titik biru). Cuma sedikit yang memesan, yang menulis sesuatu yang baru (titik kuning). Baca gampang mengalahkan tulis sepuluh banding satu.',
		'Jadi kita bikin salinan. Satu database jadi <b>primary</b>, si bos. Cuma dia yang boleh menerima tulisan, jadi tiap pesanan tetap mendarat di satu tempat saja.',
		'Di sebelahnya ada <b>replica</b>. Tiap replica menyalin setiap perubahan dari primary, sesaat setelah terjadi. Menjaga salinan tetap sama seperti ini namanya <b>replikasi</b>.',
		'Sekarang bacaan dikirim ke replica, makanya mereka disebut <b>read replica</b>. Bebannya dibagi, semua meteran jadi tenang, dan primary punya waktu buat mengurus pesanan.',
		'Salinan juga menolong waktu ada yang rusak. Kalau primary mati, satu replica <b>dipromosikan</b> jadi primary baru dan toko tetap jualan. Pindah seperti ini namanya <b>failover</b>.',
		'Replica berbagi kerjaan, tapi masing masing tetap menyimpan <b>semua</b> data. Suatu hari tabel users terlalu besar buat satu mesin mana pun. Saatnya barisnya sendiri yang dibelah. Itulah <b>sharding</b>, dan tiap bagiannya disebut <b>shard</b>.',
		'Aplikasi memilih shard pakai <b>shard key</b>, di sini huruf pertama nama. User A sampai M tinggal di shard 1, N sampai Z di shard 2. Bima ke kiri, Nadia ke kanan, selalu begitu.',
		'[ingat] Replikasi itu <b>mesin fotokopi</b>, makin banyak salinan buku yang sama supaya makin banyak orang bisa baca barengan. Sharding itu <b>gunting</b>, satu buku dipotong jadi beberapa jilid karena terlalu tebal buat dipegang.',
		'[fyi] Salinan butuh sesaat buat sampai, namanya <b>replication lag</b>. Kirim komentar, langsung refresh, dan replica mungkin belum punya. Makanya aplikasi sering membaca perubahan barumu sendiri dari primary.'
	],
	reactions: {},
	steps: [
		{
			tag: 'Satu database',
			title: 'Semua di satu tempat',
			body: 'Tiap bacaan dan tiap tulisan masuk ke <b>mesin yang sama</b>. Hari ramai bikin dia kewalahan.'
		},
		{
			tag: 'Lalu lintas',
			title: 'Baca dan tulis',
			body: '<b>Baca</b> cuma melihat data, <b>tulis</b> mengubahnya. Toko jauh lebih sering dilihat daripada dipesan.'
		},
		{
			tag: 'Primary',
			title: 'Satu satunya yang menulis',
			body: 'Semua tulisan masuk ke <b>primary</b>. Satu tempat buat tiap perubahan bikin datanya nggak saling bertentangan.'
		},
		{
			tag: 'Replikasi',
			title: 'Salinan yang ikut terus',
			body: 'Tiap <b>replica</b> mengulang setiap perubahan yang dibuat primary, sesaat kemudian.'
		},
		{
			tag: 'Read replica',
			title: 'Bagi bacaannya',
			body: 'Bacaan disebar ke para replica. Kalau bacaan naik lagi, tinggal tambah satu replica.'
		},
		{
			tag: 'Failover',
			title: 'Replica mengambil alih',
			body: 'Primary mati, jadi satu replica <b>dipromosikan</b>. Pengunjung hampir nggak sadar.'
		},
		{
			tag: 'Sharding',
			title: 'Belah barisnya',
			body: 'Tiap <b>shard</b> cuma menyimpan sebagian baris, jadi nggak ada mesin yang harus menyimpan semuanya.'
		},
		{
			tag: 'Shard key',
			title: 'Shard yang mana?',
			body: '<b>Shard key</b> (di sini huruf pertama nama) selalu mengirim user ke shard yang sama.'
		},
		{
			tag: 'Biar nempel',
			title: 'Fotokopi dan gunting',
			body: '<b>Replikasi</b> menyalin seluruh buku. <b>Sharding</b> memotongnya jadi beberapa jilid.'
		},
		{
			tag: 'Catatan',
			title: 'Replication lag',
			body: 'Replica bisa telat sesaat. Tulisan barumu sendiri paling aman dibaca dari <b>primary</b>.'
		}
	],
	appLabel: 'aplikasi nimbus.com',
	dbLabel: 'database',
	primary: 'primary',
	replica: 'replica',
	read: 'baca',
	write: 'tulis',
	copy: 'salin',
	load: 'beban',
	down: 'mati',
	promoted: 'primary baru',
	tooBig: 'terlalu besar buat satu mesin',
	shard: 'shard',
	ranges: ['A sampai M', 'N sampai Z'],
	users: ['Bima', 'Nadia'],
	memory: { copy: 'Fotokopi', cut: 'Gunting' },
	lag: 'belum sampai',
	caughtUp: 'tersalin'
};
