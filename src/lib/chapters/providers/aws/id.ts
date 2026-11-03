import type { AwsText } from './types';

export const id: AwsText = {
	title: 'AWS',
	intro: [
		'Kamu sudah kenal semua bagian sebuah setup cloud. Server, load balancer, jaringan privat, database. Sekarang kenalan sama toko paling besar yang menyewakan semua itu, <b>Amazon Web Services</b>, atau AWS.',
		'AWS lahir dari dalam Amazon sendiri. Tahun 2006 Amazon mulai menyewakan mesin sejenis yang menjalankan toko online mereka, pertama <b>S3</b> buat file, lalu <b>EC2</b> buat server. Sekarang AWS jadi cloud terbesar di dunia.',
		'Nah, ini bagian yang bikin pusing pemula. AWS punya lebih dari 200 layanan, dan namanya jarang menjelaskan fungsinya. Route 53? CloudFront? Kedengarannya kayak kode rahasia.',
		'Kabar baiknya, di balik tiap nama aneh ada ide yang sudah kamu kenal. Server tetap server, cuma AWS menyebutnya EC2. Hafalkan petanya sekali, dan console AWS nggak seram lagi.',
		'[fyi] Ide yang sama punya nama lain di provider lain. Server sewaan disebut Compute Engine di [[Google Cloud|providers/gcp]] dan Virtual Machines di [[Azure|providers/azure]]. Barangnya sama, labelnya beda.',
		'Yuk bangun nimbus.com di AWS, satu lapis demi satu lapis, dari pintu depan ke bawah. Pilih satu kartu layanan, lalu taruh di ide yang diwakilinya.'
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
	trayLabel: 'Layanan AWS',
	pickHint: 'Pilih satu kartu layanan, lalu ketuk ide yang diwakilinya',
	placeHint: '{s} masuk ke mana?',
	missTag: 'bukan di sini',
	layerTag: '{n} dari {t} lapis',
	liveBtn: 'Kirim pengunjung ke nimbus.com',
	noteDone: 'Semua bagian sudah di tempatnya, saatnya pengunjung sungguhan',
	noteLive: 'Ide yang sama yang kamu kenal, pakai nama AWS'
};
