import type { CloudServicesText } from '../../types';

export const id: CloudServicesText = {
	title: 'Layanan cloud',
	intro: [
		'Selama ini kamu menyewa satu server di cloud. Server virtual itu layanan paling dasar. Orang sering nyebutnya <b>VPS</b>, dan versi cloudnya yang bisa kamu besar kecilkan kapan saja namanya <b>EC2</b> di AWS, <b>Compute Engine</b> di Google, <b>Virtual Machines</b> di Azure.',
		'Masalahnya, server kosongan itu masih polos. Mau punya database, tempat simpan file, atau yang lain, semuanya harus kamu pasang sendiri lalu rawat sendiri biar nggak rewel.',
		'Makanya provider bikin banyak layanan siap pakai. Tiap kebutuhan ada layanannya, dan providernya yang ngurus pasang, backup, sampai perawatan, kamu tinggal sewa lalu langsung pakai. Mirip nyewa dapur yang sudah lengkap dibanding bangun dapur dari nol.',
		'Layanan begini ada ratusan. Nyalakan layarnya dan lihat sendiri.',
		'Layanan itu datang dalam tiga ukuran bantuan. <b>IaaS</b> (Infrastructure as a Service) nyewain mesinnya, kayak EC2, dan kamu pasang semuanya sendiri. <b>PaaS</b> (Platform as a Service) nyewain platform yang sudah siap, jadi kamu tinggal bawa kode. <b>SaaS</b> (Software as a Service) itu aplikasi jadi yang tinggal kamu pakai, kayak Gmail. Dan <b>serverless</b> (disebut juga FaaS, kayak Lambda) ngejalanin potongan kecil kodemu cuma waktu dipanggil.',
		'[ingat] Bayangin pizza. IaaS itu nyewa dapur lengkap dengan oven, adonannya kamu bikin dan panggang sendiri. PaaS itu dapat roti dasar yang siap, kamu tinggal tambah topping. SaaS itu makan di restoran, pizzanya datang sudah jadi. Serverless? Bayar per potong, cuma waktu kamu lapar.',
		'[fyi] Nanti kamu bakal sering ketemu nama layanan AWS, dan ternyata ada polanya. Ada yang depannya <b>Amazon</b>, ada yang depannya <b>AWS</b>. Yang <b>Amazon</b> biasanya produk utuh yang dipakai sendirian, kayak <b>Amazon EC2</b> (server) atau <b>Amazon S3</b> (tempat simpan file). Yang <b>AWS</b> biasanya alat yang kerjanya nyambung sama layanan lain, kayak <b>AWS Lambda</b> yang ngejalanin kode kamu tanpa perlu ngurus server. Ini bukan aturan resmi, cuma pola yang sering kelihatan.'
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
