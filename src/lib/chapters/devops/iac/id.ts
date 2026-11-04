import type { IacText } from './types';

export const id: IacText = {
	title: 'Infrastructure as Code',
	intro: [
		'Buat ngejalanin nimbus.com kamu butuh [[server|foundations/server]] di cloud. Langkah pertama yang biasa, buka website cloudnya. Klik bikin server, pilih ukuran, pilih region, klik create. Terus ulangi semuanya buat server berikutnya.',
		'Buat satu dua server sih oke. Tapi bulan depan, siapa yang ingat persis tadi milih apa? Ada yang ngeklik medium padahal harusnya small, dan sekarang servernya nggak sama persis. Nggak ada yang nyatet.',
		'<b>Infrastructure as Code</b> (IaC) ngebalik caranya. <b>Infrastruktur</b> itu mesin dan jaringan tempat aplikasimu jalan. Daripada ngeklik, kamu tulis semuanya di file teks biasa, kayak resep.',
		'Ada alat namanya <b>Terraform</b> yang baca file itu. Kamu ketik <b>terraform apply</b>, dia ngebandingin isi file sama yang udah ada di cloud, terus bikin yang belum ada. Tiga server, langsung dari teks.',
		'Butuh lebih banyak? Ganti satu angka di file, dari 3 jadi 5, terus apply lagi. Terraform cuma bikin selisihnya (dua server baru) dan nggak ngutak atik tiga yang lama.',
		'Sekarang bagian yang serem. Ada yang nggak sengaja ngehapus semuanya. Selama filenya ada, sekali apply semua lima server balik lagi, persis kayak sebelumnya.',
		'[ingat] <b>File itu resepnya, Terraform yang masak.</b> Resep sama, masakannya pasti sama. Dan yang nggak ada di file, nggak bakal dibikin.',
		'[fyi] Karena cuma teks, filenya bisa disimpan di [[Git|compute/version-control]] bareng kodemu, jadi tiap perubahan server punya riwayat dan bisa dibatalin. Terraform juga bisa ngobrol sama banyak cloud (AWS, Google Cloud, Azure) bahkan sama mesin milikmu sendiri di kantor (on premise).',
		'Mau coba? Ubah jumlahnya pakai tombol, terus lihat Terraform nambah atau ngurangin server biar sama kayak isi file. Atau tonton aja, itu juga boleh.'
	],
	reactions: {
		more: 'Angkanya kamu naikin, jadi Terraform lihat ada server yang kurang dan cuma bikin yang kurang itu. Yang udah jalan nggak disentuh sama sekali.',
		less: 'Angkanya kamu turunin, jadi Terraform ngehapus server yang kelebihan. File yang nentuin jumlahnya, cloud tinggal ngikut.'
	},
	steps: [
		{
			tag: 'Pakai tangan',
			title: 'Ngeklik di console',
			body: 'Website cloud (namanya <b>console</b>) punya formulir. Isi, pencet create, dan muncul satu server.'
		},
		{
			tag: 'Masalahnya',
			title: 'Nggak ada yang ingat',
			body: 'Satu server jadinya <b>medium</b>, bukan small. Klik nggak ninggalin catatan, jadi salah kayak gini gampang ngumpet.'
		},
		{
			tag: 'Idenya',
			title: 'Infrastructure as Code',
			body: 'Server yang kamu mau, ditulis sebagai teks. File di bawah minta <b>3</b> server small di Jakarta.'
		},
		{
			tag: 'Alatnya',
			title: 'terraform apply',
			body: 'Terraform baca filenya, bikin <b>rencana</b> (apa yang ditambah, diubah, atau dihapus), baru dibangun.'
		},
		{
			tag: 'Mengubah',
			title: 'Cuma selisihnya',
			body: 'Jumlahnya dari 3 jadi 5. Rencananya bilang <b>2 to add</b>, dan tiga yang pertama tetap apa adanya.'
		},
		{
			tag: 'Bencana',
			title: 'Dibangun ulang sekaligus',
			body: 'Semuanya hilang, tapi resepnya nggak. Sekali apply, kelimanya balik dan sama persis.'
		},
		{
			tag: 'Biar nempel',
			title: 'Resep dan koki',
			body: '<b>File</b> itu resepnya, <b>Terraform</b> kokinya. Resep sama, hasil sama.'
		},
		{
			tag: 'Perlu tahu',
			title: 'Disimpan di Git',
			body: 'File teks bisa direview, punya versi, dan bisa dibatalin, persis kayak kode.'
		},
		{
			tag: 'Opsional',
			title: 'Ubah jumlahnya',
			body: 'Pencet plus atau minus. Filenya berubah duluan, baru Terraform nyamain isi cloudnya.'
		}
	],
	consoleTitle: 'Bikin server',
	sizeLabel: 'Ukuran',
	regionLabel: 'Region',
	regionValue: 'Jakarta',
	createBtn: 'Create',
	cloudLabel: 'Cloud kamu, region Jakarta',
	emptyLabel: 'Belum ada server',
	countLabel: 'Jumlah server di file',
	lessBtn: 'Kurangi satu server',
	moreBtn: 'Tambah satu server'
};
