import type { AzureText } from './types';

export const id: AzureText = {
	title: 'Azure',
	intro: [
		'Microsoft sudah puluhan tahun membuat Windows dan Office, dan jutaan pekerja kantoran login pakai akun Microsoft tiap pagi. <b>Azure</b> itu cloud milik Microsoft.',
		'Azure dibuka tahun 2010 dengan nama Windows Azure. Tahun 2014 namanya jadi Microsoft Azure, dan sekarang virtual machine di sana malah lebih banyak yang menjalankan Linux daripada Windows.',
		'Nama layanan Azure kebanyakan lugas, seperti Virtual Machines, Load Balancer, dan Functions, plus beberapa nama merek yang perlu dihafal, seperti Cosmos DB dan Entra ID.',
		'[fyi] Azure menaruh semua bagian satu proyek di dalam <b>resource group</b>, mirip folder. Hapus foldernya, semua isinya ikut terhapus. Ide yang sama punya nama lain di [[AWS|providers/aws]] dan [[Google Cloud|providers/gcp]].',
		'Perusahaan besar sering memilih Azure karena karyawannya sudah login pakai Microsoft. Yuk bangun nimbus.com di Azure, mulai dari pintu depan. Pilih satu kartu layanan, lalu taruh di ide yang diwakilinya.'
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
	trayLabel: 'Layanan Azure',
	pickHint: 'Pilih satu kartu layanan, lalu ketuk ide yang diwakilinya',
	placeHint: '{s} masuk ke mana?',
	missTag: 'bukan di sini',
	layerTag: '{n} dari {t} lapis',
	liveBtn: 'Kirim pengunjung ke nimbus.com',
	noteDone: 'Semua bagian sudah di tempatnya, saatnya pengunjung sungguhan',
	noteLive: 'Ide yang sama yang kamu kenal, pakai nama Azure'
};
