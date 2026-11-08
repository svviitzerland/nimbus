import type { AzureText } from './types';

export const id: AzureText = {
	title: 'Azure',
	intro: [
		'Kamu sudah kenal semua bagian sebuah website di cloud. Pintu depan, jaringan privat, server, data, dan yang berjaga. Di papan ini, tiap bagian jadi satu kartu polos bertuliskan idenya.',
		'Microsoft sudah puluhan tahun membuat Windows dan Office, dan jutaan pekerja kantor login pakai akun Microsoft tiap pagi. <b>Azure</b> itu cloud milik Microsoft. Dibuka tahun 2010, dan sekarang virtual machine di sana lebih banyak yang menjalankan Linux daripada Windows.',
		'Lihat baris paling atas membalik. Pintu depan jadi <b>Azure DNS</b>, <b>Front Door</b> (CDN sekaligus pintu masuk global, salinan dekat tiap pengunjung) dan <b>Load Balancer</b>, nama yang dibiarkan Azure apa adanya.',
		'Berikutnya jaringan privat. <b>VNet</b>, singkatan Virtual Network, itu jaringan berpagar milikmu, dan <b>NSG</b> (Network Security Group) itu firewall yang menentukan port mana yang boleh lewat.',
		'Lalu komputer yang menjalankan nimbus.com. <b>Virtual Machines</b> itu server sewaan, tanpa nama julukan sama sekali. <b>Container Apps</b> menjalankan container, dan <b>Functions</b> menjalankan sepotong kode waktu dipanggil.',
		'Tiap website butuh tempat buat datanya. <b>Blob Storage</b> menyimpan file, <b>Azure SQL</b> itu database SQL yang diurus Microsoft, dan <b>Cosmos DB</b> itu database NoSQL yang menyalin dirinya ke banyak region.',
		'Terakhir, alat yang menjaga dan mengawasi. <b>Entra ID</b> itu login yang menentukan siapa boleh apa, <b>Key Vault</b> menyimpan kunci dan password, dan <b>Azure Monitor</b> menggambar grafik dan membunyikan alarm.',
		'[ingat] Virtual Machines menyediakan VM, Blob Storage menyediakan object storage, dan Azure SQL Database menyediakan database relasional terkelola.',
		'[fyi] Satu kata, beda dunia. Server sewaan disebut EC2 di [[AWS|providers/aws]] dan Compute Engine di [[Google Cloud|providers/gcp]]. Azure juga mengumpulkan semua bagian satu proyek dalam <b>resource group</b>, seperti folder yang bisa dihapus sekaligus.',
		'Lihat satu pengunjung berjalan melewati seluruh papan, dari Azure DNS sampai Azure Monitor. Mau coba sendiri? Pasang lagi nama namanya ke kartu, ini cuma bonus.'
	],
	reactions: {
		dns: 'Azure DNS itu [[DNS|networking/dns]], tempat menyimpan catatan yang mengarahkan nimbus.com ke server servermu.',
		cdn: 'Front Door itu [[CDN|traffic/cdn]] milik Azure sekaligus pintu masuk globalnya. Dia menyimpan file dekat pengunjung dan mengirim tiap orang ke region sehat yang paling dekat.',
		lb: 'Load Balancer ya memang [[load balancer|traffic/load-balancer]], yang ini Azure biarkan polos. Dia membagi trafik ke Virtual Machines milikmu.',
		network:
			'VNet, singkatan dari Virtual Network, itu [[jaringan privat|networking/vpc]] milikmu di Azure. Idenya sama dengan VPC di tempat lain, cuma beda huruf.',
		firewall:
			'NSG singkatan dari Network Security Group, [[firewall|networking/firewall]] untuk satu subnet atau satu server. Tiap aturannya bilang port mana dan alamat mana yang boleh lewat.',
		vm: 'Virtual Machines itu [[virtual machine|foundations/virtual-machine]], tanpa nama panggilan sama sekali. Windows atau Linux, disewa per detik.',
		container:
			'Container Apps menjalankan [[container|compute/container]] milikmu tanpa kamu perlu mengurus cluster, dan ada AKS kalau kamu mau Kubernetes penuh.',
		function:
			'Functions itu [[serverless|compute/serverless]]. Sepotong kode yang bangun karena ada request atau jadwal, dan kamu bayar per sekali jalan.',
		files:
			'Blob Storage itu [[object storage|resilience/storage-types]]. Blob artinya Binary Large OBject, file apa saja, foto, video, atau backup.',
		sql: 'Azure SQL itu [[database SQL|resilience/database]] yang dikelola, dibangun dari Microsoft SQL Server, ditambal dan dibackup buat kamu.',
		nosql:
			'Cosmos DB itu [[database|resilience/database]] NoSQL yang dibuat untuk menyalin datamu ke banyak region sekaligus, jadi baca data tetap cepat di mana saja.',
		iam: 'Entra ID, dulu namanya Azure Active Directory, itu [[Identity and Access|networking/iam]]. Login yang dipakai karyawan buat Outlook bisa sekalian menjaga seluruh cloud.',
		keys: 'Key Vault menyimpan kunci [[enkripsi|networking/encryption]], password, dan sertifikat di satu tempat terkunci, jadi semua itu nggak pernah nongkrong di dalam kodemu.',
		monitor:
			'Azure Monitor itu [[monitoring|compute/monitoring]]. Metrik, log, dan alert untuk semua yang kamu jalankan di Azure.',
		miss: 'Bukan di situ. Baca lagi namanya, lalu pikirkan kerjanya apa.',
		live: 'Pengunjungmu masuk lewat Azure DNS dan Front Door, melewati Load Balancer dan NSG, sampai di Virtual Machine, baca Azure SQL dan Blob Storage, dan Azure Monitor memantau semua langkahnya. nimbus.com sudah hidup di Azure.'
	},
	steps: [
		{
			tag: 'Kebutuhan situs',
			title: 'Website di cloud',
			body: 'Susunan ini mencakup akses situs, jaringan, komputasi, data, dan monitoring. Pilih kartu untuk melihat fungsi layanannya.'
		},
		{
			tag: 'Sejak 2010',
			title: 'Microsoft Azure',
			body: 'Cloud dari perusahaan pembuat Windows dan Office. Kantor besar sering memilihnya karena stafnya sudah login pakai Microsoft.'
		},
		{
			tag: 'Lapis 1',
			title: 'DNS, CDN, dan load balancer',
			body: '<b>Azure DNS</b> itu DNS, <b>Front Door</b> itu CDN, <b>Load Balancer</b> itu load balancer.'
		},
		{
			tag: 'Lapis 2',
			title: 'Jaringan privat',
			body: '<b>VNet</b> itu jaringan privat. <b>NSG</b> itu firewallnya.'
		},
		{
			tag: 'Lapis 3',
			title: 'Komputasi',
			body: '<b>Virtual Machines</b>, <b>Container Apps</b> buat container, <b>Functions</b> buat serverless.'
		},
		{
			tag: 'Lapis 4',
			title: 'Data',
			body: '<b>Blob Storage</b> menyimpan file, <b>Azure SQL</b> itu SQL, <b>Cosmos DB</b> itu NoSQL.'
		},
		{
			tag: 'Lapis 5',
			title: 'Akses dan monitoring',
			body: '<b>Entra ID</b> buat login, <b>Key Vault</b> buat kunci, <b>Azure Monitor</b> buat grafik dan alarm.'
		},
		{
			tag: 'Cara ingat',
			title: 'Nama layanan dan fungsinya',
			body: 'Virtual Machines menyediakan VM, Blob Storage menyimpan objek, dan Azure SQL Database menyediakan database relasional.'
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
	boardTitle: 'nimbus.com di Azure',
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
	trayLabel: 'Layanan Azure',
	pickHint: 'Pilih satu nama, lalu ketuk ide yang diwakilinya',
	placeHint: '{s} masuk ke mana?',
	missTag: 'bukan di sini',
	noteLive: 'Beres, ide yang sama dengan nama Azure'
};
