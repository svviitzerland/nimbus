import type { CloudServicesText } from '../../types';

export const id: CloudServicesText = {
	title: 'Layanan cloud',
	intro: [
		'Selama ini kamu menyewa satu server di cloud. Server virtual itu layanan paling dasar. Orang sering nyebutnya <b>VPS</b>, dan versi cloudnya yang bisa kamu besar kecilkan kapan saja namanya <b>EC2</b> di AWS, <b>Compute Engine</b> di Google, <b>Virtual Machines</b> di Azure.',
		'Masalahnya, server kosongan itu masih polos. Mau punya database, tempat simpan file, atau yang lain, semuanya harus kamu pasang sendiri lalu rawat sendiri biar nggak rewel.',
		'Makanya provider bikin banyak layanan siap pakai. Tiap kebutuhan ada layanannya, dan providernya yang ngurus pasang, backup, sampai perawatan, kamu tinggal sewa lalu langsung pakai. Mirip nyewa dapur yang sudah lengkap dibanding bangun dapur dari nol.',
		'Layanan begini ada ratusan. Nyalakan layarnya dan lihat sendiri.',
		'Tiga model layanan membagi tanggung jawab. <b>IaaS</b> menyediakan mesin virtual, kamu mengelola OS dan aplikasi. <b>PaaS</b> menjalankan aplikasimu pada platform yang dikelola penyedia. <b>SaaS</b> adalah aplikasi siap pakai, seperti Gmail.',
		'[ingat] Pilih layanan dari tugasnya. Menjalankan kode, menyimpan file, dan menyimpan data punya kebutuhan berbeda.',
		'[fyi] Nama layanan berbeda antarpenyedia. Amazon EC2 menyediakan komputasi, Amazon S3 menyimpan objek, dan AWS Lambda menjalankan fungsi. Pelajari tugasnya sebelum menghafal nama produknya.'
	],
	reactions: {
		open: 'Lihat, ada storage, database, jaringan, sampai analitik dan AI, semuanya dari AWS, Google, dan Azure. Cloud itu katalog raksasa. Di bab bab berikutnya kita bakal kenalan sama yang penting penting satu satu.'
	},
	screenTitle: 'Layanan cloud',
	screenSub: 'ratusan layanan tinggal sewa',
	openBtn: 'Nyalakan layar',
	layers: ['Mesin', 'Sistem', 'Platform', 'Aplikasi'],
	youLabel: 'Kamu yang urus',
	providerLabel: 'Provider yang urus',
	pizza: ['sewa dapur', 'tambah topping', 'makan di luar'],
	serverlessNote: 'Serverless, kodemu jalan cuma waktu dipanggil'
};
