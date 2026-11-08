import type { GcpText } from './types';

export const id: GcpText = {
	title: 'Google Cloud',
	intro: [
		'Kamu sudah kenal semua bagian sebuah website di cloud. Pintu depan, jaringan privat, server, data, dan yang berjaga. Di papan ini, tiap bagian jadi satu kartu polos bertuliskan idenya.',
		'Google sudah menjalankan Search, Gmail, dan YouTube buat miliaran orang jauh sebelum menyewakan satu server pun. <b>Google Cloud</b> membuat mesin yang sama itu bisa kamu pakai. Mulainya tahun 2008 dengan App Engine, lalu server sewaan polosnya menyusul tahun 2012.',
		'Lihat kartu di baris paling atas berbalik. Google memberi nama apa adanya, jadi pintu depan jadi <b>Cloud DNS</b>, <b>Cloud CDN</b> (salinan dekat tiap pengunjung) dan <b>Cloud Load Balancing</b>, satu alamat buat pengunjung dari semua benua.',
		'Berikutnya jaringan privat. <b>VPC</b> itu jaringan berpagar milikmu, dan di Google Cloud satu VPC bisa membentang ke seluruh dunia. <b>Firewall rules</b> menentukan apa yang boleh masuk.',
		'Lalu komputer yang menjalankan nimbus.com. <b>Compute Engine</b> itu server sewaan, <b>Cloud Run</b> menjalankan container dan menyusut sampai nol waktu sepi, dan <b>Cloud Functions</b> menjalankan satu fungsi kecil tiap ada permintaan.',
		'Tiap website butuh tempat buat datanya. <b>Cloud Storage</b> menyimpan file, <b>Cloud SQL</b> itu database SQL yang diurus Google, dan <b>Firestore</b> itu database NoSQL yang bisa langsung mengirim perubahan ke HP.',
		'Terakhir, alat yang menjaga dan mengawasi. <b>IAM</b> membagi peran, <b>Cloud KMS</b> menyimpan kunci enkripsi, dan <b>Cloud Monitoring</b> menggambar grafik dan membunyikan alarm.',
		'[ingat] Compute Engine menyediakan virtual machine, Cloud Storage menyediakan object storage, dan Cloud SQL menyediakan database relasional terkelola.',
		'[fyi] Satu kata, beda dunia. Server sewaan disebut EC2 di [[AWS|providers/aws]] dan Virtual Machines di [[Azure|providers/azure]]. Satu VPC Google juga bisa mencakup semua region, sementara di dua cloud lain tiap jaringan privat tinggal di satu region.',
		'Lihat satu pengunjung berjalan melewati seluruh papan, dari Cloud DNS sampai Cloud Monitoring. Mau coba sendiri? Pasang lagi nama namanya ke kartu, ini cuma bonus.'
	],
	reactions: {
		dns: 'Cloud DNS itu [[DNS|networking/dns]] milik Google Cloud. Dia menjawab dari jaringan sedunia yang sama yang bikin Google Search ngebut.',
		cdn: 'Cloud CDN itu [[CDN|traffic/cdn]], salinan filemu disimpan di titik titik Google di seluruh dunia, dekat dengan tiap pengunjung.',
		lb: 'Cloud Load Balancing itu [[load balancer|traffic/load-balancer]]. Satu alamat IP saja bisa menangkap pengunjung dari semua benua, lalu mengirim masing masing ke server sehat yang paling dekat.',
		network:
			'VPC itu [[jaringan privat|networking/vpc]] milikmu. Di Google Cloud satu VPC bisa meliputi seluruh planet, dengan satu subnet di tiap region yang kamu pakai.',
		firewall:
			'Firewall rules itu [[firewall|networking/firewall]] untuk VPC Google. Izinkan port 443 dari internet, dan semua yang nggak kamu izinkan diblokir.',
		vm: 'Compute Engine itu [[virtual machine|foundations/virtual-machine]]. Pilih CPU dan memori yang kamu mau, dan Google bahkan bisa memindahkannya ke mesin sehat tanpa mematikannya.',
		container:
			'Cloud Run menjalankan [[container|compute/container]] milikmu dan mengecilkannya sampai nol waktu nggak ada pengunjung. Kalau sudah kebesaran, ada GKE, dan Google itu tempat Kubernetes lahir.',
		function:
			'Cloud Functions itu [[serverless|compute/serverless]], satu fungsi kecil yang bangun tiap ada request. Sekarang Google memasukkannya ke keluarga Cloud Run, namanya Cloud Run functions.',
		files:
			'Cloud Storage itu [[object storage|resilience/storage-types]], bucket buat foto, video, dan backup, laci raksasa tanpa dasar.',
		sql: 'Cloud SQL itu [[database SQL|resilience/database]] yang dikelola Google, MySQL atau PostgreSQL yang ditambal dan dibackup Google buat kamu.',
		nosql:
			'Firestore itu [[database|resilience/database]] NoSQL berisi dokumen. Dia bisa mendorong perubahan langsung ke HP begitu terjadi, makanya aplikasi chat suka banget.',
		iam: 'IAM di Google Cloud itu [[Identity and Access|networking/iam]]. Kamu bagi peran seperti viewer atau editor ke orang dan layanan, nggak pernah lebih dari yang mereka butuhkan.',
		keys: 'Cloud KMS menyimpan kunci [[enkripsi|networking/encryption]]. Google sudah mengenkripsi datamu di disk, dan KMS membiarkan kamu pegang dan ganti sendiri kunci kuncinya.',
		monitor:
			'Cloud Monitoring itu bagian [[monitoring|compute/monitoring]]. Dashboard, cek uptime, dan alert yang mencolekmu sebelum pengunjung sadar ada apa apa.',
		miss: 'Bukan di situ. Baca lagi namanya, lalu pikirkan kerjanya apa.',
		live: 'Pengunjungmu lewat Cloud DNS, Cloud CDN, dan load balancer, melewati firewall rules masuk ke Compute Engine, baca Cloud SQL dan Cloud Storage, dan Cloud Monitoring melihat semua langkahnya. nimbus.com sudah hidup di Google Cloud.'
	},
	steps: [
		{
			tag: 'Kebutuhan situs',
			title: 'Website di cloud',
			body: 'Susunan ini mencakup akses situs, jaringan, komputasi, data, dan monitoring. Pilih kartu untuk melihat fungsi layanannya.'
		},
		{
			tag: 'Sejak 2008',
			title: 'Google Cloud',
			body: 'Mesin yang sama di balik Search dan YouTube, disewakan ke semua orang.'
		},
		{
			tag: 'Lapis 1',
			title: 'DNS, CDN, dan load balancer',
			body: '<b>Cloud DNS</b>, <b>Cloud CDN</b>, dan <b>Cloud Load Balancing</b>. Namanya sudah menyebut kerjanya.'
		},
		{
			tag: 'Lapis 2',
			title: 'Jaringan privat',
			body: '<b>VPC</b> itu jaringan privat, <b>Firewall rules</b> menjaganya. Satu VPC bisa membentang sedunia.'
		},
		{
			tag: 'Lapis 3',
			title: 'Komputasi',
			body: '<b>Compute Engine</b> itu virtual machine, <b>Cloud Run</b> menjalankan container, <b>Cloud Functions</b> itu serverless.'
		},
		{
			tag: 'Lapis 4',
			title: 'Data',
			body: '<b>Cloud Storage</b> menyimpan file, <b>Cloud SQL</b> itu SQL, <b>Firestore</b> itu NoSQL.'
		},
		{
			tag: 'Lapis 5',
			title: 'Akses dan monitoring',
			body: '<b>IAM</b> buat peran, <b>Cloud KMS</b> buat kunci, <b>Cloud Monitoring</b> buat grafik dan alarm.'
		},
		{
			tag: 'Cara ingat',
			title: 'Nama layanan dan fungsinya',
			body: 'Compute Engine menyediakan VM, Cloud Storage menyimpan objek, dan Cloud SQL mengelola database relasional.'
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
	boardTitle: 'nimbus.com di Google Cloud',
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
	trayLabel: 'Layanan Google Cloud',
	pickHint: 'Pilih satu nama, lalu ketuk ide yang diwakilinya',
	placeHint: '{s} masuk ke mana?',
	missTag: 'bukan di sini',
	noteLive: 'Beres, ide yang sama dengan nama Google'
};
