import type { AwsText } from './types';

export const id: AwsText = {
	title: 'AWS',
	intro: [
		'Kamu sudah kenal semua bagian sebuah website di cloud. Pintu depan, jaringan privat, server, data, dan yang berjaga. Di papan ini, tiap bagian jadi satu kartu polos bertuliskan idenya.',
		'Sekarang kenalan sama toko paling besar yang menyewakan semua itu, <b>Amazon Web Services</b>, atau AWS. Dia lahir di dalam Amazon, dan tahun 2006 mulai menyewakan mesin sejenis yang menjalankan toko online mereka. Sekarang layanannya lebih dari 200, dan namanya kedengaran kayak kode rahasia.',
		'Lihat kartu di baris paling atas berbalik. Pintu depan jadi <b>Route 53</b> ([[DNS|networking/dns]], dinamai dari port 53), <b>CloudFront</b> (CDN, salinan dekat tiap pengunjung) dan <b>Elastic Load Balancing</b> (membagi pengunjung ke beberapa server).',
		'Berikutnya jaringan privat. <b>VPC</b> itu jaringan berpagar milikmu sendiri di dalam AWS, dan <b>Security Group</b> itu firewall di sekeliling tiap server, cuma membiarkan masuk yang kamu izinkan.',
		'Lalu komputer yang benar benar menjalankan nimbus.com. <b>EC2</b> itu server sewaan, <b>ECS</b> menjalankan container, dan <b>Lambda</b> menjalankan satu fungsi kecil cuma waktu ada yang memanggil.',
		'Tiap website butuh tempat buat datanya. <b>S3</b> menyimpan file seperti foto dan backup, <b>RDS</b> itu database SQL yang diurus AWS, dan <b>DynamoDB</b> itu database NoSQL buat trafik raksasa.',
		'Terakhir, alat yang menjaga dan mengawasi. <b>IAM</b> menentukan siapa boleh apa, <b>KMS</b> menyimpan kunci enkripsi, dan <b>CloudWatch</b> menggambar grafik dan membunyikan alarm.',
		'[ingat] EC2 menyediakan virtual machine, S3 menyediakan object storage, dan RDS menyediakan database relasional terkelola.',
		'[fyi] Satu kata, beda dunia. Server sewaan disebut Compute Engine di [[Google Cloud|providers/gcp]] dan Virtual Machines di [[Azure|providers/azure]]. Kotaknya sama, labelnya tiga.',
		'Lihat satu pengunjung berjalan melewati seluruh papan, dari Route 53 sampai CloudWatch. Mau coba sendiri? Pasang lagi nama namanya ke kartu, ini cuma bonus.'
	],
	reactions: {
		dns: 'Route 53 itu [[DNS|networking/dns]] milik AWS, buku telepon yang mengubah nimbus.com jadi alamat IP. Namanya sedikit bercanda, port 53 itu pintu yang dari dulu dipakai DNS.',
		cdn: 'CloudFront itu [[CDN|traffic/cdn]]. Dia menyimpan salinan gambarmu di ratusan kota, jadi pengunjung yang jauh nggak perlu menunggu satu server yang jauh.',
		lb: 'Elastic Load Balancing, singkatnya ELB, itu [[load balancer|traffic/load-balancer]]. Dia membagi pengunjung ke server servermu dan melewati server yang berhenti menjawab.',
		network:
			'VPC singkatan dari Virtual Private Cloud, [[jaringan privat|networking/vpc]] milikmu sendiri di dalam AWS, dibagi jadi beberapa subnet. Nggak ada yang bisa masuk kalau kamu nggak membuka jalan.',
		firewall:
			'Security Group itu [[firewall|networking/firewall]] yang membungkus tiap server. Kamu tulis apa yang boleh masuk, misalnya port 443 buat web, dan sisanya ditolak.',
		vm: 'EC2 itu [[virtual machine|foundations/virtual-machine]], server yang disewa per detik. Pasangkan dengan Auto Scaling, dan AWS menambah EC2 sendiri waktu trafik naik.',
		container:
			'ECS menjalankan [[container|compute/container]] milikmu. Taruh Fargate di bawahnya, dan kamu bahkan nggak perlu mengurus server tempat container itu duduk.',
		function:
			'Lambda itu [[serverless|compute/serverless]]. Kamu unggah satu fungsi, dia bangun waktu dipanggil, dan kamu cuma bayar milidetik selama dia jalan.',
		files:
			'S3 itu [[object storage|resilience/storage-types]], ember tanpa dasar buat foto, video, dan backup. Ini salah satu layanan AWS paling pertama, dari tahun 2006.',
		sql: 'RDS itu [[database SQL|resilience/database]] yang dikelola AWS. AWS yang memasang, menambal, dan membackupnya, kamu tinggal pakai tabelnya.',
		nosql:
			'DynamoDB itu [[database|resilience/database]] NoSQL yang dibuat untuk trafik raksasa. Asalnya dari Dynamo, sistem buatan Amazon supaya keranjang belanja tetap hidup di hari paling ramai.',
		iam: 'IAM itu [[Identity and Access|networking/iam]]. Tiap orang dan tiap server cuma dapat izin yang dia butuhkan, nggak lebih.',
		keys: 'KMS, Key Management Service, menyimpan kunci [[enkripsi|networking/encryption]] yang mengunci disk dan bucket milikmu. Kuncinya nggak pernah keluar dari brankasnya.',
		monitor:
			'CloudWatch itu dashboard [[monitoring|compute/monitoring]]. Dia menggambar grafik CPU dan error, lalu membunyikan alarm begitu ada garis yang dilewati.',
		miss: 'Bukan di situ. Baca lagi namanya, lalu pikirkan kerjanya apa.',
		live: 'Pengunjungmu masuk lewat Route 53, ambil gambar dari CloudFront, lewat ELB dan Security Group, sampai di EC2, baca RDS dan S3, dan CloudWatch memantau semua langkahnya. Itulah nimbus.com di AWS sungguhan.'
	},
	steps: [
		{
			tag: 'Kebutuhan situs',
			title: 'Website di cloud',
			body: 'Susunan ini mencakup akses situs, jaringan, komputasi, data, dan monitoring. Pilih kartu untuk melihat fungsi layanannya.'
		},
		{
			tag: 'Sejak 2006',
			title: 'Amazon Web Services',
			body: 'Cloud terbesar di dunia. Layanan pertamanya <b>S3</b> buat file dan <b>EC2</b> buat server.'
		},
		{
			tag: 'Lapis 1',
			title: 'DNS, CDN, dan load balancer',
			body: '<b>Route 53</b> itu DNS, <b>CloudFront</b> itu CDN, <b>Elastic Load Balancing</b> itu load balancer.'
		},
		{
			tag: 'Lapis 2',
			title: 'Jaringan privat',
			body: '<b>VPC</b> itu jaringan privat. <b>Security Group</b> itu firewall di tiap server.'
		},
		{
			tag: 'Lapis 3',
			title: 'Komputasi',
			body: '<b>EC2</b> itu virtual machine, <b>ECS</b> menjalankan container, <b>Lambda</b> itu serverless.'
		},
		{
			tag: 'Lapis 4',
			title: 'Data',
			body: '<b>S3</b> menyimpan file, <b>RDS</b> itu SQL, <b>DynamoDB</b> itu NoSQL.'
		},
		{
			tag: 'Lapis 5',
			title: 'Akses dan monitoring',
			body: '<b>IAM</b> buat siapa boleh apa, <b>KMS</b> buat kunci, <b>CloudWatch</b> buat grafik dan alarm.'
		},
		{
			tag: 'Cara ingat',
			title: 'Nama layanan dan fungsinya',
			body: 'EC2 menyediakan VM, S3 menyimpan objek, dan RDS mengelola database relasional.'
		},
		{
			tag: 'Perbandingan',
			title: 'Perbandingan antar penyedia',
			body: 'Ketiga penyedia menawarkan virtual machine. Nama, konfigurasi, batas layanan, dan harga perlu diperiksa pada masing masing penyedia.'
		},
		{
			tag: 'Opsional',
			title: 'Alur request pengunjung',
			body: 'Permintaannya menyalakan tiap bagian yang dilewati. Ketuk tombolnya kalau mau mencocokkan sendiri.'
		}
	],
	boardTitle: 'nimbus.com di AWS',
	youLabel: 'Pengunjung',
	layers: ['Pintu depan', 'Jaringan privat', 'Komputasi', 'Data', 'Akses dan pantau'],
	concepts: {
		dns: 'DNS',
		cdn: 'CDN',
		lb: 'Load balancer',
		network: 'Jaringan privat',
		firewall: 'Firewall',
		vm: 'Virtual machine',
		container: 'Container',
		function: 'Serverless',
		files: 'Penyimpanan file',
		sql: 'Database SQL',
		nosql: 'Database NoSQL',
		iam: 'Identitas dan akses',
		keys: 'Kunci enkripsi',
		monitor: 'Monitoring'
	},
	sameIdea: '{c} di tiap cloud',
	playBtn: 'Cocokkan sendiri',
	trayLabel: 'Layanan AWS',
	pickHint: 'Pilih satu nama, lalu ketuk ide yang diwakilinya',
	placeHint: '{s} masuk ke mana?',
	missTag: 'bukan di sini',
	noteLive: 'Beres, ide yang sama dengan nama AWS'
};
